"use client";

import { ShoppingBag, Coffee, Package, Plus } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import toast from "react-hot-toast";

// Data Dummy Produk Toko
const DUMMY_PRODUCTS = [
  { id: "p1", name: "Gayo Washed 200g", price: 85000, category: "Biji Kopi", image: "https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&q=80&w=500" },
  { id: "p2", name: "Toraja Sapan 200g", price: 95000, category: "Biji Kopi", image: "https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&q=80&w=500" },
  { id: "p3", name: "Hario V60 Dripper", price: 120000, category: "Alat Seduh", image: "https://images.unsplash.com/photo-1544681280-d2dc270bc555?auto=format&fit=crop&q=80&w=500" },
  { id: "p4", name: "Kertas Filter V60 (100pcs)", price: 45000, category: "Aksesoris", image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=500" },
];

export default function TokoPage() {
  const addItem = useCartStore((state) => state.addItem);

  // Fungsi format mata uang Rupiah
  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(angka);
  };

  return (
    <div className="bg-[#FDF6EE] min-h-screen pt-16 pb-24 text-[#4B2E1C]">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        
        {/* Header Toko */}
        <div className="mb-12 border-b border-[#8B5E3C]/10 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="font-judul text-4xl md:text-5xl font-black text-[#4B2E1C] mb-4 tracking-tighter">Pasar Kopi</h1>
            <p className="font-teks text-[#8B5E3C] text-lg max-w-2xl leading-relaxed">
              Biji kopi pilihan nusantara dan alat seduh berkualitas untuk mendukung ritual kopimu di rumah.
            </p>
          </div>
        </div>

        {/* Grid Produk */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {DUMMY_PRODUCTS.map((product: any) => (
            <div key={product.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-[#8B5E3C]/10 flex flex-col group">
              {/* Gambar Produk */}
              <div className="h-48 overflow-hidden relative">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-[#8B5E3C] uppercase tracking-wider shadow-sm">
                  {product.category}
                </div>
              </div>
              
              {/* Info Produk */}
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-judul text-lg font-bold text-[#4B2E1C] mb-1 leading-tight">{product.name}</h3>
                <p className="font-teks text-[#D4956A] font-black text-lg mb-4">{formatRupiah(product.price)}</p>
                
                {/* Tombol Add to Cart */}
                <button 
                  onClick={() => {
                    addItem(product);
                    toast.success(`${product.name} ditambahkan ke keranjang!`, {
                      icon: '☕',
                      style: {
                        borderRadius: '12px',
                        background: '#4B2E1C',
                        color: '#FDF6EE',
                        fontFamily: 'var(--font-teks)',
                      },
                    });
                  }}
                  className="mt-auto w-full py-3 bg-[#FDF6EE] text-[#4B2E1C] border border-[#8B5E3C]/20 rounded-xl font-bold hover:bg-[#4B2E1C] hover:text-[#FDF6EE] transition-all flex items-center justify-center gap-2 text-sm shadow-sm group-hover:border-[#4B2E1C]"
                >
                  <Plus className="w-4 h-4" /> Masukkan Keranjang
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}