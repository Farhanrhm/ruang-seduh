import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative w-full min-h-[90vh] flex items-center bg-[#1A110A] overflow-hidden pt-20">
      {/* Background Image (Estetika Gelap) */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Image 
          src="/hero-bg.jpg" // Pastikan gambar Anda ada di folder public/hero-bg.jpg
          alt="Coffee Pouring"
          fill
          className="object-cover opacity-60 md:opacity-50 object-center"
          priority
        />
        {/* Efek Gradasi: Dari hitam transparan di atas, memudar ke warna #FDF6EE di paling bawah agar nyambung dengan konten */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#FDF6EE] via-[#1A110A]/40 to-transparent" />
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10 mt-10 md:mt-0">
        <div className="max-w-3xl">
          <span className="inline-block py-1.5 px-4 bg-[#D4956A]/20 text-[#D4956A] rounded-full font-bold text-xs tracking-widest uppercase mb-6 backdrop-blur-sm border border-[#D4956A]/30 shadow-sm">
            Eksplorasi Rasa Kopi Nusantara
          </span>
          
          <h1 className="font-judul text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] mb-6 tracking-tighter drop-shadow-md">
            Menyeduh <span className="text-[#D4956A]">Cerita</span>,<br className="hidden md:block"/> Menemukan Rasa.
          </h1>
          
          <p className="font-teks text-lg md:text-xl text-gray-200 mb-10 max-w-xl leading-relaxed drop-shadow">
            Ruang Seduh adalah kompas bagi para penikmat kopi. Temukan panduan seduh, direktori biji kopi lokal, hingga jurnal personal untuk mencatat resep terbaikmu.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link href="/direktori" className="w-full sm:w-auto px-8 py-4 bg-[#D4956A] text-white rounded-full font-bold hover:bg-[#b57a52] transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-1 group">
              Mulai Eksplorasi <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/panduan" className="w-full sm:w-auto px-8 py-4 bg-white/10 text-white backdrop-blur-md rounded-full font-bold hover:bg-white/20 border border-white/20 transition-all duration-300 flex items-center justify-center gap-2 hover:-translate-y-1">
              Pelajari Panduan
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}