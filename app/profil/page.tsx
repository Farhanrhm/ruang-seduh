import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Image from "next/image";

export default async function ProfilPage() {
  // Mengecek sesi langsung dari sisi server!
  const session = await getServerSession(authOptions);

  // Jika belum login, tendang kembali ke Beranda
  if (!session) {
    redirect("/");
  }

  return (
    <div className="container mx-auto px-4 py-16 min-h-[60vh]">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-[#8B5E3C]/10">
        <h1 className="font-judul text-3xl font-bold text-[#3D2B1F] mb-8">Profil Saya</h1>
        
        <div className="flex items-center gap-6">
          <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-[#FDF6EE] shadow-md">
            {session.user?.image ? (
              <Image src={session.user.image} alt="Profil" width={96} height={96} />
            ) : (
              <div className="h-full w-full bg-[#8B5E3C]/20" />
            )}
          </div>
          <div>
            <h2 className="font-judul text-2xl font-semibold text-[#3D2B1F]">{session.user?.name}</h2>
            <p className="font-teks text-[#8B5E3C]">{session.user?.email}</p>
            <span className="inline-block mt-2 px-3 py-1 bg-[#D4956A]/20 text-[#D4956A] text-xs font-semibold rounded-full">
              Member Ruang Seduh
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}