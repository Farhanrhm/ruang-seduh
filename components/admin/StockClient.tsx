"use client";

import { useState } from "react";
import { restockProduct } from "@/app/actions/stock";
import { toast } from "react-hot-toast";

type Product = {
  id: string;
  name: string;
  stock: number;
  isActive: boolean;
};

export default function StockClient({ products }: { products: Product[] }) {
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [quantity, setQuantity] = useState<number | "">("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return toast.error("Pilih produk dulu");
    if (!quantity || quantity === 0) return toast.error("Masukkan jumlah yang valid (min/plus)");

    setIsSubmitting(true);
    const res = await restockProduct(selectedProduct, Number(quantity), notes);
    
    if (res.success) {
      toast.success("Stok berhasil diperbarui!");
      setSelectedProduct("");
      setQuantity("");
      setNotes("");
    } else {
      toast.error(res.error || "Gagal update stok");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Update Stok Manual</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Produk (SKU)</label>
          <select 
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="w-full border-gray-300 rounded-lg shadow-sm focus:border-black focus:ring-black"
            required
          >
            <option value="" disabled>-- Pilih Produk --</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} (Sisa: {p.stock})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah</label>
            <input 
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value ? Number(e.target.value) : "")}
              placeholder="Contoh: 10 atau -2"
              className="w-full border-gray-300 rounded-lg shadow-sm focus:border-black focus:ring-black"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Gunakan minus (-) untuk koreksi kurang</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Catatan</label>
            <input 
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Mis: Restock Mingguan"
              className="w-full border-gray-300 rounded-lg shadow-sm focus:border-black focus:ring-black"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-black text-white font-medium py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50"
        >
          {isSubmitting ? "Menyimpan..." : "Simpan Perubahan Stok"}
        </button>
      </form>
    </div>
  );
}
