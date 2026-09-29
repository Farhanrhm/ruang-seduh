import { prisma } from "@/lib/prisma";
import StockClient from "@/components/admin/StockClient";
import Link from "next/link";

export default async function AdminStockPage() {
  const products = await prisma.product.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, stock: true, isActive: true }
  });

  const lowStockProducts = products.filter(p => p.stock <= 5 && p.isActive);

  // Ambil history stok terbaru
  const recentLedgers = await prisma.stockLedger.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
    include: { product: { select: { name: true } } }
  });

  return (
    <div className="space-y-6">
      {lowStockProducts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <h3 className="text-red-800 font-bold mb-2 flex items-center gap-2">
            ⚠️ Peringatan Stok Menipis
          </h3>
          <ul className="list-disc pl-5 text-sm text-red-700 space-y-1">
            {lowStockProducts.map(p => (
              <li key={p.id}>{p.name} - Sisa {p.stock}</li>
            ))}
          </ul>
        </div>
      )}

      <StockClient products={products} />

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Riwayat Perubahan Terakhir (Ledger)</h2>
        {recentLedgers.length === 0 ? (
          <p className="text-sm text-gray-500">Belum ada riwayat perubahan stok.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-gray-600">
                  <th className="pb-2 font-medium">Tanggal</th>
                  <th className="pb-2 font-medium">Produk</th>
                  <th className="pb-2 font-medium">Perubahan</th>
                  <th className="pb-2 font-medium">Alasan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentLedgers.map(l => (
                  <tr key={l.id}>
                    <td className="py-3 text-gray-500">
                      {new Date(l.createdAt).toLocaleDateString("id-ID", { day: "2-digit", month: "short", hour: "2-digit", minute:"2-digit" })}
                    </td>
                    <td className="py-3 font-medium text-gray-900">{l.product.name}</td>
                    <td className="py-3">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${l.quantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {l.quantity > 0 ? "+" : ""}{l.quantity}
                      </span>
                    </td>
                    <td className="py-3 text-gray-600">{l.reason} <span className="text-gray-400 text-xs block">{l.notes}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
