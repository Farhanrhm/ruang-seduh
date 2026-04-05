"use client";

import { useTransition } from "react";
import { hapusKomentar, togglePin } from "@/app/actions/komentar";
import { Pin, Trash2, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function TombolAksiKomentar({ commentId, slug, isAdmin, isPinned, isOwner }: any) {
  const [isPending, startTransition] = useTransition();

  const handleAction = (actionType: 'pin' | 'delete') => {
    if (actionType === 'delete' && !window.confirm("Hapus komentar ini secara permanen?")) return;

    startTransition(async () => {
      try {
        if (actionType === 'pin') await togglePin(commentId, slug);
        if (actionType === 'delete') await hapusKomentar(commentId, slug);
        toast.success(actionType === 'pin' ? "Status pin diperbarui" : "Komentar dihapus");
      } catch (err) {
        toast.error("Gagal melakukan aksi");
      }
    });
  };

  if (!isAdmin && !isOwner) return null;

  return (
    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
      {isAdmin && (
        <button onClick={() => handleAction('pin')} disabled={isPending} className={`p-1.5 rounded-lg transition-colors ${isPinned ? 'text-[#D4956A] bg-[#D4956A]/10' : 'text-gray-400 hover:bg-gray-100'}`}>
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Pin className={`w-4 h-4 ${isPinned ? 'fill-[#D4956A]' : ''}`} />}
        </button>
      )}
      {(isAdmin || isOwner) && (
        <button onClick={() => handleAction('delete')} disabled={isPending} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
