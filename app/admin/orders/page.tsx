import { prisma } from "@/lib/prisma";
import OrderCard from "@/components/admin/OrderCard";
import SyncButton from "@/components/admin/SyncButton";
import Link from "next/link";
import { OrderStatus } from "@prisma/client";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: { filter?: string };
}) {
  const currentFilter = searchParams.filter || "aktif";

  let statusFilter: OrderStatus[] = [];
  if (currentFilter === "aktif") statusFilter = ["PAID", "PROCESSING"];
  else if (currentFilter === "dikirim") statusFilter = ["SHIPPED"];
  else if (currentFilter === "selesai") statusFilter = ["DELIVERED"];
  else if (currentFilter === "batal") statusFilter = ["CANCELLED", "REFUNDED"];

  const orders = await prisma.order.findMany({
    where: statusFilter.length > 0 ? { status: { in: statusFilter } } : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      items: true,
      user: true,
    },
    take: 50,
  });

  return (
    <div>
      {/* Tabs / Filter & Sync */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex overflow-x-auto space-x-2 scrollbar-hide">
          <Link
            href="?filter=aktif"
            className={`px-4 py-2 whitespace-nowrap rounded-full text-sm font-medium transition-colors ${
              currentFilter === "aktif" ? "bg-black text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            🔴 Perlu Dikemas
          </Link>
          <Link
            href="?filter=dikirim"
            className={`px-4 py-2 whitespace-nowrap rounded-full text-sm font-medium transition-colors ${
              currentFilter === "dikirim" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            🟡 Sedang Dikirim
          </Link>
          <Link
            href="?filter=selesai"
            className={`px-4 py-2 whitespace-nowrap rounded-full text-sm font-medium transition-colors ${
              currentFilter === "selesai" ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            🟢 Selesai
          </Link>
        </div>
        
        <SyncButton />
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>Tidak ada pesanan di kategori ini.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
