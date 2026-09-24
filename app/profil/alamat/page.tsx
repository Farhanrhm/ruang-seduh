import { MapPin, CheckCircle2, Phone, User, Home } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AddAddressButton from "@/components/address/AddAddressButton";
import AddressCardActions from "@/components/address/AddressCardActions";

export default async function AlamatPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/");
  }

  const addresses = await prisma.address.findMany({
    where: { userId: session.user.id },
    orderBy: [
      { isDefault: 'desc' },
      { createdAt: 'desc' }
    ]
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-[#8B5E3C]/10">
        <h2 className="font-judul text-2xl font-bold text-[#4B2E1C] flex items-center gap-3">
          <MapPin className="w-6 h-6 text-[#D4956A]" /> Alamat Pengiriman
        </h2>
        {addresses.length > 0 && <AddAddressButton />}
      </div>

      {addresses.length === 0 ? (
        <div className="bg-white py-16 px-6 rounded-2xl text-center border border-[#8B5E3C]/10 shadow-sm flex flex-col items-center mt-6">
          <div className="w-24 h-24 bg-[#FDF6EE] rounded-full flex items-center justify-center mb-6 border border-[#8B5E3C]/5 shadow-inner">
            <MapPin className="w-12 h-12 text-[#D4956A]" />
          </div>
          <h3 className="font-judul text-2xl font-bold text-[#4B2E1C] mb-2">Belum Ada Alamat</h3>
          <p className="font-teks text-sm text-[#8B5E3C] mb-8 max-w-sm leading-relaxed">
            Tambahkan alamat pengirimanmu agar proses checkout kopi dan alat seduh menjadi lebih cepat dan mudah.
          </p>
          <AddAddressButton />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {addresses.map((address) => (
            <div 
              key={address.id} 
              className={`p-6 rounded-2xl border transition-all ${
                address.isDefault 
                  ? "bg-[#FDF6EE]/30 border-[#D4956A] shadow-md ring-1 ring-[#D4956A]/20" 
                  : "bg-white border-[#8B5E3C]/10 shadow-sm hover:shadow-md"
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#4B2E1C] text-[#FDF6EE] rounded-md text-[10px] font-bold uppercase tracking-wider">
                  <Home className="w-3 h-3" /> {address.label || "Alamat"}
                </span>
                {address.isDefault && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-green-700 bg-green-50 px-2 py-1 rounded-md border border-green-200">
                    <CheckCircle2 className="w-3 h-3" /> UTAMA
                  </span>
                )}
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="font-judul text-lg font-bold text-[#4B2E1C] flex items-center gap-2">
                    <User className="w-4 h-4 text-[#8B5E3C]" /> {address.recipientName}
                  </h4>
                  <p className="text-sm font-bold text-[#8B5E3C] flex items-center gap-2 mt-1">
                    <Phone className="w-4 h-4" /> {address.phoneNumber}
                  </p>
                </div>
                
                <p className="text-sm text-[#4B2E1C] leading-relaxed">
                  {address.detailAddress}
                </p>
                
                <p className="text-xs font-bold text-[#8B5E3C] bg-gray-50 p-2 rounded-lg border border-gray-100">
                  {address.district}, {address.city}, {address.province} {address.postalCode}
                </p>

                {address.courierNote && (
                  <p className="text-[11px] text-gray-500 italic mt-2 flex items-start gap-1">
                    <span className="font-bold shrink-0">Catatan:</span> {address.courierNote}
                  </p>
                )}
              </div>
              <AddressCardActions address={address} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
