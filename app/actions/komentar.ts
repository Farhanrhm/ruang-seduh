"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// 1. Tambah & Balas Komentar
export async function tambahKomentar(slug: string, text: string, parentId?: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Harus login.");
  if (text.length > 500) throw new Error("Maksimal 500 karakter.");

  await prisma.comment.create({
    data: {
      text,
      postSlug: slug,
      userId: session.user.id,
      parentId: parentId || null,
    },
  });
  revalidatePath(`/blog/${slug}`);
}

// 2. Sistem Like/Upvote
export async function toggleLike(commentId: string, slug: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Harus login.");

  const existingLike = await prisma.like.findUnique({
    where: { userId_commentId: { userId: session.user.id, commentId } },
  });

  if (existingLike) {
    await prisma.like.delete({ where: { id: existingLike.id } });
  } else {
    await prisma.like.create({ data: { userId: session.user.id, commentId } });
  }
  revalidatePath(`/blog/${slug}`);
}

// 3. Admin: Hapus Komentar
export async function hapusKomentar(commentId: string, slug: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Tidak ada akses.");

  // Cek apakah dia Admin atau pemilik komentar
  const userDB = await prisma.user.findUnique({ where: { id: session.user.id } });
  const comment = await prisma.comment.findUnique({ where: { id: commentId } });

  if (userDB?.role !== "ADMIN" && comment?.userId !== session.user.id) {
    throw new Error("Hanya admin atau penulis yang bisa menghapus.");
  }

  await prisma.comment.delete({ where: { id: commentId } });
  revalidatePath(`/blog/${slug}`);
}

// 4. Admin: Pin Komentar
export async function togglePin(commentId: string, slug: string) {
  const session = await getServerSession(authOptions);
  const userDB = await prisma.user.findUnique({ where: { id: session?.user?.id || "" } });
  if (userDB?.role !== "ADMIN") throw new Error("Hanya admin yang bisa melakukan pin.");

  const comment = await prisma.comment.findUnique({ where: { id: commentId } });
  
  // Jika ingin Pin komentar baru, Unpin dulu semua komentar di artikel ini
  if (!comment?.isPinned) {
    await prisma.comment.updateMany({
      where: { postSlug: slug, isPinned: true },
      data: { isPinned: false },
    });
  }

  // Toggle status pin komentar yang dipilih
  await prisma.comment.update({
    where: { id: commentId },
    data: { isPinned: !comment?.isPinned },
  });
  
  revalidatePath(`/blog/${slug}`);
}