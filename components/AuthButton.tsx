"use client";

import { useState, useRef, useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { User, LogOut, Settings, ShoppingBag, BookOpen, Bookmark, ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AuthButton() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Handle click outside untuk menutup dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    // Handle escape key
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  // Jika sedang mengecek sesi (loading), tampilkan skeleton lingkaran
  if (status === "loading") {
    return (
      <div className="h-9 w-[88px] rounded-full bg-[#8B5E3C]/10 animate-pulse border border-[#8B5E3C]/5" />
    );
  }

  // Jika SUDAH login: Tampilkan Profil Dropdown
  if (session && session.user) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-haspopup="true"
          className={`group flex items-center gap-2 rounded-full p-1 pr-3 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] focus:ring-offset-2 focus:ring-offset-[#FDF6EE] ${
            isOpen ? "bg-[#FDF6EE] border-[#D4956A] shadow-inner" : "hover:bg-[#FDF6EE] border-transparent"
          } border border-solid`}
          title="Menu Profil"
          aria-label="Menu Profil"
        >
          <div className="relative h-9 w-9 rounded-full overflow-hidden border-2 border-[#8B5E3C]/20 group-hover:border-[#D4956A] transition-colors flex-shrink-0">
            {session.user.image ? (
              <Image 
                src={session.user.image} 
                alt={session.user.name || "Profil"} 
                fill
                sizes="36px"
                className="object-cover"
                priority
              />
            ) : (
              <div className="h-full w-full bg-[#FDF6EE] flex items-center justify-center font-bold text-[#A9683C] text-sm uppercase tracking-widest">
                {session.user.name?.[0] || "U"}
              </div>
            )}
          </div>
          <ChevronDown className={`w-4 h-4 text-[#8B5E3C] transition-transform duration-300 ${isOpen ? "rotate-180 text-[#D4956A]" : "group-hover:text-[#D4956A]"}`} />
        </button>

        {/* DROPDOWN MENU */}
        {isOpen && (
          <div 
            className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-[#8B5E3C]/15 overflow-hidden z-50 animate-dropdownPop origin-top-right"
            role="menu"
            aria-orientation="vertical"
          >
            {/* Header Dropdown - Menampilkan Info Session */}
            <div className="px-5 py-4 border-b border-[#8B5E3C]/10 bg-gradient-to-br from-[#FDF6EE]/50 to-white">
              <p className="font-judul font-bold text-[#4B2E1C] truncate">{session.user.name}</p>
              <p className="font-teks text-xs text-[#8B5E3C] truncate mt-0.5">{session.user.email}</p>
            </div>
            
            {/* List Menu */}
            <div className="py-2 px-2 font-teks">
              <Link 
                href="/profil" 
                className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-[#4B2E1C] hover:bg-[#FDF6EE] hover:text-[#A9683C] transition-colors focus:outline-none focus:bg-[#FDF6EE]"
                onClick={closeMenu}
                role="menuitem"
              >
                <User className="w-4 h-4 text-[#8B5E3C] group-hover:text-[#D4956A] group-hover:translate-x-0.5 transition-all" /> 
                Dasbor Profil
              </Link>
              
              <Link 
                href="/profil/pesanan" 
                className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-[#4B2E1C] hover:bg-[#FDF6EE] hover:text-[#A9683C] transition-colors focus:outline-none focus:bg-[#FDF6EE]"
                onClick={closeMenu}
                role="menuitem"
              >
                <ShoppingBag className="w-4 h-4 text-[#8B5E3C] group-hover:text-[#D4956A] group-hover:translate-x-0.5 transition-all" /> 
                Pesanan Saya
              </Link>

              <Link 
                href="/profil/jurnal" 
                className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-[#4B2E1C] hover:bg-[#FDF6EE] hover:text-[#A9683C] transition-colors focus:outline-none focus:bg-[#FDF6EE]"
                onClick={closeMenu}
                role="menuitem"
              >
                <BookOpen className="w-4 h-4 text-[#8B5E3C] group-hover:text-[#D4956A] group-hover:translate-x-0.5 transition-all" /> 
                Jurnal Seduh
              </Link>

              <Link 
                href="/profil/tersimpan" 
                className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-[#4B2E1C] hover:bg-[#FDF6EE] hover:text-[#A9683C] transition-colors focus:outline-none focus:bg-[#FDF6EE]"
                onClick={closeMenu}
                role="menuitem"
              >
                <Bookmark className="w-4 h-4 text-[#8B5E3C] group-hover:text-[#D4956A] group-hover:translate-x-0.5 transition-all" /> 
                Artikel Tersimpan
              </Link>

              <Link 
                href="/profil/pengaturan" 
                className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-[#4B2E1C] hover:bg-[#FDF6EE] hover:text-[#A9683C] transition-colors focus:outline-none focus:bg-[#FDF6EE]"
                onClick={closeMenu}
                role="menuitem"
              >
                <Settings className="w-4 h-4 text-[#8B5E3C] group-hover:text-[#D4956A] group-hover:translate-x-0.5 transition-all" /> 
                Pengaturan
              </Link>
            </div>
            
            {/* Footer / Keluar */}
            <div className="p-2 border-t border-[#8B5E3C]/10">
              <button 
                onClick={() => { closeMenu(); signOut({ callbackUrl: '/' }); }}
                className="group flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors focus:outline-none focus:bg-red-50"
                role="menuitem"
              >
                <LogOut className="w-4 h-4 text-red-400 group-hover:text-red-500 group-hover:-translate-x-0.5 transition-all" /> 
                Keluar
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Jika BELUM login: Tampilkan tombol "Masuk" berbentuk pill yang lebih premium
  return (
    <button 
      onClick={() => signIn("google")} 
      aria-label="Masuk atau Daftar"
      className="flex items-center gap-2 bg-[#4B2E1C] text-[#FDF6EE] hover:bg-[#8B5E3C] hover:shadow-md px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] focus:ring-offset-2"
    >
      <User className="h-3.5 w-3.5" />
      Masuk
    </button>
  );
}