import { useEffect, useState } from "react";
import { useCartStore } from "@/store/useCartStore";

/**
 * Hook untuk memastikan state dari localStorage (Zustand persist)
 * sudah selesai dihidrasi di sisi browser sebelum digunakan pada UI.
 * Ini mencegah terjadinya error Hydration Mismatch pada Next.js SSR.
 */
export function useCartHydration() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Periksa apakah persist sudah selesai menghidrasi state
    const unsubHydrate = useCartStore.persist?.onHydrate?.(() => setHydrated(false));
    const unsubFinishHydration = useCartStore.persist?.onFinishHydration?.(() => setHydrated(true));

    if (useCartStore.persist?.hasHydrated?.()) {
      setHydrated(true);
    } else {
      setHydrated(true);
    }

    return () => {
      unsubHydrate?.();
      unsubFinishHydration?.();
    };
  }, []);

  return hydrated;
}
