"use client";

import { useState, useTransition } from "react";
import { hapusKomentar, togglePin } from "@/app/actions/komentar";
import { Pin, Trash2, Loader2, AlertTriangle, X, Check } from "lucide-react";
import toast from "react-hot-toast";

export default function TombolAksiKomentar({ commentId, slug, isAdmin, isPinned }: any) {
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false); // State untuk konfirmasi UI

  // Jika bukan Admin, jangan tampilkan apa-apa sama sekali
  if (!isAdmin) return null;

  const handlePin = () => {
    startTransition(async () => {
      try {
        await togglePin(commentId, slug);
        toast.success(isPinned ? "Komentar dilepas" : "Komentar disematkan");
      } catch (err) { toast.error("Gagal melakukan aksi"); }
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await hapusKomentar(commentId, slug);
        toast.success("Komentar berhasil dihapus permanen");
        setShowConfirm(false);
      } catch (err) { toast.error("Gagal menghapus komentar"); }
    });
  };

  return (
    <div className="flex items-center gap-2">
      {/* Jika tombol hapus diklik, tampilkan mode konfirmasi UI */}
      {showConfirm ? (
        <div className="flex items-center gap-2 bg-red-50 text-red-600 px-3 py-1.5 rounded-xl border border-red-100 text-[10px] font-black tracking-wider animate-in fade-in zoom-in duration-200">
          <AlertTriangle className="w-3.5 h-3.5" /> HAPUS?
          <button onClick={handleDelete} disabled={isPending} className="p-1 hover:bg-red-200 rounded-md text-red-700 transition-colors ml-1">
            {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
          </button>
          <button onClick={() => setShowConfirm(false)} disabled={isPending} className="p-1 hover:bg-red-200 rounded-md text-red-700 transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        /* Tampilan Default (Muncul saat di-hover) */
        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={handlePin} disabled={isPending} className={`p-1.5 rounded-lg transition-colors ${isPinned ? 'text-[#D4956A] bg-[#D4956A]/10' : 'text-gray-400 hover:bg-gray-100'}`} title="Sematkan">
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Pin className={`w-4 h-4 ${isPinned ? 'fill-[#D4956A]' : ''}`} />}
          </button>
          <button onClick={() => setShowConfirm(true)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Hapus Permanen">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}