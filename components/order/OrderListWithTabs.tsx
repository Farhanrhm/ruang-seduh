"use client";

import { useState } from "react";
import OrderCard from "./OrderCard";
import { PackageOpen } from "lucide-react";

type OrderItem = {
  id: string;
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  price: number;
  grindSize?: string | null;
  product?: {
    id: string;
    price: number;
    isActive: boolean;
    stock: number;
    imageUrl?: string | null;
    grindOptions: string[];
  } | null;
};

type Order = {
  id: string;
  status: string;
  createdAt: Date;
  recipientName: string;
  city: string;
  paymentType?: string | null;
  totalAmount: number;
  snapToken?: string | null;
  items: OrderItem[];
};

const TABS = [
  { id: "ALL", label: "Semua" },
  { id: "PENDING", label: "Perlu Dibayar" },
  { id: "PAID", label: "Diproses" },
  { id: "SHIPPED", label: "Dikirim" },
  { id: "DELIVERED", label: "Selesai" },
  { id: "CANCELLED", label: "Dibatalkan" },
];

export default function OrderListWithTabs({ orders }: { orders: Order[] }) {
  const [activeTab, setActiveTab] = useState("ALL");
  const [displayCount, setDisplayCount] = useState(5);

  // Helper untuk menentukan status fiktif (khusus UI) bagi pesanan yang mati
  const getDisplayStatus = (o: Order) => {
    if (o.status === "PENDING" && !o.snapToken) {
      return "CANCELLED"; // Dianggap kedaluwarsa/batal secara UI
    }
    return o.status;
  };

  const getFilteredOrders = () => {
    if (activeTab === "ALL") {
      // Sembunyikan CANCELLED (termasuk PENDING yang kedaluwarsa) dari tab Semua
      return orders.filter(o => getDisplayStatus(o) !== "CANCELLED");
    }
    return orders.filter(o => getDisplayStatus(o) === activeTab);
  };

  const getCount = (tabId: string) => {
    if (tabId === "ALL") return orders.filter(o => getDisplayStatus(o) !== "CANCELLED").length;
    return orders.filter(o => getDisplayStatus(o) === tabId).length;
  };

  const filteredOrders = getFilteredOrders();
  const visibleOrders = filteredOrders.slice(0, displayCount);
  const hasMore = displayCount < filteredOrders.length;

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setDisplayCount(5); // Paginasi selalu di-reset ke 5 saat berpindah tab
  };

  return (
    <div className="space-y-6">
      {/* Scrollable Tabs */}
      <div className="relative -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-2">
          {TABS.map((tab) => {
            const count = getCount(tab.id);
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`whitespace-nowrap flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  isActive 
                    ? "bg-[#4B2E1C] text-[#FDF6EE] shadow-md" 
                    : "bg-white text-[#8B5E3C] border border-[#8B5E3C]/10 hover:border-[#8B5E3C]/30 hover:bg-[#FDF6EE]"
                }`}
              >
                {tab.label}
                <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                  isActive ? "bg-[#FDF6EE]/20 text-[#FDF6EE]" : "bg-[#8B5E3C]/10 text-[#8B5E3C]"
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* List Pesanan */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl text-center border border-[#8B5E3C]/10 shadow-sm flex flex-col items-center animate-in fade-in">
          <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mb-4">
            <PackageOpen className="w-8 h-8" />
          </div>
          <h3 className="font-judul text-lg font-bold text-[#4B2E1C] mb-1">
            Kosong
          </h3>
          <p className="font-teks text-sm text-[#8B5E3C]">
            Tidak ada pesanan dengan status ini.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {visibleOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
          
          {hasMore && (
            <div className="pt-2 pb-4 text-center">
              <button 
                onClick={() => setDisplayCount(prev => prev + 5)}
                className="px-6 py-2.5 bg-white border border-[#8B5E3C]/20 text-[#8B5E3C] rounded-full text-sm font-bold hover:bg-[#FDF6EE] hover:text-[#4B2E1C] hover:border-[#4B2E1C] transition-all shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5E3C]/50"
              >
                Muat Lebih Banyak
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
