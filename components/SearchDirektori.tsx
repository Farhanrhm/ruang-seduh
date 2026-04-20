"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

export default function SearchDirektori() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('q', term); 
    } else {
      params.delete('q'); 
    }
    
    startTransition(() => {
      router.replace(`/direktori?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <div className="relative w-full group">
      <input 
        type="text" 
        placeholder="Cari daerah atau roast..." 
        defaultValue={searchParams.get('q')?.toString()}
        onChange={(e) => handleSearch(e.target.value)}
        className="w-full px-6 py-4 pl-14 rounded-2xl border border-[#8B5E3C]/20 bg-white focus:outline-none focus:ring-2 focus:ring-[#D4956A]/30 font-teks text-[#4B2E1C] transition-all shadow-sm placeholder:text-[#8B5E3C]/40"
      />
      <Search className={`absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${isPending ? 'text-[#D4956A] animate-pulse' : 'text-[#8B5E3C]/50 group-focus-within:text-[#D4956A]'}`} />
    </div>
  );
}