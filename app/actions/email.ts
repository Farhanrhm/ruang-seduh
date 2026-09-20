"use server";

import { Resend } from "resend";
import { WelcomeEmail } from "@/emails/WelcomeEmail";
import { InvoiceEmail } from "@/emails/InvoiceEmail";
import type { CartItem } from "@/store/useCartStore";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function kirimEmailWelcome(email: string, name: string) {
  try {
    await resend.emails.send({
      from: "Ruang Seduh <onboarding@resend.dev>",
      to: email,
      subject: "Selamat Datang di Komunitas Ruang Seduh!",
      react: WelcomeEmail({ name }),
    });
  } catch {
    console.error("Gagal mengirim email sambutan.");
  }
}

export async function kirimEmailInvoice(
  email: string,
  customerName: string,
  cartItems: CartItem[],
  total: number,
  orderId: string
) {
  try {
    await resend.emails.send({
      from: "Ruang Seduh Store <onboarding@resend.dev>",
      to: email,
      subject: `Invoice Pesanan Anda - ${orderId}`,
      react: InvoiceEmail({
        name: customerName,
        orderId: orderId,
        items: cartItems,
        total: total,
      }),
    });
  } catch {
    console.error("Gagal mengirim email invoice.");
  }
}
