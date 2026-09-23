import Hero from "@/components/Hero";
import Link from "next/link";
import { BookOpen, Map, BookMarked, Users } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

export default function Home() {
  return (
    <div className="bg-[#FDF6EE] min-h-screen text-[#4B2E1C]">
      {/* 1. Bagian Hero */}
      <Hero />

      {/* 2. Fitur Utama Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">

          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="font-judul text-4xl md:text-5xl font-black text-[#4B2E1C] mb-4 tracking-tight">Ruang Untuk Semua</h2>
            <p className="font-teks text-[#8B5E3C] text-lg leading-relaxed">Dari pemula yang baru mengenal V60 hingga barista rumahan yang mencari kesempurnaan rasio dan suhu seduhan.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">

            {/* Primary Feature 1 — Direktori, 2 kolom */}
            <ScrollReveal delay={0} className="lg:col-span-2 h-full">
              <Link href="/direktori" className="bg-white p-8 md:p-12 rounded-2xl border border-[#8B5E3C]/10 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group flex flex-col md:flex-row gap-8 items-center h-full">
                <div className="w-20 h-20 bg-[#FDF6EE] rounded-3xl flex items-center justify-center flex-shrink-0 group-hover:bg-[#D4956A] transition-colors duration-300 [&>svg]:group-hover:text-white [&>svg]:transition-colors">
                  <Map className="w-10 h-10 text-[#D4956A]" />
                </div>
                <div>
                  <h3 className="font-judul text-3xl font-bold text-[#4B2E1C] mb-3 group-hover:text-[#D4956A] transition-colors">Peta Kopi Nusantara</h3>
                  <p className="font-teks text-[#8B5E3C] leading-relaxed text-lg">
                    Katalog profil rasa biji kopi nusantara untuk referensi seduhanmu.
                  </p>
                </div>
              </Link>
            </ScrollReveal>

            {/* Secondary Feature 1 — Jurnal */}
            <ScrollReveal delay={100} className="h-full">
              <Link href="/jurnal" className="bg-white p-8 rounded-2xl border border-[#8B5E3C]/10 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full">
                <div className="w-16 h-16 bg-[#FDF6EE] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#D4956A] transition-colors duration-300 [&>svg]:group-hover:text-white [&>svg]:transition-colors">
                  <BookMarked className="w-8 h-8 text-[#D4956A]" />
                </div>
                <h3 className="font-judul text-2xl font-bold text-[#4B2E1C] mb-3 group-hover:text-[#D4956A] transition-colors">Jurnal Personal</h3>
                <p className="font-teks text-[#8B5E3C] leading-relaxed flex-1">
                  Catat rasio, suhu, dan hasil eksperimen seduhan kopimu setiap harinya secara rahasia.
                </p>
              </Link>
            </ScrollReveal>

            {/* Secondary Feature 2 — Panduan */}
            <ScrollReveal delay={150} className="h-full">
              <Link href="/panduan" className="bg-white p-8 rounded-2xl border border-[#8B5E3C]/10 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full">
                <div className="w-16 h-16 bg-[#FDF6EE] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#D4956A] transition-colors duration-300 [&>svg]:group-hover:text-white [&>svg]:transition-colors">
                  <BookOpen className="w-8 h-8 text-[#D4956A]" />
                </div>
                <h3 className="font-judul text-2xl font-bold text-[#4B2E1C] mb-3 group-hover:text-[#D4956A] transition-colors">Panduan Seduh</h3>
                <p className="font-teks text-[#8B5E3C] leading-relaxed flex-1">
                  Panduan langkah demi langkah teknik manual brew untuk pemula hingga mahir.
                </p>
              </Link>
            </ScrollReveal>

            {/* Primary Feature 2 — Blog, 2 kolom */}
            <ScrollReveal delay={200} className="lg:col-span-2 h-full">
              <Link href="/blog" className="bg-white p-8 md:p-10 rounded-2xl border border-[#8B5E3C]/10 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group flex flex-col md:flex-row gap-6 items-center h-full">
                <div className="w-16 h-16 bg-[#FDF6EE] rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-[#D4956A] transition-colors duration-300 [&>svg]:group-hover:text-white [&>svg]:transition-colors">
                  <Users className="w-8 h-8 text-[#D4956A]" />
                </div>
                <div>
                  <h3 className="font-judul text-2xl font-bold text-[#4B2E1C] mb-2 group-hover:text-[#D4956A] transition-colors">Blog & Komunitas</h3>
                  <p className="font-teks text-[#8B5E3C] leading-relaxed">
                    Baca artikel seputar industri kopi, tips rahasia dari ahli, dan cerita inspiratif langsung dari petani lokal.
                  </p>
                </div>
              </Link>
            </ScrollReveal>

          </div>
        </div>
      </section>
    </div>
  );
}