"use client";

import { useState, useTransition } from "react";
import { hapusJurnal } from "@/app/actions/jurnal";
import { Trash2, Loader2, AlertCircle, X } from "lucide-react";

export default function TombolHapus({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();
  const [isModalOpen, setIsModalOpen] = useState(false); 

  // Fungsi untuk mengeksekusi penghapusan
  const handleHapus = () => {
    startTransition(async () => {
      await hapusJurnal(id);
      setIsModalOpen(false); 
    });
  };

  return (
    <>
      {/* Tombol Pemicu (Ikon Sampah) */}
      <button
        onClick={() => setIsModalOpen(true)}
        disabled={isPending}
        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
        title="Hapus Jurnal"
      >
        {isPending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Trash2 className="w-4 h-4" />
        )}
      </button>

      {/* Custom Modal Dialog (Pengganti Alert Localhost) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl transform transition-all border border-[#8B5E3C]/10 animate-in fade-in zoom-in duration-200">
            
            {/* Header Modal */}
            <div className="flex justify-between items-start mb-5">
              <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center flex-shrink-0 border border-red-100">
                <AlertCircle className="w-6 h-6 text-red-500" />
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Konten Teks */}
            <h3 className="font-judul text-xl font-bold text-[#4B2E1C] mb-2">Hapus Catatan?</h3>
            <p className="font-teks text-sm text-[#8B5E3C] mb-8 leading-relaxed">
              Apakah kamu yakin ingin membuang catatan eksperimen ini? Tindakan ini tidak dapat dibatalkan dan resepmu akan hilang.
            </p>

            {/* Tombol Aksi */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                disabled={isPending}
                className="flex-1 py-3 px-4 bg-[#FDF6EE] text-[#8B5E3C] font-bold rounded-xl hover:bg-[#f5e6d3] transition-colors text-sm border border-[#8B5E3C]/20"
              >
                Batal
              </button>
              <button
                onClick={handleHapus}
                disabled={isPending}
                className="flex-1 py-3 px-4 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors flex items-center justify-center gap-2 text-sm shadow-md shadow-red-500/20"
              >
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Ya, Hapus"}
              </button>
            </div>
            
          </div>
        </div>
      )}
    </>
  );
}