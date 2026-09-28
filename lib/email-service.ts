import { resend } from "@/lib/resend";
import { WelcomeEmail } from "@/emails/WelcomeEmail";
import { InvoiceEmail } from "@/emails/InvoiceEmail";
import { formatOrderId } from "@/lib/formatUtils";
import type { CartItem } from "@/store/useCartStore";

export interface InvoiceEmailItem {
  name: string;
  quantity: number;
  price: number;
}

export async function kirimEmailWelcome(email: string, name: string) {
  try {
    const fromEmail = process.env.EMAIL_FROM || "Ruang Seduh <halo@ruangseduh.id>";
    const targetEmail = process.env.NODE_ENV === "production" ? email : "delivered@resend.dev";
    await resend.emails.send({
      from: fromEmail,
      to: targetEmail,
      subject: "Selamat Datang di Komunitas Ruang Seduh!",
      react: WelcomeEmail({ name }),
    });
  } catch (error) {
    console.error("Gagal mengirim email sambutan:", error);
  }
}

export async function kirimEmailInvoice(
  email: string,
  customerName: string,
  cartItems: InvoiceEmailItem[] | CartItem[],
  total: number,
  orderId: string,
  guestToken?: string | null,
  subtotal: number = total,
  ongkir: number = 0,
  city: string = "-",
  paymentType: string = "-",
  createdAt: Date = new Date()
) {
  try {
    const formattedId = formatOrderId(orderId);
    const fromEmail = process.env.EMAIL_FROM || "Ruang Seduh Store <pesanan@ruangseduh.id>";
    const targetEmail = process.env.NODE_ENV === "production" ? email : "delivered@resend.dev";
    
    await resend.emails.send({
      from: fromEmail,
      to: targetEmail,
      subject: `Invoice Pesanan Anda - ${formattedId}`,
      react: InvoiceEmail({
        name: customerName,
        orderId: orderId,
        items: cartItems,
        total: total,
        guestToken: guestToken,
        subtotal: subtotal,
        ongkir: ongkir,
        city: city,
        paymentType: paymentType,
        createdAt: createdAt
      }),
    });
  } catch (error) {
    console.error("Gagal mengirim email invoice:", error);
  }
}
