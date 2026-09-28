"use client";

import { useState, useTransition, useEffect } from "react";
import { toggleLike } from "@/app/actions/komentar";
import { Heart } from "lucide-react";
import { useSession } from "next-auth/react";

export default function TombolLike({ commentId, slug, initialLikes, likes = [] }: any) {
  const { data: session } = useSession();
  const [isPending, startTransition] = useTransition();
  const [localAction, setLocalAction] = useState<"liked" | "unliked" | null>(null);

  const serverHasLiked = session?.user?.id ? likes.some((like: any) => like.userId === session.user.id) : false;
  
  const optimisticLiked = localAction === "liked" ? true : localAction === "unliked" ? false : serverHasLiked;
  const optimisticCount = initialLikes + (localAction === "liked" && !serverHasLiked ? 1 : localAction === "unliked" && serverHasLiked ? -1 : 0);

  const handleLike = () => {
    if (!session?.user) return alert("Silakan login untuk menyukai komentar.");
    
    // Efek UI instan
    setLocalAction(optimisticLiked ? "unliked" : "liked");

    startTransition(async () => {
      await toggleLike(commentId, slug);
    });
  };

  return (
    <button 
      onClick={handleLike} 
      disabled={isPending} 
      className={`flex items-center gap-1.5 text-xs font-bold transition-transform active:scale-90 ${optimisticLiked ? 'text-red-500' : 'text-[#8B5E3C] hover:text-red-400'}`}
    >
      <Heart className={`w-4 h-4 transition-all ${optimisticLiked ? 'fill-red-500 scale-110' : ''}`} /> 
      {optimisticCount} Suka
    </button>
  );
}