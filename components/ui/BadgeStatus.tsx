import { CheckCircle2, Clock, Truck, AlertCircle, Package } from "lucide-react";

type OrderStatus = "PENDING" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED";

export default function BadgeStatus({ status }: { status: string }) {
  switch (status as OrderStatus) {
    case "PAID":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
          <Package className="w-3.5 h-3.5" /> Diproses
        </span>
      );
    case "SHIPPED":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
          <Truck className="w-3.5 h-3.5" /> Dikirim
        </span>
      );
    case "DELIVERED":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
          <CheckCircle2 className="w-3.5 h-3.5" /> Selesai
        </span>
      );
    case "CANCELLED":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-100 opacity-90">
          <AlertCircle className="w-3.5 h-3.5" /> Dibatalkan
        </span>
      );
    default: // PENDING
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-100">
          <Clock className="w-3.5 h-3.5" /> Menunggu Pembayaran
        </span>
      );
  }
}
