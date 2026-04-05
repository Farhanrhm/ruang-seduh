import { prisma } from "@/lib/prisma";
import { MapPin, Database } from "lucide-react";
import SearchDirektori from "@/components/SearchDirektori";

export const dynamic = "force-dynamic";

export default async function DirektoriPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = searchParams.q || "";

  // ====================================================================
  // LOGIKA AUTO-SEED (Hanya berjalan 1x jika database kosong)
  // ====================================================================
  const count = await prisma.coffeeDirectory.count();
  if (count === 0) {
    await prisma.coffeeDirectory.createMany({
      data: [
        { name: "Gayo Washed", origin: "Aceh, Sumatera", roastLevel: "Light to Medium", notes: ["Apple", "Caramel", "Clean"] },
        { name: "Toraja Sapan", origin: "Sulawesi Selatan", roastLevel: "Medium", notes: ["Dark Chocolate", "Herbal", "Spicy"] },
        { name: "Bali Kintamani", origin: "Gunung Batur, Bali", roastLevel: "Light", notes: ["Citrus", "Orange", "Bright Acidity"] },
        { name: "Flores Bajawa", origin: "Nusa Tenggara Timur", roastLevel: "Medium to Dark", notes: ["Nutty", "Caramel", "Full Body"] },
      ],
    });
  }

  // ====================================================================
  // FETCHING & SEARCHING DARI DATABASE SUPABASE
  // ====================================================================
  const beans = await prisma.coffeeDirectory.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { origin: { contains: query, mode: "insensitive" } },
        { roastLevel: { contains: query, mode: "insensitive" } }
      ],
    },
    orderBy: { name: "asc" }, // Urutkan sesuai abjad
  });

  return (
    <div className="bg-[#FDF6EE] min-h-screen pt-16 pb-24 text-[#4B2E1C]">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        
        {/* Header & Fitur Pencarian */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#8B5E3C]/10 pb-8">
          <div>
            <h1 className="font-judul text-4xl md:text-5xl font-black text-[#4B2E1C] mb-4 tracking-tighter">Direktori Kopi</h1>
            <p className="font-teks text-[#8B5E3C] text-lg max-w-2xl leading-relaxed">
              Jelajahi kekayaan rasa kopi Nusantara.
            </p>
          </div>
          
          {/* Komponen Search Client-Side */}
          <SearchDirektori />
        </div>

        {/* Grid Hasil Pencarian */}
        {beans.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {beans.map((bean: any) => ( 
              <div key={bean.id} className="bg-white rounded-2xl p-6 shadow-sm border border-[#8B5E3C]/10 hover:shadow-lg transition-all flex flex-col sm:flex-row gap-6 items-start">
                <div className="w-full sm:w-32 h-32 bg-[#FDF6EE] rounded-2xl flex-shrink-0 flex items-center justify-center border border-[#8B5E3C]/5 relative overflow-hidden">
                  <Database className="absolute -bottom-4 -right-4 w-16 h-16 text-[#8B5E3C]/5" />
                  <span className="font-judul font-black text-[#4B2E1C]/20 text-4xl tracking-tighter">{bean.name.charAt(0)}</span>
                </div>
                <div className="flex-1 w-full">
                  <div className="flex items-center gap-1.5 text-[#D4956A] text-xs font-bold uppercase tracking-wider mb-1">
                    <MapPin className="w-3.5 h-3.5" /> {bean.origin}
                  </div>
                  <h2 className="font-judul text-2xl font-bold text-[#4B2E1C] mb-1 tracking-tight">{bean.name}</h2>
                  <p className="font-teks text-[#8B5E3C] text-sm font-medium mb-4">Roast: {bean.roastLevel}</p>
                  
                  <div className="flex flex-wrap gap-2 pt-1">
                    {bean.notes.map((note: string, i: number) => (
                      <span key={i} className="px-3 py-1 bg-[#FDF6EE] text-[#8B5E3C] text-xs font-bold rounded-md border border-[#8B5E3C]/10 shadow-sm">
                        {note}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* State Jika Pencarian Tidak Ditemukan */
          <div className="text-center py-20">
            <h2 className="font-judul text-2xl font-bold text-[#4B2E1C]">Oops, kopi tidak ditemukan</h2>
            <p className="font-teks text-[#8B5E3C] mt-2">Coba gunakan kata kunci lain seperti "Bali" atau "Medium".</p>
          </div>
        )}
      </div>
    </div>
  );
}