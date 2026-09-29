"use client";

import { useState } from "react";
import { syncMidtransOrders } from "@/app/actions/admin";
import { toast } from "react-hot-toast";
import { RefreshCw } from "lucide-react";

export default function SyncButton() {
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    setIsSyncing(true);
    const res = await syncMidtransOrders();
    if (res.success) {
      toast.success(res.message || "Sinkronisasi berhasil");
    } else {
      toast.error(res.error || "Gagal sinkronisasi");
    }
    setIsSyncing(false);
  };

  return (
    <button
      onClick={handleSync}
      disabled={isSyncing}
      className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
    >
      <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
      {isSyncing ? "Menyinkronkan..." : "Sync Pembayaran Gantung"}
    </button>
  );
}
