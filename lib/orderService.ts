import { prisma } from "@/lib/prisma";
import { kirimEmailInvoice } from "@/app/actions/email";

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
      // Kurangi stok barang
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }
      
      // Kirim email invoice hanya sekali saat transisi dari PENDING ke PAID
      if (order.user?.email) {
        const emailItems = order.items.map((item) => ({
          name: `${item.productName}${item.grindSize ? ` (${item.grindSize})` : ""}`,
          price: item.price,
          quantity: item.quantity,
        }));

        kirimEmailInvoice(
          order.user.email,
          order.recipientName || order.user.name || "Pelanggan",
          emailItems,
          order.totalAmount,
          order.id
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
    if (order.status === "PAID") {
      const updateResult = await tx.order.updateMany({
        where: { id: orderId, status: "PAID" },
        data: { status: "CANCELLED", ...(midtransId && { midtransId }) },
      });

      // Kembalikan stok hanya jika benar-benar berubah dari PAID ke CANCELLED
      if (updateResult.count > 0) {
        for (const item of order.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          });
        }
      }
    } else if (order.status === "PENDING") {
       await tx.order.updateMany({
        where: { id: orderId, status: "PENDING" },
        data: { status: "CANCELLED", ...(midtransId && { midtransId }) },
      });
    }
  });

  return true;
}
