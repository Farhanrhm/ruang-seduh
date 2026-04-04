import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Coffee, Calendar, BarChart3, Scale, Timer, Star, Edit } from "lucide-react";
import TombolHapus from "@/components/TombolHapus";

export default async function DetailJurnalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const session = await getServerSession(authOptions);
  if (!(session?.user as any)?.id) redirect("/");

  const jurnal = await prisma.brewJournal.findUnique({
    where: { 
      id: id,
      userId: (session!.user as any).id
    },
  });

  if (!jurnal) redirect("/jurnal");

  return (
    <div className="min-h-screen bg-[#4B2E1C] text-[#FDF6EE] pt-16 pb-24">
      <div className="container mx-auto px-4 md:px-8 max-w-3xl">
        
        {/* Navigasi Atas */}
        <div className="flex items-center justify-between mb-12">
          <Link href="/jurnal" className="inline-flex items-center gap-2 text-[#D4956A] hover:text-[#b57a52] transition-all font-teks font-bold text-sm tracking-tight p-2 bg-white/5 rounded-xl border border-[#FDF6EE]/10">
            <ArrowLeft className="w-4 h-4" /> Kembali
          </Link>
          
          <div className="flex items-center gap-3">
            <Link href={`/jurnal/${jurnal.id}/edit`} className="inline-flex items-center gap-2 px-4 py-2 bg-[#FDF6EE] text-[#4B2E1C] rounded-xl font-bold hover:bg-[#f5e6d3] transition-all text-sm shadow-sm">
              <Edit className="w-4 h-4" /> Edit
            </Link>
            {/* Tombol Hapus dengan background terang agar serasi */}
            <div className="bg-white/10 rounded-xl">
               <TombolHapus id={jurnal.id} />
            </div>
          </div>
        </div>

        {/* Kartu Detail Utama */}
        <div className="bg-[#FDF6EE] rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-[#8B5E3C]/10 text-[#4B2E1C]">
          
          {/* Header Kartu */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-10 pb-10 border-b border-[#8B5E3C]/10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-white rounded-2xl shadow-sm border border-[#8B5E3C]/10">
                  <Coffee className="w-8 h-8 text-[#D4956A]" />
                </div>
                <span className={`text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border ${
                  jurnal.rating === 'SUCCESS' ? 'bg-green-100 text-green-700 border-green-200' : 
                  jurnal.rating === 'COULD_BE_BETTER' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' : 
                  'bg-orange-100 text-orange-700 border-orange-200'
                }`}>
                  {jurnal.rating.replace(/_/g, ' ')}
                </span>
              </div>
              <h1 className="font-judul text-4xl md:text-5xl font-black text-[#4B2E1C] tracking-tighter leading-tight">
                {jurnal.coffeeBean}
              </h1>
              <div className="flex items-center gap-2 mt-4 font-teks text-[#8B5E3C] text-sm font-medium">
                <Calendar className="w-4 h-4 text-[#D4956A]" /> 
                Diseduh pada {new Date(jurnal.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
            </div>
          </div>

          {/* Grid Spesifikasi Seduh */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white p-5 rounded-2xl border border-[#8B5E3C]/5 shadow-sm">
              <span className="flex items-center gap-2 text-xs font-bold text-[#8B5E3C] uppercase tracking-wider mb-2">
                <BarChart3 className="w-4 h-4 text-[#D4956A]" /> Alat Seduh
              </span>
              <p className="font-judul text-xl font-bold text-[#4B2E1C]">{jurnal.brewMethod}</p>
            </div>
            
            <div className="bg-white p-5 rounded-2xl border border-[#8B5E3C]/5 shadow-sm">
              <span className="flex items-center gap-2 text-xs font-bold text-[#8B5E3C] uppercase tracking-wider mb-2">
                <Scale className="w-4 h-4 text-[#D4956A]" /> Rasio & Takaran
              </span>
              <p className="font-judul text-xl font-bold text-[#4B2E1C]">{jurnal.ratio}</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#8B5E3C]/5 shadow-sm col-span-2 md:col-span-1">
              <span className="flex items-center gap-2 text-xs font-bold text-[#8B5E3C] uppercase tracking-wider mb-2">
                <Star className="w-4 h-4 text-[#D4956A]" /> Rating
              </span>
              <p className="font-judul text-xl font-bold text-[#4B2E1C] capitalize">
                {jurnal.rating.replace(/_/g, ' ').toLowerCase()}
              </p>
            </div>
          </div>

          {/* Catatan Rasa */}
          <div className="bg-white p-8 rounded-3xl border border-[#8B5E3C]/5 shadow-sm">
            <span className="flex items-center gap-2 text-sm font-bold text-[#8B5E3C] uppercase tracking-wider mb-4 border-b border-[#8B5E3C]/10 pb-4">
              <Timer className="w-5 h-5 text-[#D4956A]" /> Catatan Rasa & Evaluasi
            </span>
            <p className="font-teks text-[#4B2E1C] text-lg leading-relaxed whitespace-pre-wrap italic">
              "{jurnal.tastingNote}"
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}