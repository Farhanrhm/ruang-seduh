"use client";

import { useFormStatus } from "react-dom";
import { Save, Loader2 } from "lucide-react";

interface TombolSimpanProps {
  labelAsli?: string;
  labelLoading?: string;
}

export default function TombolSimpan({ 
  labelAsli = "Simpan Jurnal Seduh", 
  labelLoading = "Menyimpan..." 
}: TombolSimpanProps) {
  const { pending } = useFormStatus();

  return (
    <button 
      type="submit" 
      disabled={pending}
      className={`w-full md:w-auto px-10 py-5 rounded-full font-bold transition-all duration-300 shadow-lg flex items-center justify-center gap-3 text-lg group ${
        pending 
          ? "bg-[#8B5E3C] text-white/70 cursor-not-allowed opacity-80" 
          : "bg-[#4B2E1C] text-[#FDF6EE] hover:bg-[#8B5E3C] hover:shadow-xl hover:-translate-y-1"
      }`}
    >
      {pending ? (
        <>
          <Loader2 className="w-6 h-6 animate-spin" />
          {labelLoading}
        </>
      ) : (
        <>
          <Save className="w-6 h-6 group-hover:scale-110 transition-transform" />
          {labelAsli}
        </>
      )}
    </button>
  );
}
