"use client";

import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useState } from "react";

export default function HeroCTA() {
  const { data: session, status } = useSession();
  const [signingIn, setSigningIn] = useState(false);

  // Skeleton loading state — mencegah CLS saat sesi sedang diverifikasi
  if (status === "loading") {
    return (
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-pulse">
        <div className="w-52 h-14 bg-white/20 rounded-2xl border border-white/10" />
        <div className="w-48 h-14 bg-white/10 rounded-2xl border border-white/20" />
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
      {session ? (
        <Link
          href="/toko"
          className="group relative px-8 py-4 bg-[#D4956A] text-[#1A110A] rounded-2xl font-black text-lg overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-[#D4956A]/20"
        >
          <span className="relative z-10">Mulai Belanja</span>
        </Link>
      ) : (
        <button
          onClick={async () => {
            setSigningIn(true);
            await signIn("google");
          }}
          disabled={signingIn}
          className="group relative px-8 py-4 bg-[#D4956A] text-[#1A110A] rounded-2xl font-black text-lg overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-[#D4956A]/20 disabled:opacity-80 disabled:cursor-wait disabled:hover:scale-100"
        >
          <span className="relative z-10">
            {signingIn ? "Mengarahkan..." : "Bergabung Sekarang"}
          </span>
        </button>
      )}

      <Link
        href="/panduan"
        className="px-8 py-4 bg-transparent text-[#FDF6EE] border-2 border-white/20 rounded-2xl font-black text-lg hover:bg-white/10 transition-all"
      >
        Pelajari Teknik
      </Link>
    </div>
  );
}
