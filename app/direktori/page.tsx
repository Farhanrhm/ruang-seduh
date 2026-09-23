import { prisma } from "@/lib/prisma";
import { MapPin, Compass, Coffee } from "lucide-react";
import SearchDirektori from "@/components/SearchDirektori";

// ISR: Cache hasil direktori dasar selama 5 menit (300 detik)
export const revalidate = 300;

export default async function DirektoriPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q || "";

  // Seed data awal jika database masih kosong
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
      <div className="container mx-auto px-4 md:px-8 max-w-5xl">
        
        {/* Header Section - Light Theme */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 border-b border-[#8B5E3C]/10 pb-10">
          <div>
            <h1 className="font-judul text-4xl md:text-5xl font-black text-[#4B2E1C] tracking-tighter">Peta Kopi Nusantara</h1>
            <p className="font-teks text-[#8B5E3C] text-lg max-w-xl mt-4 leading-relaxed">
              Temukan karakteristik unik dari setiap biji kopi yang tumbuh di tanah air.
            </p>
          </div>
          <div className="w-full md:w-80">
            <SearchDirektori />
          </div>
        </div>

        {/* List Cards - Row Layout untuk variasi */}
        {beans.length > 0 ? (
          <div className="flex flex-col gap-6">
            {beans.map((bean: any) => ( 
              <div key={bean.id} className="bg-white rounded-2xl p-6 md:p-8 border border-[#8B5E3C]/10 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6">
                
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 text-[#D4956A] text-[10px] font-black uppercase tracking-wider mb-2">
                    <MapPin className="w-3.5 h-3.5" /> {bean.origin}
                  </div>
                  
                  <h2 className="font-judul text-2xl font-bold text-[#4B2E1C] mb-2 tracking-tight">
                    {bean.name}
                  </h2>
                  
                  <p className="font-teks text-[#8B5E3C] text-sm flex items-center gap-2">
                    <span className="font-bold text-[10px] uppercase tracking-widest text-[#8B5E3C]/50">Roast Level:</span>
                    <span className="font-bold text-[#4B2E1C]">{bean.roastLevel}</span>
                  </p>
                </div>

                <div className="md:w-1/2 md:text-right">
                  <span className="block font-bold text-[10px] uppercase tracking-widest text-[#8B5E3C]/50 mb-2 md:mb-3">Karakteristik Rasa</span>
                  <div className="flex flex-wrap md:justify-end gap-2">
                    {bean.notes.map((note: string, i: number) => (
                      <span key={i} className="px-3 py-1.5 bg-[#FDF6EE] text-[#8B5E3C] text-[10px] font-black uppercase rounded-lg border border-[#8B5E3C]/10">
                        {note}
                      </span>
                    ))}
                  </div>
                </div>
                
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-white rounded-3xl border border-[#8B5E3C]/10">
            <h2 className="font-judul text-2xl font-bold text-[#4B2E1C]">Data tidak ditemukan</h2>
            <p className="font-teks text-[#8B5E3C] mt-2">Coba cari dengan kata kunci daerah atau profil rasa lainnya.</p>
          </div>
        )}
      </div>
    </div>
  );
}