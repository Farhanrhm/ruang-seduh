"use client";

import { useSession } from "next-auth/react";
import AuthPromptBlog from "@/components/AuthPromptBlog";

export default function BlogAuthGate({ 
  children, 
  postTitle, 
  imageUrl, 
  slug 
}: { 
  children: React.ReactNode, 
  postTitle: string, 
  imageUrl?: string, 
  slug: string 
}) {
  const { data: session, status } = useSession();
  
  // Menunggu status session
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#FDF6EE] flex items-center justify-center text-[#8B5E3C] font-bold">
        Memuat konten...
      </div>
    );
  }
  
  // Jika tidak login, tampilkan overlay AuthPrompt (konten utama di balik ini tidak akan muncul ke user, tapi ada di HTML sumber)
  if (!session?.user?.id) {
    return <AuthPromptBlog title={postTitle} imageUrl={imageUrl} slug={slug} />;
  }

  // Jika login, tampilkan konten asli
  return <>{children}</>;
}
