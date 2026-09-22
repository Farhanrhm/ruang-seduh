"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

export default function KeranjangBelanja() {
  const [isMounted, setIsMounted] = useState(false);
  const [isBouncing, setIsBouncing] = useState(false);
  const [badgeKey, setBadgeKey] = useState(0);

  // Ref untuk track apakah sudah melewati mount awal
  const isInitialized = useRef(false);
  const prevCountRef = useRef(0);

  const totalItems = useCartStore((state) => state.getTotalItems());
  const openCart = useCartStore((state) => state.openCart);

  useEffect(() => {
    // Inisialisasi — catat jumlah awal tanpa memicu animasi
    prevCountRef.current = totalItems;
    isInitialized.current = true;
    setIsMounted(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // Hanya jalankan setelah mount awal selesai
    if (!isInitialized.current) return;

    if (totalItems > prevCountRef.current) {
      // Item baru masuk — bounce ikon + pop badge
      setIsBouncing(true);
      setBadgeKey((k) => k + 1);
      const timer = setTimeout(() => setIsBouncing(false), 500);
      prevCountRef.current = totalItems;
      return () => clearTimeout(timer);
    }

    prevCountRef.current = totalItems;
  }, [totalItems]);

  const handleBounceEnd = useCallback(() => {
    setIsBouncing(false);
  }, []);

  if (!isMounted) return null;

  return (
    <button
      onClick={openCart}
      className="relative p-2 text-[#4B2E1C] hover:bg-black/5 rounded-full transition-colors flex items-center justify-center"
      aria-label="Buka keranjang belanja"
    >
      <ShoppingBag
        className={`w-5 h-5 ${isBouncing ? "cart-bounce" : ""}`}
        onAnimationEnd={handleBounceEnd}
      />
      {totalItems > 0 && (
        <span
          key={badgeKey}
          className="badge-pop absolute -top-1 -right-1 bg-[#D4956A] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#FDF6EE]"
        >
          {totalItems}
        </span>
      )}
    </button>
  );
}