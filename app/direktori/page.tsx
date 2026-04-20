import { prisma } from "@/lib/prisma";
import { MapPin, Compass, Coffee } from "lucide-react";
import SearchDirektori from "@/components/SearchDirektori";

export const dynamic = "force-dynamic";

export default async function DirektoriPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q || "";

  // ====================================================================
  // DATA ASLI NUSANTARA (Auto-Seed jika kosong)
  // ====================================================================
  const count = await prisma.coffeeDirectory.count();
  if (count === 0) {
    await prisma.coffeeDirectory.createMany({
      data: [
        { name: "Aceh Gayo Washed", origin: "Aceh Tengah, Sumatra", roastLevel: "Medium", notes: ["Black Cherry", "Nutty", "Clean Aftertaste"] },
        { name: "Toraja Sapan", origin: "Tana Toraja, Sulawesi", roastLevel: "Medium-Dark", notes: ["Spicy", "Dark Chocolate", "Tobacco"] },
        { name: "Bali Kintamani Natural", origin: "Kintamani, Bali", roastLevel: "Light-Medium", notes: ["Citrus", "Orange", "Brown Sugar"] },
        { name: "Flores Bajawa", origin: "Ngada, NTT", roastLevel: "Medium", notes: ["Nutty", "Caramel", "Full Body"] },
        { name: "Java Preanger", origin: "Pangalengan, Jawa Barat", roastLevel: "Medium", notes: ["Floral", "Brown Sugar", "Tea-like"] },
        { name: "Papua Wamena", origin: "Lembah Baliem, Papua", roastLevel: "Medium", notes: ["Cocoa", "Earth Tone", "Berries"] },
      ],
    });
  }

  const beans = await prisma.coffeeDirectory.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { origin: { contains: query, mode: "insensitive" } },
        { roastLevel: { contains: query, mode: "insensitive" } }
      ],
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="bg-[#FDF6EE] min-h-screen pt-24 pb-24 text-[#4B2E1C]">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        
        {/* Header Section - Light Theme */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 border-b border-[#8B5E3C]/10 pb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Compass className="w-6 h-6 text-[#D4956A]" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8B5E3C]">Eksplorasi Nusantara</span>
            </div>
            <h1 className="font-judul text-4xl md:text-5xl font-black text-[#4B2E1C] tracking-tighter">Direktori Kopi</h1>
            <p className="font-teks text-[#8B5E3C] text-lg max-w-xl mt-4 leading-relaxed">
              Temukan karakteristik unik dari setiap biji kopi yang tumbuh di tanah air.
            </p>
          </div>
          <div className="w-full md:w-80">
            <SearchDirektori />
          </div>
        </div>

        {/* Grid Cards - Light Theme Style */}
        {beans.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {beans.map((bean: any) => ( 
              <div key={bean.id} className="bg-white rounded-[2rem] p-8 border border-[#8B5E3C]/10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col relative overflow-hidden">
                
                {/* Background Pattern */}
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#FDF6EE] rounded-full flex items-center justify-center -z-0 opacity-50 group-hover:bg-[#D4956A]/10 transition-colors">
                  <Coffee className="w-8 h-8 text-[#8B5E3C]/20" />
                </div>

                <div className="relative z-10">
                  <div className="flex items-center gap-1.5 text-[#D4956A] text-[10px] font-black uppercase tracking-wider mb-4">
                    <MapPin className="w-3.5 h-3.5" /> {bean.origin}
                  </div>
                  
                  <h2 className="font-judul text-2xl font-bold text-[#4B2E1C] mb-2 tracking-tight group-hover:text-[#D4956A] transition-colors line-clamp-1">
                    {bean.name}
                  </h2>
                  
                  <div className="h-1 w-12 bg-[#D4956A]/20 rounded-full mb-6" />
                  
                  <p className="font-teks text-[#8B5E3C] text-sm mb-6 flex items-center gap-2">
                    <span className="font-bold text-[10px] uppercase tracking-widest text-[#8B5E3C]/40">Roast:</span>
                    <span className="font-bold">{bean.roastLevel}</span>
                  </p>
                  
                  <div className="mt-auto pt-6 border-t border-[#8B5E3C]/5">
                    <div className="flex flex-wrap gap-2">
                      {bean.notes.map((note: string, i: number) => (
                        <span key={i} className="px-3 py-1.5 bg-[#FDF6EE] text-[#8B5E3C] text-[10px] font-black uppercase rounded-lg border border-[#8B5E3C]/10 shadow-sm">
                          {note}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-white rounded-[3rem] border border-[#8B5E3C]/10">
            <h2 className="font-judul text-2xl font-bold text-[#4B2E1C]">Data tidak ditemukan</h2>
            <p className="font-teks text-[#8B5E3C] mt-2">Coba cari dengan kata kunci daerah atau profil rasa lainnya.</p>
          </div>
        )}
      </div>
    </div>
  );
}