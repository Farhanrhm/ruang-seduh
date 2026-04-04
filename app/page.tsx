import Link from "next/link";
import { ArrowRight, Coffee } from "lucide-react";

export default function Home() {
  return (
    <div className="bg-[#FDF6EE] min-h-[90vh] flex items-center">
      <div className="container mx-auto px-4 md:px-8 py-12 md:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="space-y-8 max-w-2xl">
            <h1 className="font-judul text-5xl md:text-6xl lg:text-7xl font-black text-[#4B2E1C] leading-[1.1]">
              Teman Menyeduh Kopi di <span className="text-[#D4956A]">Rumah</span>
            </h1>
            <p className="font-teks text-[#8B5E3C] text-lg md:text-xl leading-relaxed">
              Kenali biji kopi Nusantara, temukan metode seduh favoritmu, dan mari buat secangkir kopi yang hangat, tanpa aturan yang mengekang.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link href="/panduan" className="px-8 py-4 bg-[#D4956A] text-white rounded-full font-bold hover:bg-[#b57a52] transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center gap-2">
                <Coffee className="w-5 h-5" /> Mulai Belajar
              </Link>
              <Link href="/toko" className="px-8 py-4 bg-transparent border-2 border-[#D4956A] text-[#D4956A] rounded-full font-bold hover:bg-[#D4956A] hover:text-white transition-all flex items-center gap-2">
                Lihat Koleksi Kopi <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
          <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white transform lg:rotate-2 hover:rotate-0 transition-transform duration-500">
            <img src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=1000&auto=format&fit=crop" alt="Peralatan Kopi Estetik" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </div>
  );
}