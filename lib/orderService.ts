import { prisma } from "@/lib/prisma";
import { kirimEmailInvoice } from "@/lib/email-service";

export async function processSuccessfulOrder(orderId: string, midtransId?: string, paymentType?: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true, user: { select: { email: true, name: true } } },
  });

  if (!order) return false;

  await prisma.$transaction(async (tx) => {
    // 1. Lakukan update HANYA JIKA statusnya masih PENDING
    const updateResult = await tx.order.updateMany({
      where: { 
        id: orderId, 
        status: "PENDING" // Kunci atomic ada di sini
      },
      data: { 
        status: "PAID",
        ...(midtransId && { midtransId }),
        ...(paymentType && { paymentType })
      },
    });

    // 2. Jika count > 0, artinya kode INI yang berhasil mengubah status dari PENDING ke PAID
    if (updateResult.count > 0) {
      // Stok sudah dikurangi saat proses checkout (buatPesanan), jadi tidak perlu dikurangi lagi di sini.
      
      // Kirim email invoice hanya sekali saat transisi dari PENDING ke PAID
      const targetEmail = order.email || order.user?.email;
      if (targetEmail) {
        const emailItems = order.items.map((item) => ({
          name: `${item.productName}${item.grindSize ? ` (${item.grindSize})` : ""}`,
          price: item.price,
          quantity: item.quantity,
        }));

        kirimEmailInvoice(
          targetEmail,
          order.recipientName || order.user?.name || "Pelanggan",
          emailItems,
          order.totalAmount,
          order.id,
          order.guestToken
        ).catch((err) => {
          console.error("Failed to send invoice email:", err);
        });
      }
    }
  });

  return true;
}

export async function processCancelledOrder(orderId: string, midtransId?: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true }
  });

  if (!order) return false;

  await prisma.$transaction(async (tx) => {
    // Kembalikan stok baik dari status PENDING (expired) maupun PAID (refund)
    if (order.status === "PAID" || order.status === "PENDING") {
      const updateResult = await tx.order.updateMany({
        where: { id: orderId, status: order.status },
        data: { status: "CANCELLED", ...(midtransId && { midtransId }) },
      });

      // Kembalikan stok hanya jika benar-benar berhasil mengubah status
      if (updateResult.count > 0) {
        for (const item of order.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          });
        }
      }
    }
  });

  return true;
}
