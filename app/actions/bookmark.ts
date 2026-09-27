"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const BookmarkSchema = z.object({
  slug: z.string().min(1, "Slug wajib diisi.").max(200),
  type: z.enum(["guide", "blog", "jurnal"]).default("guide"),
});

const SlugSchema = z.string().min(1).max(200);

export async function toggleBookmark(slug: string, type: string = "guide") {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, error: "Silakan masuk untuk menyimpan artikel." };
  }

  const parsed = BookmarkSchema.safeParse({ slug, type });
  if (!parsed.success) {
    return { success: false, error: "Input tidak valid." };
  }

  try {
    const existing = await prisma.savedArticle.findUnique({
      where: {
        userId_slug: {
          userId: session.user.id,
          slug: parsed.data.slug,
        },
      },
    });

    if (existing) {
      await prisma.savedArticle.delete({
        where: { id: existing.id },
      });
      revalidatePath("/profil/tersimpan");
      return { success: true, saved: false, message: "Artikel dihapus dari ruang baca." };
    } else {
      await prisma.savedArticle.create({
        data: {
          userId: session.user.id,
          slug: parsed.data.slug,
          type: parsed.data.type,
        },
      });
      revalidatePath("/profil/tersimpan");
      return { success: true, saved: true, message: "Artikel disimpan ke ruang baca." };
    }
  } catch (error) {
    console.error("Error toggling bookmark:", error);
    return { success: false, error: "Gagal memproses permintaan, silakan coba lagi." };
  }
}

export async function checkBookmarkStatus(slug: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return false;

  const parsed = SlugSchema.safeParse(slug);
  if (!parsed.success) return false;

  try {
    const existing = await prisma.savedArticle.findUnique({
      where: {
        userId_slug: {
          userId: session.user.id,
          slug: parsed.data,
        },
      },
    });
    return !!existing;
  } catch (error) {
    return false;
  }
}

