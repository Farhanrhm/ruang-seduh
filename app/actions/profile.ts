"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const ProfileSchema = z.object({
  name: z.string().trim().min(3, "Nama lengkap harus terdiri dari minimal 3 karakter.").max(100, "Nama maksimal 100 karakter."),
  newsletter: z.boolean(),
});

export async function updateProfile(name: string, newsletter: boolean) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const parsed = ProfileSchema.safeParse({ name, newsletter });
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Input tidak valid." };
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: parsed.data.name,
        newsletter: parsed.data.newsletter
      }
    });

    revalidatePath("/profil/pengaturan");
    return { success: true };
  } catch (error) {
    console.error("[updateProfile] Error:", error);
    return { success: false, error: "Gagal memperbarui profil. Silakan coba lagi." };
  }
}

export async function deleteAccount() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const userId = session.user.id;

    // Transaksi database: Hapus PII dan data interaksi, pertahankan Order dengan anonimisasi.
    await prisma.$transaction([
      prisma.account.deleteMany({ where: { userId } }),
      prisma.session.deleteMany({ where: { userId } }),
      prisma.address.deleteMany({ where: { userId } }),
      prisma.brewJournal.deleteMany({ where: { userId } }),
      prisma.comment.deleteMany({ where: { userId } }),
      prisma.like.deleteMany({ where: { userId } }),
      prisma.savedArticle.deleteMany({ where: { userId } }),
      
      prisma.user.update({
        where: { id: userId },
        data: {
          name: "Pengguna Anonim",
          email: `anonim-${userId}@ruangseduh.local`,
          image: null,
          newsletter: false,
        }
      })
    ]);

    return { success: true };
  } catch (error) {
    console.error("[deleteAccount] Error:", error);
    return { success: false, error: "Gagal menghapus akun. Silakan coba lagi nanti." };
  }
}

