"use client";

import { useState } from "react";
import { User, Mail } from "lucide-react";
import { updateProfile } from "@/app/actions/profile";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface ProfileFormProps {
  initialName: string;
  initialEmail: string;
  initialNewsletter: boolean;
}

export default function ProfileForm({ initialName, initialEmail, initialNewsletter }: ProfileFormProps) {
  const [name, setName] = useState(initialName);
  const [newsletter, setNewsletter] = useState(initialNewsletter);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const router = useRouter();
  const { update } = useSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const result = await updateProfile(name, newsletter);
      if (result.success) {
        await update({ name: name }); // Memperbarui token sesi lokal secara instan
        setMessage({ text: "Profil berhasil diperbarui!", type: "success" });
        router.refresh(); 
      } else {
        setMessage({ text: result.error || "Gagal memperbarui profil.", type: "error" });
      }
    } catch (error) {
      setMessage({ text: "Terjadi kesalahan sistem.", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {message && (
        <div className={`p-4 mb-6 rounded-xl text-sm font-bold border ${
          message.type === "success" 
            ? "bg-green-50 text-green-700 border-green-200" 
            : "bg-red-50 text-red-700 border-red-200"
        }`}>
          {message.text}
        </div>
      )}

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
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={3}
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#4B2E1C] font-medium focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] focus:border-transparent transition-all"
            />
          </div>
          
          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-[#8B5E3C] uppercase tracking-wider mb-2">
              <Mail className="w-4 h-4" /> Alamat Email
            </label>
            <input 
              type="email" 
              value={initialEmail} 
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
              checked={newsletter}
              onChange={(e) => setNewsletter(e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 text-[#D4956A] focus:ring-[#8B5E3C] cursor-pointer"
            />
          </div>
          <div>
            <label htmlFor="newsletter" className="font-bold text-[#4B2E1C] text-sm block mb-1 cursor-pointer">
              Newsletter & Promo
            </label>
            <p className="font-teks text-xs text-[#8B5E3C] leading-relaxed">
              Kirimkan saya pembaruan mingguan tentang biji kopi terbaru, panduan seduh, dan penawaran eksklusif.
            </p>
          </div>
        </div>

        <div className="mt-8 flex items-center gap-4">
          <button
            type="submit"
            disabled={isLoading || (name === initialName && newsletter === initialNewsletter)}
            className="px-6 py-3 bg-[#4B2E1C] text-[#FDF6EE] rounded-xl text-sm font-bold hover:bg-[#8B5E3C] transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] focus:ring-offset-2"
          >
            {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
          {name === initialName && newsletter === initialNewsletter && (
             <span className="text-xs text-[#8B5E3C] italic">Tidak ada perubahan</span>
          )}
        </div>
      </div>
    </form>
  );
}
