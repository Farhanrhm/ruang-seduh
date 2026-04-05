"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function tambahKomentar(slug: string, text: string) {
  // 1. Cek apakah user sudah login
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("Anda harus login untuk berkomentar.");
  }

  // 2. Simpan komentar ke Supabase
  await prisma.comment.create({
    data: {
      text,
      postSlug: slug,
      userId: session.user.id,
    },
  });

  // 3. Refresh halaman blog secara otomatis agar komentar langsung muncul
  revalidatePath(`/blog/${slug}`);
}