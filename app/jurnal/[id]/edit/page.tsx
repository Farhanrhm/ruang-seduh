import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import EditJurnalForm from "@/components/EditJurnalForm";

export default async function EditJurnalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/");

  // Ambil data jurnal lama dari database
  const jurnal = await prisma.brewJournal.findUnique({
    where: { id: id, userId: session.user.id },
  });

  if (!jurnal) redirect("/jurnal");

  return (
    <div className="min-h-screen bg-[#FDF6EE] text-[#4B2E1C] pt-24 pb-24">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        
        <Link href="/jurnal" className="inline-flex items-center gap-2 text-[#8B5E3C] hover:text-[#4B2E1C] font-bold mb-10 transition-colors bg-white px-5 py-2.5 rounded-full shadow-sm border border-[#8B5E3C]/10 w-fit group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Batal & Kembali
        </Link>

        <div className="mb-10 text-center md:text-left">
          <h1 className="font-judul text-4xl md:text-5xl font-black text-[#4B2E1C] mb-4 tracking-tighter">Edit Jurnal</h1>
          <p className="font-teks text-[#8B5E3C] text-lg max-w-2xl leading-relaxed">
            Ada yang salah ketik atau ingin merevisi catatan rasamu? Perbaiki di sini.
          </p>
        </div>
        
        <EditJurnalForm jurnal={jurnal} />

      </div>
    </div>
  );
}
