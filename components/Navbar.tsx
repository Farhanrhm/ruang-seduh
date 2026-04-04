import Link from "next/link";
import { ShoppingBag, Menu } from "lucide-react";
import AuthButton from "./AuthButton"; 
import KeranjangBelanja from "./KeranjangBelanja";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#8B5E3C]/10 bg-[#FDF6EE]/80 backdrop-blur-md">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex h-20 items-center justify-between">
          
          <Link href="/" className="font-judul text-3xl font-black text-[#4B2E1C] tracking-tight">
            Ruang Seduh
          </Link>

          <nav className="hidden md:flex items-center gap-8 font-teks text-sm font-bold text-[#8B5E3C]">
            <Link href="/panduan" className="hover:text-[#D4956A] transition-colors">Panduan Seduh</Link>
            <Link href="/direktori" className="hover:text-[#D4956A] transition-colors">Direktori Kopi</Link>
            <Link href="/toko" className="hover:text-[#D4956A] transition-colors">Toko</Link>
            <Link href="/jurnal" className="hover:text-[#D4956A] transition-colors">Jurnal Seduh</Link>
            <Link href="/blog" className="hover:text-[#D4956A] transition-colors">Blog</Link>
          </nav>

          <div className="flex items-center gap-5 text-[#4B2E1C]">
            <AuthButton />
            
            <KeranjangBelanja />
            
            <button aria-label="Menu" className="md:hidden hover:text-[#D4956A] transition-colors">
              <Menu className="h-6 w-6" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}