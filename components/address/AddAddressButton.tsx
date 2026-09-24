"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import AddressFormDrawer from "./AddressFormDrawer";

export default function AddAddressButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#4B2E1C] text-[#FDF6EE] rounded-xl text-sm font-bold hover:bg-[#8B5E3C] transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
      >
        <Plus className="w-4 h-4" /> Tambah Alamat
      </button>

      <AddressFormDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
