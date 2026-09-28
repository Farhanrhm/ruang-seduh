import { Resend } from "resend";
import { WelcomeEmail } from "@/emails/WelcomeEmail";
import { InvoiceEmail } from "@/emails/InvoiceEmail";
import { formatOrderId } from "@/lib/formatUtils";
import type { CartItem } from "@/store/useCartStore";

export interface InvoiceEmailItem {
  name: string;
  quantity: number;
  price: number;
}

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
  cartItems: InvoiceEmailItem[] | CartItem[],
  total: number,
  orderId: string,
  guestToken?: string | null
) {
  try {
    const formattedId = formatOrderId(orderId);
    await resend.emails.send({
      from: "Ruang Seduh Store <onboarding@resend.dev>",
      to: email,
      subject: `Invoice Pesanan Anda - ${formattedId}`,
      react: InvoiceEmail({
        name: customerName,
        orderId: orderId,
        items: cartItems,
        total: total,
        guestToken: guestToken,
      }),
    });
  } catch {
    console.error("Gagal mengirim email invoice.");
  }
}
