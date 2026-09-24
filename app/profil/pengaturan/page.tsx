import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Settings } from "lucide-react";
import { prisma } from "@/lib/prisma";
import ProfileForm from "@/components/profile/ProfileForm";

export default async function PengaturanPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true, newsletter: true }
  });

  if (!user) {
    redirect("/");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-[#8B5E3C]/10">
        <h2 className="font-judul text-2xl font-bold text-[#4B2E1C] flex items-center gap-3">
          <Settings className="w-6 h-6 text-[#D4956A]" /> Pengaturan Akun
        </h2>
      </div>

      <div className="bg-white rounded-2xl border border-[#8B5E3C]/10 shadow-sm overflow-hidden mt-6">
        <ProfileForm 
          initialName={user.name || ""} 
          initialEmail={user.email || ""} 
          initialNewsletter={user.newsletter} 
        />
      </div>
    </div>
  );
}
