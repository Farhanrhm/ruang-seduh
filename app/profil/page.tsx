import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Package, ShoppingBag, MapPin, CreditCard } from "lucide-react";
import Script from "next/script";
import OrderListWithTabs from "@/components/order/OrderListWithTabs";

export default async function ProfilPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/");
  }

  // Ambil user dengan alamat utama untuk ringkasan profil
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      addresses: {
        where: { isDefault: true },
        take: 1
      }
    }
  });

  // Query orders dengan select yang ketat (bukan include penuh)
  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    select: {
      id: true,
      status: true,
      createdAt: true,
      recipientName: true,
      city: true,
      paymentType: true,
      totalAmount: true,
      snapToken: true,
      items: {
        select: {
          id: true,
          productId: true,
          productName: true,
          unitPrice: true,
          quantity: true,
          price: true,
          grindSize: true,
          product: {
            select: {
              id: true,
              price: true,
              isActive: true,
              stock: true,
              imageUrl: true,
              grindOptions: true,
            }
          }
        }
      }
    },
    orderBy: { createdAt: "desc" },
  });

  const formatRupiah = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);

  // Definisi "Tagihan Aktif": Pesanan PENDING yang BISA dilanjutkan (memiliki snapToken)
  const activeBills = orders.filter(o => o.status === "PENDING" && o.snapToken);
  const totalNeedToPay = activeBills.reduce((sum, order) => sum + order.totalAmount, 0);
  const defaultAddress = user?.addresses?.[0];

  return (
    <div className="min-h-screen bg-[#FDF6EE] pt-28 pb-20 text-[#4B2E1C]">
      <Script 
        src={process.env.NODE_ENV === 'production' ? "https://app.midtrans.com/snap/snap.js" : "https://app.sandbox.midtrans.com/snap/snap.js"}
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || 'SB-Mid-client-DUMMY'}
        strategy="lazyOnload"
      />
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Kartu Profil Padat (Horizontal Layout) */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-[#8B5E3C]/10 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 overflow-hidden rounded-full border border-[#8B5E3C]/20 shadow-sm flex-shrink-0">
              {session.user.image ? (
                <Image src={session.user.image} alt="Profil" width={64} height={64} className="object-cover h-full w-full" />
              ) : (
                <div className="h-full w-full bg-[#8B5E3C]/10 flex items-center justify-center font-bold text-[#4B2E1C] text-lg">
                  {session.user.name?.[0] || "U"}
                </div>
              )}
            </div>
            <div>
              <h1 className="font-judul text-xl font-bold text-[#4B2E1C]">{session.user.name}</h1>
              <p className="font-teks text-xs text-[#8B5E3C] mt-0.5 mb-1.5">{session.user.email}</p>
              <span className="inline-block px-2.5 py-0.5 bg-[#8B5E3C]/10 text-[#8B5E3C] text-[10px] font-bold uppercase tracking-wider rounded-md">
                Member Ruang Seduh
              </span>
            </div>
          </div>

          {/* Ringkasan Akun */}
          <div className="flex flex-wrap md:flex-nowrap gap-3 md:gap-4 md:border-l border-[#8B5E3C]/10 md:pl-6">
            <div className="bg-gray-50/50 rounded-xl p-3 flex-1 min-w-[120px] border border-gray-100">
              <div className="flex items-center gap-1.5 text-xs text-[#8B5E3C] font-medium mb-1">
                <CreditCard className="w-3.5 h-3.5 text-amber-600" /> Tagihan Aktif
              </div>
              <p className="font-bold text-[#4B2E1C] text-sm">
                {activeBills.length} <span className="text-xs text-gray-500 font-normal">({formatRupiah(totalNeedToPay)})</span>
              </p>
            </div>
            <div className="bg-gray-50/50 rounded-xl p-3 flex-1 min-w-[120px] border border-gray-100">
              <div className="flex items-center gap-1.5 text-xs text-[#8B5E3C] font-medium mb-1">
                <MapPin className="w-3.5 h-3.5 text-[#D4956A]" /> Alamat Utama
              </div>
              <p className="font-bold text-[#4B2E1C] text-xs truncate max-w-[150px]" title={defaultAddress?.city || "Belum diatur"}>
                {defaultAddress ? defaultAddress.city : "Belum diatur"}
              </p>
            </div>
          </div>

        </div>

        {/* Bagian Riwayat Pesanan */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2">
            <h2 className="font-judul text-xl font-bold text-[#4B2E1C] flex items-center gap-2">
              <Package className="w-5 h-5 text-[#D4956A]" /> Riwayat Pesanan
            </h2>
            <span className="text-xs text-[#8B5E3C] font-medium bg-white px-3 py-1 rounded-full shadow-sm border border-[#8B5E3C]/10">
              {orders.length} pesanan · {activeBills.length} bisa dilanjutkan
            </span>
          </div>

          {orders.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl text-center border border-[#8B5E3C]/10 shadow-sm flex flex-col items-center">
              <div className="w-20 h-20 bg-[#FDF6EE] text-[#D4956A] rounded-full flex items-center justify-center mb-5 shadow-inner">
                <ShoppingBag className="w-10 h-10" />
              </div>
              <h3 className="font-judul text-xl font-bold text-[#4B2E1C] mb-2">Belum Ada Pesanan</h3>
              <p className="font-teks text-sm text-[#8B5E3C] mb-8 max-w-sm">
                Riwayat belanja Anda masih kosong. Yuk, temukan biji kopi dan alat seduh favoritmu di toko kami!
              </p>
              <Link
                href="/toko"
                className="inline-flex items-center gap-2 px-8 py-3 bg-[#D4956A] text-[#FDF6EE] rounded-xl text-sm font-bold hover:bg-[#c28359] transition-all shadow-md hover:shadow-lg"
              >
                Mulai Belanja
              </Link>
            </div>
          ) : (
            <OrderListWithTabs orders={orders as any} />
          )}
        </div>

      </div>
    </div>
  );
}
