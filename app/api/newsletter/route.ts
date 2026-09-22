import { NextRequest, NextResponse } from "next/server";
import { resend } from "@/lib/resend";
import { WelcomeEmail } from "@/emails/WelcomeEmail";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Alamat email tidak valid." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Format email tidak dikenali." },
        { status: 400 }
      );
    }

    await resend.emails.send({
      from: "Ruang Seduh <halo@ruangseduh.id>",
      to: [email],
      subject: "Selamat datang di Ruang Seduh!",
      react: WelcomeEmail({ name: "Penikmat Kopi" }),
    });

    return NextResponse.json(
      { message: "Berhasil berlangganan." },
      { status: 200 }
    );
  } catch (error) {
    console.error("[newsletter] Gagal mengirim email:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan. Coba lagi sebentar." },
      { status: 500 }
    );
  }
}
