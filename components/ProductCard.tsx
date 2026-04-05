"use client";

import Image from "next/image";
import { useState } from "react";
import { Plus, Coffee, Loader2 } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { urlFor } from "@/sanity/lib/image";
import toast from "react-hot-toast";

export default function ProductCard({ product }: { product: any }) {
  const [imgError, setImgError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const addItem = useCartStore((state: any) => state.addItem);

  const formatRupiah = (price: number) => 
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

  const displayImage = product.imageUrl 
    ? product.imageUrl 
    : (product.sanityImage ? urlFor(product.sanityImage).url() : "");

  return (
    <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-[#8B5E3C]/10 flex flex-col group h-full">
      <div className="relative h-64 overflow-hidden bg-[#FDF6EE] flex items-center justify-center">
        {isLoading && !imgError && (
          <div className="absolute inset-0 bg-[#8B5E3C]/5 animate-pulse flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-[#D4956A]/20 animate-spin" />
          </div>
        )}

        {displayImage && !imgError ? (
          <Image
            src={displayImage}
            alt={product.name}
            fill
            className={`object-cover group-hover:scale-110 transition-transform duration-700 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
            onLoad={() => setIsLoading(false)}
            onError={() => { setImgError(true); setIsLoading(false); }}
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-[#8B5E3C]/30 p-6">
            <Coffee className="w-12 h-12 mb-2 opacity-20" />
            <span className="text-[9px] uppercase font-bold">Gambar tidak tersedia</span>
          </div>
        )}

        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[9px] font-black text-[#8B5E3C] uppercase tracking-widest shadow-sm">
          {product.category || "PRODUK"}
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="mb-5">
          <h3 className="font-judul text-xl font-bold text-[#4B2E1C] mb-1 leading-tight group-hover:text-[#D4956A] transition-colors line-clamp-2 min-h-[3rem]">
            {product.name}
          </h3>
          <p className="font-teks text-[#D4956A] font-black text-xl">{formatRupiah(product.price)}</p>
        </div>

        {product.category === 'BIJI KOPI' ? (
          <div className="mb-6 space-y-4 flex-1">
            {/* Area Badge (Lokal/Impor, Roast, Process) */}
            <div className="flex flex-wrap gap-2">
              {/* Badge Lokal / Impor */}
              {product.originCategory && (
                <span className={`text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider border ${
                  product.originCategory === 'LOKAL' 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                    : 'bg-blue-50 text-blue-700 border-blue-200'
                }`}>
                  {product.originCategory === 'LOKAL' ? '🇮🇩 LOKAL' : '✈️ IMPOR'}
                </span>
              )}

              {product.roast && <span className="text-[10px] bg-[#4B2E1C] text-white px-2.5 py-1 rounded-md font-bold uppercase tracking-wider">{product.roast}</span>}
              {product.process && <span className="text-[10px] bg-[#D4956A]/10 text-[#D4956A] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider">{product.process}</span>}
            </div>
            
            {product.notes && product.notes.length > 0 && (
              <div className="bg-[#FDF6EE] p-3 rounded-xl border border-[#8B5E3C]/10">
                <p className="text-[9px] uppercase tracking-widest font-black text-[#8B5E3C] mb-1">Tasting Notes</p>
                <p className="text-xs font-teks text-[#4B2E1C] italic font-medium leading-relaxed">
                  "{product.notes.join(" • ")}"
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="mb-6 flex-1">
             <p className="text-[9px] uppercase tracking-widest font-black text-[#8B5E3C] mb-1">Description</p>
             <p className="text-sm font-teks text-[#8B5E3C] leading-relaxed line-clamp-3">{product.description}</p>
          </div>
        )}

        <div className="mt-auto pt-2">
          <button
            onClick={() => {
              addItem({ id: product.id, name: product.name, price: product.price, image: displayImage || "", quantity: 1 });
              toast.success(`${product.name} ditambahkan!`, { style: { background: '#4B2E1C', color: '#FDF6EE' } });
            }}
            className="w-full py-3.5 bg-[#FDF6EE] text-[#4B2E1C] border-2 border-[#8B5E3C]/10 rounded-2xl font-bold hover:bg-[#4B2E1C] hover:text-[#FDF6EE] hover:border-[#4B2E1C] transition-all flex items-center justify-center gap-2 text-sm shadow-sm"
          >
            <Plus className="w-5 h-5" /> Masukkan Keranjang
          </button>
        </div>
      </div>
    </div>
  );
}