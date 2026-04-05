"use client";

import Image from "next/image";
import { useState } from "react";
import { Plus, Coffee, AlertCircle, Loader2 } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import toast from "react-hot-toast";

export interface Product {
  id: string;
  name: string;
  price: number;
  category: 'BIJI KOPI' | 'ALAT SEDUH' | 'AKSESORIS';
  image: string;
  description?: string;
  origin?: string;
  process?: string;
  roast?: string;
  notes?: string[];
  createdAt?: string;
}

export default function ProductCard({ product }: { product: Product }) {
  const [imgError, setImgError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);

  const formatRupiah = (price: number) => 
    new Intl.NumberFormat('id-ID', { 
      style: 'currency', 
      currency: 'IDR',
      minimumFractionDigits: 0 
    }).format(price);

  return (
    <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-[#8B5E3C]/10 flex flex-col group h-full">
      {/* Container Gambar dengan Aspect Ratio & Skeleton */}
      <div className="relative h-64 overflow-hidden bg-[#FDF6EE] flex items-center justify-center">
        {isLoading && !imgError && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }}>
            <div className="w-full h-full bg-[#8B5E3C]/5 animate-pulse flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-[#D4956A]/20 animate-spin" />
            </div>
          </div>
        )}

        {!imgError ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className={`object-cover group-hover:scale-110 transition-transform duration-700 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setImgError(true);
              setIsLoading(false);
            }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-[#8B5E3C]/30 p-6 text-center">
            <Coffee className="w-12 h-12 mb-2 opacity-20" />
            <p className="text-[10px] font-bold uppercase tracking-widest">{product.name}</p>
            <span className="text-[9px] mt-1 opacity-50 uppercase">Gambar tidak tersedia</span>
          </div>
        )}

        {/* Badge Kategori dengan Posisi Konsisten */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[9px] font-black text-[#8B5E3C] uppercase tracking-widest shadow-sm border border-[#8B5E3C]/5">
          {product.category}
        </div>
      </div>

      {/* Konten Produk */}
      <div className="p-6 flex flex-col flex-1">
        <div className="mb-4">
          <h3 className="font-judul text-xl font-bold text-[#4B2E1C] mb-1 leading-tight group-hover:text-[#D4956A] transition-colors line-clamp-2 min-h-[3rem]">
            {product.name}
          </h3>
          <p className="font-teks text-[#D4956A] font-black text-xl">
            {formatRupiah(product.price)}
          </p>
        </div>

        {/* Detail Tambahan untuk Kopi (Info Roast/Notes) */}
        {product.category === 'BIJI KOPI' && (
          <div className="mb-6 space-y-2">
            <div className="flex flex-wrap gap-1.5">
              {product.roast && (
                <span className="text-[9px] bg-[#FDF6EE] text-[#8B5E3C] px-2 py-0.5 rounded-md font-bold border border-[#8B5E3C]/10 uppercase">
                  {product.roast} Roast
                </span>
              )}
              {product.process && (
                <span className="text-[9px] bg-white text-[#D4956A] px-2 py-0.5 rounded-md font-bold border border-[#D4956A]/20 uppercase">
                  {product.process}
                </span>
              )}
            </div>
            {product.notes && (
              <p className="text-[10px] text-[#8B5E3C] italic line-clamp-1">
                Notes: {product.notes.join(", ")}
              </p>
            )}
          </div>
        )}

        <div className="mt-auto">
          <button
            onClick={() => {
              addItem(product);
              toast.success(`${product.name} ditambahkan!`, {
                icon: '☕',
                style: {
                  borderRadius: '16px',
                  background: '#4B2E1C',
                  color: '#FDF6EE',
                  fontWeight: 'bold',
                },
              });
            }}
            className="w-full py-4 bg-[#FDF6EE] text-[#4B2E1C] border-2 border-[#8B5E3C]/10 rounded-2xl font-bold hover:bg-[#4B2E1C] hover:text-[#FDF6EE] hover:border-[#4B2E1C] transition-all duration-300 flex items-center justify-center gap-2 text-sm shadow-sm active:scale-95"
          >
            <Plus className="w-5 h-5" /> Masukkan Keranjang
          </button>
        </div>
      </div>
    </div>
  );
}
