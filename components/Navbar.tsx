"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import AuthButton from "./AuthButton";
import KeranjangBelanja from "./KeranjangBelanja";
import { useState, useEffect } from "react";

const NAV_LINKS = [
  { href: "/panduan",   label: "Panduan Seduh" },
  { href: "/direktori", label: "Direktori Kopi" },
  { href: "/toko",      label: "Toko" },
  { href: "/jurnal",    label: "Jurnal Seduh" },
  { href: "/blog",      label: "Blog" },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Tutup menu saat ukuran layar berubah ke desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMobileMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Cegah scroll body saat mobile menu terbuka
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-[#8B5E3C]/10 bg-[#FDF6EE]/80 backdrop-blur-md">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex h-20 items-center justify-between">

            <Link href="/" className="font-judul text-3xl font-black text-[#4B2E1C] tracking-tight" onClick={() => setIsMobileMenuOpen(false)}>
              Ruang Seduh
            </Link>

            {/* Navigasi Desktop */}
            <nav className="hidden md:flex items-center gap-8 font-teks text-sm font-bold text-[#8B5E3C]">
              {NAV_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className="hover:text-[#D4956A] transition-colors">
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-5 text-[#4B2E1C]">
              <AuthButton />
              <KeranjangBelanja />

              {/* Tombol Hamburger Mobile */}
              <button
                aria-label={isMobileMenuOpen ? "Tutup Menu" : "Buka Menu"}
                aria-expanded={isMobileMenuOpen}
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                className="md:hidden hover:text-[#D4956A] transition-colors"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#FDF6EE] flex flex-col pt-24 pb-10 px-8 md:hidden"
          role="dialog"
          aria-label="Menu navigasi"
        >
          <nav className="flex flex-col gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="font-judul text-3xl font-black text-[#4B2E1C] hover:text-[#D4956A] transition-colors border-b border-[#8B5E3C]/10 pb-5"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}