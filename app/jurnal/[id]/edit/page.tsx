import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { updateJurnal } from "@/app/actions/jurnal";
import Link from "next/link";
import { ArrowLeft, Save, Coffee, BarChart3, Scale, Timer } from "lucide-react";

export default async function EditJurnalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const session = await getServerSession(authOptions);
  if (!(session?.user as any)?.id) redirect("/");

  // Ambil data jurnal lama dari database
  const jurnal = await prisma.brewJournal.findUnique({
    where: { id: id, userId: (session.user as any).id },
  });

  if (!jurnal) redirect("/jurnal");

  // Karena Server Action butuh ID, kita bungkus fungsinya dengan .bind
  const updateJurnalDenganId = updateJurnal.bind(null, jurnal.id);

  return (
    <div className="min-h-screen bg-[#4B2E1C] text-[#FDF6EE] pt-16 pb-24">
      <div className="container mx-auto px-4 md:px-8 max-w-5xl">
        
        <Link href="/jurnal" className="inline-flex items-center gap-2 text-[#D4956A] hover:text-[#b57a52] mb-12 transition-all font-teks font-bold text-sm tracking-tight p-2 bg-white/5 rounded-xl border border-[#FDF6EE]/10 w-fit">
          <ArrowLeft className="w-4 h-4" /> Batal & Kembali
        </Link>

        <div className="mb-16 border-b border-[#FDF6EE]/10 pb-8">
          <h1 className="font-judul text-4xl md:text-5xl font-black text-[#FDF6EE] tracking-tighter mb-3">Edit Jurnal</h1>
          <p className="font-teks text-[#8B5E3C] text-lg max-w-2xl leading-relaxed">
            Ada yang salah ketik atau ingin merevisi catatan rasamu? Perbaiki di sini.
          </p>
        </div>
        
        <form action={updateJurnalDenganId} className="space-y-6 font-teks text-[#4B2E1C]">
          
          <div className="bg-white p-8 rounded-3xl border border-[#8B5E3C]/10 shadow-sm flex flex-col md:flex-row gap-6 items-center">
            <div className="w-20 h-20 bg-[#FDF6EE] rounded-3xl flex items-center justify-center mb-6 md:mb-0 border border-[#8B5E3C]/10 shadow-inner flex-shrink-0">
              <Coffee className="w-10 h-10 text-[#D4956A]" />
            </div>
            <div className="flex-1 w-full space-y-4">
              <label htmlFor="coffeeBean" className="block text-sm font-bold text-[#4B2E1C] uppercase tracking-wider mb-1">Nama Biji Kopi</label>
              <input type="text" id="coffeeBean" name="coffeeBean" required defaultValue={jurnal.coffeeBean}
                className="w-full px-6 py-3.5 rounded-full border border-[#8B5E3C]/30 focus:outline-none focus:border-[#D4956A] bg-[#FDF6EE] shadow-sm font-teks" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-8 rounded-3xl border border-[#8B5E3C]/10 shadow-sm space-y-5">
              <div className="space-y-4 mb-4">
                <label htmlFor="brewMethod" className="block text-sm font-bold text-[#4B2E1C] uppercase tracking-wider mb-1 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-[#D4956A]" /> Alat Seduh
                </label>
                <select id="brewMethod" name="brewMethod" required defaultValue={jurnal.brewMethod}
                  className="w-full px-6 py-3.5 rounded-full border border-[#8B5E3C]/30 focus:outline-none focus:border-[#D4956A] bg-[#FDF6EE] shadow-sm font-teks appearance-none">
                  <option value="V60 Pour Over">V60 Pour Over</option>
                  <option value="French Press">French Press</option>
                  <option value="Aeropress">Aeropress</option>
                  <option value="Espresso">Espresso Machine</option>
                  <option value="Cold Brew">Cold Brew</option>
                  <option value="Siphon">Siphon</option>
                  <option value="Kopi Tubruk">Kopi Tubruk</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div className="space-y-4 mb-4">
                <label htmlFor="ratio" className="block text-sm font-bold text-[#4B2E1C] uppercase tracking-wider mb-1 flex items-center gap-2">
                  <Scale className="w-4 h-4 text-[#D4956A]" /> Rasio Air & Kopi
                </label>
                <input type="text" id="ratio" name="ratio" required defaultValue={jurnal.ratio}
                  className="w-full px-6 py-3.5 rounded-full border border-[#8B5E3C]/30 focus:outline-none focus:border-[#D4956A] bg-[#FDF6EE] shadow-sm font-teks" />
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-[#8B5E3C]/10 shadow-sm space-y-4">
              <label htmlFor="tastingNote" className="block text-sm font-bold text-[#4B2E1C] uppercase tracking-wider mb-1 flex items-center gap-2">
                <Timer className="w-4 h-4 text-[#D4956A]" /> Catatan Rasa & Hasil
              </label>
              <textarea id="tastingNote" name="tastingNote" rows={8} required defaultValue={jurnal.tastingNote || ""}
                className="w-full p-6 rounded-3xl border border-[#8B5E3C]/30 focus:outline-none focus:border-[#D4956A] bg-[#FDF6EE] shadow-sm font-teks resize-none leading-relaxed"></textarea>
            </div>
          </div>

          <div className="pt-6">
            <button type="submit" className="w-full py-5 bg-[#D4956A] text-white rounded-full font-bold hover:bg-[#b57a52] transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3 text-lg">
              <Save className="w-6 h-6" /> Perbarui Jurnal Seduh
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
