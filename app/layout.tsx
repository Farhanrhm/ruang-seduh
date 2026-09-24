import type { Metadata } from "next";
import { Lora, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers"; 
import CartDrawerWrapper from "@/components/CartDrawerWrapper";
import ScrollToTop from "@/components/ScrollToTop";
import { Toaster } from 'react-hot-toast';

const lora = Lora({ 
  subsets: ["latin"], 
  variable: "--font-lora",
  display: "swap",
});

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ruang Seduh | Teman Menyeduh Kopi di Rumah",
  description: "Platform belajar menyeduh kopi rumahan secara menyenangkan.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${lora.variable} ${inter.variable} font-teks antialiased bg-[#FDF6EE] text-[#4B2E1C]`} suppressHydrationWarning>
        <Providers>
          <Toaster position="bottom-center" />
          <Navbar />
          <main>{children}</main>
          <Footer />
          <CartDrawerWrapper />
          <ScrollToTop />
        </Providers>
      </body>
    </html>
  );
}