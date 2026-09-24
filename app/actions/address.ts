"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const addressSchema = z.object({
  label: z.string().optional(),
  recipientName: z.string().min(2, "Nama penerima terlalu pendek"),
  phoneNumber: z.string().min(9, "Nomor telepon tidak valid"),
  province: z.string().min(2),
  city: z.string().min(2),
  district: z.string().min(2),
  postalCode: z.string().min(3),
  detailAddress: z.string().min(5, "Alamat detail terlalu singkat"),
  courierNote: z.string().optional(),
  biteshipAreaId: z.string().min(5),
  isDefault: z.boolean().default(false),
});

export type AddressInput = z.infer<typeof addressSchema>;

export async function tambahAlamat(data: AddressInput) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const validatedData = addressSchema.parse(data);

    // Jika ini adalah alamat pertama, atau di-set sebagai default, jadikan default
    let isDefault = validatedData.isDefault;
    const existingAddresses = await prisma.address.count({
      where: { userId: session.user.id }
    });

    if (existingAddresses === 0) {
      isDefault = true;
    } else if (isDefault) {
      // Hilangkan default dari alamat lain
      await prisma.address.updateMany({
        where: { userId: session.user.id, isDefault: true },
        data: { isDefault: false }
      });
    }

    await prisma.address.create({
      data: {
        userId: session.user.id,
        label: validatedData.label,
        recipientName: validatedData.recipientName,
        phoneNumber: validatedData.phoneNumber,
        province: validatedData.province,
        city: validatedData.city,
        district: validatedData.district,
        postalCode: validatedData.postalCode,
        detailAddress: validatedData.detailAddress,
        courierNote: validatedData.courierNote,
        biteshipAreaId: validatedData.biteshipAreaId,
        isDefault: isDefault,
      }
    });

    revalidatePath("/profil/alamat");
    return { success: true };
  } catch (error) {
    console.error("[tambahAlamat] Error:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: (error as any).errors?.[0]?.message || "Data alamat tidak valid." };
    }
    return { success: false, error: "Gagal menyimpan alamat. Silakan coba lagi." };
  }
}

const editAddressSchema = addressSchema.extend({
  id: z.string().min(1, "ID Alamat diperlukan"),
});

export type EditAddressInput = z.infer<typeof editAddressSchema>;

export async function editAlamat(data: EditAddressInput) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const validatedData = editAddressSchema.parse(data);

    // Pastikan alamat ini milik user
    const existing = await prisma.address.findUnique({
      where: { id: validatedData.id }
    });

    if (!existing || existing.userId !== session.user.id) {
      return { success: false, error: "Alamat tidak ditemukan atau Anda tidak berhak mengubahnya." };
    }

    let isDefault = validatedData.isDefault;

    // Jika diubah menjadi default, hilangkan default dari yang lain
    if (isDefault && !existing.isDefault) {
      await prisma.address.updateMany({
        where: { userId: session.user.id, isDefault: true },
        data: { isDefault: false }
      });
    }

    // Tidak boleh menghilangkan default jika ini adalah satu-satunya alamat
    if (!isDefault && existing.isDefault) {
      const totalAddresses = await prisma.address.count({
        where: { userId: session.user.id }
      });
      if (totalAddresses === 1) {
        isDefault = true;
      }
    }

    await prisma.address.update({
      where: { id: validatedData.id },
      data: {
        label: validatedData.label,
        recipientName: validatedData.recipientName,
        phoneNumber: validatedData.phoneNumber,
        province: validatedData.province,
        city: validatedData.city,
        district: validatedData.district,
        postalCode: validatedData.postalCode,
        detailAddress: validatedData.detailAddress,
        courierNote: validatedData.courierNote,
        biteshipAreaId: validatedData.biteshipAreaId,
        isDefault: isDefault,
      }
    });

    revalidatePath("/profil/alamat");
    return { success: true };
  } catch (error) {
    console.error("[editAlamat] Error:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: (error as any).errors?.[0]?.message || "Data alamat tidak valid." };
    }
    return { success: false, error: "Gagal mengubah alamat. Silakan coba lagi." };
  }
}

export async function hapusAlamat(addressId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    if (!addressId) {
      return { success: false, error: "ID Alamat diperlukan" };
    }

    const existing = await prisma.address.findUnique({
      where: { id: addressId }
    });

    if (!existing || existing.userId !== session.user.id) {
      return { success: false, error: "Alamat tidak ditemukan atau Anda tidak berhak menghapusnya." };
    }

    await prisma.address.delete({
      where: { id: addressId }
    });

    // Jika yang dihapus adalah default address, dan masih ada address lain, set salah satu jadi default
    if (existing.isDefault) {
      const fallbackAddress = await prisma.address.findFirst({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" }
      });

      if (fallbackAddress) {
        await prisma.address.update({
          where: { id: fallbackAddress.id },
          data: { isDefault: true }
        });
      }
    }

    revalidatePath("/profil/alamat");
    return { success: true };
  } catch (error) {
    console.error("[hapusAlamat] Error:", error);
    return { success: false, error: "Gagal menghapus alamat. Silakan coba lagi." };
  }
}
