"use client";

import { useState } from "react";
import { CreditCard, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function PayButton({ snapToken }: { snapToken: string }) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePay = () => {
    if (!snapToken) {
      toast.error("Token pembayaran tidak ditemukan.");
      return;
    }

    if (!(window as any).snap) {
      toast.error("Sistem pembayaran belum siap. Silakan refresh halaman.");
      return;
    }

    setIsProcessing(true);

    (window as any).snap.pay(snapToken, {
      onSuccess: function () {
        toast.success("Pembayaran berhasil!");
        window.location.reload(); // Refresh to update status
      },
      onPending: function () {
        toast.success("Menunggu konfirmasi pembayaran.");
        window.location.reload(); // Refresh to update status
      },
      onError: function () {
        toast.error("Pembayaran gagal.");
        setIsProcessing(false);
      },
      onClose: function () {
        toast.error("Popup pembayaran ditutup tanpa menyelesaikan pembayaran.");
        setIsProcessing(false);
      }
    });
  };

  return (
    <button
      onClick={handlePay}
      disabled={isProcessing || !snapToken}
      className="inline-flex items-center gap-2 px-4 py-2 bg-[#D4956A] text-white rounded-xl text-sm font-bold hover:bg-[#c28359] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {isProcessing ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <CreditCard className="w-4 h-4" />
      )}
      Lanjutkan Pembayaran
    </button>
  );
}
