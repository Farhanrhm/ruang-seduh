"use client";

import { useEffect, useRef } from "react";
import { syncPendingOrders } from "@/app/actions/order";

export default function OrderSyncTrigger() {
  const syncedRef = useRef(false);

  useEffect(() => {
    // Jalankan sekali saat mount (strict mode di dev akan memanggil 2x, kita batasi dengan ref)
    if (syncedRef.current) return;
    syncedRef.current = true;

    // Panggil action sinkronisasi di latar belakang
    // Action ini akan mengecek Midtrans, mengubah DB, dan memanggil revalidatePath jika ada perubahan.
    syncPendingOrders().catch((err) => {
      console.error("Gagal melakukan sinkronisasi pesanan:", err);
    });
  }, []);

  // Komponen ini tidak merender UI apa pun (siluman)
  return null;
}
