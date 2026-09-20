"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { sanitizeErrorMessage } from "@/lib/sanitize";

const KomentarSchema = z.object({
  text: z
    .string()
    .min(1, "Komentar tidak boleh kosong.")
    .max(500, "Maksimal 500 karakter."),
  slug: z.string().min(1),
  parentId: z.string().optional(),
});

export async function tambahKomentar(slug: string, text: string, parentId?: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Harus login untuk berkomentar.");

  const parsed = KomentarSchema.safeParse({ text, slug, parentId });
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message || "Input tidak valid.");
  }

  try {
    await prisma.comment.create({
      data: {
        text: parsed.data.text,
        postSlug: parsed.data.slug,
        userId: session.user.id,
        parentId: parsed.data.parentId || null,
      },
    });
  } catch (error) {
    throw new Error(sanitizeErrorMessage(error, "Gagal mengirim komentar. Silakan coba lagi."));
  }

  revalidatePath(`/blog/${slug}`);
}

export async function toggleLike(commentId: string, slug: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Harus login untuk menyukai komentar.");

  if (!commentId || typeof commentId !== "string") {
    throw new Error("ID komentar tidak valid.");
  }

  try {
    const existingLike = await prisma.like.findUnique({
      where: { userId_commentId: { userId: session.user.id, commentId } },
    });

    if (existingLike) {
      await prisma.like.delete({ where: { id: existingLike.id } });
    } else {
      await prisma.like.create({ data: { userId: session.user.id, commentId } });
    }
  } catch (error) {
    throw new Error(sanitizeErrorMessage(error, "Gagal memproses like. Silakan coba lagi."));
  }

  revalidatePath(`/blog/${slug}`);
}

export async function hapusKomentar(commentId: string, slug: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Tidak ada akses.");

  try {
    const userDB = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (userDB?.role !== "ADMIN") {
      throw new Error("Hanya admin yang bisa menghapus komentar.");
    }

    await prisma.comment.delete({ where: { id: commentId } });
  } catch (err) {
    if (err instanceof Error && err.message.includes("admin")) throw err;
    throw new Error(sanitizeErrorMessage(err, "Gagal menghapus komentar. Silakan coba lagi."));
  }

  revalidatePath(`/blog/${slug}`);
}

export async function togglePin(commentId: string, slug: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Tidak ada akses.");

  try {
    const userDB = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (userDB?.role !== "ADMIN") throw new Error("Hanya admin yang bisa melakukan pin.");

    const comment = await prisma.comment.findUnique({ where: { id: commentId } });

    if (!comment?.isPinned) {
      await prisma.comment.updateMany({
        where: { postSlug: slug, isPinned: true },
        data: { isPinned: false },
      });
    }

    await prisma.comment.update({
      where: { id: commentId },
      data: { isPinned: !comment?.isPinned },
    });
  } catch (err) {
    if (err instanceof Error && err.message.includes("admin")) throw err;
    throw new Error(sanitizeErrorMessage(err, "Gagal memperbarui pin komentar. Silakan coba lagi."));
  }

  revalidatePath(`/blog/${slug}`);
}
