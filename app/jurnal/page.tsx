import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image"; 
import { Coffee, Calendar, BarChart3, Plus, Compass, LogIn, Edit } from "lucide-react";
import TombolLogin from "@/components/TombolLogin"; 
import TombolHapus from "@/components/TombolHapus";

export default async function JurnalPage() {
  const session = await getServerSession(authOptions);

  // ==========================================
  // 1. TAMPILAN PERINGATAN (JIKA BELUM LOGIN) 
  // ==========================================
  if (!session?.user?.id) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center bg-[#4B2E1C] px-4 py-12 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D4956A]/10 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-md w-full bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-10 md:p-16 shadow-lg border border-[#8B5E3C]/10 text-center flex flex-col items-center">
          
          <div className="w-20 h-20 bg-[#FDF6EE] rounded-3xl flex items-center justify-center mb-10 border border-[#8B5E3C]/20 shadow-sm">
            <LogIn className="w-10 h-10 text-[#D4956A]" />
          </div>

          <h1 className="font-judul text-3xl font-black text-[#4B2E1C] mb-4 tracking-tight">
            Halaman Terkunci
          </h1>
          
          <p className="font-teks text-[#8B5E3C] mb-12 leading-relaxed">
            Fitur Jurnal Seduh adalah ruang personal untuk mencatat resep dan eksperimen kopimu. Silakan masuk terlebih dahulu untuk mengaksesnya.
          </p>

          <TombolLogin />
        </div>
      </div>
    );
  }

  // ================================================= =====================
  // 2. TAMPILAN NORMAL (JIKA SUDAH LOGIN)
  // ================================================= =====================
  
  const daftarJurnal = await prisma.brewJournal.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc", 
    },
  });

  return (
    <div className="min-h-screen bg-[#4B2E1C] text-[#FDF6EE]">
      <div className="container mx-auto px-4 md:px-8 py-16">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-[#FDF6EE]/10 pb-8">
          <div>
            <h1 className="font-judul text-4xl md:text-5xl font-black text-[#FDF6EE] tracking-tighter">Jurnal Seduh</h1>
            <p className="mt-2 font-teks text-[#8B5E3C]">
              Halo {session.user?.name?.split(" ")[0]}, ada {daftarJurnal.length} catatan eksperimen seduhanmu.
            </p>
          </div>
          <Link 
            href="/jurnal/baru" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#D4956A] text-white rounded-xl font-bold hover:bg-[#b57a52] transition-all shadow-md hover:shadow-lg w-fit text-sm"
          >
            <Plus className="w-5 h-5" /> Catat Seduhan Baru
          </Link>
        </div>

        {/* Grid Daftar Jurnal */}
        {daftarJurnal.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {daftarJurnal.map((jurnal: any) => (
              <div 
                key={jurnal.id} 
                className="bg-white rounded-3xl p-6 border border-[#8B5E3C]/10 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-4 gap-4">
                    <div className="p-2 bg-[#FDF6EE] rounded-lg">
                      <Coffee className="w-6 h-6 text-[#8B5E3C]" />
                    </div>
                    {/* Badge Rating */}
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${
                      jurnal.rating === 'SUCCESS' ? 'bg-green-100 text-green-700' : 
                      jurnal.rating === 'COULD_BE_BETTER' ? 'bg-yellow-100 text-yellow-700' : 
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {jurnal.rating.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <h3 className="font-judul text-xl font-black text-[#4B2E1C] mb-1 line-clamp-2 leading-tight">
                    {jurnal.coffeeBean}
                  </h3>
                  <p className="font-teks text-sm text-[#8B5E3C] mb-4 flex items-center gap-1">
                    <BarChart3 className="w-3.5 h-3.5" /> {jurnal.brewMethod} • Rasio {jurnal.ratio}
                  </p>
                  
                  <p className="font-teks text-[#4B2E1C]/80 text-sm italic line-clamp-3 mb-6 leading-relaxed">
                    "{jurnal.tastingNote}"
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between font-teks text-[#8B5E3C]">
                  <span className="flex items-center gap-1.5 text-[11px] font-medium">
                    <Calendar className="w-3.5 h-3.5 text-[#D4956A]" /> 
                    {new Date(jurnal.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                  <div className="flex items-center gap-3">
                    <TombolHapus id={jurnal.id} />

                    {/* Tombol Edit Baru */}
                    <Link href={`/jurnal/${jurnal.id}/edit`} className="p-2 text-gray-400 hover:text-[#D4956A] hover:bg-[#FDF6EE] rounded-lg transition-all" title="Edit Jurnal">
                      <Edit className="w-4 h-4" />
                    </Link>

                    <Link href={`/jurnal/${jurnal.id}`} className="text-[#D4956A] hover:underline font-bold text-sm tracking-tight">
  Detail →
</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* 1. User Profile Card (Integrated Left) */}
            <div className="md:col-span-1 p-8 bg-white/5 backdrop-blur-sm rounded-3xl border border-[#FDF6EE]/10 flex flex-col items-center text-center">
              <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-[#FDF6EE]/10 shadow-lg mb-6">
                {session.user?.image ? (
                  <Image 
                    src={session.user.image} 
                    alt={session.user.name || "Profil"} 
                    width={96} 
                    height={96} 
                  />
                ) : (
                  <Coffee className="h-full w-full p-4 text-[#FDF6EE]/30 bg-[#4B2E1C]" />
                )}
              </div>
              <h2 className="font-judul text-2xl font-black text-[#FDF6EE] tracking-tight">{session.user?.name}</h2>
              <span className="mt-2 inline-block px-3 py-1.5 bg-green-500/10 text-green-400 text-xs font-bold rounded-full border border-green-500/20 shadow-sm">
                Logged-in
              </span>
            </div>

            {/* 2. Konten Jurnal Kosong (Compass Card Right) */}
            <div className="md:col-span-3 p-12 bg-white rounded-3xl border border-[#8B5E3C]/10 shadow-lg text-center flex flex-col items-center justify-center">
              <div className="w-24 h-24 bg-[#FDF6EE] rounded-full flex items-center justify-center mb-8 border border-[#8B5E3C]/10 shadow-inner">
                <Compass className="w-12 h-12 text-[#D4956A]/60" />
              </div>
              
              <h2 className="font-judul text-3xl font-black text-[#4B2E1C] mb-3 tracking-tighter">empty journal</h2>
              
              <p className="font-teks text-[#8B5E3C] mt-2 mb-12 max-w-lg leading-relaxed text-lg">
                Setiap seduhan punya cerita rasa uniknya sendiri. Mulailah mencatat eksperimen pertamamu hari ini, is more inspiring.
              </p>
              
              <Link 
                href="/jurnal/baru" 
                className="inline-flex items-center gap-2 px-10 py-4 bg-[#D4956A] text-white rounded-full font-bold hover:bg-[#b57a52] transition-all shadow-md hover:shadow-xl w-fit"
              >
                <Plus className="w-5 h-5" /> Catat Seduhan Baru
              </Link>
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
}