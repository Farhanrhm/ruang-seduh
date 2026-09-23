import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Package, MapPin, CreditCard, Coffee, Bookmark, ChevronRight } from "lucide-react";

export default async function ProfilPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/");
  }

  // Ambil user dengan alamat utama untuk ringkasan profil
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      addresses: {
        where: { isDefault: true },
        take: 1
      }
    }
  });

  // Query status pesanan secara ringkas untuk summary
  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    select: { status: true, snapToken: true },
  });

  const activeBills = orders.filter(o => o.status === "PENDING" && o.snapToken);
  const defaultAddress = user?.addresses?.[0];

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Kartu Profil Utama */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-[#8B5E3C]/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="h-20 w-20 sm:h-24 sm:w-24 overflow-hidden rounded-full border-2 border-[#D4956A]/20 shadow-sm flex-shrink-0">
            {session.user.image ? (
              <Image src={session.user.image} alt="Profil" width={96} height={96} className="object-cover h-full w-full" />
            ) : (
              <div className="h-full w-full bg-[#8B5E3C]/10 flex items-center justify-center font-bold text-[#4B2E1C] text-3xl">
                {session.user.name?.[0] || "U"}
              </div>
            )}
          </div>
          <div>
            <h1 className="font-judul text-2xl sm:text-3xl font-bold text-[#4B2E1C] mb-1">{session.user.name}</h1>
            <p className="font-teks text-sm text-[#8B5E3C] mb-2">{session.user.email}</p>
            <span className="inline-block px-3 py-1 bg-[#4B2E1C] text-[#FDF6EE] text-[10px] font-bold uppercase tracking-widest rounded-md">
              Member Ruang Seduh
            </span>
          </div>
        </div>

        {/* Ringkasan Cepat */}
        <div className="flex flex-wrap md:flex-nowrap gap-4 md:border-l border-[#8B5E3C]/10 md:pl-8">
          <div className="bg-[#FDF6EE] rounded-xl p-4 flex-1 min-w-[140px] border border-[#8B5E3C]/10">
            <div className="flex items-center gap-2 text-xs text-[#8B5E3C] font-bold uppercase tracking-wider mb-2">
              <CreditCard className="w-4 h-4 text-[#D4956A]" /> Tagihan Aktif
            </div>
            <p className="font-judul font-black text-[#4B2E1C] text-2xl">
              {activeBills.length}
            </p>
          </div>
          <div className="bg-[#FDF6EE] rounded-xl p-4 flex-1 min-w-[140px] border border-[#8B5E3C]/10">
            <div className="flex items-center gap-2 text-xs text-[#8B5E3C] font-bold uppercase tracking-wider mb-2">
              <MapPin className="w-4 h-4 text-[#4A7C59]" /> Alamat Utama
            </div>
            <p className="font-bold text-[#4B2E1C] text-sm truncate max-w-[160px]" title={defaultAddress?.city || "Belum diatur"}>
              {defaultAddress ? defaultAddress.city : "Belum diatur"}
            </p>
          </div>
        </div>
      </div>

      {/* Grid Menu Cepat */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <Link href="/profil/pesanan" className="bg-white p-6 rounded-2xl shadow-sm border border-[#8B5E3C]/10 hover:shadow-md hover:border-[#D4956A]/30 transition-all group">
          <Package className="w-8 h-8 text-[#8B5E3C] mb-4 group-hover:text-[#D4956A] transition-colors" />
          <h3 className="font-judul text-lg font-bold text-[#4B2E1C] mb-1">Pesanan Saya</h3>
          <p className="font-teks text-xs text-[#8B5E3C] mb-4">Lacak & kelola pesanan</p>
          <div className="flex items-center text-xs font-bold text-[#D4956A] uppercase tracking-wider">
            Lihat Detail <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
        
        <Link href="/profil/jurnal" className="bg-white p-6 rounded-2xl shadow-sm border border-[#8B5E3C]/10 hover:shadow-md hover:border-[#D4956A]/30 transition-all group">
          <Coffee className="w-8 h-8 text-[#8B5E3C] mb-4 group-hover:text-[#D4956A] transition-colors" />
          <h3 className="font-judul text-lg font-bold text-[#4B2E1C] mb-1">Jurnal Seduh</h3>
          <p className="font-teks text-xs text-[#8B5E3C] mb-4">Catatan personal brewing</p>
          <div className="flex items-center text-xs font-bold text-[#D4956A] uppercase tracking-wider">
            Buka Jurnal <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link href="/profil/tersimpan" className="bg-white p-6 rounded-2xl shadow-sm border border-[#8B5E3C]/10 hover:shadow-md hover:border-[#D4956A]/30 transition-all group">
          <Bookmark className="w-8 h-8 text-[#8B5E3C] mb-4 group-hover:text-[#D4956A] transition-colors" />
          <h3 className="font-judul text-lg font-bold text-[#4B2E1C] mb-1">Artikel Tersimpan</h3>
          <p className="font-teks text-xs text-[#8B5E3C] mb-4">Panduan & edukasi kopi</p>
          <div className="flex items-center text-xs font-bold text-[#D4956A] uppercase tracking-wider">
            Baca Lagi <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>
    </div>
  );
}
