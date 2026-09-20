"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";
import type { CartItem } from "@/store/useCartStore";
import { sanitizeErrorMessage } from "@/lib/sanitize";

const CheckoutSchema = z.object({
  nama: z.string().min(1, "Nama tidak boleh kosong.").max(100),
  email: z.string().email("Format email tidak valid."),
  alamat: z.string().min(5, "Alamat terlalu pendek.").max(500),
});

export type BuatPesananResult =
  | { success: true; orderId: string }
  | { success: false; error: string };

export async function buatPesanan(
  formData: FormData,
  cartItems: CartItem[],
  total: number
): Promise<BuatPesananResult> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { success: false, error: "Anda harus login untuk melakukan pemesanan." };
  }

  const parsed = CheckoutSchema.safeParse({
    nama: formData.get("nama"),
    email: formData.get("email"),
    alamat: formData.get("alamat"),
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message };
  }

  if (!cartItems || cartItems.length === 0) {
    return { success: false, error: "Keranjang belanja kosong." };
  }

  try {
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        totalAmount: total,
        status: "PENDING",
        items: {
          create: cartItems.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });

    return { success: true, orderId: order.id };
  } catch (error) {
    return { success: false, error: sanitizeErrorMessage(error, "Gagal membuat pesanan. Silakan coba lagi.") };
  }
}
