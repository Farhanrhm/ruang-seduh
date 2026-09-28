"use client";

import { useState } from "react";
import { AlertTriangle, Trash2 } from "lucide-react";
import { deleteAccount } from "@/app/actions/profile";
import { signOut } from "next-auth/react";
import toast from "react-hot-toast";

export default function DeleteAccount() {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const result = await deleteAccount();
      if (result.success) {
        toast.success("Akun berhasil dihapus secara permanen.", {
          style: { background: "#4B2E1C", color: "#FDF6EE" }
        });
        // Sign out akan mengarahkan ke halaman utama
        await signOut({ callbackUrl: "/" });
      } else {
        toast.error(result.error || "Gagal menghapus akun.");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan sistem.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 bg-red-50/30 border border-red-100 rounded-2xl shadow-sm mt-6">
      <h3 className="font-judul text-lg font-bold text-red-700 mb-2 flex items-center gap-2">
        <AlertTriangle className="w-5 h-5" /> Zona Berbahaya
      </h3>
      <p className="font-teks text-sm text-red-600/80 mb-6 max-w-2xl leading-relaxed">
        Menghapus akun Anda bersifat permanen dan tidak dapat dibatalkan. Semua data pribadi, alamat, dan interaksi Anda akan dihapus. Data transaksi finansial (riwayat pesanan) akan dianominasi (Right to Erasure - UU PDP) untuk keperluan kepatuhan pajak.
      </p>

      {!isConfirming ? (
        <button
          onClick={() => setIsConfirming(true)}
          className="px-6 py-2.5 bg-white text-red-600 border border-red-200 rounded-xl text-sm font-bold hover:bg-red-50 transition-all focus:outline-none focus:ring-2 focus:ring-red-200 shadow-sm flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" /> Hapus Akun Secara Permanen
        </button>
      ) : (
        <div className="bg-white p-5 rounded-xl border border-red-200 shadow-sm max-w-xl">
          <p className="font-bold text-gray-800 text-sm mb-4">
            Apakah Anda yakin ingin menghapus akun ini selamanya? Tindakan ini tidak bisa diurungkan.
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleDelete}
              disabled={isLoading}
              className="px-6 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {isLoading ? "Menghapus..." : "Ya, Hapus Akun Saya"}
            </button>
            <button
              onClick={() => setIsConfirming(false)}
              disabled={isLoading}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-200 transition-all"
            >
              Batal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
