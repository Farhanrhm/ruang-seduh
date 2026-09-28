import Link from "next/link";
import { Coffee, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FDF6EE] flex items-center justify-center p-4">
      <div className="bg-white p-8 md:p-16 rounded-3xl shadow-xl max-w-lg w-full text-center border border-[#8B5E3C]/10">
        <div className="relative w-32 h-32 mx-auto mb-8">
          <div className="absolute inset-0 bg-[#FDF6EE] rounded-full flex items-center justify-center">
            <Coffee className="w-16 h-16 text-[#D4956A]" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center border border-[#8B5E3C]/5">
            <Search className="w-5 h-5 text-[#8B5E3C]" />
          </div>
        </div>
        
        <h1 className="font-judul text-7xl font-black text-[#4B2E1C] mb-4">404</h1>
        <h2 className="font-judul text-2xl font-bold text-[#8B5E3C] mb-4">Biji Kopi Tidak Ditemukan</h2>
        
        <p className="font-teks text-[#8B5E3C] mb-10 leading-relaxed max-w-sm mx-auto">
          Halaman atau produk yang Anda cari mungkin sudah habis diseduh atau dipindahkan ke etalase lain.
        </p>

        <Link
          href="/"
          className="inline-flex items-center justify-center px-8 py-4 bg-[#4B2E1C] text-[#FDF6EE] rounded-2xl font-bold hover:bg-[#8B5E3C] transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 active:scale-95 text-lg"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
