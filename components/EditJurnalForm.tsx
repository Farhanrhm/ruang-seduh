"use client";

import { useState } from "react";
import { Coffee, BarChart3, Scale, Timer, Droplets, Info, Thermometer, Settings2, Clock, Star, Save } from "lucide-react";
import { updateJurnal } from "@/app/actions/jurnal";
import TextareaAutosize from "react-textarea-autosize";
import TombolSimpan from "@/components/TombolSimpan";

// KAMUS RASIO STANDAR INTERNASIONAL (Smart Presets)
const standarSeduh: Record<string, { kopi: number; rasio: number; hint: string }> = {
  "V60 Pour Over": { kopi: 15, rasio: 15, hint: "Rasio emas 1:15. Seduhan seimbang, body medium, acidity cerah." },
  "French Press": { kopi: 20, rasio: 12, hint: "Rasio padat 1:12. Ekstraksi imersi penuh, body tebal dan bold." },
  "Aeropress": { kopi: 15, rasio: 13, hint: "Rasio 1:13. Konsentrat kuat, bisa di-bypass (tambah air) setelah jadi." },
  "Espresso": { kopi: 18, rasio: 2, hint: "Rasio ketat 1:2. Yield 36ml untuk double shot standar kafe." },
  "Cold Brew": { kopi: 50, rasio: 10, hint: "Rasio 1:10. Sangat konsentrat, cocok disajikan dengan es batu atau susu." },
  "Siphon": { kopi: 20, rasio: 15, hint: "Rasio 1:15. Ekstraksi panas tinggi, menghasilkan kopi yang sangat clean." },
  "Kopi Tubruk": { kopi: 12, rasio: 14, hint: "Rasio 1:14. Klasik nusantara. Seduh air mendidih, tunggu 4 menit." },
  "Lainnya": { kopi: 15, rasio: 15, hint: "Eksperimen bebas. Rasio 1:15 adalah titik awal paling aman." }
};

export default function EditJurnalForm({ jurnal }: { jurnal: any }) {
  // Fail-Safe Parser Rasio
  let initialRasio = 15;
  let initialKopi = 15;
  let initialAir = 225;
  
  try {
    if (jurnal.ratio) {
      // Format 1: "1:15 (15g kopi, 225g air)"
      const match = jurnal.ratio.match(/1:([\d.]+)\s*\(([\d.]+)g\s*kopi,\s*([\d.]+)(?:g|ml)\s*air\)/i);
      if (match) {
        initialRasio = parseFloat(match[1]);
        initialKopi = parseFloat(match[2]);
        initialAir = parseFloat(match[3]);
      } else {
        // Format sederhana: "1:15"
        const simpleMatch = jurnal.ratio.match(/1:([\d.]+)/);
        if (simpleMatch) {
          initialRasio = parseFloat(simpleMatch[1]);
          // Asumsi kopi standar 15g
          initialKopi = 15;
          initialAir = initialKopi * initialRasio;
        }
      }
    }
  } catch(e) {
    console.warn("Gagal parse rasio, menggunakan fallback default", e);
  }

  const [metode, setMetode] = useState<string>(jurnal.brewMethod || "");
  const [kopi, setKopi] = useState<number>(initialKopi);
  const [rasio, setRasio] = useState<number>(initialRasio);
  const [air, setAir] = useState<number>(initialAir);

  const [suhuAir, setSuhuAir] = useState<number | "">(jurnal.waterTemp || "");
  const [ukuranGilingan, setUkuranGilingan] = useState<string>(jurnal.grindSize || "");
  const [waktuMenit, setWaktuMenit] = useState<number | "">(jurnal.brewTime !== null && jurnal.brewTime !== undefined ? Math.floor(jurnal.brewTime / 60) : "");
  const [waktuDetik, setWaktuDetik] = useState<number | "">(jurnal.brewTime !== null && jurnal.brewTime !== undefined ? jurnal.brewTime % 60 : "");
  const [rating, setRating] = useState<number>(jurnal.starRating || 0);

  const handlePilihMetode = (metodePilihan: string) => {
    setMetode(metodePilihan);
    if (standarSeduh[metodePilihan]) {
      setRasio(standarSeduh[metodePilihan].rasio);
      setKopi(standarSeduh[metodePilihan].kopi);
      setAir(standarSeduh[metodePilihan].kopi * standarSeduh[metodePilihan].rasio);
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

  const rasioFinal = `1:${rasio} (${kopi}g kopi, ${air}${metode === 'Espresso' ? 'ml' : 'g'} air)`;
  const actionDenganId = updateJurnal.bind(null, jurnal.id);

  return (
    <form action={actionDenganId} className="space-y-8 font-teks text-[#4B2E1C]">
      {/* Card 1: Biji Kopi */}
      <div className="bg-white p-8 rounded-[2rem] border border-[#8B5E3C]/10 shadow-sm transition-all focus-within:shadow-md focus-within:border-[#D4956A]/30">
        <div className="w-full space-y-3">
          <label htmlFor="coffeeBean" className="block text-sm font-bold text-[#6B442A] uppercase tracking-wider mb-1">Nama Biji Kopi</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Coffee className="w-6 h-6 text-[#D4956A]" />
            </div>
            <input type="text" id="coffeeBean" name="coffeeBean" required defaultValue={jurnal.coffeeBean} placeholder="Contoh: Gayo Washed, Toraja Sapan..." 
              className="w-full pl-14 pr-6 py-4 rounded-2xl border border-[#8B5E3C]/20 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]/50 bg-gray-50/50 hover:bg-gray-50 focus:bg-white transition-all shadow-sm font-judul text-lg font-bold text-[#4B2E1C] placeholder:font-teks placeholder:text-[#8B5E3C]/50 placeholder:font-normal" />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-stretch">
        {/* Card 2: Kalkulator */}
        <div className="bg-white p-8 rounded-[2rem] border border-[#8B5E3C]/10 shadow-sm flex flex-col h-full">
          <div className="space-y-4 mb-8">
            <label htmlFor="brewMethod" className="block text-sm font-bold text-[#6B442A] uppercase tracking-wider mb-1 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#D4956A]" /> Alat Seduh
            </label>
            
            <select id="brewMethod" name="brewMethod" required value={metode} 
              onChange={(e) => handlePilihMetode(e.target.value)}
              className="w-full px-6 py-4 rounded-2xl border border-[#8B5E3C]/20 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]/50 bg-gray-50/50 shadow-sm font-judul font-bold text-lg text-[#4B2E1C] appearance-none cursor-pointer">
              <option value="" disabled>Pilih metode seduh...</option>
              {Object.keys(standarSeduh).map((alat) => (
                <option key={alat} value={alat}>{alat}</option>
              ))}
              {!Object.keys(standarSeduh).includes(metode) && metode !== "" && (
                <option value={metode}>{metode}</option>
              )}
            </select>
          </div>

          <div className="space-y-4 flex-1 flex flex-col mb-8">
            <label className="block text-sm font-bold text-[#6B442A] uppercase tracking-wider mb-1 flex items-center gap-2">
              <Scale className="w-4 h-4 text-[#D4956A]" /> Kalkulator Rasio
            </label>
            
            <input type="hidden" name="ratio" value={rasioFinal} />

            <div className="bg-[#FDF6EE] p-6 rounded-3xl border border-[#8B5E3C]/10 flex flex-col gap-5 flex-1 justify-center">
              <div className="flex items-center justify-between gap-4">
                <span className="font-teks font-bold text-[#6B442A] flex items-center gap-2">
                  <Coffee className="w-4.5 h-4.5" /> Kopi (g)
                </span>
                <input type="number" value={kopi || ""} onChange={(e) => hitungDariKopi(Number(e.target.value))}
                  className="w-24 px-3 py-2 text-center rounded-xl border border-[#8B5E3C]/20 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] bg-white text-[#4B2E1C] font-black text-lg" />
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="font-teks font-bold text-[#6B442A] flex items-center gap-2">
                  <Scale className="w-4.5 h-4.5" /> Rasio 1:
                </span>
                <input type="number" step="0.1" value={rasio || ""} onChange={(e) => hitungDariRasio(Number(e.target.value))}
                  className="w-24 px-3 py-2 text-center rounded-xl border border-[#8B5E3C]/20 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] bg-white text-[#4B2E1C] font-black text-lg" />
              </div>
              <div className="flex items-center justify-between gap-4 pt-5 border-t border-[#8B5E3C]/10 mt-1">
                <span className="font-teks font-bold text-[#D4956A] flex items-center gap-2">
                  <Droplets className="w-4.5 h-4.5" /> Air ({metode === 'Espresso' ? 'ml' : 'g'})
                </span>
                <input type="number" value={air || ""} readOnly
                  className="w-24 px-3 py-2 text-center rounded-xl border border-[#8B5E3C]/20 bg-gray-100 text-[#8B5E3C] font-black text-lg cursor-not-allowed" />
              </div>
            </div>
            
            {metode && standarSeduh[metode] && (
              <div className="flex items-start gap-2 text-sm font-medium text-[#D4956A] bg-[#D4956A]/10 p-4 rounded-2xl mt-4">
                <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed">{standarSeduh[metode].hint}</p>
              </div>
            )}
          </div>

          {/* Parameter Tambahan */}
          <div className="space-y-4 border-t border-[#8B5E3C]/10 pt-6">
            <label className="block text-sm font-bold text-[#6B442A] uppercase tracking-wider mb-4 flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-[#D4956A]" /> Parameter Detail (Opsional)
            </label>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="waterTemp" className="text-xs font-bold text-[#8B5E3C] flex items-center gap-1"><Thermometer className="w-3 h-3"/> Suhu (°C)</label>
                <input type="number" id="waterTemp" name="waterTemp" value={suhuAir} onChange={(e) => setSuhuAir(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl border border-[#8B5E3C]/20 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] bg-white text-[#4B2E1C] font-teks text-sm" placeholder="Misal: 92" />
              </div>
              <div className="space-y-2">
                <label htmlFor="grindSize" className="text-xs font-bold text-[#8B5E3C] flex items-center gap-1"><Settings2 className="w-3 h-3"/> Gilingan</label>
                <select id="grindSize" name="grindSize" value={ukuranGilingan} onChange={(e) => setUkuranGilingan(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#8B5E3C]/20 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] bg-white text-[#4B2E1C] font-teks text-sm appearance-none cursor-pointer">
                  <option value="">-- Pilih --</option>
                  <option value="Extra Fine">Extra Fine</option>
                  <option value="Fine">Fine</option>
                  <option value="Medium-Fine">Medium-Fine</option>
                  <option value="Medium">Medium</option>
                  <option value="Medium-Coarse">Medium-Coarse</option>
                  <option value="Coarse">Coarse</option>
                </select>
              </div>
            </div>

            <div className="space-y-2 mt-4">
              <label className="text-xs font-bold text-[#8B5E3C] flex items-center gap-1"><Clock className="w-3 h-3"/> Waktu Seduh</label>
              <div className="flex gap-2 items-center">
                <input type="number" name="waktuMenit" value={waktuMenit} onChange={(e) => setWaktuMenit(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl border border-[#8B5E3C]/20 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] bg-white text-[#4B2E1C] text-center font-teks text-sm" placeholder="Menit" />
                <span className="font-bold text-[#8B5E3C]">:</span>
                <input type="number" name="waktuDetik" value={waktuDetik} onChange={(e) => setWaktuDetik(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl border border-[#8B5E3C]/20 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] bg-white text-[#4B2E1C] text-center font-teks text-sm" placeholder="Detik" />
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Tasting Notes & Rating */}
        <div className="bg-white p-8 rounded-[2rem] border border-[#8B5E3C]/10 shadow-sm flex flex-col h-fit self-start w-full">
          
          <div className="mb-8">
            <label className="block text-sm font-bold text-[#6B442A] uppercase tracking-wider mb-3 flex items-center gap-2">
              <Star className="w-4 h-4 text-[#D4956A]" /> Rating Seduhan
            </label>
            <div className="flex gap-2">
              <input type="hidden" name="rating" value={rating} />
              {[1, 2, 3, 4, 5].map((star) => (
                <button type="button" key={star} onClick={() => setRating(star)}
                  className={`w-10 h-10 flex items-center justify-center rounded-full transition-all ${
                    rating >= star ? 'bg-[#D4956A] text-white shadow-md' : 'bg-gray-100 text-[#8B5E3C] hover:bg-gray-200'
                  }`}>
                  <Star className={`w-5 h-5 ${rating >= star ? 'fill-white' : ''}`} />
                </button>
              ))}
            </div>
          </div>

          <label htmlFor="tastingNote" className="block text-sm font-bold text-[#6B442A] uppercase tracking-wider mb-4 flex items-center gap-2">
            <Timer className="w-4 h-4 text-[#D4956A]" /> Catatan Rasa & Hasil
          </label>
          <TextareaAutosize id="tastingNote" name="tastingNote" required defaultValue={jurnal.tastingNote || ""} placeholder="Gimana rasanya? Terlalu asam, pas, atau pahit? Catat profil rasa dominannya di sini..." 
            minRows={4} maxRows={15}
            className="w-full p-6 rounded-3xl border border-[#8B5E3C]/20 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]/50 bg-gray-50/50 hover:bg-gray-50 focus:bg-white transition-all shadow-sm font-teks resize-none leading-relaxed text-lg placeholder:text-[#8B5E3C]/40 overflow-y-auto" />
        </div>
      </div>

      {/* Tombol Simpan */}
      <div className="pt-6 flex justify-end">
        <TombolSimpan labelAsli="Perbarui Jurnal Seduh" labelLoading="Memperbarui..." />
      </div>
    </form>
  );
}
