"use client";

import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, PackageX, ChevronDown } from "lucide-react";
import ProductCard from "@/components/ProductCard";

const CATEGORIES = ["SEMUA", "BIJI KOPI", "ALAT SEDUH", "AKSESORIS"];
const SORT_OPTIONS = [
  { value: "newest", label: "Terbaru" },
  { value: "price_asc", label: "Harga Terendah" },
  { value: "price_desc", label: "Harga Tertinggi" },
];

export default function KatalogToko({ initialProducts }: { initialProducts: any[] }) {
  const [activeCategory, setActiveCategory] = useState("SEMUA");
  const [sortBy, setSortBy] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = useMemo(() => {
    let result = initialProducts.filter((p) => {
      const matchCategory = activeCategory === "SEMUA" || p.category === activeCategory;
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });

    if (sortBy === "price_asc") result = result.sort((a, b) => a.price - b.price);
    if (sortBy === "price_desc") result = result.sort((a, b) => b.price - a.price);
    if (sortBy === "newest") result = result.sort((a, b) => new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime());

    return result;
  }, [activeCategory, sortBy, searchQuery, initialProducts]);

  return (
    <>
      <div className="mb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div>
            <h1 className="font-judul text-5xl md:text-6xl font-black text-[#4B2E1C] mb-6 tracking-tighter">Pasar Kopi</h1>
            <p className="font-teks text-[#8B5E3C] text-lg max-w-2xl leading-relaxed">
              Biji kopi pilihan nusantara dan alat seduh berkualitas untuk mendukung ritual kopimu di rumah.
            </p>
          </div>
          
          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B5E3C]/50 group-focus-within:text-[#D4956A] transition-colors" />
            <input 
              type="text" 
              placeholder="Cari produk..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-5 py-4 bg-white rounded-2xl border border-[#8B5E3C]/10 focus:outline-none focus:ring-2 focus:ring-[#D4956A] transition-all shadow-sm font-teks placeholder:text-[#8B5E3C]/40"
            />
          </div>
        </div>

        {/* Filter & Sort Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-4 rounded-3xl border border-[#8B5E3C]/5 shadow-sm">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 lg:pb-0">
            <SlidersHorizontal className="w-4 h-4 text-[#8B5E3C] mr-2 flex-shrink-0" />
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  activeCategory === cat ? "bg-[#4B2E1C] text-white shadow-md scale-105" : "bg-[#FDF6EE] text-[#8B5E3C] hover:bg-[#8B5E3C]/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 border-t lg:border-t-0 pt-4 lg:pt-0 border-[#8B5E3C]/5">
            <span className="text-xs font-bold text-[#8B5E3C] uppercase tracking-wider hidden sm:block">Urutkan:</span>
            <div className="relative flex-1 sm:flex-initial">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none w-full bg-[#FDF6EE] border-none rounded-xl pl-5 pr-10 py-2.5 text-xs font-black text-[#4B2E1C] uppercase tracking-widest focus:ring-2 focus:ring-[#D4956A] cursor-pointer"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D4956A] pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-32 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-8 shadow-xl border border-[#D4956A]/10">
            <PackageX className="w-12 h-12 text-[#D4956A] opacity-20" />
          </div>
          <h2 className="font-judul text-3xl font-black text-[#4B2E1C] mb-3">Produk Tidak Ditemukan</h2>
          <p className="font-teks text-[#8B5E3C] max-w-md mx-auto leading-relaxed">
            Belum ada produk dari Admin atau pencarian tidak cocok.
          </p>
        </div>
      )}
    </>
  );
}