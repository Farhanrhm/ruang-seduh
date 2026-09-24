"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateProfile(name: string, newsletter: boolean) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    if (!name || name.trim().length < 3) {
      return { success: false, error: "Nama lengkap harus terdiri dari minimal 3 karakter." };
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: name.trim(),
        newsletter: newsletter
      }
    });

    revalidatePath("/profil/pengaturan");
    return { success: true };
  } catch (error) {
    console.error("[updateProfile] Error:", error);
    return { success: false, error: "Gagal memperbarui profil. Silakan coba lagi." };
  }
}
