"use client";

import { useCartStore } from "@/store/useCartStore";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, ShieldCheck, MapPin, Mail, User } from "lucide-react";
import Link from "next/link";
import { kirimEmailInvoice } from "@/app/actions/email";

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const total = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
  const ongkir = 20000;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const name = formData.get('nama') as string;

    try {
      await kirimEmailInvoice(email, name, items, total + ongkir);
      clearCart();
      router.push("/checkout/sukses");
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FDF6EE] pt-32 pb-24 text-center">
        <h1 className="font-judul text-3xl font-black text-[#4B2E1C] mb-4">Keranjang Kosong</h1>
        <Link href="/toko" className="px-6 py-3 bg-[#D4956A] text-white rounded-full font-bold inline-block">Belanja Sekarang</Link>
      </div>
    );
  }

  return (
    <div className="bg-[#FDF6EE] min-h-screen pt-24 pb-24 text-[#4B2E1C]">
      <div className="container mx-auto px-4 max-w-6xl">
        <Link href="/toko" className="inline-flex items-center gap-2 text-[#8B5E3C] hover:text-[#4B2E1C] font-bold mb-8 bg-white px-4 py-2 rounded-full shadow-sm border border-[#8B5E3C]/10 w-fit">
          <ArrowLeft className="w-4 h-4" /> Kembali Belanja
        </Link>

        <h1 className="font-judul text-4xl md:text-5xl font-black text-[#4B2E1C] mb-10 tracking-tight">Checkout</h1>

        <div className="grid lg:grid-cols-12 gap-10">
          {/* Kolom Kiri: Form Data Diri */}
          <div className="lg:col-span-7">
            <form id="checkout-form" onSubmit={handleSubmit} className="bg-white p-8 md:p-10 rounded-[2rem] border border-[#8B5E3C]/10 shadow-sm space-y-8">
              <div>
                <h3 className="font-judul text-xl font-bold text-[#4B2E1C] mb-6 flex items-center gap-2">
                  <User className="w-5 h-5 text-[#D4956A]" /> Informasi Kontak
                </h3>
                <div className="grid md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#8B5E3C] uppercase tracking-wider">Nama Lengkap</label>
                    <input name="nama" required placeholder="Cth: Farhan" className="w-full px-5 py-3.5 bg-gray-50 border border-[#8B5E3C]/20 rounded-xl focus:ring-2 focus:ring-[#D4956A] focus:bg-white outline-none transition-all font-teks" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#8B5E3C] uppercase tracking-wider">Email (Untuk Invoice)</label>
                    <input name="email" type="email" required placeholder="Cth: halo@email.com" className="w-full px-5 py-3.5 bg-gray-50 border border-[#8B5E3C]/20 rounded-xl focus:ring-2 focus:ring-[#D4956A] focus:bg-white outline-none transition-all font-teks" />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-[#8B5E3C]/10">
                <h3 className="font-judul text-xl font-bold text-[#4B2E1C] mb-6 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#D4956A]" /> Alamat Pengiriman
                </h3>
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#8B5E3C] uppercase tracking-wider">Alamat Lengkap</label>
                    <textarea name="alamat" required rows={3} placeholder="Nama jalan, nomor rumah, RT/RW..." className="w-full px-5 py-3.5 bg-gray-50 border border-[#8B5E3C]/20 rounded-xl focus:ring-2 focus:ring-[#D4956A] focus:bg-white outline-none transition-all font-teks resize-none" />
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Kolom Kanan: Rincian Pesanan */}
          <div className="lg:col-span-5">
            <div className="bg-white p-8 md:p-10 rounded-[2rem] border border-[#8B5E3C]/10 shadow-lg sticky top-32">
              <h3 className="font-judul text-xl font-bold text-[#4B2E1C] mb-6">Ringkasan Pesanan</h3>
              
              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
                {items.map((item: any) => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-[#FDF6EE] flex-shrink-0 border border-[#8B5E3C]/10">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-judul font-bold text-[#4B2E1C] text-sm">{item.name}</h4>
                      <p className="font-teks text-xs text-[#8B5E3C]">{item.quantity} x Rp {item.price.toLocaleString('id-ID')}</p>
                    </div>
                    <p className="font-teks font-black text-[#4B2E1C] text-sm">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-b border-[#8B5E3C]/10 py-5 space-y-3 mb-6">
                <div className="flex justify-between font-teks text-sm text-[#8B5E3C]">
                  <span>Subtotal</span><span>Rp {total.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between font-teks text-sm text-[#8B5E3C]">
                  <span>Biaya Pengiriman</span><span>Rp {ongkir.toLocaleString('id-ID')}</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-8">
                <span className="font-judul text-lg font-bold text-[#4B2E1C]">Total Akhir</span>
                <span className="font-judul text-3xl font-black text-[#D4956A]">Rp {(total + ongkir).toLocaleString('id-ID')}</span>
              </div>

              <button form="checkout-form" type="submit" disabled={isSubmitting} className="w-full py-4 bg-[#4B2E1C] text-[#FDF6EE] rounded-2xl font-bold hover:bg-[#8B5E3C] transition-all flex items-center justify-center gap-2 text-lg shadow-lg disabled:opacity-70 disabled:cursor-not-allowed group">
                {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : "Bayar Pesanan"}
              </button>

              <p className="text-xs text-center text-[#8B5E3C] mt-4 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> Transaksi Aman & Terenkripsi
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}