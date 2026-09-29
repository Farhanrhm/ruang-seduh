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

export async function kirimEmailResi(
  email: string,
  customerName: string,
  orderId: string,
  trackingNumber: string
) {
  try {
    const formattedId = formatOrderId(orderId);
    const envObj = process["env"];
    const fromEmail = envObj.EMAIL_FROM || "Ruang Seduh Store <pesanan@ruangseduh.id>";
    const targetEmail = envObj.NODE_ENV === "production" ? email : "delivered@resend.dev";
    const domain = envObj.NEXT_PUBLIC_APP_URL || "https://ruangseduh.id";
    
    await resend.emails.send({
      from: fromEmail,
      to: targetEmail,
      subject: `Paket Anda Telah Dikirim! - ${formattedId}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>Halo ${customerName}, paket Anda sedang dalam perjalanan! 🚚</h2>
          <p>Terima kasih telah berbelanja di Ruang Seduh. Pesanan Anda dengan ID <strong>${formattedId}</strong> telah diserahkan kepada kurir.</p>
          <div style="background-color: #f4f4f4; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;">Nomor Resi Pelacakan:</p>
            <h3 style="margin: 5px 0;">${trackingNumber}</h3>
          </div>
          <p>Anda dapat mengecek status pesanan Anda melalui dashboard toko kami atau langsung melalui website kurir bersangkutan.</p>
          <a href="${domain}/status-pesanan?orderId=${orderId}" style="display: inline-block; padding: 10px 20px; background-color: #000; color: #fff; text-decoration: none; border-radius: 5px;">Lacak Pesanan Saya</a>
        </div>
      `,
    });
  } catch (error) {
    console.error("Gagal mengirim email resi:", error);
    throw error;
  }
}
