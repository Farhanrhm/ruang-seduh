"use client";

import { signIn } from "next-auth/react";
import { LogIn } from "lucide-react";

export default function TombolLogin() {
  return (
    <button
      onClick={() => signIn("google")}
      className="inline-flex items-center gap-2 px-8 py-3 bg-[#D4956A] text-white rounded-xl font-medium hover:bg-[#b57a52] transition-all shadow-md hover:shadow-lg"
    >
      <LogIn className="w-5 h-5" />
      Masuk dengan Google
    </button>
  );
}