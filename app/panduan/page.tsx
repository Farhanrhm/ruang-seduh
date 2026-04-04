import Link from "next/link";
import { Timer, Thermometer, ArrowRight, Coffee } from "lucide-react";

export default function PanduanPage() {
  const panduan = [
    { title: "V60 Pour Over", slug: "v60", desc: "Karakter rasa yang bersih (clean) dan menonjolkan keasaman (acidity) cerah dari biji kopi.", time: "3 Menit", temp: "90-93°C" },
    { title: "French Press", slug: "french-press", desc: "Menghasilkan kopi dengan body yang tebal dan kaya rasa karena minyak kopi tidak tersaring kertas.", time: "4 Menit", temp: "95°C" },
    { title: "Aeropress", slug: "aeropress", desc: "Metode serbaguna yang cepat, menghasilkan kopi yang pekat, halus, dan tingkat keasaman yang rendah.", time: "2 Menit", temp: "85-90°C" },
  ];

  return (
    <div className="bg-[#FDF6EE] min-h-screen pt-16 pb-24">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        <div className="mb-16 border-b border-[#8B5E3C]/10 pb-8 text-center md:text-left">
          <h1 className="font-judul text-4xl md:text-5xl font-black text-[#4B2E1C] mb-4 tracking-tighter">Panduan Seduh</h1>
          <p className="font-teks text-[#8B5E3C] text-lg max-w-2xl">Langkah demi langkah mengekstrak rasa terbaik dari biji kopimu. Pilih metode favoritmu dan mari menyeduh.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {panduan.map((item: any, index: number) => (
            <div key={index} className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all border border-[#8B5E3C]/10 group flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 bg-[#FDF6EE] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#D4956A] group-hover:text-white transition-colors text-[#D4956A]">
                  <Coffee className="w-7 h-7" />
                </div>
                <h2 className="font-judul text-2xl font-bold text-[#4B2E1C] mb-3">{item.title}</h2>
                <p className="font-teks text-[#8B5E3C] text-sm mb-6 leading-relaxed">{item.desc}</p>
                <div className="flex items-center gap-4 mb-8">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-[#8B5E3C] bg-[#FDF6EE] px-3 py-1.5 rounded-lg"><Timer className="w-4 h-4 text-[#D4956A]" /> {item.time}</span>
                  <span className="flex items-center gap-1.5 text-xs font-bold text-[#8B5E3C] bg-[#FDF6EE] px-3 py-1.5 rounded-lg"><Thermometer className="w-4 h-4 text-[#D4956A]" /> {item.temp}</span>
                </div>
              </div>
              {/* REVISI: Tombol sekarang menjadi Link yang mengarah ke dynamic route */}
              <Link href={`/panduan/${item.slug}`} className="w-full py-3 bg-transparent border-2 border-[#4B2E1C] text-[#4B2E1C] rounded-xl font-bold hover:bg-[#4B2E1C] hover:text-[#FDF6EE] transition-all flex items-center justify-center gap-2">
                Mulai Belajar <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}