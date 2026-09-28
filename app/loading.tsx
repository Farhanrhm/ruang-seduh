import { Loader2 } from "lucide-react";

export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#FDF6EE]/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center border border-[#D4956A]/20">
          <Loader2 className="w-8 h-8 text-[#D4956A] animate-spin" />
        </div>
        <p className="font-judul font-bold text-[#4B2E1C] text-lg tracking-wider animate-pulse">Menyeduh...</p>
      </div>
    </div>
  );
}
