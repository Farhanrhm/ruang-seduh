import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Timer, Thermometer, Droplets, Scale } from "lucide-react";

// Data Panduan Seduh Standar Profesional (SCA & Barista Champions)
const artikelPanduan: Record<string, any> = {
  "v60": {
    title: "V60 Pour Over",
    tagline: "Seni mengekstrak kejernihan dan kompleksitas rasa.",
    kopi: "15 Gram (Medium-Fine)",
    air: "225 ml",
    suhu: "90-93°C",
    waktu: "2:30 - 3:00 Menit",
    langkah: [
      { judul: "1. Persiapan & Bilas Kertas", teks: "Lipat jahitan kertas filter V60, letakkan di dripper. Bilas dengan air panas merata. Ini menghilangkan bau kertas sekaligus memanaskan dripper dan server. Jangan lupa buang air bilasannya." },
      { judul: "2. Blooming (0:00 - 0:45)", teks: "Masukkan kopi, ratakan. Tuang 45g air panas perlahan dari tengah memutar ke luar. Proses 'Blooming' ini melepaskan gas CO2 yang terjebak di biji kopi agar ekstraksi selanjutnya maksimal. Tunggu hingga detik ke-45." },
      { judul: "3. Tuangan Kedua (0:45 - 1:15)", teks: "Tuang kembali air secara perlahan dengan gerakan spiral memutar, pastikan semua bubuk kopi terkena air. Berhenti menuang saat timbangan menunjukkan angka 135g." },
      { judul: "4. Tuangan Akhir (1:15 - 1:45)", teks: "Lakukan tuangan terakhir dengan ritme yang sama hingga timbangan mencapai tepat 225g. Biarkan sisa air turun sepenuhnya (drawdown). Angkat dripper saat waktu menunjukkan 2:30 - 3:00 menit." }
    ]
  },
  "french-press": {
    title: "French Press",
    tagline: "Teknik klasik untuk body yang tebal dan minyak kopi alami.",
    kopi: "30 Gram (Coarse / Kasar)",
    air: "450 ml",
    suhu: "95°C",
    waktu: "4:00 - 5:00 Menit",
    langkah: [
      { judul: "1. Tuang & Basahi (0:00)", teks: "Masukkan 30g kopi giling kasar ke dalam tabung kaca. Tuang seluruh air (450g) dengan ritme sedikit cepat agar semua bubuk kopi terbasahi secara merata dan bergejolak." },
      { judul: "2. Seduh (0:30 - 4:00)", teks: "Bubuk kopi akan mengapung dan membentuk 'kerak' (crust) di bagian atas. Jangan ditekan dulu! Biarkan kopi terekstraksi secara alami selama tepat 4 menit." },
      { judul: "3. Pecahkan Kerak (4:00)", teks: "Gunakan sendok, aduk perlahan bagian atas kerak kopi tersebut sebanyak 3 kali agar ampas kopi tenggelam ke dasar. (Opsional: buang busa tipis di atasnya untuk rasa yang lebih bersih)." },
      { judul: "4. Tekan & Sajikan", teks: "Pasang penutup French Press. Tekan plunger (saringan) secara sangat perlahan hanya sampai menyentuh permukaan ampas di dasar (jangan ditekan kuat-kuat). Segera tuang ke cangkir agar kopi tidak over-ekstraksi." }
    ]
  },
  "aeropress": {
    title: "AeroPress (Inverted Method)",
    tagline: "Fleksibel, tekanan stabil, menghasilkan kopi pekat nan halus.",
    kopi: "15 Gram (Medium-Fine)",
    air: "200 ml",
    suhu: "85-90°C",
    waktu: "2:00 Menit",
    langkah: [
      { judul: "1. Setup Inverted (Terbalik)", teks: "Masukkan karet plunger (pendorong) ke dalam tabung sekitar 1 cm saja. Berdirikan AeroPress secara terbalik (angka terbalik). Masukkan 15g kopi ke dalamnya." },
      { judul: "2. Blooming & Aduk (0:00 - 0:30)", teks: "Tuang 50g air panas, gunakan pengaduk bawaan dan aduk kuat selama 10 detik agar semua kopi basah. Biarkan blooming selama 30 detik." },
      { judul: "3. Tuang Penuh (0:30 - 1:30)", teks: "Tuangkan sisa air hingga timbangan menunjukkan 200g. Pasang tutup hitam (cap) yang sudah dipasangi kertas filter basah dengan rapat. Biarkan hingga waktu mencapai 1 menit 30 detik." },
      { judul: "4. Balik & Eksekusi (1:30 - 2:00)", teks: "Siapkan server/cangkir kokoh. Dengan cepat dan hati-hati, balikkan AeroPress ke atas cangkir. Tekan plunger ke bawah dengan tekanan konstan selama 30 detik sampai terdengar suara desisan angin (hiss). Selesai!" }
    ]
  }
};

export default async function DetailPanduanPage({ params }: { params: Promise<{ slug: string }> }) {
  // Ambil data panduan berdasarkan slug dari URL setelah merombaknya perlahan
  const { slug } = await params;
  const panduan = artikelPanduan[slug];

  // Memicu halaman 404 jika user mengetik URL ngawur (misal: /panduan/kopi-luwak)
  if (!panduan) {
    notFound();
  }

  return (
    <div className="bg-[#FDF6EE] min-h-screen pt-16 pb-24 text-[#4B2E1C]">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        
        {/* Tombol Kembali */}
        <Link href="/panduan" className="inline-flex items-center gap-2 text-[#D4956A] hover:text-[#b57a52] mb-12 transition-all font-teks font-bold text-sm tracking-tight p-2 bg-white/50 rounded-xl border border-[#8B5E3C]/10 w-fit shadow-sm">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Panduan
        </Link>

        {/* Header Artikel */}
        <div className="mb-12 border-b border-[#8B5E3C]/10 pb-12 text-center md:text-left">
          <h1 className="font-judul text-5xl md:text-6xl font-black text-[#4B2E1C] mb-4 tracking-tighter">
            {panduan.title}
          </h1>
          <p className="font-teks text-[#8B5E3C] text-xl max-w-2xl italic">
            "{panduan.tagline}"
          </p>
        </div>

        {/* Kartu Spesifikasi / Parameter Pro */}
        <div className="bg-white rounded-3xl p-8 mb-12 border border-[#8B5E3C]/10 shadow-sm">
          <h3 className="font-judul text-2xl font-bold text-[#4B2E1C] mb-6 border-b border-[#8B5E3C]/10 pb-4">Parameter Standar SCA</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-[#FDF6EE] p-4 rounded-2xl border border-[#8B5E3C]/5">
              <span className="flex items-center gap-2 text-xs font-bold text-[#8B5E3C] uppercase tracking-wider mb-2">
                <Scale className="w-4 h-4 text-[#D4956A]" /> Rasio Kopi
              </span>
              <p className="font-teks font-bold text-[#4B2E1C]">{panduan.kopi}</p>
            </div>
            <div className="bg-[#FDF6EE] p-4 rounded-2xl border border-[#8B5E3C]/5">
              <span className="flex items-center gap-2 text-xs font-bold text-[#8B5E3C] uppercase tracking-wider mb-2">
                <Droplets className="w-4 h-4 text-[#D4956A]" /> Volume Air
              </span>
              <p className="font-teks font-bold text-[#4B2E1C]">{panduan.air}</p>
            </div>
            <div className="bg-[#FDF6EE] p-4 rounded-2xl border border-[#8B5E3C]/5">
              <span className="flex items-center gap-2 text-xs font-bold text-[#8B5E3C] uppercase tracking-wider mb-2">
                <Thermometer className="w-4 h-4 text-[#D4956A]" /> Suhu Optimal
              </span>
              <p className="font-teks font-bold text-[#4B2E1C]">{panduan.suhu}</p>
            </div>
            <div className="bg-[#FDF6EE] p-4 rounded-2xl border border-[#8B5E3C]/5">
              <span className="flex items-center gap-2 text-xs font-bold text-[#8B5E3C] uppercase tracking-wider mb-2">
                <Timer className="w-4 h-4 text-[#D4956A]" /> Total Waktu
              </span>
              <p className="font-teks font-bold text-[#4B2E1C]">{panduan.waktu}</p>
            </div>
          </div>
        </div>

        {/* Langkah-Langkah (Step-by-step) Estetik */}
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-[#8B5E3C]/10 shadow-sm">
          <h3 className="font-judul text-3xl font-bold text-[#4B2E1C] mb-10">Langkah Menyeduh</h3>
          
          <div className="space-y-10">
            {panduan.langkah.map((step: any, index: number) => (
              <div key={index} className="flex gap-6 group">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-[#D4956A] text-white flex items-center justify-center font-judul font-black text-xl shadow-md group-hover:scale-110 transition-transform flex-shrink-0 border-4 border-[#FDF6EE]">
                    {index + 1}
                  </div>
                  {index !== panduan.langkah.length - 1 && (
                    <div className="w-1 h-full bg-[#8B5E3C]/10 mt-4 rounded-full"></div>
                  )}
                </div>
                
                <div className="pb-4 pt-2">
                  <h4 className="font-judul text-2xl font-bold text-[#4B2E1C] mb-3">
                    {step.judul.replace(/^\d+\.\s/, '')} {/* Hapus nomor dari judul */}
                  </h4>
                  <p className="font-teks text-[#8B5E3C] leading-relaxed text-lg">
                    {step.teks}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}