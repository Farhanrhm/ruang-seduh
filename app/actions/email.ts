"use server";

import { resend } from "@/lib/resend";
import { WelcomeEmail } from "@/emails/WelcomeEmail";
import { InvoiceEmail } from "@/emails/InvoiceEmail"; // Asumsikan Anda buat template serupa untuk Invoice

export async function kirimEmailWelcome(email: string, name: string) {
  try {
    await resend.emails.send({
      from: 'Ruang Seduh <onboarding@resend.dev>', // Nanti ganti dengan domain asli
      to: email,
      subject: 'Selamat Datang di Komunitas Ruang Seduh!',
      react: WelcomeEmail({ name }),
    });
  } catch (error) {
    console.error("Gagal kirim email welcome:", error);
  }
}


export async function kirimEmailInvoice(email: string, customerName: string, cartItems: any[], total: number) {
  try {
    // Generate Order ID acak
    const orderId = `INV-${Math.floor(100000 + Math.random() * 900000)}`;
    const shippingCost = 20000;

    await resend.emails.send({
      from: 'Ruang Seduh Store <onboarding@resend.dev>', // Nanti ganti domain Anda
      to: email,
      subject: `Invoice Pesanan Anda - ${orderId}`,
      react: InvoiceEmail({ 
        customerName: customerName,
        orderId: orderId,
        items: cartItems,
        totalAmount: total,
        shippingCost: shippingCost
      }),
    });
    
    console.log("Invoice berhasil dikirim ke", email);
  } catch (error) {
    console.error("Gagal kirim email invoice:", error);
  }
}