import { Bookmark } from "lucide-react";
import Link from "next/link";

export default function TersimpanPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-[#8B5E3C]/10">
        <h2 className="font-judul text-2xl font-bold text-[#4B2E1C] flex items-center gap-3">
          <Bookmark className="w-6 h-6 text-[#D4956A]" /> Artikel Tersimpan
        </h2>
      </div>

      <div className="bg-white py-16 px-6 rounded-2xl text-center border border-[#8B5E3C]/10 shadow-sm flex flex-col items-center mt-6">
        <div className="w-24 h-24 bg-[#FDF6EE] rounded-full flex items-center justify-center mb-6 border border-[#8B5E3C]/5 shadow-inner">
          <Bookmark className="w-12 h-12 text-[#D4956A]" />
        </div>
        <h3 className="font-judul text-2xl font-bold text-[#4B2E1C] mb-2">Belum Ada Artikel yang Disimpan</h3>
        <p className="font-teks text-sm text-[#8B5E3C] mb-8 max-w-sm leading-relaxed">
          Simpan panduan seduh, resep kopi, atau artikel favoritmu untuk dibaca lagi nanti.
        </p>
        <Link
          href="/panduan"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#4B2E1C] text-[#FDF6EE] rounded-xl text-sm font-bold hover:bg-[#8B5E3C] transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
        >
          Eksplorasi Panduan
        </Link>
      </div>
    </div>
  );
}
