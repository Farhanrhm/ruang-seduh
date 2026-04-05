"use client";

import { useState, useTransition } from "react";
import { tambahKomentar } from "@/app/actions/komentar";
import { Send, MessageSquareText } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function FormKomentar({ slug, userId }: { slug: string; userId?: string }) {
  const [text, setText] = useState("");
  const [isPending, startTransition] = useTransition();

  // Tampilan jika user BELUM login
  if (!userId) {
    return (
      <div className="bg-[#4B2E1C]/5 rounded-3xl p-8 text-center border border-[#8B5E3C]/10 flex flex-col items-center">
        <MessageSquareText className="w-10 h-10 text-[#8B5E3C]/50 mb-4" />
        <h4 className="font-judul text-xl font-bold text-[#4B2E1C] mb-2">Ingin ikut berdiskusi?</h4>
        <p className="text-[#8B5E3C] font-teks mb-6 text-sm max-w-sm">
          Bagikan pengalaman, tanya resep, atau sekadar menyapa penikmat kopi lainnya. Masuk terlebih dahulu yuk!
        </p>
        <Link href="/api/auth/signin" className="px-8 py-3 bg-[#4B2E1C] text-[#FDF6EE] rounded-full font-bold hover:bg-[#8B5E3C] transition-all shadow-md">
          Masuk / Daftar
        </Link>
      </div>
    );
  }

  // Tampilan jika user SUDAH login
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    startTransition(async () => {
      try {
        await tambahKomentar(slug, text);
        setText("");
        toast.success("Komentar berhasil dikirim!");
      } catch (error) {
        console.error("Detail Error Komentar:", error);
        toast.error("Gagal mengirim komentar.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="relative group">
      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Tulis pendapat atau pertanyaanmu di sini..."
          disabled={isPending}
          maxLength={500}
          className="w-full bg-white border border-[#8B5E3C]/20 rounded-3xl p-5 pr-16 min-h-[140px] focus:outline-none focus:ring-2 focus:ring-[#D4956A] focus:border-transparent resize-y font-teks text-[#4B2E1C] shadow-sm transition-all"
        />
        <div className="absolute bottom-4 left-5 text-[10px] font-bold text-[#8B5E3C]/40 uppercase tracking-widest">
          {text.length} / 500
        </div>
        <button
          type="submit"
          disabled={isPending || !text.trim()}
          className="absolute bottom-5 right-5 p-3.5 bg-[#D4956A] text-white rounded-2xl hover:bg-[#b57a52] disabled:opacity-50 disabled:hover:bg-[#D4956A] transition-all shadow-md group-focus-within:animate-pulse"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
}