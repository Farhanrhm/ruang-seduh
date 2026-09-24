"use client";

import Image from "next/image";
import { signIn } from "next-auth/react";
import { useState, useEffect, Suspense } from "react";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

function LoginContent() {
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  
  const error = searchParams.get("error");
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  useEffect(() => {
    if (error) {
      toast.error("Proses masuk dibatalkan atau gagal. Silakan coba lagi.");
    }
  }, [error]);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await signIn("google", { callbackUrl });
    } catch (error) {
      console.error("Gagal login:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] w-full flex bg-[#FDFBF7]">
      {/* Kiri: Gambar Estetik (Tersembunyi di layar kecil) */}
      <div className="hidden lg:flex w-1/2 relative bg-[#4B2E1C]">
        <Image
          src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=2071&auto=format&fit=crop"
          alt="Suasana menyeduh kopi"
          fill
          className="object-cover opacity-90 mix-blend-overlay"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Quote opsional di pojok bawah */}
        <div className="absolute bottom-12 left-12 right-12 text-white">
          <h2 className="font-heading text-3xl mb-4 font-bold tracking-tight">Kopi yang baik, berawal dari ruang yang seduh.</h2>
          <p className="font-teks text-white/80 leading-relaxed text-lg">
            Masuk untuk menjelajahi jurnal personalmu, melacak pesanan biji kopi, dan menikmati fitur eksklusif Ruang Seduh.
          </p>
        </div>
      </div>

      {/* Kanan: Form Login */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-24">
        <div className="w-full max-w-md space-y-12">
          
          {/* Header & Logo */}
          <div className="space-y-6 text-center">
            <div className="flex justify-center mb-8">
              <Image 
                src="/logo-clear.png" 
                alt="Logo Ruang Seduh Kopi Spesialis" 
                width={300} 
                height={100} 
                className="h-16 w-auto object-contain"
                priority
              />
            </div>
            <h1 className="text-3xl font-heading font-bold text-[#4B2E1C]">Selamat Datang Kembali</h1>
            <p className="font-teks text-[#8B5E3C] text-lg">
              Silakan masuk menggunakan akun Google kamu untuk melanjutkan.
            </p>
          </div>

          {/* Tombol Login */}
          <div className="pt-4">
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 bg-white border-2 border-[#E5E5E5] text-[#4B2E1C] px-6 py-4 rounded-xl font-teks font-bold text-lg hover:bg-gray-50 hover:border-[#8B5E3C]/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5E3C] focus-visible:ring-offset-2 transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin text-[#8B5E3C]" />
              ) : (
                <>
                  <svg className="w-6 h-6 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Lanjutkan dengan Google
                </>
              )}
            </button>
            <p className="text-center font-teks text-sm text-gray-500 mt-6">
              Dengan masuk, kamu menyetujui Syarat dan Ketentuan serta Kebijakan Privasi Ruang Seduh.
            </p>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[85vh] w-full flex items-center justify-center bg-[#FDFBF7]"><Loader2 className="w-8 h-8 animate-spin text-[#8B5E3C]" /></div>}>
      <LoginContent />
    </Suspense>
  );
}
