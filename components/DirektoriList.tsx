"use client";

import { useState, useMemo, useDeferredValue } from "react";
import { Search, MapPin } from "lucide-react";

export default function DirektoriList({ initialBeans }: { initialBeans: any[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const deferredSearchQuery = useDeferredValue(searchQuery);

  const filteredBeans = useMemo(() => {
    if (!deferredSearchQuery) return initialBeans;
    const query = deferredSearchQuery.toLowerCase();
    return initialBeans.filter((bean) => 
      bean.name.toLowerCase().includes(query) ||
      bean.origin.toLowerCase().includes(query) ||
      bean.roastLevel.toLowerCase().includes(query)
    );
  }, [deferredSearchQuery, initialBeans]);

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 border-b border-[#8B5E3C]/10 pb-10">
        <div>
          <h1 className="font-judul text-4xl md:text-5xl font-black text-[#4B2E1C] tracking-tighter">Peta Kopi Nusantara</h1>
          <p className="font-teks text-[#8B5E3C] text-lg max-w-xl mt-4 leading-relaxed">
            Temukan karakteristik unik dari setiap biji kopi yang tumbuh di tanah air.
          </p>
        </div>
        <div className="w-full md:w-80">
          <div className="relative w-full group">
            <input 
              type="text" 
              placeholder="Cari daerah atau roast..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 pl-14 rounded-2xl border border-[#8B5E3C]/20 bg-white focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]/30 font-teks text-[#4B2E1C] transition-all shadow-sm placeholder:text-[#8B5E3C]/40"
            />
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors text-[#8B5E3C]/50 group-focus-within:text-[#D4956A]" />
          </div>
        </div>
      </div>

      {/* List Cards */}
      {filteredBeans.length > 0 ? (
        <div className="flex flex-col gap-6">
          {filteredBeans.map((bean: any) => ( 
            <div key={bean.id} className="bg-white rounded-2xl p-6 md:p-8 border border-[#8B5E3C]/10 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6">
              
              <div className="flex-1">
                <div className="flex items-center gap-1.5 text-[#D4956A] text-[10px] font-black uppercase tracking-wider mb-2">
                  <MapPin className="w-3.5 h-3.5" /> {bean.origin}
                </div>
                
                <h2 className="font-judul text-2xl font-bold text-[#4B2E1C] mb-2 tracking-tight">
                  {bean.name}
                </h2>
                
                <p className="font-teks text-[#8B5E3C] text-sm flex items-center gap-2">
                  <span className="font-bold text-[10px] uppercase tracking-widest text-[#8B5E3C]/50">Roast Level:</span>
                  <span className="font-bold text-[#4B2E1C]">{bean.roastLevel}</span>
                </p>
              </div>

              <div className="md:w-1/2 md:text-right">
                <span className="block font-bold text-[10px] uppercase tracking-widest text-[#8B5E3C]/50 mb-2 md:mb-3">Karakteristik Rasa</span>
                <div className="flex flex-wrap md:justify-end gap-2">
                  {bean.notes.map((note: string, i: number) => (
                    <span key={i} className="px-3 py-1.5 bg-[#FDF6EE] text-[#8B5E3C] text-[10px] font-black uppercase rounded-lg border border-[#8B5E3C]/10">
                      {note}
                    </span>
                  ))}
                </div>
              </div>
              
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-32 bg-white rounded-3xl border border-[#8B5E3C]/10">
          <h2 className="font-judul text-2xl font-bold text-[#4B2E1C]">Data tidak ditemukan</h2>
          <p className="font-teks text-[#8B5E3C] mt-2">Coba cari dengan kata kunci daerah atau profil rasa lainnya.</p>
        </div>
      )}
    </>
  );
}
