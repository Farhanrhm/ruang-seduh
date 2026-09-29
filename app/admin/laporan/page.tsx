import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";

export default async function AdminLaporanPage() {
  const currentMonthStart = new Date();
  currentMonthStart.setDate(1);
  currentMonthStart.setHours(0, 0, 0, 0);

  // Ambil semua order sukses bulan ini
  const successfulStatuses: OrderStatus[] = ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"];
  
  const ordersThisMonth = await prisma.order.findMany({
    where: {
      status: { in: successfulStatuses },
      createdAt: { gte: currentMonthStart }
    },
    include: { items: true }
  });

  const totalRevenue = ordersThisMonth.reduce((sum, order) => sum + order.totalAmount, 0);
  const totalOrders = ordersThisMonth.length;

  // Hitung produk terlaris
  const productSales: Record<string, { name: string, quantity: number, revenue: number }> = {};
  
  ordersThisMonth.forEach(order => {
    order.items.forEach(item => {
      if (!productSales[item.productId]) {
        productSales[item.productId] = { name: item.productName, quantity: 0, revenue: 0 };
      }
      productSales[item.productId].quantity += item.quantity;
      productSales[item.productId].revenue += (item.price * item.quantity);
    });
  });

  const topProducts = Object.values(productSales)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  const formatRupiah = (amount: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Pendapatan Bulan Ini</h3>
          <p className="text-3xl font-black text-gray-900">{formatRupiah(totalRevenue)}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Pesanan Sukses</h3>
          <p className="text-3xl font-black text-gray-900">{totalOrders} <span className="text-lg font-medium text-gray-400">pesanan</span></p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Produk Terlaris Bulan Ini</h2>
        {topProducts.length === 0 ? (
          <p className="text-sm text-gray-500">Belum ada penjualan bulan ini.</p>
        ) : (
          <div className="space-y-4">
            {topProducts.map((p, idx) => (
              <div key={idx} className="flex justify-between items-center border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-500 text-xs">
                    #{idx + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{p.name}</p>
                    <p className="text-xs text-gray-500">{p.quantity} terjual</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{formatRupiah(p.revenue)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
