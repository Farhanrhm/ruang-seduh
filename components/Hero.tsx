import Image from "next/image";
import Link from "next/link";
import { Coffee, ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#FDF6EE] pt-16 md:pt-24 lg:pt-32 pb-16">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
          
          {/* Sisi Kiri: Teks & Tombol CTA */}
          <div className="flex-1 space-y-8 text-center lg:text-left">
            <h1 className="font-judul text-4xl md:text-5xl lg:text-6xl font-bold text-[#3D2B1F] leading-tight">
              Teman Menyeduh Kopi di <span className="text-[#D4956A]">Rumah</span>
            </h1>
            <p className="font-teks text-lg text-[#8B5E3C] max-w-2xl mx-auto lg:mx-0">
              Kenali biji kopi Nusantara, temukan metode seduh favoritmu, dan mari buat secangkir kopi yang hangat, tanpa aturan yang mengekang.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <Link 
                href="/panduan" 
                className="flex items-center gap-2 px-6 py-3 bg-[#D4956A] text-white rounded-full font-medium hover:bg-[#b87d55] transition-colors shadow-sm"
              >
                <Coffee className="w-5 h-5" />
                Mulai Belajar
              </Link>
              <Link 
                href="/toko" 
                className="flex items-center gap-2 px-6 py-3 border border-[#8B5E3C] text-[#3D2B1F] rounded-full font-medium hover:bg-[#8B5E3C]/10 transition-colors"
              >
                Lihat Koleksi Kopi
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Sisi Kanan: Foto Suasana Seduh */}
          <div className="flex-1 relative w-full max-w-lg mx-auto lg:max-w-none">
            {/* Aspect ratio container agar gambar tidak lompat (mencegah CLS) */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=1000&auto=format&fit=crop"
                alt="Suasana menyeduh kopi di meja kayu"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            {/* Aksen Dekoratif */}
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-[#D4956A]/20 rounded-full blur-xl -z-10"></div>
          </div>

        </div>
      </div>
    </section>
  );
}