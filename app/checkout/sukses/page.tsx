import Link from "next/link";
import { CheckCircle2, ShoppingBag, ArrowRight, FileText, Mail } from "lucide-react";

// Di Next.js 15+, searchParams adalah Promise
export default async function CheckoutSuccessPage({ searchParams }: { searchParams: Promise<{ orderId?: string }> }) {
  const resolvedParams = await searchParams;
  
  // Mengambil Nomor pesanan dari URL (jika ada), atau membuat secara acak
  const orderId = resolvedParams?.orderId || `INV-${new Date().getFullYear()}${new Date().getMonth()+1}-${Math.floor(1000 + Math.random() * 9000)}`;

  return (
    <div className="min-h-screen bg-[#FDF6EE] pt-32 pb-24 text-[#4B2E1C] flex items-center justify-center">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-[2.5rem] p-8 md:p-14 shadow-xl border border-[#8B5E3C]/10 text-center relative overflow-hidden">
          
          {/* Ornamen Latar Bayangan Hijau */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

          {/* Ikon Sukses */}
          <div className="relative w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-emerald-100 shadow-inner">
            <CheckCircle2 className="w-12 h-12 animate-in zoom-in duration-500" />
          </div>

          <h1 className="font-judul text-4xl md:text-5xl font-black text-[#4B2E1C] mb-4 tracking-tight">
            Pesanan Berhasil!
          </h1>
          
          <p className="font-teks text-[#8B5E3C] text-lg mb-10 leading-relaxed max-w-md mx-auto">
            Terima kasih telah berbelanja di Ruang Seduh. Biji kopi pilihan Anda sedang kami siapkan untuk segera diseduh.
          </p>

          {/* Kotak Nomor Invoice */}
          <div className="bg-[#FDF6EE] rounded-3xl p-6 mb-10 border border-[#8B5E3C]/10 inline-block text-left w-full max-w-sm shadow-sm">
            <p className="text-[11px] font-bold text-[#8B5E3C] uppercase tracking-widest mb-1 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#D4956A]" /> Nomor Invoice
            </p>
            <p className="font-judul text-2xl md:text-3xl font-black text-[#4B2E1C] mb-4">
              {orderId}
            </p>
            
            <div className="h-px w-full bg-[#8B5E3C]/10 mb-4" />
            
            <p className="text-sm font-teks text-[#8B5E3C] flex items-start gap-3 leading-relaxed">
              <Mail className="w-5 h-5 text-[#D4956A] flex-shrink-0 mt-0.5" />
              Detail tagihan dan instruksi pembayaran telah dikirimkan ke email Anda.
            </p>
          </div>

          {/* Tombol Aksi */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <Link 
              href="/toko" 
              className="w-full sm:w-auto px-8 py-4 bg-[#4B2E1C] text-[#FDF6EE] rounded-full font-bold hover:bg-[#8B5E3C] transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2 group"
            >
              <ShoppingBag className="w-5 h-5" /> Belanja Lagi
            </Link>
            <Link 
              href="/" 
              className="w-full sm:w-auto px-8 py-4 bg-white text-[#4B2E1C] border-2 border-[#8B5E3C]/20 rounded-full font-bold hover:bg-[#FDF6EE] hover:border-[#D4956A] transition-all flex items-center justify-center gap-2 group"
            >
              Beranda <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}