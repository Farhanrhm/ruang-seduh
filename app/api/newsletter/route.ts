import { NextRequest, NextResponse } from "next/server";
import { resend } from "@/lib/resend";
import { WelcomeEmail } from "@/emails/WelcomeEmail";

const rateLimitMap = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS = 3;

export async function POST(request: NextRequest) {
  try {
    // Rate limiting by IP
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    if (ip !== "unknown") {
      const now = Date.now();
      const entry = rateLimitMap.get(ip) || { count: 0, timestamp: now };

      if (now - entry.timestamp < RATE_LIMIT_WINDOW) {
        if (entry.count >= MAX_REQUESTS) {
          return NextResponse.json(
            { error: "Terlalu banyak permintaan. Coba lagi nanti." },
            { status: 429 }
          );
        }
        entry.count++;
      } else {
        entry.count = 1;
        entry.timestamp = now;
      }

      if (rateLimitMap.size > 1000) rateLimitMap.clear();
      rateLimitMap.set(ip, entry);
    }

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

