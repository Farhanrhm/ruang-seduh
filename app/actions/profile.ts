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

