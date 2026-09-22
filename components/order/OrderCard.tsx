"use client";

import { useState } from "react";
import Image from "next/image";
import { Calendar, Copy, Check, ChevronDown, ChevronUp, Truck, Info } from "lucide-react";
import BadgeStatus from "@/components/ui/BadgeStatus";
import PayButton from "@/app/profil/PayButton";
import { useCartStore } from "@/store/useCartStore";
import toast from "react-hot-toast";
import { isDummyCourier } from "@/lib/biteshipUtils";

type OrderItem = {
  id: string;
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  price: number;
  grindSize?: string | null;
  product?: {
    id: string;
    price: number;
    isActive: boolean;
    stock: number;
    imageUrl?: string | null;
    grindOptions: string[];
  } | null;
};

type Order = {
  id: string;
  status: string;
  createdAt: Date;
  recipientName: string;
  city: string;
  paymentType?: string | null;
  totalAmount: number;
  snapToken?: string | null;
  items: OrderItem[];
};

interface CartState {
  addItem: (item: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    weight: number;
    grindSize?: string | null;
  }) => void;
}

export default function OrderCard({ order }: { order: Order }) {
  const [isCopied, setIsCopied] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const addItem = useCartStore((state: unknown) => (state as CartState).addItem);

  const shortId = `#RS-${order.id.substring(0, 8).toUpperCase()}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(order.id);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const formatRupiah = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);

  const formatTanggal = (date: Date) =>
    new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(new Date(date));

  // Ongkir Turunan (Sementara)
  const subtotal = order.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const ongkir = order.totalAmount - subtotal;
  const isSimulasi = isDummyCourier(order.paymentType);
  
  const isExpired = order.status === "PENDING" && !order.snapToken;
  // Di UI, jika kedaluwarsa kita anggap tampilannya sebagai CANCELLED (Redup)
  const displayStatus = isExpired ? "CANCELLED" : order.status;
  const isCancelledLook = displayStatus === "CANCELLED";

  const handleBeliLagi = () => {
    let successCount = 0;
    
    // Catatan: Pengecekan isActive/stock/harga/grindSize di client-side ini murni HANYA UNTUK UX 
    // agar user mendapat umpan balik langsung.
    // Keputusan final (validasi stok dan harga akhir) tetap wajib dilakukan di sisi Server (order.ts) saat re-checkout!
    order.items.forEach(item => {
      if (!item.product) {
        toast.error(`Produk "${item.productName}" sudah dihapus dari toko.`);
        return;
      }
      if (!item.product.isActive) {
        toast.error(`Produk "${item.productName}" sedang tidak aktif.`);
        return;
      }
      if (item.product.stock < 1) {
        toast.error(`Stok "${item.productName}" sedang habis.`);
        return;
      }

      // 1. Kuantitas dibatasi maksimal sisa stok
      const maxQty = Math.min(item.quantity, item.product.stock);
      if (maxQty < item.quantity) {
        toast(`Stok "${item.productName}" terbatas, kuantitas disesuaikan jadi ${maxQty}.`, { icon: '⚠️' });
      }

      // 2. Validasi Grind Size basi
      let finalGrindSize = item.grindSize;
      if (finalGrindSize && item.product.grindOptions?.length > 0) {
        if (!item.product.grindOptions.includes(finalGrindSize)) {
          finalGrindSize = null; // Reset ke null agar user milih ulang di keranjang
          toast(`Opsi gilingan "${item.grindSize}" tidak tersedia lagi. Silakan atur ulang di keranjang.`, { icon: '⚠️' });
        }
      }

      // Menggunakan harga terbaru dari tabel Product, bukan harga lama
      addItem({
        id: item.product.id,
        name: item.productName,
        price: item.product.price, // Selalu gunakan harga terbaru
        quantity: maxQty, 
        image: item.product.imageUrl || "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop",
        weight: 200, // Fallback if weight is missing
        grindSize: finalGrindSize,
      });
      successCount++;
    });

    if (successCount > 0) {
      toast.success(`${successCount} produk berhasil ditambahkan ke keranjang!`);
    }
  };

  return (
    <div className={`bg-white p-5 sm:p-6 rounded-2xl border ${isCancelledLook ? 'border-[#8B5E3C]/5 opacity-75' : 'border-[#8B5E3C]/10 shadow-sm'} transition-all`}>
      {/* Header Kartu */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#8B5E3C]/10">
        <div className="flex flex-wrap items-center gap-3">
          <BadgeStatus status={displayStatus} />
          <span className="text-xs text-[#8B5E3C] flex items-center gap-1.5 font-teks">
            <Calendar className="w-3.5 h-3.5" />
            {formatTanggal(order.createdAt)}
          </span>
        </div>
        
        <div className="flex items-center gap-2 text-xs font-mono font-medium text-[#8B5E3C] bg-gray-50 px-2.5 py-1.5 rounded-lg border border-gray-100">
          <span>{shortId}</span>
          <button 
            onClick={handleCopy}
            className="text-[#8B5E3C] hover:text-[#4B2E1C] transition-colors p-0.5 rounded-md hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5E3C]/50"
            title="Salin ID Pesanan (Full)"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Item Produk */}
      <div className="py-5 space-y-4">
        {order.items.slice(0, 2).map((item) => (
          <div key={item.id} className="flex gap-4 items-start">
            <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-[#8B5E3C]/10">
              <Image 
                src={item.product?.imageUrl || "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop"} 
                alt={item.productName} 
                fill 
                className="object-cover" 
              />
            </div>
            <div className="flex-1">
              <h4 className="font-judul font-bold text-[#4B2E1C] text-sm md:text-base leading-tight">
                {item.productName}
              </h4>
              <p className="text-xs text-[#8B5E3C] mt-1 font-teks">
                {item.quantity} x {formatRupiah(item.unitPrice)}
              </p>
              {item.grindSize && (
                <span className="inline-block mt-1.5 text-[10px] font-medium bg-[#FDF6EE] text-[#8B5E3C] px-2 py-0.5 rounded-md border border-[#8B5E3C]/20">
                  Gilingan: {item.grindSize}
                </span>
              )}
            </div>
          </div>
        ))}
        {order.items.length > 2 && (
          <p className="text-xs text-[#8B5E3C] font-medium italic pl-20">
            + {order.items.length - 2} produk lainnya
          </p>
        )}
      </div>

      {/* Rincian Harga & Pengiriman (Accordion) */}
      <div className="bg-gray-50/50 rounded-xl border border-gray-100 mb-5 transition-all">
        <button 
          onClick={() => setShowDetails(!showDetails)}
          className="w-full flex items-center justify-between px-4 py-3 text-xs font-bold text-[#8B5E3C] hover:bg-gray-50 transition-colors rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5E3C]/50 focus-visible:bg-white"
        >
          <span>Lihat rincian pesanan</span>
          {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        
        {showDetails && (
          <div className="px-4 pb-4 pt-1 space-y-4 animate-in fade-in slide-in-from-top-2 text-xs font-teks text-[#8B5E3C]">
            <div className="space-y-2 border-b border-gray-200 pb-3">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#D4956A]" />
                <span className="font-medium text-[#4B2E1C]">Info Pengiriman</span>
              </div>
              <p className="pl-6">Dikirim ke: <strong className="text-[#4B2E1C]">{order.recipientName}</strong>, {order.city}</p>
              <div className="pl-6 flex items-center gap-2">
                <span>Kurir: <strong className="text-[#4B2E1C]">{order.paymentType || "-"}</strong></span>
                {isSimulasi && process.env.NODE_ENV !== "production" && (
                  <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-md flex items-center gap-1">
                    <Info className="w-3 h-3" /> Mode Uji
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <div className="flex justify-between">
                <span>Subtotal ({order.items.length} produk)</span>
                <span className="font-medium text-[#4B2E1C]">{formatRupiah(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Ongkos Kirim</span>
                <span className="font-medium text-[#4B2E1C]">
                  {ongkir > 0 ? formatRupiah(ongkir) : "Gratis"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Kartu: Total & Aksi */}
      <div className="pt-4 border-t border-[#8B5E3C]/10 flex flex-col md:flex-row items-center justify-between gap-5">
        <div className="w-full md:w-auto text-left">
          <p className="text-xs text-[#8B5E3C] font-teks mb-1">Total Belanja</p>
          <p className="text-lg font-black font-judul text-[#4B2E1C]">
            {formatRupiah(order.totalAmount)}
          </p>
        </div>
        
        <div className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-3">
          {isExpired && (
            <span className="text-xs text-rose-600 bg-rose-50 px-3 py-2 rounded-lg border border-rose-100 font-medium w-full sm:w-auto text-center">
              Kedaluwarsa
            </span>
          )}

          {order.status === "PENDING" && order.snapToken ? (
            <div className="w-full sm:w-auto min-w-[200px]">
              <PayButton snapToken={order.snapToken} />
            </div>
          ) : (
            <button 
              onClick={handleBeliLagi}
              className="w-full sm:w-auto min-h-[44px] px-6 py-2 bg-white text-[#4B2E1C] border-2 border-[#8B5E3C]/20 rounded-xl text-sm font-bold hover:border-[#D4956A] hover:text-[#D4956A] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5E3C]/50"
            >
              Beli Lagi
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
