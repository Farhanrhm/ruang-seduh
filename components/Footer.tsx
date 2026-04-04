import Link from "next/link";
import { Mail, MapPin } from "lucide-react";
import { FaInstagram, FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-[#8B5E3C]/10 pt-16 pb-8 text-[#3D2B1F]">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Kolom 1: Brand & Bio */}
          <div className="space-y-4">
            <h3 className="font-judul text-2xl font-bold">Ruang Seduh</h3>
            <p className="font-teks text-sm text-[#8B5E3C] leading-relaxed">
              Duduk nyaman, siapkan alatmu. Kami di sini untuk menemani perjalananmu menemukan cangkir kopi terbaik setiap paginya.
            </p>
          </div>

          {/* Kolom 2: Link Navigasi Cepat */}
          <div className="space-y-4">
            <h4 className="font-judul font-semibold text-lg">Eksplorasi</h4>
            <ul className="space-y-2 font-teks text-sm text-[#8B5E3C]">
              <li><Link href="/panduan" className="hover:text-[#D4956A] transition-colors">Panduan Seduh</Link></li>
              <li><Link href="/direktori" className="hover:text-[#D4956A] transition-colors">Peta Kopi Indonesia</Link></li>
              <li><Link href="/jurnal" className="hover:text-[#D4956A] transition-colors">Jurnal Personal</Link></li>
              <li><Link href="/blog" className="hover:text-[#D4956A] transition-colors">Artikel & Cerita</Link></li>
            </ul>
          </div>

          {/* Kolom 3: Bantuan & Kontak */}
          <div className="space-y-4">
            <h4 className="font-judul font-semibold text-lg">Bantuan</h4>
            <ul className="space-y-2 font-teks text-sm text-[#8B5E3C]">
              <li><Link href="/faq" className="hover:text-[#D4956A] transition-colors">Pertanyaan Umum (FAQ)</Link></li>
              <li><Link href="/pengiriman" className="hover:text-[#D4956A] transition-colors">Info Pengiriman</Link></li>
              <li className="flex items-center gap-2 pt-2">
                <Mail className="w-4 h-4" /> halo@ruangseduh.id
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Bandung, Indonesia
              </li>
            </ul>
          </div>

          {/* Kolom 4: Newsletter Mingguan */}
          <div className="space-y-4">
            <h4 className="font-judul font-semibold text-lg">Satu Tegukan</h4>
            <p className="font-teks text-sm text-[#8B5E3C]">
              Dapatkan tips singkat dan rekomendasi kopi pilihan setiap minggunya[cite: 64].
            </p>
            <form className="flex flex-col gap-2">
              <input 
                type="email" 
                placeholder="Alamat email kamu..." 
                className="w-full px-4 py-2 rounded-lg border border-[#8B5E3C]/30 focus:outline-none focus:border-[#D4956A] bg-[#FDF6EE] font-teks text-sm"
              />
              <button 
                type="button" 
                className="w-full px-4 py-2 bg-[#3D2B1F] text-[#FDF6EE] rounded-lg font-medium hover:bg-[#2a1d15] transition-colors text-sm"
              >
                Berlangganan
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Socials */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-[#8B5E3C]/10 gap-4">
          <p className="font-teks text-sm text-[#8B5E3C]">
            &copy; {new Date().getFullYear()} Ruang Seduh. Dirancang dengan sepenuh hati.
          </p>
          <div className="flex items-center gap-4 text-[#8B5E3C]">
            {/* Menggunakan ikon dari react-icons di sini */}
            <a href="#" className="hover:text-[#D4956A] transition-colors" aria-label="Instagram">
              <FaInstagram className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-[#D4956A] transition-colors" aria-label="Twitter/X">
              <FaXTwitter className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}