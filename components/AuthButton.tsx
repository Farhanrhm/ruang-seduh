"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { User, LogOut } from "lucide-react";
import Image from "next/image";

export default function AuthButton() {
  const { data: session, status } = useSession();

  // Jika sedang mengecek sesi (loading), tampilkan ikon samar
  if (status === "loading") {
    return <User className="h-5 w-5 text-[#8B5E3C]/50 animate-pulse" />;
  }

  // Jika SUDAH login: Tampilkan foto profil Google dan tombol Logout
  if (session && session.user) {
    return (
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 overflow-hidden rounded-full border border-[#8B5E3C]/30">
          {session.user.image ? (
            <Image 
              src={session.user.image} 
              alt={session.user.name || "Profil"} 
              width={32} 
              height={32} 
            />
          ) : (
            <User className="h-full w-full p-1" />
          )}
        </div>
        <button 
          onClick={() => signOut()} 
          title="Keluar"
          className="hover:text-[#D4956A] transition-colors"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    );
  }

  // Jika BELUM login: Tampilkan tombol login (ikon User)
  return (
    <button 
      onClick={() => signIn("google")} 
      title="Masuk / Daftar"
      className="hover:text-[#D4956A] transition-colors"
    >
      <User className="h-5 w-5" />
    </button>
  );
}