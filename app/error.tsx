"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Bisa disambungkan ke Sentry atau layanan pelaporan error lainnya
    console.error("Terjadi kesalahan global:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#FDF6EE] flex items-center justify-center p-4">
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl max-w-lg w-full text-center border border-red-100">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10 text-red-500" />
        </div>
        
        <h2 className="font-judul text-3xl font-black text-[#4B2E1C] mb-4">
          Waduh, Ada Kendala!
        </h2>
        
        <p className="font-teks text-[#8B5E3C] mb-8 leading-relaxed">
          Sistem kami mengalami sedikit masalah. Jangan khawatir, tim teknisi kami sedang membuatkan kopi agar bisa memperbaikinya segera.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#D4956A] text-white rounded-xl font-bold hover:bg-[#A9683C] transition-all shadow-md active:scale-95"
          >
            <RefreshCcw className="w-4 h-4" /> Coba Lagi
          </button>
          
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-[#4B2E1C] border-2 border-[#8B5E3C]/20 rounded-xl font-bold hover:bg-[#FDF6EE] transition-all active:scale-95"
          >
            <Home className="w-4 h-4" /> Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
