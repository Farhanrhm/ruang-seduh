"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession, DefaultSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { sanitizeErrorMessage } from "@/lib/sanitize";

type SessionUser = DefaultSession["user"] & { id: string };

const JurnalSchema = z.object({
  coffeeBean: z.string().min(1, "Nama biji kopi wajib diisi.").max(100),
  brewMethod: z.string().min(1, "Metode seduh wajib diisi.").max(50),
  ratio: z.string().min(1, "Rasio seduh wajib diisi.").max(20),
  tastingNote: z.string().max(1000).optional(),
});

export async function simpanJurnalBaru(formData: FormData) {
  const session = await getServerSession(authOptions);
  const user = session?.user as SessionUser | undefined;

  if (!user?.id) {
    throw new Error("Anda harus login untuk mencatat jurnal.");
  }

  const rawData = {
    coffeeBean: formData.get("coffeeBean"),
    brewMethod: formData.get("brewMethod"),
    ratio: formData.get("ratio"),
    tastingNote: formData.get("tastingNote") || undefined,
  };

  const parsed = JurnalSchema.safeParse(rawData);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message || "Input tidak valid.");
  }

  try {
    await prisma.brewJournal.create({
      data: {
        userId: user.id,
        coffeeBean: parsed.data.coffeeBean,
        brewMethod: parsed.data.brewMethod,
        ratio: parsed.data.ratio,
        tastingNote: parsed.data.tastingNote || null,
        rating: "SUCCESS",
      },
    });
  } catch (error) {
    throw new Error(sanitizeErrorMessage(error, "Gagal menyimpan jurnal seduh. Silakan coba lagi."));
  }

  revalidatePath("/jurnal");
  redirect("/jurnal");
}

export async function hapusJurnal(id: string) {
  const session = await getServerSession(authOptions);
  const user = session?.user as SessionUser | undefined;

  if (!user?.id) {
    throw new Error("Tidak diizinkan.");
  }

  try {
    await prisma.brewJournal.delete({
      where: {
        id: id,
        userId: user.id,
      },
    });
  } catch (error) {
    throw new Error(sanitizeErrorMessage(error, "Gagal menghapus jurnal. Silakan coba lagi."));
  }

  revalidatePath("/jurnal");
}

export async function updateJurnal(id: string, formData: FormData) {
  const session = await getServerSession(authOptions);
  const user = session?.user as SessionUser | undefined;

  if (!user?.id) {
    throw new Error("Tidak diizinkan.");
  }

  const rawData = {
    coffeeBean: formData.get("coffeeBean"),
    brewMethod: formData.get("brewMethod"),
    ratio: formData.get("ratio"),
    tastingNote: formData.get("tastingNote") || undefined,
  };

  const parsed = JurnalSchema.safeParse(rawData);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message || "Input tidak valid.");
  }

  try {
    await prisma.brewJournal.update({
      where: {
        id: id,
        userId: user.id,
      },
      data: {
        coffeeBean: parsed.data.coffeeBean,
        brewMethod: parsed.data.brewMethod,
        ratio: parsed.data.ratio,
        tastingNote: parsed.data.tastingNote || null,
      },
    });
  } catch (error) {
    throw new Error(sanitizeErrorMessage(error, "Gagal memperbarui jurnal. Silakan coba lagi."));
  }

  revalidatePath("/jurnal");
  redirect("/jurnal");
}
