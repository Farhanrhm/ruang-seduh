"use client";

import Link from "next/link";
import { Mail, MapPin, Coffee } from "lucide-react";
import toast from "react-hot-toast";
import { useState } from "react";

export default function Footer() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Gagal berlangganan. Coba lagi.", {
          style: { borderRadius: "12px", background: "#4B2E1C", color: "#FDF6EE" },
        });
        return;
      }

      toast.success("Cek kotak masukmu! Email selamat datang sudah kami kirim.", {
        icon: "☕",
        style: { borderRadius: "12px", background: "#4B2E1C", color: "#FDF6EE" },
      });
      form.reset();
    } catch {
      toast.error("Koneksi bermasalah. Coba lagi sebentar.", {
        style: { borderRadius: "12px", background: "#4B2E1C", color: "#FDF6EE" },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-white border-t border-[#8B5E3C]/10 pt-20 pb-10 text-[#4B2E1C]">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          
          {/* Kolom 1: Brand, Bio, Kontak */}
          <div className="space-y-5">
            <Link href="/" className="flex items-center gap-2 text-2xl font-black font-judul tracking-tighter text-[#4B2E1C]">
              <Coffee className="w-8 h-8 text-[#8B5E3C]" />
              Ruang Seduh
            </Link>
            <p className="font-teks text-[#8B5E3C] leading-relaxed">
              Duduk nyaman, siapkan alatmu. Kami di sini untuk menemani perjalananmu menemukan cangkir kopi terbaik setiap paginya.
            </p>
            <div className="pt-2 space-y-3 font-teks text-[#8B5E3C]">
              <div className="flex items-center gap-3 text-[#4B2E1C] font-medium">
                <Mail className="w-4.5 h-4.5 text-[#8B5E3C]" /> halo@ruangseduh.id
              </div>
              <div className="flex items-center gap-3 text-[#4B2E1C] font-medium">
                <MapPin className="w-4.5 h-4.5 text-[#8B5E3C]" /> Bandung, Indonesia
              </div>
            </div>
          </div>

          {/* Kolom 2: Link Navigasi Nyata */}
          <div className="space-y-5">
            <h4 className="font-judul font-bold text-xl">Eksplorasi</h4>
            <ul className="space-y-3 font-teks text-[#8B5E3C]">
              <li><Link href="/panduan" className="hover:text-[#A9683C] hover:translate-x-1 flex items-center transition-all">Panduan Seduh</Link></li>
              <li><Link href="/direktori" className="hover:text-[#A9683C] hover:translate-x-1 flex items-center transition-all">Peta Kopi Indonesia</Link></li>
              <li><Link href="/toko" className="hover:text-[#A9683C] hover:translate-x-1 flex items-center transition-all">Toko</Link></li>
              <li><Link href="/jurnal" className="hover:text-[#A9683C] hover:translate-x-1 flex items-center transition-all">Jurnal Personal</Link></li>
              <li><Link href="/blog" className="hover:text-[#A9683C] hover:translate-x-1 flex items-center transition-all">Artikel & Cerita</Link></li>
            </ul>
          </div>

          {/* Kolom 3: Newsletter */}
          <div className="space-y-5">
            <h4 className="font-judul font-bold text-xl">Satu Tegukan</h4>
            <p className="font-teks text-[#8B5E3C] leading-relaxed">
              Dapatkan tips singkat dan rekomendasi kopi pilihan setiap minggunya.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
              <input
                type="email"
                name="email"
                required
                disabled={isSubmitting}
                placeholder="Alamat email kamu..."
                className="w-full px-5 py-3.5 rounded-xl border border-[#8B5E3C]/20 focus:outline-none focus:ring-2 focus:ring-[#D4956A]/50 bg-gray-50 font-teks transition-all placeholder:text-[#8B5E3C]/50 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-5 py-3.5 bg-[#4B2E1C] text-[#FDF6EE] rounded-xl font-bold hover:bg-[#8B5E3C] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-[#4B2E1C]"
              >
                {isSubmitting ? "Mengirim..." : "Berlangganan"}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar: Copyright */}
        <div className="flex items-center justify-center pt-8 border-t border-[#8B5E3C]/10">
          <p className="font-teks text-[#8B5E3C] font-medium text-sm text-center">
            &copy; {new Date().getFullYear()} Ruang Seduh. Dirancang dengan sepenuh hati.
          </p>
        </div>
      </div>
    </footer>
  );
}