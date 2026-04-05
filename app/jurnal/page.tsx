import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image"; 
import { Coffee, Calendar, BarChart3, Plus, Compass, LogIn, Edit, ChevronRight } from "lucide-react";
import TombolLogin from "@/components/TombolLogin"; 
import TombolHapus from "@/components/TombolHapus";

export default async function JurnalPage() {
  const session = await getServerSession(authOptions);

  // ==========================================
  // 1. TAMPILAN PERINGATAN (JIKA BELUM LOGIN) 
  // ==========================================
  if (!session?.user?.id) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center bg-[#FDF6EE] px-4 py-12 relative overflow-hidden">
        {/* Ornamen Latar Belakang */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#D4956A]/20 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-md w-full bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-10 md:p-14 shadow-xl border border-[#8B5E3C]/10 text-center flex flex-col items-center">
          <div className="w-20 h-20 bg-[#FDF6EE] rounded-3xl flex items-center justify-center mb-8 border border-[#8B5E3C]/10 shadow-inner">
            <LogIn className="w-10 h-10 text-[#D4956A]" />
          </div>

          <h1 className="font-judul text-3xl font-black text-[#4B2E1C] mb-3 tracking-tight">
            Ruang Personalmu
          </h1>
          
          <p className="font-teks text-[#8B5E3C] mb-10 leading-relaxed">
            Jurnal Seduh adalah tempat untuk mencatat rasio, suhu, dan eksperimen kopimu. Masuk sekarang untuk mulai membuat resep rahasiamu.
          </p>

          <TombolLogin />
        </div>
      </div>
    );
  }

  // =====================================================================
  // 2. TAMPILAN NORMAL (JIKA SUDAH LOGIN)
  // =====================================================================
  
  const daftarJurnal = await prisma.brewJournal.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="bg-[#FDF6EE] min-h-screen pt-20 pb-24 text-[#4B2E1C]">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        
        {/* Header Jurnal */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-[#8B5E3C]/10 pb-8">
          <div>
            <h1 className="font-judul text-4xl md:text-5xl font-black text-[#4B2E1C] tracking-tighter mb-3">
              Jurnal Seduh
            </h1>
            <p className="font-teks text-[#8B5E3C] text-lg">
              Halo <span className="font-bold text-[#D4956A]">{session.user?.name?.split(" ")[0]}</span>, kamu memiliki {daftarJurnal.length} catatan eksperimen.
            </p>
          </div>
          <Link 
            href="/jurnal/baru" 
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#4B2E1C] text-[#FDF6EE] rounded-xl font-bold hover:bg-[#8B5E3C] transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 w-fit group"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" /> Catat Seduhan
          </Link>
        </div>

        {/* Grid Daftar Jurnal */}
        {daftarJurnal.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {daftarJurnal.map((jurnal: any) => (
              <div 
                key={jurnal.id} 
                className="bg-white rounded-[2rem] p-6 border border-[#8B5E3C]/10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group"
              >
                {/* Header Card (Icon & Badge) */}
                <div className="flex justify-between items-start mb-5">
                  <div className="p-3 bg-[#FDF6EE] rounded-2xl group-hover:bg-[#D4956A] transition-colors duration-300">
                    <Coffee className="w-6 h-6 text-[#8B5E3C] group-hover:text-white transition-colors duration-300" />
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full border shadow-sm ${
                    jurnal.rating === 'SUCCESS' ? 'bg-green-50 text-green-700 border-green-200' : 
                    jurnal.rating === 'COULD_BE_BETTER' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 
                    'bg-red-50 text-red-700 border-red-200'
                  }`}>
                    {jurnal.rating.replace(/_/g, ' ')}
                  </span>
                </div>

                {/* Info Utama */}
                <div className="mb-5 flex-1">
                  <h3 className="font-judul text-2xl font-bold text-[#4B2E1C] mb-3 line-clamp-2 leading-tight">
                    {jurnal.coffeeBean}
                  </h3>
                  
                  {/* Tags Detail Seduhan */}
                  <div className="flex flex-wrap items-center gap-2 mb-5">
                    <span className="font-teks text-xs font-bold bg-[#FDF6EE] text-[#D4956A] px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 border border-[#8B5E3C]/5">
                      <BarChart3 className="w-3.5 h-3.5" /> {jurnal.brewMethod}
                    </span>
                    <span className="font-teks text-xs font-bold bg-[#FDF6EE] text-[#8B5E3C] px-2.5 py-1.5 rounded-lg border border-[#8B5E3C]/5">
                      Rasio {jurnal.ratio}
                    </span>
                  </div>
                  
                  {/* Catatan Rasa (Tasting Note) */}
                  <div className="relative">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#D4956A] rounded-full opacity-50" />
                    <p className="font-teks text-[#8B5E3C] text-sm italic line-clamp-3 pl-4 leading-relaxed">
                      "{jurnal.tastingNote}"
                    </p>
                  </div>
                </div>

                {/* Footer Card (Aksi & Tanggal) */}
                <div className="pt-5 border-t border-[#8B5E3C]/10 flex items-center justify-between font-teks">
                  <span className="flex items-center gap-1.5 text-xs font-medium text-[#8B5E3C]">
                    <Calendar className="w-4 h-4 text-[#D4956A]" /> 
                    {new Date(jurnal.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  
                  <div className="flex items-center gap-1">
                    <TombolHapus id={jurnal.id} />
                    <Link href={`/jurnal/${jurnal.id}/edit`} className="p-2 text-[#8B5E3C] hover:text-[#D4956A] hover:bg-[#FDF6EE] rounded-xl transition-all" title="Edit Jurnal">
                      <Edit className="w-4 h-4" />
                    </Link>
                    <Link href={`/jurnal/${jurnal.id}`} className="ml-1 flex items-center justify-center p-2 bg-[#FDF6EE] text-[#D4956A] hover:bg-[#D4956A] hover:text-white rounded-xl transition-all group/btn" title="Lihat Detail">
                      <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Tampilan Kosong (Empty State) - Modern Layout */
          <div className="flex flex-col md:flex-row gap-8 items-stretch">
            
            {/* Profil Card */}
            <div className="w-full md:w-1/3 p-8 bg-white rounded-[2.5rem] border border-[#8B5E3C]/10 shadow-sm flex flex-col items-center justify-center text-center">
              <div className="h-28 w-28 overflow-hidden rounded-full border-4 border-[#FDF6EE] shadow-lg mb-6 relative">
                {session.user?.image ? (
                  <Image src={session.user.image} alt={session.user.name || "Profil"} fill className="object-cover" />
                ) : (
                  <Coffee className="h-full w-full p-6 text-[#8B5E3C] bg-[#FDF6EE]" />
                )}
              </div>
              <h2 className="font-judul text-2xl font-black text-[#4B2E1C] tracking-tight">{session.user?.name}</h2>
              <span className="mt-3 inline-flex items-center gap-1.5 px-4 py-1.5 bg-green-50 text-green-600 text-xs font-bold rounded-full border border-green-200">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Member Aktif
              </span>
            </div>

            {/* Empty Area */}
            <div className="w-full md:w-2/3 p-10 md:p-16 bg-white rounded-[2.5rem] border border-[#8B5E3C]/10 shadow-sm text-center flex flex-col items-center justify-center">
              <div className="w-24 h-24 bg-[#FDF6EE] rounded-full flex items-center justify-center mb-8 border border-[#8B5E3C]/5">
                <Compass className="w-12 h-12 text-[#D4956A]" />
              </div>
              
              <h2 className="font-judul text-3xl font-black text-[#4B2E1C] mb-4">Jurnalmu masih kosong</h2>
              
              <p className="font-teks text-[#8B5E3C] mb-10 max-w-md leading-relaxed text-lg">
                Perjalanan menyeduh kopi yang sempurna dimulai dari satu catatan kecil. Rekam rasio dan suhu pertamamu hari ini!
              </p>
              
              <Link 
                href="/jurnal/baru" 
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#D4956A] text-white rounded-xl font-bold hover:bg-[#b57a52] transition-all shadow-md hover:shadow-lg w-fit hover:-translate-y-1 group"
              >
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" /> Buat Jurnal Pertama
              </Link>
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
}