"use client";

import { useState, useTransition, useEffect } from "react";
import { Bookmark } from "lucide-react";
import toast from "react-hot-toast";
import { toggleBookmark, checkBookmarkStatus } from "@/app/actions/bookmark";
import { useRouter } from "next/navigation";

interface BookmarkButtonProps {
  slug: string;
  title: string;
}

export default function BookmarkButton({ slug, title }: BookmarkButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [optimisticSaved, setOptimisticSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch initial state client-side to keep the parent page statically cached (ISR)
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const saved = await checkBookmarkStatus(slug);
        setOptimisticSaved(saved);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStatus();
  }, [slug]);

  const handleToggle = () => {
    // 1. Optimistic Update (Immediate Feedback)
    const previousState = optimisticSaved;
    setOptimisticSaved(!previousState);

    // 2. Server Action call wrapped in transition
    startTransition(async () => {
      const res = await toggleBookmark(slug, "guide");
      
      if (!res.success) {
        // Rollback on Error
        setOptimisticSaved(previousState);
        
        if (res.error === "Silakan masuk untuk menyimpan artikel.") {
          // Auth guard: Guest users
          toast.error(res.error, { icon: "🔒" });
          router.push("/login");
        } else {
          // General error
          toast.error(res.error || "Gagal menyimpan artikel.");
        }
      } else {
        // Success
        setOptimisticSaved(res.saved || false); // Ensure sync with server response
        if (res.saved) {
          toast.success(`"${title}" disimpan ke Ruang Baca!`, { icon: "🔖" });
        } else {
          toast.success(`Artikel dihapus dari Ruang Baca.`);
        }
      }
    });
  };

  if (isLoading) {
    return (
      <div className="w-12 h-12 bg-white rounded-xl border border-[#8B5E3C]/10 animate-pulse shadow-sm"></div>
    );
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      aria-label={optimisticSaved ? "Hapus dari Tersimpan" : "Simpan Artikel"}
      className={`
        relative p-3 rounded-xl transition-all duration-300 flex items-center justify-center border shadow-sm group
        ${optimisticSaved 
          ? "bg-[#FDF6EE] border-[#D4956A]/50 text-[#D4956A]" 
          : "bg-white border-[#8B5E3C]/10 text-[#8B5E3C] hover:border-[#D4956A]/50 hover:bg-[#FDF6EE] hover:text-[#D4956A]"
        }
      `}
    >
      <Bookmark 
        className={`w-6 h-6 transition-all duration-300 ease-out ${
          optimisticSaved 
            ? "fill-[#D4956A] scale-110 drop-shadow-md" 
            : "group-hover:scale-110 group-active:scale-95"
        }`} 
      />
    </button>
  );
}
