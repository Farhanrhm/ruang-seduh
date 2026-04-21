"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Coffee } from "lucide-react";
import { useSession } from "next-auth/react"; 

export default function Hero() {
  const { data: session, status } = useSession(); 
  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";

  return (
    <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-bg.jpg"
          alt="Suasana menyeduh kopi"
          fill
          className="object-cover brightness-[0.3]"
          priority
        />
      </div>

      {/* Hero Content */}
      <div className="container mx-auto px-4 z-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8 animate-fade-in">
          <Coffee className="w-4 h-4 text-[#D4956A]" />
          <span className="text-xs font-bold text-[#FDF6EE] uppercase tracking-widest">
            Temukan Karakter Kopimu
          </span>
        </div>
        
        <h1 className="font-judul text-5xl md:text-7xl lg:text-8xl font-black text-[#FDF6EE] mb-8 leading-[1.1] tracking-tighter">
          Ruang <span className="text-[#D4956A]">Seduh.</span>
        </h1>
        
        <p className="font-teks text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-12 leading-relaxed">
          Catat setiap tetesan rasa, jelajahi biji kopi nusantara, dan temukan teknik seduh yang paling pas untuk harimu.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          {/* Tombol Utama Dinamis */}
          <Link
            href={session ? "/toko" : "/api/auth/signin"} // Jika sudah login, arahkan ke Toko. Jika belum, ke Sign In.
            className="group relative px-8 py-4 bg-[#D4956A] text-[#1A110A] rounded-full font-black text-lg overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-[#D4956A]/20"
          >
            <span className="relative z-10 flex items-center gap-2">
              {session ? "Mulai Belanja" : "Bergabung Sekarang"} {/* Teks berubah sesuai status login */}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
          
          <Link
            href="/panduan"
            className="px-8 py-4 bg-transparent text-[#FDF6EE] border-2 border-white/20 rounded-full font-black text-lg hover:bg-white/10 transition-all backdrop-blur-sm"
          >
            Pelajari Teknik
          </Link>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
        <div className="w-1 h-12 rounded-full bg-gradient-to-b from-[#D4956A] to-transparent"></div>
      </div>
    </section>
  );
}