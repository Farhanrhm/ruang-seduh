"use client";

import dynamic from "next/dynamic";

// Memuat CartDrawer secara client-side dynamic import (ssr: false)
// Memastikan modal tidak membebani initial server render dan critical path
const DynamicCartDrawer = dynamic(() => import("@/components/CartDrawer"), {
  ssr: false,
});

export default function CartDrawerWrapper() {
  return <DynamicCartDrawer />;
}
