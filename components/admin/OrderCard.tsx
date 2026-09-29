"use client";

import { useState } from "react";
import { updateOrderStatus, refundOrder } from "@/app/actions/admin";
import { OrderStatus } from "@prisma/client";
import { toast } from "react-hot-toast";

type OrderProps = {
  order: any; // Simplified for MVP
};

export default function OrderCard({ order }: OrderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resi, setResi] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatRupiah = (price: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);

  const handleProcess = async () => {
    setIsSubmitting(true);
    const res = await updateOrderStatus(order.id, "PROCESSING");
    if (res.success) {
      toast.success("Pesanan ditandai sedang diproses!");
    } else {
      toast.error(res.error || "Gagal mengubah status");
    }
    setIsSubmitting(false);
  };

  const handleShip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resi.trim()) return toast.error("Nomor resi wajib diisi");

    setIsSubmitting(true);
    const isCorrection = order.status === "SHIPPED";
    const res = await updateOrderStatus(order.id, "SHIPPED", resi, isCorrection);
    if (res.success) {
      toast.success(isCorrection ? "Resi berhasil dikoreksi!" : "Resi tersimpan & email telah dikirim!");
      setIsModalOpen(false);
    } else {
      toast.error(res.error || "Gagal menyimpan resi");
    }
    setIsSubmitting(false);
  };

  const handleDeliver = async () => {
    setIsSubmitting(true);
    const res = await updateOrderStatus(order.id, "DELIVERED");
    if (res.success) {
      toast.success("Pesanan ditandai selesai!");
    } else {
      toast.error(res.error || "Gagal mengubah status");
    }
    setIsSubmitting(false);
  };

  const handleRefund = async () => {
    if (!window.confirm("Yakin ingin membatalkan & refund pesanan ini? Stok akan otomatis dikembalikan.")) return;
    
    setIsSubmitting(true);
    const res = await refundOrder(order.id);
    if (res.success) {
      toast.success("Pesanan direfund & stok dikembalikan!");
    } else {
      toast.error(res.error || "Gagal refund pesanan");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
      <div className="flex justify-between items-start mb-3 border-b border-gray-50 pb-3">
        <div>
          <p className="text-xs text-gray-500 font-mono">#{order.id.slice(-8).toUpperCase()}</p>
          <p className="font-semibold text-gray-900 mt-1">{order.recipientName || order.user?.name}</p>
          <p className="text-sm text-gray-600">{order.recipientPhone || "-"}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">
            {new Date(order.createdAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
          </p>
          <span className="inline-block mt-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
            {order.status}
          </span>
        </div>
      </div>

      <div className="mb-4">
        <ul className="text-sm text-gray-700 space-y-1 mb-2">
          {order.items.map((item: any, idx: number) => (
            <li key={idx}>- {item.quantity}x {item.productName} {item.grindSize ? `(${item.grindSize})` : ""}</li>
          ))}
        </ul>
        <p className="text-sm font-semibold text-gray-900 mb-1">Total: {formatRupiah(order.totalAmount)}</p>
        {order.trackingNumber && (
          <p className="text-sm text-gray-600">Resi: <span className="font-mono font-medium text-black">{order.trackingNumber}</span></p>
        )}
      </div>

      <div className="flex gap-2">
        {order.status === "PAID" && (
          <button
            onClick={handleProcess}
            disabled={isSubmitting}
            className="flex-1 bg-black text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
          >
            {isSubmitting ? "Memproses..." : "Tandai Dikemas"}
          </button>
        )}
        
        
        {order.status === "PROCESSING" && (
          <button
            onClick={() => { setResi(""); setIsModalOpen(true); }}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            Input Resi
          </button>
        )}

        {order.status === "SHIPPED" && (
          <>
            <button
              onClick={() => { setResi(order.trackingNumber || ""); setIsModalOpen(true); }}
              className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-50"
            >
              Koreksi Resi
            </button>
            <button
              onClick={handleDeliver}
              disabled={isSubmitting}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50"
            >
              {isSubmitting ? "Menyimpan..." : "Pesanan Selesai"}
            </button>
          </>
        )}
      </div>
      
      {/* Tombol sekunder (Refund) */}
      {(order.status === "PAID" || order.status === "PROCESSING" || order.status === "DELIVERED" || order.status === "SHIPPED") && (
        <div className="mt-3 text-right">
          <button
            onClick={handleRefund}
            disabled={isSubmitting}
            className="text-xs text-red-600 hover:text-red-800 font-medium disabled:opacity-50"
          >
            {isSubmitting ? "Memproses..." : "Batalkan & Refund Pesanan"}
          </button>
        </div>
      )}

      {/* Modal Input Resi */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {order.status === "SHIPPED" ? "Koreksi Nomor Resi" : "Input Nomor Resi"}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {order.status === "SHIPPED" 
                ? "Koreksi tidak akan mengirim ulang email ke pembeli."
                : "Email pengiriman akan otomatis dikirim ke pembeli."}
            </p>
            
            <form onSubmit={handleShip}>
              <input
                type="text"
                placeholder="Mis: JNE123456789"
                value={resi}
                onChange={(e) => setResi(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-black focus:border-black mb-4"
                required
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border rounded-lg text-gray-700 font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-black text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50"
                >
                  {isSubmitting ? "Mengirim..." : "Kirim Resi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
