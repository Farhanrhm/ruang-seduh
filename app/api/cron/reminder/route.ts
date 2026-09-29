import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendTelegramNotification } from "@/lib/telegram";

export async function GET(request: Request) {
  // Hanya ijinkan Vercel Cron atau pengujian dengan rahasia khusus
  const authHeader = request.headers.get("authorization");
  const envObj = process["env"];
  
  if (
    envObj.NODE_ENV === "production" &&
    authHeader !== `Bearer ${envObj.CRON_SECRET}`
  ) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    // Cari semua order yang lunas tapi belum diproses atau dikirim
    // Ini berarti statusnya masih PAID dan usianya mungkin mendekati batas jam 14.00
    const pendingOrders = await prisma.order.count({
      where: {
        status: "PAID",
      }
    });

    if (pendingOrders > 0) {
      const message = `🚨 <b>PENGINGAT PENGIRIMAN</b>
Ada <b>${pendingOrders} pesanan</b> yang sudah lunas (PAID) namun belum dikemas (PROCESSING).

Mohon segera cek dashboard untuk memastikan batas pengiriman jam 14.00 WIB tidak terlewat!`;
      
      await sendTelegramNotification(message);
    }

    // AUTO-COMPLETE: Tandai DELIVERED untuk pesanan SHIPPED yang usianya > 5 hari sejak update terakhir
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

    const staleShippedOrders = await prisma.order.findMany({
      where: {
        status: "SHIPPED",
        updatedAt: {
          lt: fiveDaysAgo
        }
      },
      select: { id: true }
    });

    if (staleShippedOrders.length > 0) {
      const orderIds = staleShippedOrders.map(o => o.id);
      
      // Update status menjadi DELIVERED
      await prisma.order.updateMany({
        where: { id: { in: orderIds } },
        data: { status: "DELIVERED" }
      });

      // Insert history log untuk audit
      await prisma.orderHistory.createMany({
        data: orderIds.map(id => ({
          orderId: id,
          newStatus: "DELIVERED",
          actionBy: "Sistem (Cron)",
          notes: "Auto-complete: 5 hari berlalu sejak pengiriman",
        }))
      });

      await sendTelegramNotification(`✅ <b>AUTO-COMPLETE BERHASIL</b>\n${staleShippedOrders.length} pesanan otomatis diselesaikan (DELIVERED) karena telah 5 hari dalam perjalanan.`);
    }

    return NextResponse.json({ success: true, pendingOrders, autoCompleted: staleShippedOrders.length });
  } catch (error) {
    console.error("Gagal menjalankan cron reminder:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
