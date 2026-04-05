"use client";

import Image from "next/image";
import Link from "next/link";
import { X, Trash2, ShoppingBag, Plus, Minus, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useEffect, useState } from "react";

export default function CartDrawer() {
  const { items, removeItem, updateQuantity, isOpenCart, closeCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const total = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

  if (!isOpenCart || !mounted) return null;

  return (
    <>
      <div className="fixed inset-0 bg-[#4B2E1C]/40 backdrop-blur-sm z-50 transition-opacity" onClick={closeCart} />
      <div className="fixed inset-y-0 right-0 w-full sm:w-[400px] bg-[#FDF6EE] shadow-2xl z-50 flex flex-col transform transition-transform duration-300">
        
        {/* Header Drawer */}
        <div className="p-6 border-b border-[#8B5E3C]/10 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-[#D4956A]" />
            <h2 className="font-judul text-xl font-black text-[#4B2E1C]">Keranjangmu</h2>
            <span className="bg-[#D4956A]/10 text-[#D4956A] text-[10px] font-bold px-2 py-1 rounded-full">{items.length} item</span>
          </div>
          <button onClick={closeCart} className="p-2 text-[#8B5E3C] hover:bg-red-50 hover:text-red-500 rounded-xl transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Isi Keranjang */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center opacity-70">
              <ShoppingBag className="w-16 h-16 text-[#8B5E3C]/30 mb-4" />
              <p className="font-judul text-xl font-bold text-[#4B2E1C] mb-2">Keranjang Kosong</p>
              <p className="font-teks text-sm text-[#8B5E3C]">Yuk, eksplorasi biji kopi terbaik kami!</p>
            </div>
          ) : (
            items.map((item: any) => (
              <div key={item.id} className="flex gap-4 bg-white p-4 rounded-2xl border border-[#8B5E3C]/10 shadow-sm">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-[#FDF6EE] flex-shrink-0">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-judul font-bold text-[#4B2E1C] text-sm line-clamp-2">{item.name}</h3>
                    <button onClick={() => removeItem(item.id)} className="text-[#8B5E3C]/50 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <p className="font-teks font-black text-[#D4956A] text-sm">Rp {item.price.toLocaleString('id-ID')}</p>
                    <div className="flex items-center gap-3 bg-[#FDF6EE] rounded-lg p-1 border border-[#8B5E3C]/10">
                      <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="p-1 text-[#4B2E1C] hover:bg-white rounded-md shadow-sm">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-bold text-xs w-4 text-center text-[#4B2E1C]">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 text-[#4B2E1C] hover:bg-white rounded-md shadow-sm">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Checkout */}
        {items.length > 0 && (
          <div className="p-6 bg-white border-t border-[#8B5E3C]/10">
            <div className="flex justify-between items-center mb-6">
              <span className="font-teks text-[#8B5E3C] font-bold">Total Belanja</span>
              <span className="font-judul text-2xl font-black text-[#4B2E1C]">Rp {total.toLocaleString('id-ID')}</span>
            </div>
            <Link href="/checkout" onClick={closeCart} className="w-full py-4 bg-[#4B2E1C] text-[#FDF6EE] rounded-xl font-bold hover:bg-[#8B5E3C] transition-all flex items-center justify-center gap-2 group shadow-lg hover:shadow-xl hover:-translate-y-0.5">
              Checkout Sekarang <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        )}
      </div>
    </>
  );
}