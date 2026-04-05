import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";
import Image from "next/image";
import { Clock, BookOpen, ArrowRight } from "lucide-react";

export const revalidate = 0; // Disable cache agar update instan

export default async function PanduanPage() {
  // Ambil data dari tabel "guide" yang baru kita buat
  const query = `*[_type == "guide"] | order(_createdAt desc) {
    _id, title, "slug": slug.current, image, description, difficulty, time
  }`;
  const guides = await client.fetch(query);

  return (
    <div className="bg-[#FDF6EE] min-h-screen pt-24 pb-24 text-[#4B2E1C]">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="font-judul text-5xl md:text-6xl font-black text-[#4B2E1C] mb-6 tracking-tighter">Panduan Seduh</h1>
          <p className="font-teks text-[#8B5E3C] text-lg leading-relaxed">
            Dari teknik dasar hingga mahir. Pelajari cara menghasilkan secangkir kopi terbaik langsung dari dapur rumahmu.
          </p>
        </div>

        {guides.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {guides.map((guide: any) => (
              <Link key={guide._id} href={`/panduan/${guide.slug}`} className="bg-white rounded-[2rem] border border-[#8B5E3C]/10 overflow-hidden group hover:shadow-2xl hover:border-[#D4956A]/30 hover:-translate-y-2 transition-all duration-300 flex flex-col">
                <div className="relative h-60 w-full overflow-hidden bg-[#FDF6EE]">
                  {guide.image ? (
                    <Image src={urlFor(guide.image).url()} alt={guide.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#8B5E3C]/30"><BookOpen className="w-12 h-12" /></div>
                  )}
                  {/* Badge Kesulitan */}
                  <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md shadow-sm border ${
                    guide.difficulty === 'Mudah' ? 'bg-emerald-500/90 text-white border-emerald-400' :
                    guide.difficulty === 'Menengah' ? 'bg-amber-500/90 text-white border-amber-400' : 'bg-red-500/90 text-white border-red-400'
                  }`}>
                    {guide.difficulty || "Info"}
                  </div>
                </div>

                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="font-judul text-2xl font-bold text-[#4B2E1C] mb-3 group-hover:text-[#D4956A] transition-colors">{guide.title}</h3>
                  <p className="font-teks text-[#8B5E3C] mb-6 line-clamp-2 leading-relaxed flex-1">{guide.description}</p>
                  
                  <div className="flex items-center justify-between border-t border-[#8B5E3C]/10 pt-5 mt-auto">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-[#8B5E3C] uppercase tracking-wider">
                      <Clock className="w-4 h-4 text-[#D4956A]" /> {guide.time || "-"}
                    </span>
                    <span className="text-sm font-bold text-[#D4956A] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      Mulai Belajar <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-[#8B5E3C] italic mt-10">Admin, silakan tambahkan Panduan baru melalui Sanity Studio (/studio).</p>
        )}
      </div>
    </div>
  );
}