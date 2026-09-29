"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function restockProduct(
  productId: string,
  quantityChange: number,
  notes: string
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "ADMIN") {
    return { success: false, error: "Unauthorized" };
  }

  if (quantityChange === 0) {
    return { success: false, error: "Jumlah perubahan tidak boleh 0." };
  }

  try {
    const isAdding = quantityChange > 0;
    
    await prisma.$transaction([
      prisma.product.update({
        where: { id: productId },
        data: {
          stock: isAdding 
            ? { increment: quantityChange } 
            : { decrement: Math.abs(quantityChange) }
        }
      }),
      prisma.stockLedger.create({
        data: {
          productId,
          quantity: quantityChange,
          reason: isAdding ? "RESTOCK" : "CORRECTION",
          actionBy: `Admin (${session.user.name || session.user.email})`,
          notes: notes || (isAdding ? "Restock Mingguan" : "Koreksi Stok Manual")
        }
      })
    ]);

    revalidatePath("/admin/stok");
    return { success: true };
  } catch (error: any) {
    console.error("Gagal restock:", error);
    return { success: false, error: error.message || "Gagal mengubah stok." };
  }
}
