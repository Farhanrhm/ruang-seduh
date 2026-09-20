"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

export default function HeroCTA() {
  const { data: session, status } = useSession();

  // Skeleton loading state untuk mencegah layout shift (CLS) saat sesi sedang diverifikasi
  if (status === "loading") {
    return (
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-pulse">
        <div className="w-52 h-14 bg-white/20 rounded-full border border-white/10" />
        <div className="w-48 h-14 bg-white/10 rounded-full border border-white/20" />
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
      {/* Tombol Utama Dinamis Berdasarkan Sesi */}
      <Link
        href={session ? "/toko" : "/api/auth/signin"}
        className="group relative px-8 py-4 bg-[#D4956A] text-[#1A110A] rounded-2xl font-black text-lg overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-[#D4956A]/20"
      >
        <span className="relative z-10 flex items-center gap-2">
          {session ? "Mulai Belanja" : "Bergabung Sekarang"}
        </span>
      </Link>

      <Link
        href="/panduan"
        className="px-8 py-4 bg-transparent text-[#FDF6EE] border-2 border-white/20 rounded-2xl font-black text-lg hover:bg-white/10 transition-all"
      >
        Pelajari Teknik
      </Link>
    </div>
  );
}
