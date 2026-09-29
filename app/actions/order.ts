"use server";

import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";
import type { CartItem } from "@/store/useCartStore";
import { sanitizeErrorMessage } from "@/lib/sanitize";
import { CheckoutSchema, type CheckoutOutput } from "@/lib/validations/checkout";
import { snap, coreApi } from "@/lib/midtrans";
import { revalidatePath } from "next/cache";
import { hitungOngkirBiteship } from "@/app/actions/biteship";

export type BuatPesananResult =
  | { success: true; orderId: string; snapToken: string; guestToken?: string | null }
  | { success: false; error: string };

// Rate limiter for guest checkout (best-effort per instance)
const guestRateLimitMap = new Map<string, { count: number, timestamp: number }>();
const GUEST_RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const GUEST_MAX_REQUESTS = 3;

export async function buatPesanan(
  data: CheckoutOutput,
  cartItems: CartItem[],
  idempotencyKey: string
): Promise<BuatPesananResult> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    // Guest Rate Limiting
    const { headers } = await import("next/headers");
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "unknown";
    
    if (ip !== "unknown") {
      const now = Date.now();
      const requestData = guestRateLimitMap.get(ip) || { count: 0, timestamp: now };
      
      if (now - requestData.timestamp < GUEST_RATE_LIMIT_WINDOW) {
        if (requestData.count >= GUEST_MAX_REQUESTS) {
          return { success: false, error: "Terlalu banyak pesanan. Harap tunggu beberapa saat." };
        }
        requestData.count++;
      } else {
        requestData.count = 1;
        requestData.timestamp = now;
      }
      
      if (guestRateLimitMap.size > 1000) guestRateLimitMap.clear();
      guestRateLimitMap.set(ip, requestData);
    }
  }

  // Server-side validation using the shared schema
  const parsed = CheckoutSchema.safeParse(data);

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || "Input tidak valid." };
  }

  if (!cartItems || cartItems.length === 0) {
    return { success: false, error: "Keranjang belanja kosong." };
  }

  if (!idempotencyKey) {
    return { success: false, error: "Permintaan tidak valid (missing idempotency key)." };
  }

  try {
    // 1. Cek Idempotency: Apakah pesanan dengan ID ini sudah ada?
    const existingOrder = await prisma.order.findUnique({
      where: { id: idempotencyKey }
    });

    if (existingOrder) {
      if (existingOrder.status === "PENDING" && existingOrder.midtransId) {
        return { success: false, error: "Pesanan ini sudah sedang diproses. Silakan refresh halaman." };
      }
      return { success: false, error: "Pesanan ini sudah diproses sebelumnya." };
    }

    // 2. Server-side Validation: Cek stok dan harga asli dari DB
    const productIds = cartItems.map(i => i.id);
    const dbProducts = await prisma.product.findMany({
      where: { 
        OR: [
          { id: { in: productIds } },
          { sanityId: { in: productIds } }
        ],
        isActive: true 
      }
    });

    if (dbProducts.length !== productIds.length) {
      return { success: false, error: "Beberapa produk tidak ditemukan atau sudah tidak aktif." };
    }

    let calculatedTotalProduk = 0;
    let totalWeightGram = 0;

    for (const item of cartItems) {
      const dbProduct = dbProducts.find(p => p.id === item.id || p.sanityId === item.id);
      if (!dbProduct) return { success: false, error: `Produk ${item.name} tidak ditemukan.` };
      
      if (dbProduct.stock < item.quantity) {
        return { success: false, error: `Stok ${dbProduct.name} tidak mencukupi (Tersisa ${dbProduct.stock}).` };
      }

      calculatedTotalProduk += dbProduct.price * item.quantity;
      totalWeightGram += (dbProduct.weight || 200) * item.quantity;
    }

    // 3. Server-side Validation: Hitung ulang ongkir Biteship
    const ongkirRes = await hitungOngkirBiteship(data.biteshipAreaId, totalWeightGram);
    if (!ongkirRes.success || !ongkirRes.data) {
      return { success: false, error: (ongkirRes as any).message || "Gagal memvalidasi ongkos kirim." };
    }

    const selectedCourierRate = ongkirRes.data.find(
      r => r.courier_name === data.kurir && r.courier_service_name === data.layananKurir
    );

    if (!selectedCourierRate) {
      return { success: false, error: "Tarif kurir yang dipilih tidak valid atau telah berubah." };
    }

    const calculatedTotalAmount = calculatedTotalProduk + selectedCourierRate.price;

    // 4. Minta Snap Token ke Midtrans (SEBELUM memotong stok)
    const parameter = {
      transaction_details: {
        order_id: idempotencyKey, // Gunakan idempotencyKey sebagai order_id
        gross_amount: calculatedTotalAmount,
      },
      customer_details: {
        first_name: data.nama,
        email: data.email,
        phone: data.whatsapp,
      },
      item_details: [
        ...cartItems.map((item) => {
          const dbProduct = dbProducts.find(p => p.id === item.id || p.sanityId === item.id)!;
          return {
            id: dbProduct.id,
            price: dbProduct.price,
            quantity: item.quantity,
            name: `${dbProduct.name}${item.grindSize ? ` (${item.grindSize})` : ''}`.substring(0, 50),
          };
        }),
        {
          id: "SHIPPING",
          price: selectedCourierRate.price,
          quantity: 1,
          name: `Ongkir ${data.kurir.toUpperCase()} ${data.layananKurir}`.substring(0, 50),
        }
      ],
      custom_expiry: {
        order_time: new Date().toISOString().replace(/\.\d{3}Z$/, ' +0000'), // Format: "yyyy-MM-dd HH:mm:ss Z" expected by midtrans
        expiry_duration: 60,
        unit: "minute"
      }
    };

    const snapResponse = await snap.createTransaction(parameter);

    if (!snapResponse.token) {
      throw new Error("Gagal mendapatkan Snap token dari Midtrans");
    }

    // 5. Buat Order di Database dan Reserve Stok (Status PENDING)
    // Dijalankan setelah Midtrans sukses, untuk menghindari stok menggantung
    const guestToken = session?.user?.id ? null : crypto.randomBytes(32).toString("hex");

    const order = await prisma.$transaction(async (tx) => {
      // Atomic Stock Reservation
      for (const item of cartItems) {
        const dbProduct = dbProducts.find(p => p.id === item.id || p.sanityId === item.id)!;
        
        // Kurangi stok HANYA jika ketersediaan mencukupi (mencegah race condition)
        const updateResult = await tx.product.updateMany({
          where: {
            id: dbProduct.id,
            stock: { gte: item.quantity }
          },
          data: {
            stock: { decrement: item.quantity }
          }
        });

        // Jika count 0, berarti dalam sepersekian detik stok diambil orang lain
        if (updateResult.count === 0) {
          throw new Error(`Stok untuk ${dbProduct.name} habis saat proses checkout.`);
        }

        // Catat di Stock Ledger
        await tx.stockLedger.create({
          data: {
            productId: dbProduct.id,
            quantity: -item.quantity,
            reason: "SALE",
            orderId: idempotencyKey,
            actionBy: "Sistem (Checkout)",
            notes: `Checkout Pesanan ${idempotencyKey}`,
          }
        });
      }

      const newOrder = await tx.order.create({
        data: {
          id: idempotencyKey, 
          userId: session?.user?.id || undefined,
          email: data.email,
          guestToken: guestToken || undefined,
          snapToken: snapResponse.token,
          totalAmount: calculatedTotalAmount,
          status: "PENDING",
          // Snapshot Alamat Pengiriman
          recipientName: data.nama,
          phoneNumber: data.whatsapp,
          province: data.provinsi,
          city: data.kota,
          district: data.kecamatan,
          postalCode: data.kodepos,
          detailAddress: data.detailAlamat,
          courierNote: data.catatanPesanan || null,
          biteshipAreaId: data.biteshipAreaId,
          paymentType: `${data.kurir} - ${data.layananKurir}`, // Info kurir
          // Snapshot Items
          items: {
            create: cartItems.map((item) => {
              const dbProduct = dbProducts.find(p => p.id === item.id || p.sanityId === item.id)!;
              return {
                productId: dbProduct.id,
                productName: dbProduct.name,
                unitPrice: dbProduct.price,
                weight: dbProduct.weight || 200,
                quantity: item.quantity,
                price: dbProduct.price,
                grindSize: item.grindSize || null,
              };
            }),
          },
        },
      });
      return newOrder;
    });

    // 6. Simpan alamat ke Buku Alamat jika diminta (dan user login)
    if (data.simpanAlamat && session?.user?.id) {
      // Cek limit alamat (opsional, bisa dibiarkan)
      await prisma.address.create({
        data: {
          userId: session.user.id,
          label: data.labelAlamat || "Utama",
          recipientName: data.nama,
          phoneNumber: data.whatsapp,
          province: data.provinsi,
          city: data.kota,
          district: data.kecamatan,
          postalCode: data.kodepos,
          detailAddress: data.detailAlamat,
          courierNote: data.catatanPesanan || null,
          biteshipAreaId: data.biteshipAreaId,
        }
      }).catch(err => console.error("Gagal menyimpan alamat:", err));
    }

    return { success: true, orderId: order.id, snapToken: snapResponse.token, guestToken: guestToken };
  } catch (error) {
    console.error("[buatPesanan] Error:", error instanceof Error ? error.message : "Unknown error occurred");
    return { success: false, error: sanitizeErrorMessage(error, "Gagal membuat pesanan. Silakan coba lagi.") };
  }
}

/**
 * Server Action untuk sinkronisasi paksa pesanan PENDING yang melampaui buffer 65 menit.
 * Memanggil API Midtrans (Single Source of Truth) untuk menghindari race conditions.
 */
export async function syncPendingOrders(): Promise<{ success: boolean; message: string }> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    // Cari pesanan PENDING yang usianya lebih dari 65 menit
    const expireThreshold = new Date(Date.now() - 65 * 60 * 1000);
    
    const pendingOrders = await prisma.order.findMany({
      where: {
        userId: session.user.id,
        status: "PENDING",
        createdAt: { lt: expireThreshold }
      },
      include: {
        items: true,
      }
    });

    if (pendingOrders.length === 0) {
      return { success: true, message: "No expired pending orders found." };
    }

    let updatedCount = 0;

    for (const order of pendingOrders) {
      try {
        // Cek status real-time ke Midtrans
        const statusResponse = await coreApi.transaction.status(order.id);
        const transactionStatus = statusResponse.transaction_status;
        const fraudStatus = statusResponse.fraud_status;

        let finalStatus: "PAID" | "PENDING" | "CANCELLED" | null = null;

        if (transactionStatus === "capture") {
          finalStatus = fraudStatus === "accept" ? "PAID" : "PENDING";
        } else if (transactionStatus === "settlement") {
          finalStatus = "PAID";
        } else if (
          transactionStatus === "cancel" ||
          transactionStatus === "deny" ||
          transactionStatus === "expire"
        ) {
          finalStatus = "CANCELLED";
        }

        if (finalStatus === "CANCELLED") {
          const { processCancelledOrder } = await import("@/lib/orderService");
          const processed = await processCancelledOrder(order.id);
          if (processed) updatedCount++;
        } else if (finalStatus === "PAID") {
          // Kasus race condition di mana webhook gagal masuk tapi aslinya sudah dibayar
          const { processSuccessfulOrder } = await import("@/lib/orderService");
          const processed = await processSuccessfulOrder(order.id);
          if (processed) updatedCount++;
        }

      } catch (err: any) {
        // Jika API Midtrans mereturn 404, artinya user membuat order tapi tidak pernah meneruskan token
        // ke popup Midtrans, jadi Midtrans belum mencatatnya.
        // Dalam kasus ini, karena sudah 65 menit, kita anggap CANCELLED.
        const errorMessage = err?.message || err?.ApiResponse?.status_message || "";
        if (errorMessage.includes("404") || errorMessage.includes("not found")) {
          const { processCancelledOrder } = await import("@/lib/orderService");
          await processCancelledOrder(order.id);
          updatedCount++;
        } else {
          console.error(`Gagal mengecek status Midtrans untuk order ${order.id}:`, err);
        }
      }
    }

    if (updatedCount > 0) {
      revalidatePath("/profil/pesanan");
    }

    return { success: true, message: `Synced ${updatedCount} orders.` };
  } catch (error) {
    console.error("[syncPendingOrders] Error:", error);
    return { success: false, message: "Internal server error during sync." };
  }
}

