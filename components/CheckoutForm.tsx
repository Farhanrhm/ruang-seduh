"use client";

import { useCartStore } from "@/store/useCartStore";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Loader2, ShieldCheck, MapPin, User, Minus, Plus, Trash2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { kirimEmailInvoice } from "@/app/actions/email";
import { buatPesanan } from "@/app/actions/order";
import { cariWilayahBiteship, hitungOngkirBiteship, type BiteshipArea, type ShippingRate } from "@/app/actions/biteship";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckoutSchema, type CheckoutInput, type CheckoutOutput } from "@/lib/validations/checkout";
import Script from "next/script";

export default function CheckoutForm({ prefillData }: { prefillData: { name: string; email: string } }) {
  const { items, clearCart, updateQuantity, updateGrindSize, removeItem } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<BiteshipArea[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const [shippingRates, setShippingRates] = useState<ShippingRate[]>([]);
  const [isLoadingRates, setIsLoadingRates] = useState(false);
  const [ratesError, setRatesError] = useState<string | null>(null);
  const [selectedOngkir, setSelectedOngkir] = useState<number>(0);

  const totalWeight = items.reduce((sum, item) => sum + (item.weight || 200) * item.quantity, 0);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.length >= 3) {
        setIsLoading(true);
        setSearchError(null);
        const res = await cariWilayahBiteship(searchQuery);
        if (res.success && res.data) {
          setSearchResults(res.data);
          setIsDropdownOpen(true);
        } else {
          setSearchResults([]);
          if (!res.success && res.error) {
            setSearchError(res.error);
          }
          // Force open dropdown to show "not found" or error if query >= 3
          setIsDropdownOpen(true);
        }
        setIsLoading(false);
      } else {
        setSearchResults([]);
        setIsDropdownOpen(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<CheckoutInput>({
    resolver: zodResolver(CheckoutSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      nama: prefillData.name,
      email: prefillData.email,
      whatsapp: "",
      biteshipAreaId: "",
      provinsi: "",
      kota: "",
      kecamatan: "",
      kodepos: "",
      detailAlamat: "",
      patokan: "",
      simpanAlamat: false,
      labelAlamat: "",
      catatanPesanan: "",
      kurir: "",
      layananKurir: "",
      syaratKetentuan: false,
    },
  });

  const selectedAreaId = watch("biteshipAreaId");
  const simpanAlamat = watch("simpanAlamat");

  // Load draft from localStorage on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem("checkout_draft");
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        Object.keys(parsed).forEach((key) => {
          // Don't restore sensitive or volatile data like T&C
          if (key !== "syaratKetentuan") {
            setValue(key as keyof CheckoutInput, parsed[key]);
          }
        });
        if (parsed.provinsi && parsed.kota && parsed.kecamatan) {
          setSearchQuery(`${parsed.kecamatan}, ${parsed.kota}, ${parsed.provinsi}`);
        }
      } catch (e) {
        console.error("Failed to parse draft", e);
      }
    }
  }, [setValue]);

  // Save draft to localStorage on change
  useEffect(() => {
    const subscription = watch((value) => {
      localStorage.setItem("checkout_draft", JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const handleSelectArea = (area: BiteshipArea) => {
    setValue("biteshipAreaId", area.id, { shouldValidate: true });
    setValue("provinsi", area.administrative_division_level_1_name, { shouldValidate: true });
    setValue("kota", area.administrative_division_level_2_name, { shouldValidate: true });
    setValue("kecamatan", area.administrative_division_level_3_name, { shouldValidate: true });
    
    // Cerdas: Jika postal_code kosong, coba ekstrak 5 digit angka dari area.name (seperti "Kiaracondong... 40283")
    const extractedPostal = area.name.match(/\b\d{5}\b/);
    const finalPostalCode = area.postal_code ? area.postal_code.toString() : (extractedPostal ? extractedPostal[0] : "00000");
    setValue("kodepos", finalPostalCode, { shouldValidate: true });
    
    setSearchQuery(area.name);
    setIsDropdownOpen(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setSearchError(null);
    if (selectedAreaId) {
      setValue("biteshipAreaId", "", { shouldValidate: true });
      setValue("provinsi", "", { shouldValidate: true });
      setValue("kota", "", { shouldValidate: true });
      setValue("kecamatan", "", { shouldValidate: true });
      setShippingRates([]);
      setSelectedOngkir(0);
      setRatesError(null);
      setValue("kurir", "");
      setValue("layananKurir", "");
    }
  };

  // Fetch Shipping Rates
  const fetchRates = async () => {
    if (selectedAreaId) {
      setIsLoadingRates(true);
      setShippingRates([]);
      setSelectedOngkir(0);
      setRatesError(null);
      setValue("kurir", "");
      setValue("layananKurir", "");
      
      if (totalWeight < 1) {
        setRatesError("Berat produk tidak valid. Pastikan semua produk memiliki berat (gram).");
        setIsLoadingRates(false);
        return;
      }

      const res = await hitungOngkirBiteship(selectedAreaId, totalWeight);
      if (res.success) {
        setShippingRates(res.data);
        if (res.data.length === 0) {
          setRatesError("Belum ada layanan pengiriman ke wilayah ini.");
        }
      } else {
        setRatesError(res.message || "Layanan ongkos kirim sedang tidak tersedia, coba lagi sebentar.");
      }
      setIsLoadingRates(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, [selectedAreaId, totalWeight, setValue]);

  const handleSelectRate = (rate: ShippingRate) => {
    setSelectedOngkir(rate.price);
    setValue("kurir", rate.courier_name, { shouldValidate: true });
    setValue("layananKurir", rate.courier_service_name, { shouldValidate: true });
  };

  const total = items.reduce((sum: number, item) => sum + item.price * item.quantity, 0);
  const totalAkhir = total + selectedOngkir;
  const isGrindSizeIncomplete = items.some(item => item.grindOptions && item.grindOptions.length > 0 && !item.grindSize);

  const onSubmit = async (data: CheckoutOutput) => {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setIsSubmitting(true);
    
    // Idempotency key dihasilkan di sisi client (dengan fallback untuk browser tanpa crypto.randomUUID)
    const idempotencyKey = typeof crypto !== 'undefined' && crypto.randomUUID 
      ? crypto.randomUUID() 
      : Date.now().toString(36) + Math.random().toString(36).substring(2);

    try {
      const result = await buatPesanan(data, items, idempotencyKey);

      if (!result.success) {
        toast.error(result.error || "Gagal memproses pesanan.");
        isSubmittingRef.current = false;
        setIsSubmitting(false);
      } else {
        // Trigger Midtrans Snap Popup
        if (result.snapToken && (window as any).snap) {
          (window as any).snap.pay(result.snapToken, {
            onSuccess: function (midtransResult: any) {
              clearCart();
              localStorage.removeItem("checkout_draft");
              isSubmittingRef.current = false;
              setIsSubmitting(false);
              router.push(`/checkout/sukses?order_id=${result.orderId}`);
            },
            onPending: function (midtransResult: any) {
              clearCart();
              localStorage.removeItem("checkout_draft");
              toast.success("Pesanan dibuat. Silakan selesaikan pembayaran.", { duration: 5000 });
              isSubmittingRef.current = false;
              setIsSubmitting(false);
              router.push(`/profil`); // Idealnya ke halaman detail pesanan
            },
            onError: function (midtransResult: any) {
              toast.error("Pembayaran gagal diproses oleh Midtrans.");
              isSubmittingRef.current = false;
              setIsSubmitting(false);
            },
            onClose: function () {
              toast.error("Anda menutup jendela pembayaran.");
              clearCart();
              localStorage.removeItem("checkout_draft");
              isSubmittingRef.current = false;
              setIsSubmitting(false);
              router.push(`/profil`);
            }
          });
        } else {
          toast.error("Midtrans Snap belum siap.");
          isSubmittingRef.current = false;
          setIsSubmitting(false);
        }
      }
    } catch (error: any) {
      console.error("Checkout Error:", error);
      toast.error(`Kesalahan sistem: ${error?.message || "Silakan coba lagi"}`);
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FDF6EE] pt-32 pb-24 text-center">
        <h1 className="font-judul text-3xl font-black text-[#4B2E1C] mb-4">Keranjang Kosong</h1>
        <Link href="/toko" className="px-6 py-3 bg-[#D4956A] text-white rounded-2xl font-bold inline-block">
          Belanja Sekarang
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#FDF6EE] min-h-screen pt-24 pb-24 text-[#4B2E1C]">
      <Script 
        src={process.env.NODE_ENV === 'production' ? "https://app.midtrans.com/snap/snap.js" : "https://app.sandbox.midtrans.com/snap/snap.js"}
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || 'SB-Mid-client-DUMMY'}
        strategy="lazyOnload"
      />
      <div className="container mx-auto px-4 max-w-6xl">
        <Link href="/toko" className="inline-flex items-center gap-2 text-[#8B5E3C] hover:text-[#4B2E1C] font-bold mb-8 bg-white px-4 py-2 rounded-2xl shadow-sm border border-[#8B5E3C]/10 w-fit">
          Kembali Belanja
        </Link>

        <h1 className="font-judul text-4xl md:text-5xl font-black text-[#4B2E1C] mb-10 tracking-tight">Checkout</h1>

        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7">
            <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 md:p-10 rounded-[2rem] border border-[#8B5E3C]/10 shadow-sm space-y-8">
              <div>
                <h3 className="font-judul text-xl font-bold text-[#4B2E1C] mb-6 flex items-center gap-2">
                  <User className="w-5 h-5 text-[#D4956A]" /> Informasi Kontak
                </h3>
                <div className="grid md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label htmlFor="nama" className="text-xs font-bold text-[#8B5E3C] uppercase tracking-wider">Nama Lengkap</label>
                    <input id="nama" {...register("nama")} placeholder="Masukkan Nama Anda" className={`w-full px-5 py-3.5 bg-gray-50 border ${errors.nama ? 'border-red-500' : 'border-[#8B5E3C]/20'} rounded-xl focus:ring-2 focus:ring-[#8B5E3C] focus:bg-white outline-none transition-all font-teks`} aria-describedby={errors.nama ? "nama-error" : undefined} />
                    {errors.nama && <p id="nama-error" className="text-red-500 text-xs mt-1">{errors.nama.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-xs font-bold text-[#8B5E3C] uppercase tracking-wider">Email (Untuk Invoice)</label>
                    <input id="email" type="email" {...register("email")} placeholder="Masukkan Email Anda" className={`w-full px-5 py-3.5 bg-gray-50 border ${errors.email ? 'border-red-500' : 'border-[#8B5E3C]/20'} rounded-xl focus:ring-2 focus:ring-[#8B5E3C] focus:bg-white outline-none transition-all font-teks`} aria-describedby={errors.email ? "email-error" : undefined} />
                    {errors.email && <p id="email-error" className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label htmlFor="whatsapp" className="text-xs font-bold text-[#8B5E3C] uppercase tracking-wider">Nomor WhatsApp</label>
                    <input id="whatsapp" type="tel" inputMode="tel" autoComplete="tel" {...register("whatsapp")} placeholder="Contoh: 08123456789" className={`w-full px-5 py-3.5 bg-gray-50 border ${errors.whatsapp ? 'border-red-500' : 'border-[#8B5E3C]/20'} rounded-xl focus:ring-2 focus:ring-[#8B5E3C] focus:bg-white outline-none transition-all font-teks`} aria-describedby={errors.whatsapp ? "whatsapp-error" : undefined} />
                    {errors.whatsapp && <p id="whatsapp-error" className="text-red-500 text-xs mt-1">{errors.whatsapp.message}</p>}
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-[#8B5E3C]/10">
                <h3 className="font-judul text-xl font-bold text-[#4B2E1C] mb-6 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#D4956A]" /> Alamat Pengiriman
                </h3>
                <div className="space-y-5">
                  <div className="space-y-2 relative" ref={searchRef}>
                    <label className="text-xs font-bold text-[#8B5E3C] uppercase tracking-wider">Cari Kecamatan / Kota</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Ketik minimal 3 huruf (Cth: Bandung...)" 
                        className={`w-full px-5 py-3.5 bg-gray-50 border ${errors.biteshipAreaId ? 'border-red-500' : 'border-[#8B5E3C]/20'} rounded-xl focus:ring-2 focus:ring-[#8B5E3C] focus:bg-white outline-none transition-all font-teks`} 
                        onFocus={() => {
                          if (searchQuery.length >= 3) setIsDropdownOpen(true);
                        }}
                      />
                      {isLoading && <Loader2 className="absolute right-4 top-3.5 w-5 h-5 text-[#8B5E3C] animate-spin" />}
                    </div>
                    {errors.biteshipAreaId && <p className="text-red-500 text-xs mt-1">{errors.biteshipAreaId.message}</p>}
                    
                    {/* Autocomplete Dropdown */}
                    {isDropdownOpen && searchQuery.length >= 3 && (
                      <div className="absolute z-10 w-full mt-2 bg-white border border-[#8B5E3C]/20 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                        <ul className="py-2">
                          {isLoading ? (
                            <li className="px-4 py-3 text-sm text-[#8B5E3C] flex items-center justify-center">
                              <Loader2 className="w-4 h-4 animate-spin mr-2" />
                              Mencari wilayah...
                            </li>
                          ) : searchError ? (
                            <li className="px-4 py-3 text-sm bg-red-50 text-red-600 italic border-l-4 border-red-500">
                              {searchError}
                            </li>
                          ) : searchResults.length > 0 ? (
                            searchResults.map((area, index) => (
                              <li 
                                key={`${area.id}-${index}`} 
                                onClick={() => handleSelectArea(area)}
                                className="px-5 py-3 hover:bg-[#FDF6EE] cursor-pointer transition-colors border-b border-[#8B5E3C]/5 last:border-0"
                              >
                                <p className="font-judul font-bold text-[#4B2E1C] text-sm">{area.name}</p>
                                <p className="font-teks text-xs text-[#8B5E3C]">{area.administrative_division_level_2_name}, {area.administrative_division_level_1_name} {area.postal_code}</p>
                              </li>
                            ))
                          ) : (
                            <li className="px-4 py-3 text-sm text-[#8B5E3C] italic">
                              Wilayah tidak ditemukan. Coba kata kunci lain.
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Hidden inputs to make sure RHF registers them, or we could rely on defaultValues and setValue */}
                  <input type="hidden" {...register("biteshipAreaId")} />
                  <input type="hidden" {...register("provinsi")} />
                  <input type="hidden" {...register("kota")} />
                  <input type="hidden" {...register("kecamatan")} />

                  {/* Disabled summary to show selected area clearly */}
                  {selectedAreaId && (
                    <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-start gap-3">
                      <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-bold text-emerald-800">Wilayah Terpilih</p>
                        <p className="text-xs text-emerald-700 font-teks mt-1">{watch("kecamatan")}, {watch("kota")}, {watch("provinsi")}</p>
                      </div>
                    </div>
                  )}

                  <div className="grid md:grid-cols-3 gap-5">
                    <div className="space-y-2 md:col-span-2">
                      <label htmlFor="detailAlamat" className="text-xs font-bold text-[#8B5E3C] uppercase tracking-wider">Alamat Lengkap</label>
                      <textarea id="detailAlamat" rows={2} {...register("detailAlamat")} placeholder="Nama jalan, gedung, no. rumah, RT/RW..." className={`w-full px-5 py-3.5 bg-gray-50 border ${errors.detailAlamat ? 'border-red-500' : 'border-[#8B5E3C]/20'} rounded-xl focus:ring-2 focus:ring-[#8B5E3C] focus:bg-white outline-none transition-all font-teks resize-none`} />
                      {errors.detailAlamat && <p className="text-red-500 text-xs mt-1">{errors.detailAlamat.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="kodepos" className="text-xs font-bold text-[#8B5E3C] uppercase tracking-wider">Kode Pos</label>
                      <input id="kodepos" type="text" {...register("kodepos")} placeholder="5 digit" className={`w-full px-5 py-3.5 bg-gray-50 border ${errors.kodepos ? 'border-red-500' : 'border-[#8B5E3C]/20'} rounded-xl focus:ring-2 focus:ring-[#8B5E3C] focus:bg-white outline-none transition-all font-teks`} />
                      {errors.kodepos && <p className="text-red-500 text-xs mt-1">{errors.kodepos.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="patokan" className="text-xs font-bold text-[#8B5E3C] uppercase tracking-wider">Patokan / Catatan (Opsional)</label>
                    <input id="patokan" type="text" {...register("patokan")} placeholder="Warna pagar, posisi rumah, dll." className="w-full px-5 py-3.5 bg-gray-50 border border-[#8B5E3C]/20 rounded-xl focus:ring-2 focus:ring-[#8B5E3C] focus:bg-white outline-none transition-all font-teks" />
                    {errors.patokan && <p className="text-red-500 text-xs mt-1">{errors.patokan.message}</p>}
                  </div>

                  <div className="pt-4 border-t border-[#8B5E3C]/10 space-y-4">
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <div className="relative flex items-center justify-center mt-1">
                        <input type="checkbox" {...register("simpanAlamat")} className="peer appearance-none w-5 h-5 border-2 border-[#8B5E3C]/30 rounded-md checked:bg-[#D4956A] checked:border-[#D4956A] transition-colors cursor-pointer" />
                        <ShieldCheck className="w-3 h-3 text-white absolute opacity-0 peer-checked:opacity-100 pointer-events-none" />
                      </div>
                      <span className="text-sm text-[#4B2E1C] font-teks font-bold">Simpan alamat ini untuk pesanan berikutnya</span>
                    </label>
                    
                    {simpanAlamat && (
                      <div className="pl-8 animate-in fade-in slide-in-from-top-2">
                        <label htmlFor="labelAlamat" className="text-xs font-bold text-[#8B5E3C] uppercase tracking-wider">Simpan Sebagai (Cth: Rumah, Kantor)</label>
                        <input id="labelAlamat" type="text" {...register("labelAlamat")} placeholder="Contoh: Rumah" className="w-full mt-2 px-5 py-3.5 bg-gray-50 border border-[#8B5E3C]/20 rounded-xl focus:ring-2 focus:ring-[#8B5E3C] focus:bg-white outline-none transition-all font-teks" />
                        {errors.labelAlamat && <p className="text-red-500 text-xs mt-1">{errors.labelAlamat.message}</p>}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-[#8B5E3C]/10">
                <h3 className="font-judul text-xl font-bold text-[#4B2E1C] mb-6 flex items-center gap-2">
                  Catatan Pesanan
                </h3>
                <textarea rows={2} {...register("catatanPesanan")} placeholder="Catatan untuk penjual atau kurir (Opsional)" className={`w-full px-5 py-3.5 bg-gray-50 border ${errors.catatanPesanan ? 'border-red-500' : 'border-[#8B5E3C]/20'} rounded-xl focus:ring-2 focus:ring-[#8B5E3C] focus:bg-white outline-none transition-all font-teks resize-none`} />
                {errors.catatanPesanan && <p className="text-red-500 text-xs mt-1">{errors.catatanPesanan.message}</p>}
              </div>

              <div className="pt-6 border-t border-[#8B5E3C]/10 space-y-4">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center mt-1">
                    <input type="checkbox" {...register("syaratKetentuan")} className="peer appearance-none w-5 h-5 border-2 border-[#8B5E3C]/30 rounded-md checked:bg-[#D4956A] checked:border-[#D4956A] transition-colors cursor-pointer" aria-describedby={errors.syaratKetentuan ? "snk-error" : undefined} />
                    <ShieldCheck className="w-3 h-3 text-white absolute opacity-0 peer-checked:opacity-100 pointer-events-none" />
                  </div>
                  <span className="text-sm text-[#4B2E1C] font-teks leading-relaxed">
                    Saya menyetujui <Link href="/syarat-ketentuan" className="font-bold text-[#D4956A] hover:underline">Syarat & Ketentuan</Link> serta <Link href="/kebijakan-pengembalian" className="font-bold text-[#D4956A] hover:underline">Kebijakan Pengembalian</Link> Ruang Seduh.
                  </span>
                </label>
                {errors.syaratKetentuan && <p id="snk-error" className="text-red-500 text-xs">{errors.syaratKetentuan.message}</p>}
                
                <p className="text-xs text-[#8B5E3C] font-teks">
                  Butuh bantuan? <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="font-bold hover:underline">Hubungi CS via WhatsApp</a>
                </p>
              </div>
            </form>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white p-8 md:p-10 rounded-[2rem] border border-[#8B5E3C]/10 shadow-lg sticky top-32">
              <h3 className="font-judul text-xl font-bold text-[#4B2E1C] mb-6">Ringkasan Pesanan</h3>

              <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 border border-[#8B5E3C]/10 rounded-2xl bg-gray-50/50">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-[#FDF6EE] flex-shrink-0 flex items-center justify-center border border-[#8B5E3C]/10">
                      {item.image ? (
                        <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
                      ) : (
                        <span className="text-[10px] text-center font-bold text-[#8B5E3C]/50 px-2 uppercase">Tanpa<br/>Gambar</span>
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-judul font-bold text-[#4B2E1C] text-sm leading-tight">{item.name}</h4>
                        <button type="button" onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-600 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      {item.grindOptions && item.grindOptions.length > 0 && (
                        <div className="mt-1">
                          <select
                            value={item.grindSize || ""}
                            onChange={(e) => updateGrindSize(item.id, e.target.value)}
                            className={`w-full text-xs py-1.5 px-2 rounded-lg border ${!item.grindSize ? 'border-red-400 bg-red-50' : 'border-[#8B5E3C]/20 bg-white'} text-[#4B2E1C] font-teks outline-none focus:ring-2 focus:ring-[#8B5E3C]`}
                          >
                            <option value="" disabled>-- Pilih Varian Gilingan --</option>
                            {item.grindOptions.map((opt) => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        </div>
                      )}

                      <div className="flex justify-between items-center pt-2">
                        <div className="flex items-center gap-3 bg-white border border-[#8B5E3C]/20 rounded-lg px-2 py-1">
                          <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-[#8B5E3C] hover:text-[#4B2E1C] disabled:opacity-30" disabled={item.quantity <= 1}>
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="font-teks font-bold text-sm text-[#4B2E1C] min-w-[1rem] text-center">{item.quantity}</span>
                          <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-[#8B5E3C] hover:text-[#4B2E1C]">
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="font-teks font-black text-[#4B2E1C] text-sm">Rp {(item.price * item.quantity).toLocaleString("id-ID")}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center py-4 border-b border-[#8B5E3C]/10">
                <span className="font-teks text-[#8B5E3C]">Subtotal</span>
                <span className="font-teks font-bold text-[#4B2E1C]">Rp {total.toLocaleString("id-ID")}</span>
              </div>
              
              {/* Shipping Options UI */}
              <div className="py-4 border-b border-[#8B5E3C]/10 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-teks text-[#8B5E3C]">Biaya Pengiriman</span>
                  <span className="font-teks font-bold text-[#4B2E1C]">
                    {selectedOngkir > 0 ? `Rp ${selectedOngkir.toLocaleString("id-ID")}` : "Belum dihitung"}
                  </span>
                </div>

                {isLoadingRates ? (
                  <div className="flex items-center justify-center py-6">
                    <Loader2 className="w-6 h-6 animate-spin text-[#D4956A]" />
                    <span className="ml-2 text-sm text-[#8B5E3C] font-teks">Mencari kurir...</span>
                  </div>
                ) : ratesError && selectedAreaId ? (
                  <div className="bg-red-50 p-4 rounded-xl border border-red-100 flex flex-col items-start gap-3">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                      <p className="text-sm text-red-700 font-teks">{ratesError}</p>
                    </div>
                    {(ratesError.includes("coba lagi") || ratesError.includes("tunggu sebentar")) && (
                      <button 
                        type="button" 
                        onClick={fetchRates}
                        className="text-xs font-bold bg-white text-red-600 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        Coba Lagi
                      </button>
                    )}
                  </div>
                ) : shippingRates.length > 0 ? (
                  <div className="space-y-3 mt-4">
                    <p className="text-xs font-bold text-[#8B5E3C] uppercase tracking-wider mb-2">Pilih Kurir:</p>
                    <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                      {shippingRates.map((rate, idx) => (
                        <label 
                          key={`${rate.courier_name}-${rate.courier_service_name}-${idx}`}
                          className={`flex items-start p-4 border rounded-xl cursor-pointer transition-all ${
                            watch("kurir") === rate.courier_name && watch("layananKurir") === rate.courier_service_name 
                            ? 'bg-[#FDF6EE] border-[#D4956A] shadow-sm' 
                            : 'bg-white border-[#8B5E3C]/20 hover:border-[#D4956A]/50'
                          }`}
                          onClick={() => handleSelectRate(rate)}
                        >
                          <div className="relative flex items-center justify-center mt-1 mr-3 flex-shrink-0">
                            <input 
                              type="radio" 
                              name="shipping_rate"
                              checked={watch("kurir") === rate.courier_name && watch("layananKurir") === rate.courier_service_name}
                              readOnly
                              className="w-4 h-4 text-[#D4956A] focus:ring-[#8B5E3C] border-gray-300"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <p className="font-judul font-bold text-[#4B2E1C] uppercase text-sm">{rate.courier_name} - {rate.courier_service_name}</p>
                              <p className="font-teks font-black text-[#D4956A] text-sm">Rp {rate.price.toLocaleString("id-ID")}</p>
                            </div>
                            <p className="font-teks text-xs text-[#8B5E3C] mt-1">Estimasi: {rate.duration}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                    {errors.kurir && <p className="text-red-500 text-xs mt-1">{errors.kurir.message}</p>}
                  </div>
                ) : (
                  <p className="text-xs text-[#8B5E3C] font-teks italic">Pilih alamat pengiriman untuk melihat ongkos kirim.</p>
                )}
              </div>

              <div className="flex justify-between items-center pt-6 mb-8">
                <span className="font-judul text-xl font-bold text-[#4B2E1C]">Total Akhir</span>
                <span className="font-judul text-3xl font-black text-[#D4956A]">Rp {totalAkhir.toLocaleString("id-ID")}</span>
              </div>

              {isGrindSizeIncomplete && (
                <div className="flex items-start gap-2 p-3 mb-4 rounded-xl bg-red-50 border border-red-200">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-red-700 font-teks">Mohon pilih varian gilingan untuk semua produk kopi sebelum membayar.</p>
                </div>
              )}

              <button form="checkout-form" type="submit" disabled={isSubmitting || isGrindSizeIncomplete || (selectedAreaId && selectedOngkir === 0) || !!ratesError} className="w-full py-4 bg-[#4B2E1C] text-[#FDF6EE] rounded-2xl font-bold hover:bg-[#8B5E3C] transition-all flex items-center justify-center gap-2 text-lg shadow-lg disabled:opacity-70 disabled:cursor-not-allowed group">
                {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : "Bayar Pesanan"}
              </button>

              <p className="text-xs text-center text-[#8B5E3C] mt-4 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> Transaksi Aman & Terenkripsi
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
