"use client";

import { useState } from "react";
import { simpanJurnalBaru } from "@/app/actions/jurnal";
import Link from "next/link";
import { ArrowLeft, Save, Coffee, BarChart3, Scale, Timer, Droplets, Info } from "lucide-react";

// ====================================================================
// KAMUS RASIO STANDAR INTERNASIONAL (Smart Presets)
// ====================================================================
const standarSeduh: Record<string, { kopi: number; rasio: number; hint: string }> = {
  "V60 Pour Over": { kopi: 15, rasio: 15, hint: "Standar manual brew yang seimbang (Clean & Bright)." },
  "French Press": { kopi: 30, rasio: 15, hint: "Rasio besar untuk body yang tebal dan kaya rasa." },
  "AeroPress": { kopi: 15, rasio: 12, hint: "Rasio pekat (1:12) untuk ekstraksi cepat, atau encerkan hingga 1:15." },
  "Espresso": { kopi: 18, rasio: 2,  hint: "Rasio 1:2 (Yield 36ml) standar mutlak untuk espresso." },
  "Moka Pot": { kopi: 15, rasio: 10, hint: "Rasio 1:10 menghasilkan kopi pekat ala espresso rumahan." },
  "Chemex": { kopi: 30, rasio: 16, hint: "Filter tebal butuh rasio 1:16 untuk hasil super clean." },
  "Cold Brew": { kopi: 100, rasio: 8, hint: "Rasio 1:8 untuk konsentrat (perlu dicampur air/susu lagi nanti)." },
  "Siphon": { kopi: 20, rasio: 15, hint: "Suhu konstan cocok dengan rasio 1:15 yang klasik." },
  "Kopi Tubruk": { kopi: 12, rasio: 12, hint: "Rasio 1:12 - 1:15 paling pas untuk kopi hitam tradisional." },
  "Lainnya": { kopi: 15, rasio: 15, hint: "Silakan sesuaikan rasio eksperimenmu sendiri." }
};

export default function JurnalBaruPage() {
  const [metode, setMetode] = useState<string>("");
  const [kopi, setKopi] = useState<number>(15);
  const [rasio, setRasio] = useState<number>(15);
  const [air, setAir] = useState<number>(225);

  const handlePilihMetode = (metodePilihan: string) => {
    setMetode(metodePilihan);
    if (standarSeduh[metodePilihan]) {
      const { kopi: defaultKopi, rasio: defaultRasio } = standarSeduh[metodePilihan];
      setKopi(defaultKopi);
      setRasio(defaultRasio);
      setAir(defaultKopi * defaultRasio); 
    }
  };

  const hitungDariKopi = (valKopi: number) => {
    setKopi(valKopi);
    setAir(Math.round(valKopi * rasio));
  };

  const hitungDariRasio = (valRasio: number) => {
    setRasio(valRasio);
    setAir(Math.round(kopi * valRasio));
  };

  const hitungDariAir = (valAir: number) => {
    setAir(valAir);
    setKopi(Math.round((valAir / rasio) * 10) / 10);
  };

  const rasioFinal = `1:${rasio} (${kopi}g kopi, ${air}${metode === 'Espresso' ? 'ml' : 'g'} air)`;

  return (
    <div className="min-h-screen bg-[#FDF6EE] text-[#4B2E1C] pt-24 pb-24">
      <div className="container mx-auto px-4 md:px-8 max-w-5xl">
        
        <Link href="/jurnal" className="inline-flex items-center gap-2 text-[#8B5E3C] hover:text-[#4B2E1C] font-bold mb-10 transition-colors bg-white px-5 py-2.5 rounded-full shadow-sm border border-[#8B5E3C]/10 w-fit group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Kembali ke Jurnal
        </Link>

        <div className="mb-12 border-b border-[#8B5E3C]/10 pb-8">
          <h1 className="font-judul text-4xl md:text-5xl font-black text-[#4B2E1C] tracking-tighter mb-3">Catat Seduhan Baru</h1>
          <p className="font-teks text-[#8B5E3C] text-lg max-w-2xl leading-relaxed">
            Pilih alat seduhmu, dan kalkulator kami akan otomatis menyesuaikan rasio standarnya.
          </p>
        </div>
        
        <form action={simpanJurnalBaru} className="space-y-8 font-teks text-[#4B2E1C]">
          
          {/* Card 1: Biji Kopi */}
          <div className="bg-white p-8 rounded-[2rem] border border-[#8B5E3C]/10 shadow-sm flex flex-col md:flex-row gap-6 items-center transition-all focus-within:shadow-md focus-within:border-[#D4956A]/30">
            <div className="w-20 h-20 bg-[#FDF6EE] rounded-3xl flex items-center justify-center mb-4 md:mb-0 border border-[#8B5E3C]/10 shadow-inner flex-shrink-0">
              <Coffee className="w-10 h-10 text-[#D4956A]" />
            </div>
            <div className="flex-1 w-full space-y-3">
              <label htmlFor="coffeeBean" className="block text-sm font-bold text-[#8B5E3C] uppercase tracking-wider mb-1">Nama Biji Kopi</label>
              <input type="text" id="coffeeBean" name="coffeeBean" required placeholder="Contoh: Gayo Washed, Toraja Sapan..." 
                className="w-full px-6 py-4 rounded-2xl border border-[#8B5E3C]/20 focus:outline-none focus:ring-2 focus:ring-[#D4956A]/50 bg-gray-50/50 hover:bg-gray-50 focus:bg-white transition-all shadow-sm font-judul text-lg font-bold text-[#4B2E1C] placeholder:font-teks placeholder:text-[#8B5E3C]/50 placeholder:font-normal" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Card 2: Kalkulator */}
            <div className="bg-white p-8 rounded-[2rem] border border-[#8B5E3C]/10 shadow-sm flex flex-col h-full">
              <div className="space-y-4 mb-8">
                <label htmlFor="brewMethod" className="block text-sm font-bold text-[#8B5E3C] uppercase tracking-wider mb-1 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-[#D4956A]" /> Alat Seduh
                </label>
                
                <select id="brewMethod" name="brewMethod" required defaultValue="" 
                  onChange={(e) => handlePilihMetode(e.target.value)}
                  className="w-full px-6 py-4 rounded-2xl border border-[#8B5E3C]/20 focus:outline-none focus:ring-2 focus:ring-[#D4956A]/50 bg-gray-50/50 shadow-sm font-judul font-bold text-lg text-[#4B2E1C] appearance-none cursor-pointer">
                  <option value="" disabled>Pilih metode seduh...</option>
                  {Object.keys(standarSeduh).map((alat) => (
                    <option key={alat} value={alat}>{alat}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-4 flex-1 flex flex-col">
                <label className="block text-sm font-bold text-[#8B5E3C] uppercase tracking-wider mb-1 flex items-center gap-2">
                  <Scale className="w-4 h-4 text-[#D4956A]" /> Kalkulator Rasio
                </label>
                
                <input type="hidden" name="ratio" value={rasioFinal} />

                <div className="bg-[#FDF6EE] p-6 rounded-3xl border border-[#8B5E3C]/10 flex flex-col gap-5 flex-1 justify-center">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-teks font-bold text-[#8B5E3C] flex items-center gap-2">
                      <Coffee className="w-4.5 h-4.5" /> Kopi (g)
                    </span>
                    <input type="number" value={kopi || ""} onChange={(e) => hitungDariKopi(Number(e.target.value))}
                      className="w-24 px-3 py-2 text-center rounded-xl border border-[#8B5E3C]/20 focus:outline-none focus:ring-2 focus:ring-[#D4956A] bg-white text-[#4B2E1C] font-black text-lg" />
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-teks font-bold text-[#8B5E3C] flex items-center gap-2">
                      <Scale className="w-4.5 h-4.5" /> Rasio 1:
                    </span>
                    <input type="number" step="0.1" value={rasio || ""} onChange={(e) => hitungDariRasio(Number(e.target.value))}
                      className="w-24 px-3 py-2 text-center rounded-xl border border-[#8B5E3C]/20 focus:outline-none focus:ring-2 focus:ring-[#D4956A] bg-white text-[#4B2E1C] font-black text-lg" />
                  </div>
                  <div className="flex items-center justify-between gap-4 pt-5 border-t border-[#8B5E3C]/10 mt-1">
                    <span className="font-teks font-bold text-[#D4956A] flex items-center gap-2">
                      <Droplets className="w-4.5 h-4.5" /> Air ({metode === 'Espresso' ? 'ml' : 'g'})
                    </span>
                    <input type="number" value={air || ""} onChange={(e) => hitungDariAir(Number(e.target.value))}
                      className="w-24 px-3 py-2 text-center rounded-xl border-2 border-[#D4956A] focus:outline-none focus:ring-2 focus:ring-[#D4956A] bg-[#D4956A] text-white font-black text-lg" />
                  </div>
                </div>
                
                {metode && standarSeduh[metode] && (
                  <div className="flex items-start gap-2 text-sm font-medium text-[#D4956A] bg-[#D4956A]/10 p-4 rounded-2xl mt-4">
                    <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <p className="leading-relaxed">{standarSeduh[metode].hint}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Card 3: Tasting Notes */}
            <div className="bg-white p-8 rounded-[2rem] border border-[#8B5E3C]/10 shadow-sm flex flex-col h-full">
              <label htmlFor="tastingNote" className="block text-sm font-bold text-[#8B5E3C] uppercase tracking-wider mb-4 flex items-center gap-2">
                <Timer className="w-4 h-4 text-[#D4956A]" /> Catatan Rasa & Hasil
              </label>
              <textarea id="tastingNote" name="tastingNote" required placeholder="Gimana rasanya? Terlalu asam, pas, atau pahit? Catat profil rasa dominannya di sini..." 
                className="w-full flex-1 p-6 rounded-3xl border border-[#8B5E3C]/20 focus:outline-none focus:ring-2 focus:ring-[#D4956A]/50 bg-gray-50/50 hover:bg-gray-50 focus:bg-white transition-all shadow-sm font-teks resize-none leading-relaxed text-lg placeholder:text-[#8B5E3C]/40 min-h-[300px]"></textarea>
            </div>
          </div>

          {/* Tombol Simpan */}
          <div className="pt-6">
            <button type="submit" className="w-full py-5 bg-[#4B2E1C] text-[#FDF6EE] rounded-full font-bold hover:bg-[#8B5E3C] transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-3 text-lg group">
              <Save className="w-6 h-6 group-hover:scale-110 transition-transform" /> Simpan Jurnal Seduh
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}