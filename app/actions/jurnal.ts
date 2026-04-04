"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function simpanJurnalBaru(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!(session?.user as any)?.id) {
    throw new Error("Anda harus login untuk mencatat jurnal.");
  }

  const coffeeBean = formData.get("coffeeBean") as string;
  const brewMethod = formData.get("brewMethod") as string;
  const ratio = formData.get("ratio") as string;
  const tastingNote = formData.get("tastingNote") as string;
  
  await prisma.brewJournal.create({
    data: {
      userId: (session!.user as any).id,
      coffeeBean,
      brewMethod,
      ratio,
      tastingNote,
      rating: "SUCCESS", 
    },
  });
  revalidatePath("/jurnal");
  redirect("/jurnal");
}

export async function hapusJurnal(id: string) {
  const session = await getServerSession(authOptions);
  
  if (!(session?.user as any)?.id) {
    throw new Error("Tidak diizinkan.");
  }

  await prisma.brewJournal.delete({
    where: {
      id: id,
      userId: (session!.user as any).id,
    },
  });

  revalidatePath("/jurnal");
}

export async function updateJurnal(id: string, formData: FormData) {
  const session = await getServerSession(authOptions);
  
  if (!(session?.user as any)?.id) {
    throw new Error("Tidak diizinkan.");
  }

  const coffeeBean = formData.get("coffeeBean") as string;
  const brewMethod = formData.get("brewMethod") as string;
  const ratio = formData.get("ratio") as string;
  const tastingNote = formData.get("tastingNote") as string;

  await prisma.brewJournal.update({
    where: { 
      id: id,
      userId: (session!.user as any).id,
    },
    data: {
      coffeeBean,
      brewMethod,
      ratio,
      tastingNote,
    },
  });

  revalidatePath("/jurnal");
  redirect("/jurnal");
}