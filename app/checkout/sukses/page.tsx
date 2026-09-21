import Link from "next/link";
import { CheckCircle2, ShoppingBag, FileText, Mail, MapPin, PackageCheck, Clock } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order_id?: string; orderId?: string }>;
}) {
  const resolvedParams = await searchParams;
  const rawOrderId = resolvedParams?.order_id || resolvedParams?.orderId;

  let order = null;
  if (rawOrderId) {
    try {
      order = await prisma.order.findUnique({
        where: { id: rawOrderId },
        include: { items: true },
      });
    } catch {
      order = null;
    }
  }

  const displayOrderId = order?.id || rawOrderId || `RS-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, "0")}-${Math.floor(1000 + Math.random() * 9000)}`;

  const formatRupiah = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);

  const isPending = order ? order.status === "PENDING" : false;

  return (
    <div className="min-h-screen bg-[#FDF6EE] pt-28 pb-20 text-[#4B2E1C] flex items-center justify-center">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-[#8B5E3C]/15 text-center relative overflow-hidden">
          
          <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-200">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <h1 className="font-judul text-3xl sm:text-4xl font-bold text-[#4B2E1C] mb-3">
            {isPending ? "Pesanan Menunggu Pembayaran" : "Pesanan Berhasil!"}
          </h1>

          <p className="font-teks text-[#8B5E3C] text-base mb-8 max-w-md mx-auto">
            {isPending
              ? "Pesanan Anda telah tercatat. Silakan selesaikan pembayaran sesuai instruksi yang dipilih."
              : "Terima kasih telah memesan kopi di Ruang Seduh. Pesanan Anda segera kami proses dan kirimkan."}
          </p>

          <div className="bg-[#FDF6EE] rounded-2xl p-5 sm:p-6 mb-8 border border-[#8B5E3C]/15 text-left w-full">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 border-b border-[#8B5E3C]/10">
              <div>
                <p className="text-xs font-semibold text-[#8B5E3C] uppercase tracking-wider flex items-center gap-1.5 mb-1">
                  <FileText className="w-4 h-4 text-[#D4956A]" /> Nomor Pesanan
                </p>
                <p className="font-mono text-base sm:text-lg font-bold text-[#4B2E1C]">
                  {displayOrderId}
                </p>
              </div>

              {order && (
                <div className="sm:text-right">
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                      order.status === "PAID"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {order.status === "PAID" ? (
                      <>
                        <PackageCheck className="w-3.5 h-3.5" /> Terbayar
                      </>
                    ) : (
                      <>
                        <Clock className="w-3.5 h-3.5" /> Menunggu Pembayaran
                      </>
                    )}
                  </span>
                </div>
              )}
            </div>

            {order && (
              <div className="py-4 border-b border-[#8B5E3C]/10 space-y-2">
                <p className="text-xs font-semibold text-[#8B5E3C] uppercase tracking-wider mb-2">
                  Ringkasan Item
                </p>
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-start text-sm">
                    <div className="text-[#4B2E1C]">
                      <span className="font-medium">{item.productName}</span>
                      {item.grindSize && (
                        <span className="text-xs text-[#8B5E3C] ml-1.5 font-normal">
                          ({item.grindSize})
                        </span>
                      )}
                      <span className="text-xs text-[#8B5E3C] block">
                        {item.quantity} x {formatRupiah(item.price)}
                      </span>
                    </div>
                    <span className="font-semibold text-[#4B2E1C]">
                      {formatRupiah(item.price * item.quantity)}
                    </span>
                  </div>
                ))}

                <div className="pt-2 flex justify-between items-center text-base font-bold text-[#4B2E1C]">
                  <span>Total Tagihan</span>
                  <span className="text-[#8B5E3C]">{formatRupiah(order.totalAmount)}</span>
                </div>
              </div>
            )}

            {order && (
              <div className="pt-4 space-y-2 text-sm text-[#8B5E3C]">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#D4956A] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-[#4B2E1C]">{order.recipientName} ({order.phoneNumber})</p>
                    <p className="text-xs">{order.detailAddress}, {order.district}, {order.city}, {order.province} {order.postalCode}</p>
                    {order.paymentType && (
                      <p className="text-xs text-[#8B5E3C] mt-1 font-medium">Layanan: {order.paymentType}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {!order && (
              <div className="pt-3 text-xs text-[#8B5E3C] flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#D4956A] flex-shrink-0" />
                <span>Rincian pesanan telah dikirimkan ke alamat email Anda.</span>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/profil"
              className="w-full sm:w-auto px-6 py-3.5 bg-[#4B2E1C] text-[#FDF6EE] rounded-xl font-semibold hover:bg-[#8B5E3C] transition-colors flex items-center justify-center gap-2"
            >
              Lihat Riwayat Pesanan
            </Link>
            <Link
              href="/toko"
              className="w-full sm:w-auto px-6 py-3.5 bg-white text-[#4B2E1C] border border-[#8B5E3C]/20 rounded-xl font-semibold hover:bg-[#FDF6EE] transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" /> Belanja Lagi
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}