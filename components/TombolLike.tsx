"use client";

import { useState, useTransition } from "react";
import { toggleLike } from "@/app/actions/komentar";
import { Heart } from "lucide-react";

export default function TombolLike({ commentId, slug, initialLikes, hasLiked, isGuest }: any) {
  const [isPending, startTransition] = useTransition();
  const [optimisticLiked, setOptimisticLiked] = useState(hasLiked);
  const [optimisticCount, setOptimisticCount] = useState(initialLikes);

  const handleLike = () => {
    if (isGuest) return alert("Silakan login untuk menyukai komentar.");
    
    // Efek UI instan (Optimistic Update) agar tidak terasa lag
    setOptimisticLiked(!optimisticLiked);
    setOptimisticCount(optimisticLiked ? optimisticCount - 1 : optimisticCount + 1);

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