"use client";

import { useCartStore } from "@/store/useCartStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, MapPin, CreditCard, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { kirimEmailInvoice } from "@/app/actions/email";
import { useSession } from "next-auth/react";
import { Lock } from "lucide-react";

export default function CheckoutPage() {
  const { data: session, status } = useSession(); // 2. Ambil status login
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    // Proteksi: Jika tidak login, arahkan ke halaman utama atau tampilkan pesan login
    if (status === "unauthenticated") {
      router.push("/"); 
    }

    if (items.length === 0 && status === "authenticated") {
      router.push("/toko");
    }
  }, [items, router, status]);

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(angka);
  };

  const ongkir = 20000;
  const totalBayar = getTotalPrice() + ongkir;

  const handleBayar = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // 3. Pastikan Email terkirim dengan AWAIT sebelum pindah halaman
      // Mengambil nama dan email dari data session login
      const customerName = session?.user?.name || "Pelanggan";
      const customerEmail = session?.user?.email || "";

      if (customerEmail) {
        await kirimEmailInvoice(customerEmail, customerName, items, totalBayar);
      }

      // Berikan jeda sedikit untuk efek visual proses
      setTimeout(() => {
        clearCart();
        router.push("/checkout/sukses");
      }, 1000);
    } catch (error) {
      console.error("Gagal memproses pembayaran:", error);
      alert("Terjadi kesalahan saat memproses pesanan.");
      setIsLoading(false);
    }
  };

  // Tampilan Loading saat cek session
  if (status === "loading" || !isMounted) return <div className="min-h-screen bg-[#FDF6EE] flex items-center justify-center font-judul text-2xl text-[#4B2E1C]">Memuat...</div>;

  // Tampilan jika belum login (sebagai backup)
  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-[#FDF6EE] flex items-center justify-center p-4">
        <div className="text-center bg-white p-10 rounded-[2rem] shadow-xl border border-[#8B5E3C]/10">
          <Lock className="w-16 h-16 text-[#D4956A] mx-auto mb-4" />
          <h2 className="font-judul text-3xl font-black text-[#4B2E1C] mb-2">Akses Terbatas</h2>
          <p className="font-teks text-[#8B5E3C] mb-6">Kamu harus login terlebih dahulu untuk melakukan pembayaran.</p>
          <button onClick={() => router.push("/")} className="px-8 py-3 bg-[#D4956A] text-white rounded-xl font-bold hover:bg-[#b57a52] transition-colors">Kembali ke Beranda</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FDF6EE] min-h-screen pt-16 pb-24 text-[#4B2E1C]">
      <div className="container mx-auto px-4 md:px-8 max-w-5xl">
        
        <Link href="/toko" className="inline-flex items-center gap-2 text-[#D4956A] hover:text-[#b57a52] mb-8 font-teks font-bold text-sm bg-white/50 p-2 rounded-xl border border-[#8B5E3C]/10 w-fit">
          <ArrowLeft className="w-4 h-4" /> Kembali Belanja
        </Link>

        <h1 className="font-judul text-4xl md:text-5xl font-black text-[#4B2E1C] mb-12 tracking-tighter">Selesaikan Pesanan</h1>

        <div className="grid md:grid-cols-2 gap-12">
          
          {/* Kolom Kiri: Form Data Pengiriman */}
          <form id="form-checkout" onSubmit={handleBayar} className="space-y-8">
            <div className="bg-white p-8 rounded-3xl border border-[#8B5E3C]/10 shadow-sm space-y-6">
              <h2 className="font-judul text-2xl font-bold text-[#4B2E1C] flex items-center gap-2 border-b border-[#8B5E3C]/10 pb-4">
                <MapPin className="w-5 h-5 text-[#D4956A]" /> Detail Pengiriman
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-[#8B5E3C] mb-1">Nama Lengkap</label>
                  <input type="text" name="nama" required className="w-full px-4 py-3 rounded-xl border border-[#8B5E3C]/30 focus:outline-none focus:border-[#D4956A] bg-[#FDF6EE] font-teks" placeholder="Contoh: Budi Santoso" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#8B5E3C] mb-1">Nomor WhatsApp</label>
                  <input type="tel" required className="w-full px-4 py-3 rounded-xl border border-[#8B5E3C]/30 focus:outline-none focus:border-[#D4956A] bg-[#FDF6EE] font-teks" placeholder="Contoh: 0812xxxx" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#8B5E3C] mb-1">Alamat Lengkap</label>
                  <textarea required rows={3} className="w-full px-4 py-3 rounded-xl border border-[#8B5E3C]/30 focus:outline-none focus:border-[#D4956A] bg-[#FDF6EE] font-teks resize-none" placeholder="Nama jalan, RT/RW, nomor rumah..."></textarea>
                </div>
              </div>
            </div>
          </form>

          {/* Kolom Kanan: Ringkasan Pesanan */}
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-[#8B5E3C]/10 shadow-sm">
              <h2 className="font-judul text-2xl font-bold text-[#4B2E1C] mb-6 border-b border-[#8B5E3C]/10 pb-4">Ringkasan Belanja</h2>
              
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center font-teks">
                    <span className="text-[#8B5E3C]">{item.quantity}x {item.name}</span>
                    <span className="font-bold text-[#4B2E1C]">{formatRupiah(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#8B5E3C]/10 pt-4 space-y-3 font-teks">
                <div className="flex justify-between text-[#8B5E3C]">
                  <span>Subtotal</span>
                  <span>{formatRupiah(getTotalPrice())}</span>
                </div>
                <div className="flex justify-between text-[#8B5E3C]">
                  <span>Ongkos Kirim</span>
                  <span>{formatRupiah(ongkir)}</span>
                </div>
                <div className="flex justify-between items-center pt-4 mt-4 border-t border-[#8B5E3C]/10">
                  <span className="font-bold text-lg text-[#4B2E1C]">Total Bayar</span>
                  <span className="font-judul text-3xl font-black text-[#D4956A]">{formatRupiah(totalBayar)}</span>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              form="form-checkout" // Menghubungkan tombol ini dengan form di atas
              disabled={isLoading}
              className="w-full py-5 bg-[#4B2E1C] text-[#FDF6EE] rounded-2xl font-bold hover:bg-[#3a2315] transition-colors flex items-center justify-center gap-2 text-xl disabled:opacity-70 shadow-xl"
            >
              {isLoading ? "Memproses..." : <><CreditCard className="w-6 h-6" /> Bayar Sekarang</>}
            </button>
            <p className="text-center text-xs text-[#8B5E3C] flex items-center justify-center gap-1 mt-4">
              <ShieldCheck className="w-4 h-4" /> Pembayaran aman & dienkripsi
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}