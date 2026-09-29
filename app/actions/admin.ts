"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { processSuccessfulOrder, processCancelledOrder } from "@/lib/orderService";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { kirimEmailResi } from "@/lib/email-service";
import { OrderStatus } from "@prisma/client";

export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus,
  trackingNumber?: string,
  isCorrection: boolean = false
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "ADMIN") {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true },
    });

    if (!order) {
      return { success: false, error: "Pesanan tidak ditemukan." };
    }

    if (newStatus === "SHIPPED" && !trackingNumber) {
      return { success: false, error: "Nomor resi wajib diisi untuk pengiriman." };
    }

    const actionNotes = isCorrection 
      ? `Koreksi Resi: ${order.trackingNumber} -> ${trackingNumber}`
      : trackingNumber && newStatus === "SHIPPED"
        ? `Input Resi: ${trackingNumber}`
        : `Admin mengubah status menjadi ${newStatus}`;

    // Gunakan transaksi untuk memastikan konsistensi antara update Order dan insert History
    await prisma.$transaction([
      prisma.order.update({
        where: { id: orderId },
        data: { 
          status: newStatus,
          trackingNumber: trackingNumber !== undefined ? trackingNumber : undefined,
        },
      }),
      prisma.orderHistory.create({
        data: {
          orderId: order.id,
          oldStatus: order.status,
          newStatus: newStatus,
          actionBy: `Admin (${session.user.name || session.user.email})`,
          notes: actionNotes,
        },
      })
    ]);

    // Kirim email wajib jika status beralih ke SHIPPED dan BUKAN koreksi
    if (newStatus === "SHIPPED" && trackingNumber && !isCorrection) {
      const emailTarget = order.email;
      const customerName = order.recipientName || order.user?.name || "Pelanggan";
      if (emailTarget) {
        await kirimEmailResi(emailTarget, customerName, orderId, trackingNumber);
      }
    }

    revalidatePath("/admin/orders");
    return { success: true };
  } catch (error: any) {
    console.error("Gagal update status order:", error);
    return { success: false, error: error.message || "Terjadi kesalahan sistem." };
  }
}

export async function refundOrder(orderId: string, notes: string = "Refund manual oleh Admin") {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "ADMIN") {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true }
    });

    if (!order) return { success: false, error: "Pesanan tidak ditemukan" };

    if (order.status === "REFUNDED" || order.status === "CANCELLED") {
      return { success: false, error: "Pesanan sudah dibatalkan atau direfund." };
    }

    await prisma.$transaction(async (tx) => {
      // 1. Ubah status
      await tx.order.update({
        where: { id: orderId },
        data: { status: "REFUNDED" }
      });

      // 2. Catat History
      await tx.orderHistory.create({
        data: {
          orderId: orderId,
          oldStatus: order.status,
          newStatus: "REFUNDED",
          actionBy: `Admin (${session.user.name || session.user.email})`,
          notes: notes,
        }
      });

      // 3. Kembalikan Stok & Catat Ledger
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } }
        });

        await tx.stockLedger.create({
          data: {
            productId: item.productId,
            quantity: item.quantity,
            reason: "RETURN",
            orderId: order.id,
            actionBy: `Admin (${session.user.name || session.user.email})`,
            notes: `Retur/Refund pesanan ${order.id}`,
          }
        });
      }
    });

    revalidatePath("/admin/orders");
    return { success: true };
  } catch (error: any) {
    console.error("Gagal refund order:", error);
    return { success: false, error: error.message || "Gagal memproses refund." };
  }
}

export async function syncMidtransOrders() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "ADMIN") {
    return { success: false, error: "Unauthorized" };
  }

  try {
    // Ambil order PENDING 3 hari terakhir yang punya snapToken (berarti sudah masuk payment gateway)
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const pendingOrders = await prisma.order.findMany({
      where: {
        status: "PENDING",
        snapToken: { not: null },
        createdAt: { gte: threeDaysAgo }
      },
      select: { id: true }
    });

    if (pendingOrders.length === 0) {
      return { success: true, message: "Tidak ada pesanan gantung yang perlu disinkronisasi." };
    }

    const envObj = process["env"];
    const serverKey = envObj.MIDTRANS_SERVER_KEY;
    const isProd = envObj.NODE_ENV === "production";
    const baseUrl = isProd ? "https://api.midtrans.com/v2" : "https://api.sandbox.midtrans.com/v2";

    let syncedCount = 0;

    for (const order of pendingOrders) {
      try {
        const authString = Buffer.from(`${serverKey}:`).toString("base64");
        const res = await fetch(`${baseUrl}/${order.id}/status`, {
          headers: {
            "Authorization": `Basic ${authString}`,
            "Content-Type": "application/json",
            "Accept": "application/json"
          }
        });

        if (!res.ok) continue;

        const data = await res.json();
        const transactionStatus = data.transaction_status;
        const fraudStatus = data.fraud_status;

        if (transactionStatus === "capture") {
          if (fraudStatus === "accept") {
            await processSuccessfulOrder(order.id, data.transaction_id, data.payment_type);
            syncedCount++;
          }
        } else if (transactionStatus === "settlement") {
          await processSuccessfulOrder(order.id, data.transaction_id, data.payment_type);
          syncedCount++;
        } else if (transactionStatus === "cancel" || transactionStatus === "deny" || transactionStatus === "expire") {
          await processCancelledOrder(order.id, data.transaction_id);
          syncedCount++;
        }
      } catch (err) {
        console.error(`Gagal sync order ${order.id}:`, err);
      }
    }

    revalidatePath("/admin/orders");
    return { success: true, message: `Berhasil mengecek ${pendingOrders.length} pesanan. ${syncedCount} pesanan diperbarui.` };
  } catch (error: any) {
    console.error("Gagal menjalankan sync:", error);
    return { success: false, error: "Gagal menyinkronisasi dengan Midtrans." };
  }
}
