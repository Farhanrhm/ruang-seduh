"use client";

import { useState } from "react";
import { Edit2, Trash2, Loader2, AlertCircle } from "lucide-react";
import AddressFormDrawer from "./AddressFormDrawer";
import { hapusAlamat } from "@/app/actions/address";
import type { Address } from "@prisma/client";

interface AddressCardActionsProps {
  address: Address;
}

export default function AddressCardActions({ address }: AddressCardActionsProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleDelete = async () => {
    setIsDeleting(true);
    setErrorMsg("");
    
    const result = await hapusAlamat(address.id);
    
    setIsDeleting(false);
    
    if (result.success) {
      setIsDeleteModalOpen(false);
    } else {
      setErrorMsg(result.error || "Gagal menghapus alamat.");
    }
  };

  return (
    <>
      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[#8B5E3C]/10">
        <button
          onClick={() => setIsEditOpen(true)}
          className="flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold text-[#8B5E3C] bg-white border border-[#8B5E3C]/20 rounded-lg hover:bg-[#FDF6EE] transition-colors"
        >
          <Edit2 className="w-3.5 h-3.5" /> Ubah
        </button>
        <button
          onClick={() => setIsDeleteModalOpen(true)}
          className="flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" /> Hapus
        </button>
      </div>

      <AddressFormDrawer
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        mode="edit"
        initialData={address}
      />

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="font-judul text-lg font-bold text-[#4B2E1C] mb-2">Hapus Alamat?</h3>
              <p className="text-sm text-gray-500 mb-6">
                Apakah Anda yakin ingin menghapus alamat <span className="font-bold text-[#8B5E3C]">"{address.label || address.recipientName}"</span>? Tindakan ini tidak dapat dibatalkan.
              </p>
              
              {errorMsg && (
                <div className="w-full p-3 mb-4 text-xs font-bold text-red-600 bg-red-50 border border-red-100 rounded-lg">
                  {errorMsg}
                </div>
              )}

              <div className="flex w-full gap-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  disabled={isDeleting}
                  className="flex-1 py-2.5 text-sm font-bold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 py-2.5 text-sm font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isDeleting ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Menghapus...</>
                  ) : (
                    "Ya, Hapus"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
