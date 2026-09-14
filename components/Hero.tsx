import Image from "next/image";
import { Coffee } from "lucide-react";
import HeroCTA from "@/components/HeroCTA";

/**
 * Hero Component - Pure Server Component
 * Mengoptimalkan LCP (Largest Contentful Paint) dengan pre-rendering SSR murni,
 * dan mendelegasikan interaktivitas sesi ke leaf client component (HeroCTA).
 */
export default function Hero() {
  return (
    <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image - LCP Asset Utama */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-bg.jpg"
          alt="Suasana menyeduh kopi di Ruang Seduh"
          fill
          priority
          quality={85}
          sizes="100vw"
          className="object-cover brightness-[0.3]"
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

        {/* Leaf Client Component dengan CLS-safe skeleton */}
        <HeroCTA />
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-50" aria-hidden="true">
        <div className="w-1 h-12 rounded-full bg-gradient-to-b from-[#D4956A] to-transparent" />
      </div>
    </section>
  );
}