import Hero from "@/components/Hero";
import Link from "next/link";
import { BookOpen, Map, BookMarked, Users, ArrowRight } from "lucide-react";

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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            <FeatureCard 
              icon={<Map className="w-8 h-8 text-[#D4956A]" />}
              title="Peta Kopi"
              desc="Eksplorasi direktori biji kopi Nusantara dengan filter profil rasa yang detail."
              link="/direktori"
            />
            <FeatureCard 
              icon={<BookOpen className="w-8 h-8 text-[#D4956A]" />}
              title="Panduan Seduh"
              desc="Pelajari teknik manual brew dari dasar hingga mahir dengan visual yang jelas."
              link="/panduan"
            />
            <FeatureCard 
              icon={<BookMarked className="w-8 h-8 text-[#D4956A]" />}
              title="Jurnal Personal"
              desc="Catat rasio, suhu, dan hasil eksperimen seduhan kopimu setiap harinya."
              link="/jurnal"
            />
            <FeatureCard 
              icon={<Users className="w-8 h-8 text-[#D4956A]" />}
              title="Blog & Cerita"
              desc="Baca artikel seputar industri kopi, tips rahasia, dan cerita dari petani."
              link="/blog"
            />
          </div>
        </div>
      </section>
    </div>
  )
}

// Komponen Card Kecil agar rapi
function FeatureCard({ icon, title, desc, link }: any) {
  return (
    <Link href={link} className="bg-white p-8 rounded-[2rem] border border-[#8B5E3C]/10 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group flex flex-col h-full">
      <div className="w-16 h-16 bg-[#FDF6EE] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#D4956A] transition-colors duration-300 [&>svg]:group-hover:text-white [&>svg]:transition-colors">
        {icon}
      </div>
      <h3 className="font-judul text-2xl font-bold text-[#4B2E1C] mb-3">{title}</h3>
      <p className="font-teks text-[#8B5E3C] leading-relaxed flex-1">{desc}</p>
      
      <div className="mt-6 flex items-center gap-2 text-sm font-bold text-[#D4956A] opacity-0 group-hover:opacity-100 transition-opacity">
        Jelajahi <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  )
}