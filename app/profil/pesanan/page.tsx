import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Script from "next/script";
import OrderListWithTabs from "@/components/order/OrderListWithTabs";
import { Package, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default async function PesananPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/");
  }

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

  const activeBills = orders.filter(o => o.status === "PENDING" && o.snapToken);

  return (
    <div className="space-y-6">
      <Script 
        src={process.env.NODE_ENV === 'production' ? "https://app.midtrans.com/snap/snap.js" : "https://app.sandbox.midtrans.com/snap/snap.js"}
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || 'SB-Mid-client-DUMMY'}
        strategy="lazyOnload"
      />
      
      <div className="flex items-center justify-between pb-2 border-b border-[#8B5E3C]/10">
        <h2 className="font-judul text-2xl font-bold text-[#4B2E1C] flex items-center gap-3">
          <Package className="w-6 h-6 text-[#D4956A]" /> Riwayat Pesanan
        </h2>
        <span className="text-xs text-[#8B5E3C] font-bold uppercase tracking-wider bg-white px-3 py-1.5 rounded-md shadow-sm border border-[#8B5E3C]/10 hidden sm:inline-block">
          {orders.length} pesanan · {activeBills.length} aktif
        </span>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white py-16 px-6 rounded-2xl text-center border border-[#8B5E3C]/10 shadow-sm flex flex-col items-center mt-6">
          <div className="w-24 h-24 bg-[#FDF6EE] text-[#D4956A] rounded-full flex items-center justify-center mb-6 shadow-inner border border-[#8B5E3C]/5">
            <ShoppingBag className="w-12 h-12" />
          </div>
          <h3 className="font-judul text-2xl font-bold text-[#4B2E1C] mb-2">Belum Ada Pesanan</h3>
          <p className="font-teks text-sm text-[#8B5E3C] mb-8 max-w-sm leading-relaxed">
            Riwayat belanja Anda masih kosong. Yuk, temukan biji kopi dan alat seduh favoritmu di toko kami!
          </p>
          <Link
            href="/toko"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#4B2E1C] text-[#FDF6EE] rounded-xl text-sm font-bold hover:bg-[#8B5E3C] transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            Mulai Belanja
          </Link>
        </div>
      ) : (
        <div className="mt-4">
          <OrderListWithTabs orders={orders as any} />
        </div>
      )}
    </div>
  );
}
