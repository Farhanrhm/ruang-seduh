import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Clock, BookOpen, Coffee } from "lucide-react";

export const metadata: Metadata = {
  title: "Panduan Seduh Manual | Ruang Seduh",
  description: "Jelajahi berbagai teknik seduh manual untuk secangkir kopi presisi di rumah. Panduan lengkap V60, French Press, AeroPress, dan Cold Brew.",
};

export const revalidate = 0; // Ubah ke 86400 nanti untuk production

export default async function PanduanPage() {
  const query = `*[_type == "guide"] | order(_createdAt desc) {
    _id, title, "slug": slug.current, image, description, difficulty, time, tasteProfile
  }`;
  
  // Karena kita di komponen Server, kita memanggil async fetch langsung
  const guides = await client.fetch(query, {}, { next: { revalidate: 0 } });

  return (
    <div className="bg-[#FDF6EE] min-h-screen pt-24 pb-24 text-[#4B2E1C]">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="font-judul text-5xl md:text-6xl font-black text-[#4B2E1C] mb-6 tracking-tighter">Panduan Seduh</h1>
          <p className="font-teks text-[#8B5E3C] text-lg leading-relaxed">
            Eksplorasi teknik seduh manual untuk ekstraksi kopi yang presisi. Pelajari variabel, rasio, dan metode untuk secangkir kopi sempurna di rumah.
          </p>
        </div>

        {guides && guides.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {guides.map((guide: any) => (
              <Link 
                key={guide._id} 
                href={`/panduan/${guide.slug}`} 
                className="bg-white rounded-[2rem] border border-[#8B5E3C]/10 overflow-hidden group hover:shadow-xl hover:-translate-y-1 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#8B5E3C]/50 transition-all duration-300 flex flex-col"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#FDF6EE]">
                  {guide.image ? (
                    <Image 
                      src={urlFor(guide.image).url()} 
                      alt={`Alat seduh ${guide.title}`} 
                      fill 
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#8B5E3C]/30">
                      <BookOpen className="w-12 h-12" />
                    </div>
                  )}
                  
                  <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm border ${
                    guide.difficulty?.toLowerCase() === 'mudah' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                    guide.difficulty?.toLowerCase() === 'menengah' ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-red-50 text-red-600 border-red-200'
                  }`}>
                    {guide.difficulty || "Info"}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="font-judul text-2xl font-bold text-[#4B2E1C] mb-3 group-hover:text-[#D4956A] transition-colors">{guide.title}</h3>
                  <p className="font-teks text-[#8B5E3C] mb-6 line-clamp-3 md:line-clamp-2 leading-relaxed flex-1">{guide.description}</p>
                  
                  <div className="flex flex-col gap-3 mt-auto">
                    {guide.tasteProfile && (
                      <div className="flex items-center gap-2 text-sm font-bold text-[#8B5E3C]">
                        <Coffee className="w-4 h-4 text-[#D4956A]" aria-hidden="true" />
                        <span>{guide.tasteProfile}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between border-t border-[#8B5E3C]/10 pt-4">
                      <span className="flex items-center gap-1.5 text-xs font-bold text-[#8B5E3C] uppercase tracking-wider">
                        <Clock className="w-4 h-4 text-[#D4956A]" aria-hidden="true" /> {guide.time || "-"}
                      </span>
                      <span className="text-sm font-bold text-[#D4956A]">
                        Mulai Belajar
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white py-20 px-6 rounded-[2.5rem] text-center border border-[#8B5E3C]/10 shadow-sm flex flex-col items-center mt-10 max-w-3xl mx-auto">
            <div className="w-24 h-24 bg-[#FDF6EE] text-[#D4956A] rounded-full flex items-center justify-center mb-8 shadow-inner border border-[#8B5E3C]/5">
              <BookOpen className="w-12 h-12" />
            </div>
            <h3 className="font-judul text-3xl font-bold text-[#4B2E1C] mb-4">Belum Ada Panduan</h3>
            <p className="font-teks text-base text-[#8B5E3C] max-w-md mx-auto leading-relaxed">
              Panduan teknik seduh belum tersedia untuk saat ini. Kami sedang menyiapkan konten berkualitas untuk Anda.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}