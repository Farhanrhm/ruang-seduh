"use client";

import { useCartStore } from "@/store/useCartStore";
import TombolLoginGate from "./TombolLoginGate";
import { ShoppingBag } from "lucide-react";

function formatRupiah(amount: number): string {
  return "Rp " + amount.toLocaleString("id-ID");
}

export default function AuthPromptCheckout() {
  const items = useCartStore((state) => state.items);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);

  return (
    <div className="min-h-screen bg-[#FDF6EE] flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg border border-[#D4956A]/20">
        {/* Header */}
        <div className="p-8 pb-0 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#D4956A]/10 mb-4">
            <ShoppingBag className="w-7 h-7 text-[#D4956A]" />
          </div>
          <h2 className="text-xl font-semibold text-[#4B2E1C] mb-2">
            Masuk untuk Melanjutkan Checkout
          </h2>
          <p className="text-[#8B5E3C] text-sm leading-relaxed">
            Kamu perlu masuk terlebih dahulu untuk menyelesaikan pesanan.
            Tenang, item di keranjangmu akan tetap tersimpan setelah login.
          </p>
        </div>

        {/* Cart summary */}
        {items.length > 0 && (
          <div className="mx-8 mt-6 rounded-xl border border-[#D4956A]/20 overflow-hidden">
            <div className="bg-[#FDF6EE] px-4 py-2 border-b border-[#D4956A]/20">
              <span className="text-xs font-medium text-[#8B5E3C] uppercase tracking-wide">
                Ringkasan Keranjang
              </span>
            </div>
            <ul className="divide-y divide-[#D4956A]/10">
              {items.map((item) => (
                <li key={item.id} className="flex items-center justify-between px-4 py-3 gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#4B2E1C] truncate">{item.name}</p>
                    <p className="text-xs text-[#8B5E3C]">
                      {item.quantity} × {formatRupiah(item.price)}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-[#4B2E1C] shrink-0">
                    {formatRupiah(item.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between px-4 py-3 bg-[#FDF6EE] border-t border-[#D4956A]/20">
              <span className="text-sm font-semibold text-[#4B2E1C]">Total</span>
              <span className="text-sm font-bold text-[#4B2E1C]">
                {formatRupiah(getTotalPrice())}
              </span>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="p-8 pt-6 text-center">
          <TombolLoginGate callbackUrl="/checkout" />
        </div>
      </div>
    </div>
  );
}
