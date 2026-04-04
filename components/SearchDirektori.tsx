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
      router.replace(`/direktori?${params.toString()}`);
    });
  };

  return (
    <div className="relative w-full md:w-72 shadow-sm">
      <input 
        type="text" 
        placeholder="Cari nama atau daerah..." 
        defaultValue={searchParams.get('q')?.toString()}
        onChange={(e) => handleSearch(e.target.value)}
        className="w-full px-6 py-3 pl-12 rounded-full border border-[#8B5E3C]/30 bg-white focus:outline-none focus:border-[#D4956A] font-teks text-[#4B2E1C]"
      />
      <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isPending ? 'text-[#D4956A] animate-pulse' : 'text-[#8B5E3C]/60'}`} />
    </div>
  );
}