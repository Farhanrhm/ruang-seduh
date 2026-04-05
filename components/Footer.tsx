"use client";

import Link from "next/link";
import { Mail, MapPin, Coffee, ArrowRight } from "lucide-react";
import { FaInstagram, FaXTwitter } from "react-icons/fa6";
import toast from "react-hot-toast";

export default function Footer() {
  // Fungsi agar tombol tidak "mati" saat diklik
  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    
    // Memunculkan toast notifikasi sukses yang cantik
    toast.success("Terima kasih! Cek kotak masukmu untuk rekomendasi kopi pertama dari kami.", {
      icon: "☕",
      style: { borderRadius: '12px', background: '#4B2E1C', color: '#FDF6EE' }
    });
    
    form.reset(); // Kosongkan input setelah sukses
  };

  const handleKembangkan = (e: React.MouseEvent) => {
    e.preventDefault();
    toast("Halaman ini sedang diseduh. Kembali lagi nanti ya!", { icon: "⏳" });
  };

  return (
    <footer className="bg-white border-t border-[#8B5E3C]/10 pt-20 pb-10 text-[#4B2E1C]">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Kolom 1: Brand & Bio */}
          <div className="space-y-5">
            <Link href="/" className="flex items-center gap-2 text-2xl font-black font-judul tracking-tighter text-[#4B2E1C]">
              <Coffee className="w-8 h-8 text-[#D4956A]" />
              Ruang Seduh
            </Link>
            <p className="font-teks text-[#8B5E3C] leading-relaxed">
              Duduk nyaman, siapkan alatmu. Kami di sini untuk menemani perjalananmu menemukan cangkir kopi terbaik setiap paginya.
            </p>
          </div>

          {/* Kolom 2: Link Navigasi Cepat */}
          <div className="space-y-5">
            <h4 className="font-judul font-bold text-xl">Eksplorasi</h4>
            <ul className="space-y-3 font-teks text-[#8B5E3C]">
              <li><Link href="/panduan" className="hover:text-[#D4956A] hover:translate-x-1 flex items-center transition-all">Panduan Seduh</Link></li>
              <li><Link href="/direktori" className="hover:text-[#D4956A] hover:translate-x-1 flex items-center transition-all">Peta Kopi Indonesia</Link></li>
              <li><Link href="/jurnal" className="hover:text-[#D4956A] hover:translate-x-1 flex items-center transition-all">Jurnal Personal</Link></li>
              <li><Link href="/blog" className="hover:text-[#D4956A] hover:translate-x-1 flex items-center transition-all">Artikel & Cerita</Link></li>
            </ul>
          </div>

          {/* Kolom 3: Bantuan & Kontak */}
          <div className="space-y-5">
            <h4 className="font-judul font-bold text-xl">Bantuan</h4>
            <ul className="space-y-3 font-teks text-[#8B5E3C]">
              <li><a href="#" onClick={handleKembangkan} className="hover:text-[#D4956A] hover:translate-x-1 flex items-center transition-all">Pertanyaan Umum (FAQ)</a></li>
              <li><a href="#" onClick={handleKembangkan} className="hover:text-[#D4956A] hover:translate-x-1 flex items-center transition-all">Info Pengiriman</a></li>
              <li className="flex items-center gap-3 pt-3 text-[#4B2E1C] font-medium">
                <Mail className="w-4.5 h-4.5 text-[#D4956A]" /> halo@ruangseduh.id
              </li>
              <li className="flex items-center gap-3 text-[#4B2E1C] font-medium">
                <MapPin className="w-4.5 h-4.5 text-[#D4956A]" /> Bandung, Indonesia
              </li>
            </ul>
          </div>

          {/* Kolom 4: Newsletter Mingguan */}
          <div className="space-y-5">
            <h4 className="font-judul font-bold text-xl">Satu Tegukan</h4>
            <p className="font-teks text-[#8B5E3C] leading-relaxed">
              Dapatkan tips singkat dan rekomendasi kopi pilihan setiap minggunya.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
              <input 
                type="email" 
                required
                placeholder="Alamat email kamu..." 
                className="w-full px-5 py-3.5 rounded-xl border border-[#8B5E3C]/20 focus:outline-none focus:ring-2 focus:ring-[#D4956A]/50 bg-gray-50 font-teks transition-all placeholder:text-[#8B5E3C]/50"
              />
              <button 
                type="submit" 
                className="w-full px-5 py-3.5 bg-[#4B2E1C] text-[#FDF6EE] rounded-xl font-bold hover:bg-[#8B5E3C] transition-all flex items-center justify-center gap-2 group"
              >
                Berlangganan <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Socials */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-[#8B5E3C]/10 gap-4">
          <p className="font-teks text-[#8B5E3C] font-medium text-sm">
            &copy; {new Date().getFullYear()} Ruang Seduh. Dirancang dengan sepenuh hati.
          </p>
          <div className="flex items-center gap-5 text-[#8B5E3C]">
            <a href="#" onClick={(e) => e.preventDefault()} className="p-2 bg-gray-50 hover:bg-[#D4956A] hover:text-white rounded-full transition-all" aria-label="Instagram">
              <FaInstagram className="w-4.5 h-4.5" />
            </a>
            <a href="#" onClick={(e) => e.preventDefault()} className="p-2 bg-gray-50 hover:bg-[#D4956A] hover:text-white rounded-full transition-all" aria-label="Twitter/X">
              <FaXTwitter className="w-4.5 h-4.5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}