"use client";

import { useState, useEffect, useRef } from "react";
import { X, Search, Loader2 } from "lucide-react";
import { cariWilayahBiteship, type BiteshipArea } from "@/app/actions/biteship";
import { tambahAlamat, editAlamat, type AddressInput } from "@/app/actions/address";
import { useRouter } from "next/navigation";
import type { Address } from "@prisma/client";

interface AddressFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: "add" | "edit";
  initialData?: Address | null;
}

export default function AddressFormDrawer({ isOpen, onClose, mode = "add", initialData }: AddressFormDrawerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  // Form states
  const [recipientName, setRecipientName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [detailAddress, setDetailAddress] = useState("");
  const [courierNote, setCourierNote] = useState("");
  const [isDefault, setIsDefault] = useState(true);

  // Area search states
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<BiteshipArea[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedArea, setSelectedArea] = useState<BiteshipArea | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchDebounceRef = useRef<NodeJS.Timeout | null>(null);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Sinkronisasi isVisible untuk transisi CSS & Inisialisasi Data
  useEffect(() => {
    setIsVisible(isOpen);
    if (isOpen) {
      document.body.style.overflow = "hidden";
      if (mode === "edit" && initialData) {
        setRecipientName(initialData.recipientName);
        setPhoneNumber(initialData.phoneNumber);
        setDetailAddress(initialData.detailAddress);
        setCourierNote(initialData.courierNote || "");
        setIsDefault(initialData.isDefault);
        
        // Membentuk selectedArea simulasi agar lolos validasi tanpa mencari lagi
        setSelectedArea({
          id: initialData.biteshipAreaId,
          name: `${initialData.district}, ${initialData.city}, ${initialData.province}`,
          administrative_division_level_1_name: initialData.province,
          administrative_division_level_2_name: initialData.city,
          administrative_division_level_3_name: initialData.district,
          postal_code: parseInt(initialData.postalCode) || 0
        });
        setSearchQuery(`${initialData.district}, ${initialData.city}, ${initialData.province}`);
      }
    } else {
      document.body.style.overflow = "";
      // Reset form saat ditutup
      setTimeout(() => {
        setRecipientName("");
        setPhoneNumber("");
        setDetailAddress("");
        setCourierNote("");
        setSearchQuery("");
        setSearchResults([]);
        setSelectedArea(null);
        setErrorMsg("");
        setIsDefault(true);
      }, 300);
    }
    
    return () => {
      document.body.style.overflow = "";
    }
  }, [isOpen, mode, initialData]);

  // Handle escape key
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  // Debounce search biteship
  useEffect(() => {
    if (searchQuery.length < 3) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    // Jika user mengetik tapi area sudah terpilih, batalkan pilihan (karena diganti)
    if (selectedArea && searchQuery !== `${selectedArea.name}, ${selectedArea.administrative_division_level_2_name}`) {
      setSelectedArea(null);
    }

    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    
    searchDebounceRef.current = setTimeout(async () => {
      setIsSearching(true);
      const res = await cariWilayahBiteship(searchQuery);
      if (res.success && res.data) {
        setSearchResults(res.data);
        setShowDropdown(true);
      }
      setIsSearching(false);
    }, 500);

    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    };
  }, [searchQuery]);

  const handleSelectArea = (area: BiteshipArea) => {
    setSelectedArea(area);
    setSearchQuery(`${area.name}, ${area.administrative_division_level_2_name}`);
    setShowDropdown(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedArea) {
      setErrorMsg("Silakan cari dan pilih kecamatan dari daftar otomatis.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    const data: AddressInput = {
      recipientName,
      phoneNumber,
      province: selectedArea.administrative_division_level_1_name,
      city: selectedArea.administrative_division_level_2_name,
      district: selectedArea.administrative_division_level_3_name,
      postalCode: selectedArea.postal_code 
        ? selectedArea.postal_code.toString() 
        : (selectedArea.name.match(/\b\d{5}\b/)?.[0] || "00000"),
      detailAddress,
      courierNote: courierNote || undefined,
      biteshipAreaId: selectedArea.id,
      isDefault
    };

    try {
      let result;
      if (mode === "edit" && initialData?.id) {
        result = await editAlamat({ ...data, id: initialData.id });
      } else {
        result = await tambahAlamat(data);
      }
      
      setIsSubmitting(false);
      
      if (result.success) {
        onClose();
        router.refresh();
      } else {
        setErrorMsg(result.error || "Gagal menyimpan alamat.");
      }
    } catch (err) {
      setIsSubmitting(false);
      setErrorMsg("Terjadi kesalahan koneksi ke server. Silakan coba lagi.");
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-[#4B2E1C]/40 backdrop-blur-sm z-[80] transition-opacity duration-300 ${
          isVisible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 right-0 w-full sm:w-[500px] bg-[#FDF6EE] shadow-2xl z-[90] flex flex-col transition-transform duration-300 ease-[0.22,1,0.36,1] ${
          isVisible ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-label="Tambah Alamat Baru"
        aria-modal="true"
      >
        <div className="flex items-center justify-between p-6 border-b border-[#8B5E3C]/10 bg-white">
          <h2 className="font-judul text-xl font-bold text-[#4B2E1C]">
            {mode === "edit" ? "Ubah Alamat" : "Tambah Alamat Baru"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-[#8B5E3C] hover:bg-[#8B5E3C]/10 rounded-xl transition-all"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <form id="addressForm" onSubmit={handleSubmit} className="p-6 space-y-5">
            {errorMsg && (
              <div className="p-4 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-bold">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-[#8B5E3C] uppercase tracking-wider mb-2">
                Nama Penerima <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#4B2E1C] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
                placeholder="Cth: Budi Santoso"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#8B5E3C] uppercase tracking-wider mb-2">
                Nomor Handphone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ''))}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#4B2E1C] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
                placeholder="Cth: 081234567890"
              />
            </div>

            <div className="relative">
              <label className="block text-xs font-bold text-[#8B5E3C] uppercase tracking-wider mb-2">
                Kecamatan / Kelurahan <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => { if (searchResults.length > 0) setShowDropdown(true); }}
                  className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-[#4B2E1C] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
                  placeholder="Ketik minimal 3 huruf kecamatan..."
                />
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                {isSearching && (
                  <Loader2 className="w-4 h-4 text-[#D4956A] animate-spin absolute right-4 top-1/2 -translate-y-1/2" />
                )}
              </div>

              {/* Autocomplete Dropdown */}
              {showDropdown && searchResults.length > 0 && (
                <div className="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-xl border border-[#8B5E3C]/10 max-h-60 overflow-y-auto">
                  {searchResults.map((area, index) => (
                    <button
                      key={`${area.id}-${index}`}
                      type="button"
                      onClick={() => handleSelectArea(area)}
                      className="w-full text-left px-4 py-3 hover:bg-[#FDF6EE] border-b border-gray-50 last:border-0 transition-colors"
                    >
                      <p className="font-bold text-[#4B2E1C] text-sm">
                        {area.name}, {area.administrative_division_level_2_name}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {area.administrative_division_level_1_name}, {area.postal_code}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-[#8B5E3C] uppercase tracking-wider mb-2">
                Alamat Lengkap <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                value={detailAddress}
                onChange={(e) => setDetailAddress(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#4B2E1C] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] min-h-[100px] resize-none"
                placeholder="Nama jalan, gedung, no. rumah, RT/RW..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#8B5E3C] uppercase tracking-wider mb-2">
                Patokan / Catatan Kurir <span className="text-gray-400 font-normal">(Opsional)</span>
              </label>
              <input
                type="text"
                value={courierNote}
                onChange={(e) => setCourierNote(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#4B2E1C] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
                placeholder="Cth: Rumah pagar hitam depan masjid"
              />
            </div>

            <label className="flex items-center gap-3 cursor-pointer p-4 bg-white rounded-xl border border-gray-200">
              <input
                type="checkbox"
                checked={isDefault}
                onChange={(e) => setIsDefault(e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-[#D4956A] focus:ring-[#8B5E3C]"
              />
              <span className="font-bold text-sm text-[#4B2E1C]">Jadikan sebagai alamat utama</span>
            </label>
          </form>
        </div>

        <div className="p-6 bg-white border-t border-[#8B5E3C]/10">
          <button
            type="submit"
            form="addressForm"
            disabled={isSubmitting}
            className="w-full py-4 bg-[#4B2E1C] text-[#FDF6EE] rounded-xl font-bold hover:bg-[#8B5E3C] transition-all shadow-md disabled:opacity-70 flex justify-center items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Menyimpan...
              </>
            ) : (
              mode === "edit" ? "Update Alamat" : "Simpan Alamat"
            )}
          </button>
        </div>
      </div>
    </>
  );
}
