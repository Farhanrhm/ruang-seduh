"use client";

import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import Link from "next/link";

export default function CartDrawer() {
  // Mencegah error Hydration di Next.js
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  const { items, isOpenCart, closeCart, addItem, decreaseQuantity, removeItem, getTotalPrice, getTotalItems } = useCartStore();

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(angka);
  };

  if (!isMounted) return null;

  return (
    <Transition.Root show={isOpenCart} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeCart}>
        
        {/* Latar Belakang Gelap (Overlay) dengan Animasi Fading */}
        <Transition.Child as={Fragment} enter="ease-in-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in-out duration-300" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              
              {/* Laci Keranjang (Slide-over) dengan Animasi Slide-In */}
              <Transition.Child as={Fragment} enter="transform transition ease-in-out duration-300" enterFrom="translate-x-full" enterTo="translate-x-0" leave="transform transition ease-in-out duration-300" leaveFrom="translate-x-0" leaveTo="translate-x-full">
                <Dialog.Panel className="pointer-events-auto h-full w-full sm:w-[450px] bg-white shadow-2xl flex flex-col">
                  
                  {/* Header Laci */}
                  <div className="p-6 border-b border-[#8B5E3C]/10 flex items-center justify-between bg-[#FDF6EE]">
                    <Dialog.Title className="font-judul text-3xl font-black text-[#4B2E1C] flex items-center gap-2 tracking-tighter">
                      <ShoppingBag className="w-7 h-7 text-[#D4956A]" /> Keranjangmu
                    </Dialog.Title>
                    <button onClick={closeCart} className="p-2.5 text-[#8B5E3C] hover:bg-white rounded-full transition-colors border border-transparent hover:border-[#8B5E3C]/20">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Daftar Barang dengan Scroll */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {items.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-[#8B5E3C]/60 space-y-4">
                        <ShoppingBag className="w-20 h-20 opacity-50" />
                        <p className="font-teks font-medium text-lg">Keranjang masih kosong.</p>
                      </div>
                    ) : (
                      items.map((item) => (
                        <div key={item.id} className="flex gap-4 items-center bg-white p-4 rounded-3xl border border-[#8B5E3C]/10 shadow-sm transition-all hover:shadow-md">
                          <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-2xl flex-shrink-0" />
                          <div className="flex-1">
                            <h3 className="font-judul text-xl font-bold text-[#4B2E1C] leading-tight mb-1 line-clamp-1">{item.name}</h3>
                            <p className="font-teks text-[#D4956A] font-black text-sm mb-3">{formatRupiah(item.price)}</p>
                            
                            {/* Kontrol Kuantitas */}
                            <div className="flex items-center gap-3 bg-[#FDF6EE] w-fit rounded-lg border border-[#8B5E3C]/20 p-1">
                              <button onClick={() => decreaseQuantity(item.id)} className="p-1.5 text-[#8B5E3C] hover:text-[#4B2E1C] transition-colors"><Minus className="w-4 h-4" /></button>
                              <span className="font-teks font-bold text-base w-5 text-center">{item.quantity}</span>
                              <button onClick={() => addItem(item)} className="p-1.5 text-[#8B5E3C] hover:text-[#4B2E1C] transition-colors"><Plus className="w-4 h-4" /></button>
                            </div>
                          </div>
                          <button onClick={() => removeItem(item.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-colors">
                            <Trash2 className="w-6 h-6" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Footer / Total Harga yang Rapi dan Sejajar */}
                  {items.length > 0 && (
                    <div className="p-6 border-t border-[#8B5E3C]/10 bg-white">
                      <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#8B5E3C]/10">
                        <span className="font-teks text-[#8B5E3C] text-lg font-medium">Total Belanja</span>
                        <span className="font-judul text-3xl font-black text-[#4B2E1C] tracking-tight">{formatRupiah(getTotalPrice())}</span>
                      </div>
                      <Link href="/checkout" onClick={() => closeCart()} className="w-full py-5 bg-[#D4956A] text-white rounded-2xl font-bold hover:bg-[#b57a52] transition-colors flex items-center justify-center gap-3 shadow-lg shadow-[#D4956A]/30 text-xl tracking-wide">
                        Checkout Sekarang <ArrowRight className="w-6 h-6" />
                      </Link>
                    </div>
                  )}

                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}