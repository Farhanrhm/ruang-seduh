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

  // Fungsi saat Alat Seduh DIPILIH (Auto-Ubah Kalkulator)
  const handlePilihMetode = (metodePilihan: string) => {
    setMetode(metodePilihan);
    
    // Tarik data dari kamus Smart Presets
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
    <div className="min-h-screen bg-[#4B2E1C] text-[#FDF6EE] pt-16 pb-24">
      <div className="container mx-auto px-4 md:px-8 max-w-5xl">
        
        <Link href="/jurnal" className="inline-flex items-center gap-2 text-[#D4956A] hover:text-[#b57a52] mb-12 transition-all font-teks font-bold text-sm tracking-tight p-2 bg-white/5 rounded-xl border border-[#FDF6EE]/10 w-fit">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Jurnal
        </Link>

        <div className="mb-16 border-b border-[#FDF6EE]/10 pb-8">
          <h1 className="font-judul text-4xl md:text-5xl font-black text-[#FDF6EE] tracking-tighter mb-3">Catat Seduhan Baru</h1>
          <p className="font-teks text-[#8B5E3C] text-lg max-w-2xl leading-relaxed">
            Pilih alat seduhmu, dan kalkulator kami akan otomatis menyesuaikan rasio standarnya.
          </p>
        </div>
        
        <form action={simpanJurnalBaru} className="space-y-6 font-teks text-[#4B2E1C]">
          
          <div className="bg-white p-8 rounded-3xl border border-[#8B5E3C]/10 shadow-sm flex flex-col md:flex-row gap-6 items-center">
            <div className="w-20 h-20 bg-[#FDF6EE] rounded-3xl flex items-center justify-center mb-6 md:mb-0 border border-[#8B5E3C]/10 shadow-inner flex-shrink-0">
              <Coffee className="w-10 h-10 text-[#D4956A]" />
            </div>
            <div className="flex-1 w-full space-y-4">
              <label htmlFor="coffeeBean" className="block text-sm font-bold text-[#4B2E1C] uppercase tracking-wider mb-1">Nama Biji Kopi</label>
              <input type="text" id="coffeeBean" name="coffeeBean" required placeholder="Contoh: Gayo Washed, Toraja Sapan..." 
                className="w-full px-6 py-3.5 rounded-full border border-[#8B5E3C]/30 focus:outline-none focus:border-[#D4956A] bg-[#FDF6EE] shadow-sm font-teks" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            
            <div className="bg-white p-8 rounded-3xl border border-[#8B5E3C]/10 shadow-sm space-y-5">
              <div className="space-y-4 mb-4">
                <label htmlFor="brewMethod" className="block text-sm font-bold text-[#4B2E1C] uppercase tracking-wider mb-1 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-[#D4956A]" /> Alat Seduh
                </label>
                
                {/* EVENT onChange DITAMBAHKAN DI SINI */}
                <select id="brewMethod" name="brewMethod" required defaultValue="" 
                  onChange={(e) => handlePilihMetode(e.target.value)}
                  className="w-full px-6 py-3.5 rounded-full border border-[#8B5E3C]/30 focus:outline-none focus:border-[#D4956A] bg-[#FDF6EE] shadow-sm font-teks appearance-none">
                  <option value="" disabled>Pilih metode seduh...</option>
                  {Object.keys(standarSeduh).map((alat) => (
                    <option key={alat} value={alat}>{alat}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-4 mb-4">
                <label className="block text-sm font-bold text-[#4B2E1C] uppercase tracking-wider mb-1 flex items-center gap-2">
                  <Scale className="w-4 h-4 text-[#D4956A]" /> Kalkulator Rasio
                </label>
                
                <input type="hidden" name="ratio" value={rasioFinal} />

                <div className="bg-[#FDF6EE] p-5 rounded-2xl border border-[#8B5E3C]/20 flex flex-col gap-4">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-teks text-sm font-bold text-[#8B5E3C] flex items-center gap-2">
                      <Coffee className="w-4 h-4" /> Kopi (g)
                    </span>
                    <input type="number" value={kopi || ""} onChange={(e) => hitungDariKopi(Number(e.target.value))}
                      className="w-20 px-2 py-1.5 text-center rounded-lg border border-[#8B5E3C]/30 focus:outline-none focus:border-[#D4956A] bg-white text-[#4B2E1C] font-bold" />
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-teks text-sm font-bold text-[#8B5E3C] flex items-center gap-2">
                      <Scale className="w-4 h-4" /> Rasio 1:
                    </span>
                    <input type="number" step="0.1" value={rasio || ""} onChange={(e) => hitungDariRasio(Number(e.target.value))}
                      className="w-20 px-2 py-1.5 text-center rounded-lg border border-[#8B5E3C]/30 focus:outline-none focus:border-[#D4956A] bg-white text-[#4B2E1C] font-bold" />
                  </div>
                  <div className="flex items-center justify-between gap-4 pt-4 border-t border-[#8B5E3C]/10">
                    <span className="font-teks text-sm font-bold text-[#D4956A] flex items-center gap-2">
                      <Droplets className="w-4 h-4" /> Hasil / Air ({metode === 'Espresso' ? 'ml' : 'g'})
                    </span>
                    <input type="number" value={air || ""} onChange={(e) => hitungDariAir(Number(e.target.value))}
                      className="w-24 px-2 py-1.5 text-center rounded-lg border-2 border-[#D4956A]/50 focus:outline-none focus:border-[#D4956A] bg-[#D4956A]/10 text-[#4B2E1C] font-black" />
                  </div>
                </div>
                
                {/* TOOLTIP CERDAS (Muncul otomatis menjelaskan rasio alat) */}
                {metode && standarSeduh[metode] && (
                  <div className="flex items-start gap-2 text-xs font-medium text-[#D4956A] bg-[#D4956A]/10 p-3 rounded-xl">
                    <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <p>{standarSeduh[metode].hint}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-[#8B5E3C]/10 shadow-sm space-y-4">
              <label htmlFor="tastingNote" className="block text-sm font-bold text-[#4B2E1C] uppercase tracking-wider mb-1 flex items-center gap-2">
                <Timer className="w-4 h-4 text-[#D4956A]" /> Catatan Rasa & Hasil
              </label>
              <textarea id="tastingNote" name="tastingNote" rows={11} required placeholder="Gimana rasanya? Terlalu asam, pas, atau pahit? Catat profil rasa dominannya di sini..." 
                className="w-full p-6 rounded-3xl border border-[#8B5E3C]/30 focus:outline-none focus:border-[#D4956A] bg-[#FDF6EE] shadow-sm font-teks resize-none leading-relaxed"></textarea>
            </div>
          </div>

          <div className="pt-6">
            <button type="submit" className="w-full py-5 bg-[#D4956A] text-white rounded-full font-bold hover:bg-[#b57a52] transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3 text-lg">
              <Save className="w-6 h-6" /> Simpan Jurnal Seduh
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}