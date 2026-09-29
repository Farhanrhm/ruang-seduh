import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard Admin | Ruang Seduh",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center border-b">
          <h1 className="text-xl font-bold text-gray-900">Dashboard Toko</h1>
          <a href="/" className="text-sm text-blue-600 hover:underline">Ke Halaman Depan</a>
        </div>
        <div className="max-w-4xl mx-auto px-4 flex gap-6">
          <a href="/admin/orders" className="py-3 text-sm font-medium border-b-2 border-black text-gray-900">Pesanan</a>
          <a href="/admin/stok" className="py-3 text-sm font-medium border-b-2 border-transparent text-gray-500 hover:text-gray-900">Manajemen Stok</a>
          <a href="/admin/laporan" className="py-3 text-sm font-medium border-b-2 border-transparent text-gray-500 hover:text-gray-900">Laporan</a>
        </div>
      </header>
      <main className="max-w-4xl mx-auto p-4">
        {children}
      </main>
    </div>
  );
}
