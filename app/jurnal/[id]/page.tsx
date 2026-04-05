import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
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
      <div className="min-h-[85vh] flex items-center justify-center bg-[#FDF6EE] px-4 py-12 relative overflow-hidden">
        {/* Ornamen Latar Belakang */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D4956A]/20 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-md w-full bg-white/90 backdrop-blur-xl rounded-[2.5rem] p-10 md:p-16 shadow-xl border border-[#8B5E3C]/10 text-center flex flex-col items-center">
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

  // =====================================================================
  // 2. TAMPILAN NORMAL (JIKA SUDAH LOGIN)
  // =====================================================================
  
  const daftarJurnal = await prisma.brewJournal.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="bg-[#FDF6EE] min-h-screen pt-16 pb-24 text-[#4B2E1C]">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        
        {/* Header Jurnal - Senada dengan Toko */}
        <div className="mb-12 border-b border-[#8B5E3C]/10 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="font-judul text-4xl md:text-5xl font-black text-[#4B2E1C] mb-4 tracking-tighter">Jurnal Seduh</h1>
            <p className="font-teks text-[#8B5E3C] text-lg max-w-2xl leading-relaxed">
              Halo {session.user?.name?.split(" ")[0]}, ada {daftarJurnal.length} catatan eksperimen seduhanmu yang tersimpan.
            </p>
          </div>
          <Link 
            href="/jurnal/baru" 
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#4B2E1C] text-[#FDF6EE] border border-[#8B5E3C]/20 rounded-xl font-bold hover:bg-[#8B5E3C] transition-all shadow-sm hover:shadow-lg w-fit text-sm group"
          >
            <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" /> Catat Seduhan Baru
          </Link>
        </div>

        {/* Grid Daftar Jurnal */}
        {daftarJurnal.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {daftarJurnal.map((jurnal: any) => (
              <div 
                key={jurnal.id} 
                className="bg-white rounded-3xl p-6 border border-[#8B5E3C]/10 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex justify-between items-start mb-5 gap-4">
                    <div className="p-3 bg-[#FDF6EE] rounded-2xl group-hover:bg-[#D4956A] group-hover:text-white transition-colors duration-300">
                      <Coffee className="w-6 h-6 text-[#8B5E3C] group-hover:text-white transition-colors" />
                    </div>
                    {/* Badge Rating */}
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-sm ${
                      jurnal.rating === 'SUCCESS' ? 'bg-green-50 text-green-700 border border-green-200' : 
                      jurnal.rating === 'COULD_BE_BETTER' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' : 
                      'bg-orange-50 text-orange-700 border border-orange-200'
                    }`}>
                      {jurnal.rating.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <h3 className="font-judul text-2xl font-bold text-[#4B2E1C] mb-2 line-clamp-2 leading-tight">
                    {jurnal.coffeeBean}
                  </h3>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="font-teks text-xs font-bold bg-[#FDF6EE] text-[#D4956A] px-2 py-1 rounded-md flex items-center gap-1 border border-[#8B5E3C]/5">
                      <BarChart3 className="w-3.5 h-3.5" /> {jurnal.brewMethod}
                    </span>
                    <span className="font-teks text-xs font-bold bg-[#FDF6EE] text-[#8B5E3C] px-2 py-1 rounded-md border border-[#8B5E3C]/5">
                      Rasio {jurnal.ratio}
                    </span>
                  </div>
                  
                  <p className="font-teks text-[#8B5E3C] text-sm italic line-clamp-3 mb-6 leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-100">
                    "{jurnal.tastingNote}"
                  </p>
                </div>

                <div className="pt-5 border-t border-[#8B5E3C]/10 flex items-center justify-between font-teks mt-auto">
                  <span className="flex items-center gap-1.5 text-xs font-medium text-[#8B5E3C]">
                    <Calendar className="w-4 h-4 text-[#D4956A]" /> 
                    {new Date(jurnal.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  <div className="flex items-center gap-2">
                    <TombolHapus id={jurnal.id} />
                    <Link href={`/jurnal/${jurnal.id}/edit`} className="p-2 text-[#8B5E3C] hover:text-[#4B2E1C] hover:bg-[#FDF6EE] rounded-lg transition-all border border-transparent hover:border-[#8B5E3C]/10" title="Edit Jurnal">
                      <Edit className="w-4 h-4" />
                    </Link>
                    <Link href={`/jurnal/${jurnal.id}`} className="ml-1 text-[#D4956A] hover:text-[#4B2E1C] font-bold text-sm tracking-tight transition-colors">
                      Detail →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Profil Samping */}
            <div className="md:col-span-1 p-8 bg-white rounded-3xl border border-[#8B5E3C]/10 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center">
              <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-[#FDF6EE] shadow-lg mb-6 relative">
                {session.user?.image ? (
                  <Image src={session.user.image} alt={session.user.name || "Profil"} fill className="object-cover" />
                ) : (
                  <Coffee className="h-full w-full p-5 text-[#8B5E3C] bg-[#FDF6EE]" />
                )}
              </div>
              <h2 className="font-judul text-2xl font-black text-[#4B2E1C] tracking-tight">{session.user?.name}</h2>
              <span className="mt-3 inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-full border border-green-200">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Active
              </span>
            </div>

            {/* Area Pesan Kosong */}
            <div className="md:col-span-3 p-12 bg-white rounded-3xl border border-[#8B5E3C]/10 shadow-sm hover:shadow-md transition-all text-center flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-24 h-24 bg-[#FDF6EE] rounded-full flex items-center justify-center mb-8 border border-[#8B5E3C]/5">
                <Compass className="w-12 h-12 text-[#D4956A]" />
              </div>
              
              <h2 className="font-judul text-3xl md:text-4xl font-black text-[#4B2E1C] mb-4 tracking-tighter">Belum ada catatan</h2>
              
              <p className="font-teks text-[#8B5E3C] mb-10 max-w-lg leading-relaxed text-lg">
                Setiap biji kopi punya rahasia rasanya sendiri. Mulailah mencatat suhu, rasio, dan eksperimen pertamamu hari ini.
              </p>
              
              <Link 
                href="/jurnal/baru" 
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#4B2E1C] text-[#FDF6EE] rounded-full font-bold hover:bg-[#8B5E3C] transition-all shadow-md hover:shadow-xl w-fit group"
              >
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" /> Catat Seduhan Pertamamu
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}