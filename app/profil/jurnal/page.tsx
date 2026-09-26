import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Coffee, BarChart3, Calendar, Plus, Compass } from "lucide-react";

export default async function ProfilJurnalPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/");
  }

  // Ambil total jurnal
  const totalJurnal = await prisma.brewJournal.count({
    where: { userId: session.user.id }
  });

  // Ambil 3 jurnal terakhir
  const recentJurnal = await prisma.brewJournal.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-[#8B5E3C]/10">
        <h2 className="font-judul text-2xl font-bold text-[#4B2E1C] flex items-center gap-3">
          <Coffee className="w-6 h-6 text-[#D4956A]" /> Jurnal Seduh Saya
        </h2>
        <span className="text-xs text-[#8B5E3C] font-bold uppercase tracking-wider bg-white px-3 py-1.5 rounded-md shadow-sm border border-[#8B5E3C]/10 hidden sm:inline-block">
          {totalJurnal} Total Catatan
        </span>
      </div>

      {totalJurnal === 0 ? (
        <div className="bg-white py-16 px-6 rounded-2xl text-center border border-[#8B5E3C]/10 shadow-sm flex flex-col items-center mt-6">
          <div className="w-24 h-24 bg-[#FDF6EE] rounded-full flex items-center justify-center mb-6 border border-[#8B5E3C]/5 shadow-inner">
            <Compass className="w-12 h-12 text-[#D4956A]" />
          </div>
          <h3 className="font-judul text-2xl font-bold text-[#4B2E1C] mb-2">Belum Ada Catatan</h3>
          <p className="font-teks text-sm text-[#8B5E3C] mb-8 max-w-sm leading-relaxed">
            Perjalanan menyeduh kopi yang sempurna dimulai dari satu catatan kecil.
          </p>
          <Link
            href="/jurnal/baru"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#4B2E1C] text-[#FDF6EE] rounded-xl text-sm font-bold hover:bg-[#8B5E3C] transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" /> Buat Jurnal Pertama
          </Link>
        </div>
      ) : (
        <div className="space-y-6 mt-6">
          {/* Grid Catatan Terakhir */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentJurnal.map((jurnal) => (
              <div 
                key={jurnal.id} 
                className="bg-white rounded-2xl p-5 border border-[#8B5E3C]/10 shadow-sm hover:shadow-md transition-all flex flex-col"
              >
                <div className="flex justify-between items-start mb-4">
                  {jurnal.starRating ? (
                    <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full border shadow-sm bg-yellow-50 text-yellow-700 border-yellow-200 flex items-center gap-1">
                      ⭐ {jurnal.starRating}
                    </span>
                  ) : (
                    <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full border shadow-sm bg-gray-50 text-gray-500 border-gray-200">
                      BELUM DINILAI
                    </span>
                  )}
                  <span className="flex items-center gap-1.5 text-[10px] font-bold text-[#8B5E3C]">
                    <Calendar className="w-3 h-3 text-[#D4956A]" /> 
                    {new Date(jurnal.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                  </span>
                </div>

                <div className="mb-4 flex-1">
                  <h3 className="font-judul text-lg font-bold text-[#4B2E1C] mb-2 line-clamp-1">
                    {jurnal.coffeeBean}
                  </h3>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-bold bg-[#FDF6EE] text-[#D4956A] px-2 py-1 rounded-md border border-[#8B5E3C]/5 flex items-center gap-1">
                      <BarChart3 className="w-3 h-3" /> {jurnal.brewMethod}
                    </span>
                    <span className="text-[10px] font-bold bg-[#FDF6EE] text-[#8B5E3C] px-2 py-1 rounded-md border border-[#8B5E3C]/5">
                      Rasio {jurnal.ratio}
                    </span>
                  </div>
                  <p className="text-xs text-[#8B5E3C] italic line-clamp-2">
                    "{jurnal.tastingNote}"
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="bg-[#4B2E1C] p-6 rounded-2xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
            <div>
              <h3 className="font-judul text-xl font-bold text-[#FDF6EE] mb-1">Eksplorasi Jurnalmu</h3>
              <p className="text-sm text-[#FDF6EE]/80">Lihat seluruh catatan, edit, atau buat catatan seduhan baru.</p>
            </div>
            <Link
              href="/jurnal"
              className="w-full sm:w-auto px-6 py-3 bg-[#D4956A] text-[#FDF6EE] rounded-xl text-sm font-bold hover:bg-[#c28359] transition-all shadow-md hover:shadow-lg whitespace-nowrap text-center"
            >
              Kelola Semua Jurnal
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
