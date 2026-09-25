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
  ratio: z.string().min(1, "Rasio seduh wajib diisi.").max(100),
  waterTemp: z.string().optional().transform(v => v ? parseInt(v, 10) : null),
  grindSize: z.string().optional(),
  waktuMenit: z.string().optional().transform(v => v ? parseInt(v, 10) : 0),
  waktuDetik: z.string().optional().transform(v => v ? parseInt(v, 10) : 0),
  rating: z.string().optional().transform(v => v ? parseInt(v, 10) : null),
  tastingNote: z.string().max(1000).optional(),
});

export async function simpanJurnalBaru(formData: FormData) {
  const session = await getServerSession(authOptions);
  const user = session?.user as SessionUser | undefined;

  if (!user?.id) {
    throw new Error("Anda harus login untuk mencatat jurnal.");
  }

  const rawData = {
    coffeeBean: formData.get("coffeeBean")?.toString(),
    brewMethod: formData.get("brewMethod")?.toString(),
    ratio: formData.get("ratio")?.toString(),
    waterTemp: formData.get("waterTemp")?.toString(),
    grindSize: formData.get("grindSize")?.toString(),
    waktuMenit: formData.get("waktuMenit")?.toString(),
    waktuDetik: formData.get("waktuDetik")?.toString(),
    rating: formData.get("rating")?.toString(),
    tastingNote: formData.get("tastingNote")?.toString() || undefined,
  };

  const parsed = JurnalSchema.safeParse(rawData);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message || "Input tidak valid.");
  }

  let brewTime: number | null = null;
  if (parsed.data.waktuMenit || parsed.data.waktuDetik) {
    brewTime = (parsed.data.waktuMenit || 0) * 60 + (parsed.data.waktuDetik || 0);
  }

  try {
    await prisma.brewJournal.create({
      data: {
        userId: user.id,
        coffeeBean: parsed.data.coffeeBean,
        brewMethod: parsed.data.brewMethod,
        ratio: parsed.data.ratio,
        waterTemp: parsed.data.waterTemp,
        grindSize: parsed.data.grindSize,
        brewTime,
        starRating: parsed.data.rating,
        tastingNote: parsed.data.tastingNote || null,
      },
    });
  } catch (error) {
    console.error("PRISMA ERROR:", error);
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
    coffeeBean: formData.get("coffeeBean")?.toString(),
    brewMethod: formData.get("brewMethod")?.toString(),
    ratio: formData.get("ratio")?.toString(),
    waterTemp: formData.get("waterTemp")?.toString(),
    grindSize: formData.get("grindSize")?.toString(),
    waktuMenit: formData.get("waktuMenit")?.toString(),
    waktuDetik: formData.get("waktuDetik")?.toString(),
    rating: formData.get("rating")?.toString(),
    tastingNote: formData.get("tastingNote")?.toString() || undefined,
  };

  const parsed = JurnalSchema.safeParse(rawData);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message || "Input tidak valid.");
  }

  let brewTime: number | null = null;
  if (parsed.data.waktuMenit || parsed.data.waktuDetik) {
    brewTime = (parsed.data.waktuMenit || 0) * 60 + (parsed.data.waktuDetik || 0);
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
        waterTemp: parsed.data.waterTemp,
        grindSize: parsed.data.grindSize,
        brewTime,
        starRating: parsed.data.rating,
        tastingNote: parsed.data.tastingNote || null,
      },
    });
  } catch (error) {
    throw new Error(sanitizeErrorMessage(error, "Gagal memperbarui jurnal. Silakan coba lagi."));
  }

  revalidatePath("/jurnal");
  redirect("/jurnal");
}
