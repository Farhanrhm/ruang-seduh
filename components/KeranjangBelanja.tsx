"use client";

import { useState, useEffect } from "react";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

export default function KeranjangBelanja() {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  const { openCart, getTotalItems } = useCartStore();

  if (!isMounted) return null;

  return (
    <button onClick={openCart} className="relative p-2 text-[#4B2E1C] hover:bg-black/5 rounded-full transition-colors flex items-center justify-center">
      <ShoppingBag className="w-5 h-5" />
      {getTotalItems() > 0 && (
        <span className="absolute -top-1 -right-1 bg-[#D4956A] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#FDF6EE]">
          {getTotalItems()}
        </span>
      )}
    </button>
  );
}