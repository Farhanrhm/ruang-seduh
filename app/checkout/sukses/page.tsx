import Link from "next/link";
import { CheckCircle2, Coffee, ArrowRight } from "lucide-react";

export default function CheckoutSuksesPage() {
  return (
    <div className="bg-[#FDF6EE] min-h-[80vh] flex items-center justify-center px-4">
      <div className="bg-white p-10 md:p-16 rounded-[3rem] shadow-xl border border-[#8B5E3C]/10 text-center max-w-lg w-full relative overflow-hidden">
        
        {/* Dekorasi Background */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#D4956A]/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#4B2E1C]/5 rounded-full blur-3xl"></div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-8 shadow-inner border border-green-200">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          
          <h1 className="font-judul text-4xl font-black text-[#4B2E1C] mb-4">Pesanan Berhasil!</h1>
          <p className="font-teks text-[#8B5E3C] text-lg mb-8 leading-relaxed">
            Terima kasih telah berbelanja di Ruang Seduh. Kopi dan alat seduh impianmu sedang kami siapkan untuk dikirim.
          </p>

          <div className="space-y-4 w-full">
            <Link href="/jurnal/baru" className="w-full py-4 bg-[#D4956A] text-white rounded-2xl font-bold hover:bg-[#b57a52] transition-colors flex items-center justify-center gap-2 shadow-md">
              <Coffee className="w-5 h-5" /> Catat Resep Baru
            </Link>
            <Link href="/toko" className="w-full py-4 bg-[#FDF6EE] text-[#4B2E1C] rounded-2xl font-bold hover:bg-[#f5e6d3] transition-colors border border-[#8B5E3C]/20 flex items-center justify-center gap-2">
              Kembali ke Toko <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}