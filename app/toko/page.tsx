"use client";

import { useState, useMemo } from "react";
import { Coffee, Search, SlidersHorizontal, PackageX, ChevronDown } from "lucide-react";
import ProductCard, { Product } from "@/components/ProductCard";

// DATA PRODUK NYATA (20+ Items)
const PRODUCTS: Product[] = [
  // 1. Kategori: Biji Kopi (8)
  { id: "c1", name: "Kopi Gayo Washed 200g", price: 85000, category: "BIJI KOPI", image: "https://images.unsplash.com/photo-1559525839-b184a4d698c7?w=400&h=400&fit=crop&q=80", origin: "Aceh Tengah", process: "Washed", roast: "Medium", notes: ["Coklat", "Karamel", "Jeruk"], createdAt: "2024-01-01" },
  { id: "c2", name: "Kopi Toraja Sapan 200g", price: 95000, category: "BIJI KOPI", image: "https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=400&h=400&fit=crop&q=80", origin: "Toraja, Sulawesi", process: "Wet Hulled", roast: "Medium-Dark", notes: ["Earthy", "Dark Chocolate", "Herbal"], createdAt: "2024-01-02" },
  { id: "c3", name: "Kopi Flores Bajawa 200g", price: 90000, category: "BIJI KOPI", image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop&q=80", origin: "Ngada, Flores", process: "Natural", roast: "Medium", notes: ["Berry", "Floral", "Brown Sugar"], createdAt: "2024-01-03" },
  { id: "c4", name: "Kopi Java Preanger 200g", price: 88000, category: "BIJI KOPI", image: "https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?w=400&h=400&fit=crop&q=80", origin: "Bandung, Jawa Barat", process: "Washed", roast: "Medium", notes: ["Citrus", "Nutty", "Clean"], createdAt: "2024-01-04" },
  { id: "c5", name: "Kopi Mandailing Natural 200g", price: 92000, category: "BIJI KOPI", image: "https://images.unsplash.com/photo-1498804103079-a6351b050096?w=400&h=400&fit=crop&q=80", origin: "Tapanuli Selatan", process: "Natural", roast: "Medium-Dark", notes: ["Fruity", "Full Body", "Dark Chocolate"], createdAt: "2024-01-05" },
  { id: "c6", name: "Kopi Bali Kintamani 200g", price: 87000, category: "BIJI KOPI", image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop&q=80", origin: "Kintamani, Bali", process: "Wet Hulled", roast: "Medium", notes: ["Jeruk", "Lemon", "Brown Sugar"], createdAt: "2024-01-06" },
  { id: "c7", name: "Kopi Papua Wamena 200g", price: 110000, category: "BIJI KOPI", image: "https://images.unsplash.com/photo-1511537190424-bbbab87ac5eb?w=400&h=400&fit=crop&q=80", origin: "Wamena, Papua", process: "Washed", roast: "Medium", notes: ["Floral", "Clean", "Sweet Caramel"], createdAt: "2024-01-07" },
  { id: "c8", name: "Kopi Sumatra Lintong 200g", price: 89000, category: "BIJI KOPI", image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=400&fit=crop&q=80", origin: "Humbang Hasundutan", process: "Wet Hulled", roast: "Dark", notes: ["Earthy", "Cedar", "Dark Chocolate"], createdAt: "2024-01-08" },
  
  // 2. Kategori: Alat Seduh (6)
  { id: "b1", name: "Hario V60 Dripper (Plastik)", price: 120000, category: "ALAT SEDUH", image: "https://images.unsplash.com/photo-1544194215-541c2d3561a4?w=400&h=400&fit=crop&q=80", description: "Bahan: Plastik food-grade | Ukuran: 02 | Warna: Merah/Putih/Hitam", createdAt: "2024-01-09" },
  { id: "b2", name: "Chemex 6 Cup", price: 450000, category: "ALAT SEDUH", image: "https://images.unsplash.com/photo-1580915411954-282cb1b0d780?w=400&h=400&fit=crop&q=80", description: "Bahan: Borosilicate glass | Kapasitas: 900ml", createdAt: "2024-01-10" },
  { id: "b3", name: "Aeropress Original", price: 550000, category: "ALAT SEDUH", image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=400&fit=crop&q=80", description: "Brand: AeroPress Inc. | Includes: 350 filter papers", createdAt: "2024-01-11" },
  { id: "b4", name: "French Press Bodum 350ml", price: 285000, category: "ALAT SEDUH", image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop&q=80", description: "Brand: Bodum | Bahan: Borosilicate glass + stainless steel | Kapasitas: 350ml", createdAt: "2024-01-12" },
  { id: "b5", name: "Moka Pot Bialetti 3 Cup", price: 320000, category: "ALAT SEDUH", image: "https://images.unsplash.com/photo-1544191959-2383e524235e?w=400&h=400&fit=crop&q=80", description: "Brand: Bialetti | Bahan: Aluminium | Kapasitas: 3 cup (150ml)", createdAt: "2024-01-13" },
  { id: "b6", name: "Clever Dripper", price: 180000, category: "ALAT SEDUH", image: "https://images.unsplash.com/photo-1544194215-541c2d3561a4?w=400&h=400&fit=crop&q=80", description: "Bahan: BPA-free plastic | Ukuran: Large (500ml)", createdAt: "2024-01-14" },

  // 3. Kategori: Aksesoris (6)
  { id: "a1", name: "Kertas Filter V60 100pcs", price: 45000, category: "AKSESORIS", image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=400&fit=crop&q=80", description: "Kompatibel: Hario V60 Size 02 | Bahan: Unbleached paper", createdAt: "2024-01-15" },
  { id: "a2", name: "Timbangan Kopi Digital Timemore", price: 380000, category: "AKSESORIS", image: "https://images.unsplash.com/photo-1498804103079-a6351b050096?w=400&h=400&fit=crop&q=80", description: "Brand: Timemore | Kapasitas: 2000g | Akurasi: 0.1g", createdAt: "2024-01-16" },
  { id: "a3", name: "Gooseneck Kettle Brewista 600ml", price: 350000, category: "AKSESORIS", image: "https://images.unsplash.com/photo-1577968897966-3d4325b36b61?w=400&h=400&fit=crop&q=80", description: "Brand: Brewista | Kapasitas: 600ml | Bahan: Stainless steel", createdAt: "2024-01-17" },
  { id: "a4", name: "Grinder Manual Hario Skerton Pro", price: 420000, category: "AKSESORIS", image: "https://images.unsplash.com/photo-1559525839-b184a4d698c7?w=400&h=400&fit=crop&q=80", description: "Brand: Hario | Bahan: Ceramic burr | Kapasitas: 100g", createdAt: "2024-01-18" },
  { id: "a5", name: "Server/Carafe Hario 600ml", price: 150000, category: "AKSESORIS", image: "https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=400&h=400&fit=crop&q=80", description: "Brand: Hario | Bahan: Borosilicate glass | Kapasitas: 600ml", createdAt: "2024-01-19" },
  { id: "a6", name: "Cleaning Tablet Cafiza 8pcs", price: 95000, category: "AKSESORIS", image: "https://images.unsplash.com/photo-1511537190424-bbbab87ac5eb?w=400&h=400&fit=crop&q=80", description: "Brand: Illy | Digunakan untuk membersihkan peralatan kopi", createdAt: "2024-01-20" },
];

const CATEGORIES = ["SEMUA", "BIJI KOPI", "ALAT SEDUH", "AKSESORIS"];
const SORT_OPTIONS = [
  { value: "newest", label: "Terbaru" },
  { value: "price_asc", label: "Harga Terendah" },
  { value: "price_desc", label: "Harga Tertinggi" },
];

export default function TokoPage() {
  const [activeCategory, setActiveCategory] = useState("SEMUA");
  const [sortBy, setSortBy] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = useMemo(() => {
    let result = PRODUCTS.filter((p) => {
      const matchCategory = activeCategory === "SEMUA" || p.category === activeCategory;
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });

    if (sortBy === "price_asc") result = result.sort((a, b) => a.price - b.price);
    if (sortBy === "price_desc") result = result.sort((a, b) => b.price - a.price);
    if (sortBy === "newest") result = result.sort((a, b) => new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime());

    return result;
  }, [activeCategory, sortBy, searchQuery]);

  return (
    <div className="bg-[#FDF6EE] min-h-screen pt-24 pb-24 text-[#4B2E1C]">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        
        {/* Header Toko dengan Layout Baru */}
        <div className="mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div>
              <h1 className="font-judul text-5xl md:text-6xl font-black text-[#4B2E1C] mb-6 tracking-tighter">Pasar Kopi</h1>
              <p className="font-teks text-[#8B5E3C] text-lg max-w-2xl leading-relaxed">
                Biji kopi pilihan nusantara dan alat seduh berkualitas untuk mendukung ritual kopimu di rumah.
              </p>
            </div>
            
            {/* Search Bar Mobile/Desktop */}
            <div className="relative w-full md:w-80 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B5E3C]/50 group-focus-within:text-[#D4956A] transition-colors" />
              <input 
                type="text" 
                placeholder="Cari produk favoritmu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-5 py-4 bg-white rounded-2xl border border-[#8B5E3C]/10 focus:outline-none focus:ring-2 focus:ring-[#D4956A] focus:border-transparent transition-all shadow-sm font-teks placeholder:text-[#8B5E3C]/40"
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
                    activeCategory === cat 
                      ? "bg-[#4B2E1C] text-white shadow-md scale-105" 
                      : "bg-[#FDF6EE] text-[#8B5E3C] hover:bg-[#8B5E3C]/10"
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

        {/* Grid Produk atau Empty State */}
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
              Maaf, kami tidak menemukan produk yang Anda cari. Coba ubah filter kategori atau kata kunci pencarian Anda.
            </p>
            <button 
              onClick={() => { setActiveCategory("SEMUA"); setSearchQuery(""); }}
              className="mt-10 px-8 py-3.5 bg-[#4B2E1C] text-[#FDF6EE] rounded-full font-bold hover:bg-[#8B5E3C] transition-all shadow-lg"
            >
              Reset Semua Filter
            </button>
          </div>
        )}

      </div>
    </div>
  );
}