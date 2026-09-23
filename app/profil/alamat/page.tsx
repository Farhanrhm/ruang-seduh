import { MapPin, Plus } from "lucide-react";
import Link from "next/link";

export default function AlamatPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-[#8B5E3C]/10">
        <h2 className="font-judul text-2xl font-bold text-[#4B2E1C] flex items-center gap-3">
          <MapPin className="w-6 h-6 text-[#D4956A]" /> Alamat Pengiriman
        </h2>
      </div>

      <div className="bg-white py-16 px-6 rounded-2xl text-center border border-[#8B5E3C]/10 shadow-sm flex flex-col items-center mt-6">
        <div className="w-24 h-24 bg-[#FDF6EE] rounded-full flex items-center justify-center mb-6 border border-[#8B5E3C]/5 shadow-inner">
          <MapPin className="w-12 h-12 text-[#D4956A]" />
        </div>
        <h3 className="font-judul text-2xl font-bold text-[#4B2E1C] mb-2">Belum Ada Alamat</h3>
        <p className="font-teks text-sm text-[#8B5E3C] mb-8 max-w-sm leading-relaxed">
          Tambahkan alamat pengirimanmu agar proses checkout kopi dan alat seduh menjadi lebih cepat dan mudah.
        </p>
        <button
          disabled
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-gray-100 text-gray-400 rounded-xl text-sm font-bold shadow-none cursor-not-allowed border border-gray-200"
          title="Fitur sedang dalam pengembangan"
        >
          <Plus className="w-4 h-4" /> Tambah Alamat Baru
        </button>
        <span className="text-[10px] font-bold text-[#D4956A] uppercase tracking-wider mt-4">
          *Fitur segera hadir
        </span>
      </div>
    </div>
  );
}
