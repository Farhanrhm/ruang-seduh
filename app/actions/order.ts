"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";
import type { CartItem } from "@/store/useCartStore";
import { sanitizeErrorMessage } from "@/lib/sanitize";
import { CheckoutSchema, type CheckoutOutput } from "@/lib/validations/checkout";
import { snap } from "@/lib/midtrans";
import { hitungOngkirBiteship } from "@/app/actions/biteship";

export type BuatPesananResult =
  | { success: true; orderId: string; snapToken: string }
  | { success: false; error: string };

export async function buatPesanan(
  data: CheckoutOutput,
  cartItems: CartItem[],
  idempotencyKey: string
): Promise<BuatPesananResult> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { success: false, error: "Anda harus login untuk melakukan pemesanan." };
  }

  // Server-side validation using the shared schema
  const parsed = CheckoutSchema.safeParse(data);

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || "Input tidak valid." };
  }

  if (!cartItems || cartItems.length === 0) {
    return { success: false, error: "Keranjang belanja kosong." };
  }

  if (!idempotencyKey) {
    return { success: false, error: "Permintaan tidak valid (missing idempotency key)." };
  }

  try {
    // 1. Cek Idempotency: Apakah pesanan dengan ID ini sudah ada?
    const existingOrder = await prisma.order.findUnique({
      where: { id: idempotencyKey }
    });

    if (existingOrder) {
      if (existingOrder.status === "PENDING" && existingOrder.midtransId) { // We'll use midtransId to store snap token temporarily if we want, or just re-generate
        // But for simplicity, let's just generate a new token or return an error saying it's already processed
        // Alternatively, if it exists and pending, we could re-fetch the token. But Midtrans snap token doesn't have an API to "get token by order id" easily without storing it.
        // Let's store the snap token in `paymentType` temporarily since we don't have a dedicated column, OR just return error.
        return { success: false, error: "Pesanan ini sudah sedang diproses. Silakan refresh halaman." };
      }
      return { success: false, error: "Pesanan ini sudah diproses sebelumnya." };
    }

    // 2. Server-side Validation: Cek stok dan harga asli dari DB
    const productIds = cartItems.map(i => i.id);
    const dbProducts = await prisma.product.findMany({
      where: { 
        OR: [
          { id: { in: productIds } },
          { sanityId: { in: productIds } }
        ],
        isActive: true 
      }
    });

    if (dbProducts.length !== productIds.length) {
      return { success: false, error: "Beberapa produk tidak ditemukan atau sudah tidak aktif." };
    }

    let calculatedTotalProduk = 0;
    let totalWeightGram = 0;

    for (const item of cartItems) {
      const dbProduct = dbProducts.find(p => p.id === item.id || p.sanityId === item.id);
      if (!dbProduct) return { success: false, error: `Produk ${item.name} tidak ditemukan.` };
      
      if (dbProduct.stock < item.quantity) {
        return { success: false, error: `Stok ${dbProduct.name} tidak mencukupi (Tersisa ${dbProduct.stock}).` };
      }

      calculatedTotalProduk += dbProduct.price * item.quantity;
      totalWeightGram += (dbProduct.weight || 200) * item.quantity;
    }

    // 3. Server-side Validation: Hitung ulang ongkir Biteship
    const ongkirRes = await hitungOngkirBiteship(data.biteshipAreaId, totalWeightGram);
    if (!ongkirRes.success || !ongkirRes.data) {
      return { success: false, error: "Gagal memvalidasi ongkos kirim." };
    }

    const selectedCourierRate = ongkirRes.data.find(
      r => r.courier_name === data.kurir && r.courier_service_name === data.layananKurir
    );

    if (!selectedCourierRate) {
      return { success: false, error: "Tarif kurir yang dipilih tidak valid atau telah berubah." };
    }

    const calculatedTotalAmount = calculatedTotalProduk + selectedCourierRate.price;

    // 4. Buat Order di Database (Status PENDING)
    const order = await prisma.order.create({
      data: {
        id: idempotencyKey, // Use idempotency key as Order ID
        userId: session.user.id,
        totalAmount: calculatedTotalAmount,
        status: "PENDING",
        // Snapshot Alamat Pengiriman
        recipientName: data.nama,
        phoneNumber: data.whatsapp,
        province: data.provinsi,
        city: data.kota,
        district: data.kecamatan,
        postalCode: data.kodepos,
        detailAddress: data.detailAlamat,
        courierNote: data.catatanPesanan || null,
        biteshipAreaId: data.biteshipAreaId,
        paymentType: `${data.kurir} - ${data.layananKurir}`, // Simpan info kurir di sini untuk sementara atau di snapshot khusus
        // Snapshot Items
        items: {
          create: cartItems.map((item) => {
            const dbProduct = dbProducts.find(p => p.id === item.id || p.sanityId === item.id)!;
            return {
              productId: dbProduct.id,
              productName: dbProduct.name,
              unitPrice: dbProduct.price,
              weight: dbProduct.weight || 200,
              quantity: item.quantity,
              price: dbProduct.price,
              grindSize: item.grindSize || null,
            };
          }),
        },
      },
    });

    // 5. Minta Snap Token ke Midtrans
    const parameter = {
      transaction_details: {
        order_id: order.id,
        gross_amount: calculatedTotalAmount,
      },
      customer_details: {
        first_name: data.nama,
        email: data.email,
        phone: data.whatsapp,
      },
      item_details: [
        ...cartItems.map((item) => {
          const dbProduct = dbProducts.find(p => p.id === item.id || p.sanityId === item.id)!;
          return {
            id: dbProduct.id,
            price: dbProduct.price,
            quantity: item.quantity,
            name: `${dbProduct.name}${item.grindSize ? ` (${item.grindSize})` : ''}`.substring(0, 50),
          };
        }),
        {
          id: "SHIPPING",
          price: selectedCourierRate.price,
          quantity: 1,
          name: `Ongkir ${data.kurir.toUpperCase()} ${data.layananKurir}`.substring(0, 50),
        }
      ]
    };

    const snapResponse = await snap.createTransaction(parameter);

    if (!snapResponse.token) {
      throw new Error("Gagal mendapatkan Snap token dari Midtrans");
    }

    // Update order dengan snapToken
    await prisma.order.update({
      where: { id: order.id },
      data: { snapToken: snapResponse.token }
    });

    return { success: true, orderId: order.id, snapToken: snapResponse.token };
  } catch (error) {
    console.error("[buatPesanan] Error:", error);
    return { success: false, error: sanitizeErrorMessage(error, "Gagal membuat pesanan. Silakan coba lagi.") };
  }
}
