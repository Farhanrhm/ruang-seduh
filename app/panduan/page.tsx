import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";
import Image from "next/image";
import { Clock, BookOpen } from "lucide-react";

// ISR: Cache halaman indeks panduan selama 24 jam (86400 detik)
export const revalidate = 86400;

export default async function PanduanPage() {
  const query = `*[_type == "guide"] | order(_createdAt desc) {
    _id, title, "slug": slug.current, image, description, difficulty, time
  }`;
  const guides = await client.fetch(query, {}, { next: { revalidate: 86400 } });

  const featuredGuide = guides.length > 0 ? guides[0] : null;
  const otherGuides = guides.length > 1 ? guides.slice(1) : [];

  return (
    <div className="bg-[#FDF6EE] min-h-screen pt-24 pb-24 text-[#4B2E1C]">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="font-judul text-5xl md:text-6xl font-black text-[#4B2E1C] mb-6 tracking-tighter">Panduan Seduh</h1>
          <p className="font-teks text-[#8B5E3C] text-lg leading-relaxed">
            Dari teknik dasar hingga mahir. Pelajari cara menghasilkan secangkir kopi terbaik langsung dengan tanganmu.
          </p>
        </div>

        {guides.length > 0 ? (
          <div className="flex flex-col gap-12">
            {/* Featured Guide - Tampil lebih besar di atas */}
            {featuredGuide && (
              <Link href={`/panduan/${featuredGuide.slug}`} className="bg-white rounded-[2.5rem] border border-[#8B5E3C]/10 overflow-hidden group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col md:flex-row">
                <div className="relative h-80 md:h-auto md:w-1/2 overflow-hidden bg-[#FDF6EE]">
                  {featuredGuide.image ? (
                    <Image 
                      src={urlFor(featuredGuide.image).url()} 
                      alt={featuredGuide.title} 
                      fill 
                      priority={true}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#8B5E3C]/30"><BookOpen className="w-16 h-16" /></div>
                  )}
                  <div className={`absolute top-6 left-6 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-sm border ${
                    featuredGuide.difficulty === 'Mudah' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                    featuredGuide.difficulty === 'Menengah' ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-red-50 text-red-600 border-red-200'
                  }`}>
                    {featuredGuide.difficulty || "Info"}
                  </div>
                </div>

                <div className="p-8 md:p-12 md:w-1/2 flex flex-col justify-center">
                  <span className="text-[#D4956A] font-bold text-sm mb-4 block">PANDUAN TERBARU</span>
                  <h3 className="font-judul text-3xl md:text-4xl font-bold text-[#4B2E1C] mb-4 group-hover:text-[#D4956A] transition-colors">{featuredGuide.title}</h3>
                  <p className="font-teks text-[#8B5E3C] mb-8 text-lg leading-relaxed">{featuredGuide.description}</p>
                  
                  <div className="flex items-center gap-6 mt-auto">
                    <span className="flex items-center gap-2 text-sm font-bold text-[#8B5E3C] uppercase tracking-wider">
                      <Clock className="w-5 h-5 text-[#D4956A]" /> {featuredGuide.time || "-"}
                    </span>
                    <span className="text-sm font-bold text-[#D4956A] group-hover:underline">
                      Mulai Belajar
                    </span>
                  </div>
                </div>
              </Link>
            )}

            {/* Grid for other guides */}
            {otherGuides.length > 0 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {otherGuides.map((guide: any) => (
                  <Link key={guide._id} href={`/panduan/${guide.slug}`} className="bg-white rounded-[2rem] border border-[#8B5E3C]/10 overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
                    <div className="relative h-56 w-full overflow-hidden bg-[#FDF6EE]">
                      {guide.image ? (
                        <Image 
                          src={urlFor(guide.image).url()} 
                          alt={guide.title} 
                          fill 
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-700" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#8B5E3C]/30"><BookOpen className="w-12 h-12" /></div>
                      )}
                      <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm border ${
                        guide.difficulty === 'Mudah' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                        guide.difficulty === 'Menengah' ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-red-50 text-red-600 border-red-200'
                      }`}>
                        {guide.difficulty || "Info"}
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="font-judul text-2xl font-bold text-[#4B2E1C] mb-3 group-hover:text-[#D4956A] transition-colors">{guide.title}</h3>
                      <p className="font-teks text-[#8B5E3C] mb-6 line-clamp-2 leading-relaxed flex-1">{guide.description}</p>
                      
                      <div className="flex items-center justify-between border-t border-[#8B5E3C]/10 pt-5 mt-auto">
                        <span className="flex items-center gap-1.5 text-xs font-bold text-[#8B5E3C] uppercase tracking-wider">
                          <Clock className="w-4 h-4 text-[#D4956A]" /> {guide.time || "-"}
                        </span>
                        <span className="text-sm font-bold text-[#D4956A]">
                          Mulai Belajar
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ) : (
          <p className="text-center text-[#8B5E3C] italic mt-10">Tolong tunggu admin untuk menambahkan panduan baru.</p>
        )}
      </div>
    </div>
  );
}