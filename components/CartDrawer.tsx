"use client";

import Image from "next/image";
import Link from "next/link";
import { X, Trash2, ShoppingBag, Plus, Minus } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useCartHydration } from "@/lib/hooks/useCartHydration";
import { useState, useEffect, useCallback } from "react";

export default function CartDrawer() {
  const isHydrated = useCartHydration();
  const { items, removeItem, updateQuantity, isOpenCart, closeCart } = useCartStore();
  const [isVisible, setIsVisible] = useState(false);

  const total = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

  // Sinkronisasi isVisible dengan isOpenCart — mengaktifkan slide-in dan slide-out via CSS transition
  useEffect(() => {
    setIsVisible(isOpenCart);
  }, [isOpenCart]);

  // Tutup drawer dengan slide-out terlebih dahulu, baru unmount data
  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(closeCart, 280); // sesuai durasi transition-transform di bawah
  }, [closeCart]);

  // Escape key untuk menutup drawer — DESIGN.md §5 aksesibilitas
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpenCart) handleClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpenCart, handleClose]);

  if (!isHydrated) return null;

  return (
    <>
      {/* Backdrop — fade-in/out bersamaan dengan slide drawer */}
      <div
        className={`fixed inset-0 bg-[#4B2E1C]/40 backdrop-blur-sm z-[60] transition-opacity duration-300 ${
          isVisible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Drawer Panel — slide dari kanan */}
      <div
        className={`fixed inset-y-0 right-0 w-full sm:w-[400px] bg-[#FDF6EE] shadow-2xl z-[60] flex flex-col transition-transform duration-300 ease-in-out ${
          isVisible ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-label="Keranjang belanja"
        aria-modal="true"
      >
        {/* Header Drawer */}
        <div className="p-6 border-b border-[#8B5E3C]/10 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-[#D4956A]" />
            <h2 className="font-judul text-xl font-black text-[#4B2E1C]">Keranjangmu</h2>
            <span className="bg-[#D4956A]/10 text-[#D4956A] text-[10px] font-bold px-2 py-1 rounded-full">
              {items.length} item
            </span>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-[#8B5E3C] hover:bg-red-50 hover:text-red-500 rounded-xl transition-all"
            aria-label="Tutup Keranjang"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Isi Keranjang */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="w-24 h-24 bg-[#FDF6EE] rounded-full flex items-center justify-center mb-6 shadow-inner border border-[#8B5E3C]/10">
                <ShoppingBag className="w-10 h-10 text-[#D4956A]" />
              </div>
              <p className="font-judul text-2xl font-black text-[#4B2E1C] mb-3">Keranjang Masih Kosong</p>
              <p className="font-teks text-[#8B5E3C] leading-relaxed mb-8">
                Belum ada biji kopi yang kamu pilih. Yuk, mulai jelajahi koleksi kopi terbaik kami untuk menemani hari-harimu!
              </p>
              <Link 
                href="/toko" 
                onClick={closeCart}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#4B2E1C] text-[#FDF6EE] rounded-xl font-bold hover:bg-[#8B5E3C] transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] focus:ring-offset-2"
              >
                Mulai Belanja
              </Link>
            </div>
          ) : (
            items.map((item: any, index: number) => (
              <div
                key={item.id}
                className="cart-item-enter flex gap-4 bg-white p-4 rounded-2xl border border-[#8B5E3C]/10 shadow-sm"
                style={{ animationDelay: `${50 + index * 60}ms` }}
              >
                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-[#FDF6EE] flex-shrink-0 flex items-center justify-center border border-[#8B5E3C]/10">
                  {item.image ? (
                    <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
                  ) : (
                    <ShoppingBag className="w-8 h-8 text-[#D4956A]/50" />
                  )}
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-judul font-bold text-[#4B2E1C] text-sm line-clamp-2">{item.name}</h3>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-[#8B5E3C]/50 hover:text-red-500 transition-colors flex-shrink-0"
                      aria-label={`Hapus ${item.name}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <p className="font-teks font-black text-[#D4956A] text-sm price">
                      Rp {item.price.toLocaleString("id-ID")}
                    </p>
                    <div className="flex items-center gap-3 bg-[#FDF6EE] rounded-lg p-1 border border-[#8B5E3C]/10">
                      <button
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="p-1 text-[#4B2E1C] hover:bg-white rounded-md shadow-sm transition-colors"
                        aria-label="Kurangi jumlah"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-bold text-xs w-4 text-center text-[#4B2E1C] quantity">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 text-[#4B2E1C] hover:bg-white rounded-md shadow-sm transition-colors"
                        aria-label="Tambah jumlah"
                      >
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
              <span className="font-judul text-2xl font-black text-[#4B2E1C] price">
                Rp {total.toLocaleString("id-ID")}
              </span>
            </div>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="w-full py-4 bg-[#4B2E1C] text-[#FDF6EE] rounded-xl font-bold hover:bg-[#8B5E3C] transition-all flex items-center justify-center shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Checkout Sekarang
            </Link>
          </div>
        )}
      </div>
    </>
  );
}