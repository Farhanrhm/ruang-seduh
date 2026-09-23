"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { 
  LayoutDashboard, 
  Package, 
  MapPin, 
  Coffee, 
  Bookmark, 
  Settings, 
  LogOut 
} from "lucide-react";

export default function ProfilLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { name: "Dasbor", href: "/profil", icon: LayoutDashboard },
    { name: "Pesanan", href: "/profil/pesanan", icon: Package },
    { name: "Alamat", href: "/profil/alamat", icon: MapPin },
    { name: "Jurnal Seduh", href: "/profil/jurnal", icon: Coffee },
    { name: "Tersimpan", href: "/profil/tersimpan", icon: Bookmark },
    { name: "Pengaturan", href: "/profil/pengaturan", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#FDF6EE] pt-24 pb-20 text-[#4B2E1C]">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row gap-6 lg:gap-8 items-start">
          
          {/* Navigasi Mobile (Horizontal Scrollable Tabs) & Desktop (Sidebar) */}
          <aside className="w-full md:w-64 lg:w-72 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-[#8B5E3C]/10 md:p-4 overflow-hidden md:sticky md:top-28">
              
              {/* Container Menu */}
              <div className="flex md:flex-col overflow-x-auto scrollbar-hide md:overflow-visible p-2 md:p-0 gap-1 md:gap-2">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 md:py-3.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-200 ${
                        isActive
                          ? "bg-[#4B2E1C] text-[#FDF6EE] shadow-md shadow-[#4B2E1C]/20"
                          : "text-[#8B5E3C] hover:bg-[#8B5E3C]/10 hover:text-[#4B2E1C]"
                      }`}
                    >
                      <Icon className={`w-4 h-4 md:w-5 md:h-5 ${isActive ? "text-[#D4956A]" : "opacity-70"}`} />
                      {item.name}
                    </Link>
                  );
                })}
                
                {/* Garis Pemisah (hanya desktop) */}
                <div className="hidden md:block h-px bg-[#8B5E3C]/10 my-2 mx-4" />

                {/* Tombol Keluar */}
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex items-center gap-3 px-4 py-3 md:py-3.5 rounded-xl text-sm font-bold whitespace-nowrap text-red-600/80 hover:bg-red-50 hover:text-red-600 transition-all duration-200 mt-auto"
                >
                  <LogOut className="w-4 h-4 md:w-5 md:h-5 opacity-70" />
                  Keluar
                </button>
              </div>

            </div>
          </aside>

          {/* Konten Utama */}
          <main className="flex-1 w-full min-w-0">
            {children}
          </main>

        </div>
      </div>
    </div>
  );
}
