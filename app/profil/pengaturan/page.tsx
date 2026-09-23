import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Settings, User, Mail, Bell } from "lucide-react";

export default async function PengaturanPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-[#8B5E3C]/10">
        <h2 className="font-judul text-2xl font-bold text-[#4B2E1C] flex items-center gap-3">
          <Settings className="w-6 h-6 text-[#D4956A]" /> Pengaturan Akun
        </h2>
      </div>

      <div className="bg-white rounded-2xl border border-[#8B5E3C]/10 shadow-sm overflow-hidden mt-6">
        
        {/* Seksi Profil Pribadi */}
        <div className="p-6 md:p-8 border-b border-[#8B5E3C]/10">
          <h3 className="font-judul text-lg font-bold text-[#4B2E1C] mb-6">Informasi Pribadi</h3>
          
          <div className="space-y-5 max-w-xl">
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-[#8B5E3C] uppercase tracking-wider mb-2">
                <User className="w-4 h-4" /> Nama Lengkap
              </label>
              <input 
                type="text" 
                defaultValue={session.user.name || ""} 
                disabled
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#4B2E1C] font-medium focus:outline-none cursor-not-allowed opacity-70"
              />
            </div>
            
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-[#8B5E3C] uppercase tracking-wider mb-2">
                <Mail className="w-4 h-4" /> Alamat Email
              </label>
              <input 
                type="email" 
                defaultValue={session.user.email || ""} 
                disabled
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#4B2E1C] font-medium focus:outline-none cursor-not-allowed opacity-70"
              />
              <p className="text-[10px] text-[#8B5E3C] mt-2 font-medium">
                Email tertaut dengan provider login Anda dan tidak dapat diubah saat ini.
              </p>
            </div>
          </div>
        </div>

        {/* Seksi Preferensi */}
        <div className="p-6 md:p-8 bg-gray-50/50">
          <h3 className="font-judul text-lg font-bold text-[#4B2E1C] mb-6">Preferensi Komunikasi</h3>
          
          <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm max-w-xl">
            <div className="mt-1">
              <input 
                type="checkbox" 
                id="newsletter" 
                defaultChecked 
                disabled
                className="w-5 h-5 rounded border-gray-300 text-[#D4956A] focus:ring-[#8B5E3C] cursor-not-allowed"
              />
            </div>
            <div>
              <label htmlFor="newsletter" className="font-bold text-[#4B2E1C] text-sm block mb-1">
                Newsletter & Promo
              </label>
              <p className="font-teks text-xs text-[#8B5E3C] leading-relaxed">
                Kirimkan saya pembaruan mingguan tentang biji kopi terbaru, panduan seduh, dan penawaran eksklusif.
              </p>
            </div>
          </div>

          <div className="mt-8">
            <button
              disabled
              className="px-6 py-3 bg-[#4B2E1C] text-[#FDF6EE] rounded-xl text-sm font-bold opacity-50 cursor-not-allowed shadow-none"
            >
              Simpan Perubahan
            </button>
            <span className="text-[10px] font-bold text-[#D4956A] uppercase tracking-wider ml-4">
              *Fitur edit segera hadir
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
