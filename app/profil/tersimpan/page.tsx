import { Bookmark, Clock, BookOpen, Coffee } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { redirect } from "next/navigation";

export default async function TersimpanPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    redirect("/login");
  }

  // 1. Ambil slug artikel yang disimpan dari database Prisma
  const savedArticles = await prisma.savedArticle.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  const userName = session.user.name?.split(" ")[0] || "Sobat Seduh";
  const savedSlugs = savedArticles.map((article) => article.slug);

  // 2. Fetch data panduan dari Sanity berdasarkan slug yang disimpan
  let guides: any[] = [];
  if (savedSlugs.length > 0) {
    const query = `*[_type == "guide" && slug.current in $slugs] {
      _id, title, "slug": slug.current, image, description, difficulty, time, tasteProfile
    }`;
    guides = await client.fetch(query, { slugs: savedSlugs });
    
    // Sortir agar sesuai urutan simpannya (terbaru di atas)
    guides.sort((a, b) => savedSlugs.indexOf(a.slug) - savedSlugs.indexOf(b.slug));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-[#8B5E3C]/10">
        <h2 className="font-judul text-2xl font-bold text-[#4B2E1C] flex items-center gap-3">
          <Bookmark className="w-6 h-6 text-[#D4956A]" /> Artikel Tersimpan
        </h2>
      </div>

      {guides.length === 0 ? (
        // STATE KOSONG
        <div className="bg-white py-16 px-6 rounded-[2rem] text-center border border-[#8B5E3C]/10 shadow-sm flex flex-col items-center mt-6 relative overflow-hidden">
          <div className="relative z-10 w-24 h-24 bg-gradient-to-br from-[#FDF6EE] to-white rounded-full flex items-center justify-center mb-6 border border-[#8B5E3C]/10 shadow-lg shadow-[#D4956A]/5">
            <Bookmark className="w-10 h-10 text-[#D4956A] fill-[#D4956A]/10" />
          </div>
          
          <h3 className="relative z-10 font-judul text-3xl font-black text-[#4B2E1C] mb-4">
            Ruang bacamu masih kosong, {userName}.
          </h3>
          
          <p className="relative z-10 font-teks text-base text-[#8B5E3C] mb-2 max-w-md leading-relaxed">
            Mulai kumpulkan referensi teknik seduh dan resep kopi favoritmu agar mudah ditemukan saat waktu menyeduh tiba.
          </p>
          
          {/* Microcopy Onboarding */}
          <div className="relative z-10 inline-flex items-center gap-2 bg-[#FDF6EE] px-4 py-2 rounded-lg border border-[#8B5E3C]/10 mb-8">
            <Bookmark className="w-4 h-4 text-[#D4956A]" />
            <span className="font-teks text-xs font-bold text-[#8B5E3C]">Tips: Tekan ikon pita pada panduan untuk menyimpan.</span>
          </div>

          <Link
            href="/panduan"
            className="relative z-10 inline-flex items-center gap-2 px-8 py-4 bg-[#4B2E1C] text-[#FDF6EE] rounded-xl text-sm font-black tracking-wide hover:bg-[#8B5E3C] hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            Jelajahi Panduan Seduh
          </Link>
        </div>
      ) : (
        // GRID ARTIKEL TERSIMPAN
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
          {guides.map((guide: any) => (
            <Link 
              key={guide._id} 
              href={`/panduan/${guide.slug}`} 
              className="bg-white rounded-2xl border border-[#8B5E3C]/10 overflow-hidden group hover:shadow-md hover:border-[#D4956A]/50 transition-all duration-300 flex flex-col"
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#FDF6EE]">
                {guide.image ? (
                  <Image 
                    src={urlFor(guide.image).url()} 
                    alt={guide.title} 
                    fill 
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#8B5E3C]/30">
                    <BookOpen className="w-8 h-8" />
                  </div>
                )}
                
                <div className={`absolute top-3 left-3 px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm border ${
                  guide.difficulty?.toLowerCase() === 'mudah' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                  guide.difficulty?.toLowerCase() === 'menengah' ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-red-50 text-red-600 border-red-200'
                }`}>
                  {guide.difficulty || "Info"}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-judul text-xl font-bold text-[#4B2E1C] mb-2 group-hover:text-[#D4956A] transition-colors">{guide.title}</h3>
                <p className="font-teks text-sm text-[#8B5E3C] mb-4 line-clamp-2 leading-relaxed flex-1">{guide.description}</p>
                
                <div className="flex flex-col gap-2 mt-auto">
                  {guide.tasteProfile && (
                    <div className="flex items-center gap-2 text-xs font-bold text-[#8B5E3C]">
                      <Coffee className="w-3.5 h-3.5 text-[#D4956A]" />
                      <span className="truncate">{guide.tasteProfile}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between border-t border-[#8B5E3C]/10 pt-3 mt-1">
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-[#8B5E3C] uppercase tracking-wider">
                      <Clock className="w-3.5 h-3.5 text-[#D4956A]" /> {guide.time || "-"}
                    </span>
                    <span className="text-xs font-bold text-[#D4956A]">
                      Baca <span className="group-hover:translate-x-1 inline-block transition-transform">→</span>
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
