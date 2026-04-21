"use client";

import { signIn } from "next-auth/react";
import { LogIn } from "lucide-react";

interface TombolLoginGateProps {
  callbackUrl: string;
  label?: string;
}

export default function TombolLoginGate({
  callbackUrl,
  label = "Masuk dengan Google",
}: TombolLoginGateProps) {
  return (
    <button
      onClick={() => signIn("google", { callbackUrl })}
      className="inline-flex items-center gap-2 px-8 py-3 bg-[#D4956A] text-[#FDF6EE] rounded-xl font-medium hover:bg-[#4B2E1C] transition-all shadow-md hover:shadow-lg"
    >
      <LogIn className="w-5 h-5" />
      {label}
    </button>
  );
}
