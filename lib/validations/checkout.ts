import { z } from "zod";

export const CheckoutSchema = z.object({
  nama: z
    .string()
    .min(2, "Nama minimal 2 karakter.")
    .max(100, "Nama maksimal 100 karakter."),
  email: z.string().email("Format email tidak valid."),
  whatsapp: z
    .string()
    .trim()
    .min(1, "Nomor WhatsApp wajib diisi.")
    .transform((val) => {
      // Remove all non-numeric characters except '+'
      let cleaned = val.replace(/[^\d+]/g, "");
      
      // Normalize to 62...
      if (cleaned.startsWith("+62")) {
        cleaned = "62" + cleaned.slice(3);
      } else if (cleaned.startsWith("0")) {
        cleaned = "62" + cleaned.slice(1);
      }
      
      // Remove any remaining '+' (if someone typed something weird like 08+123)
      cleaned = cleaned.replace(/\+/g, "");
      
      return cleaned;
    })
    .refine(
      (val) => val.startsWith("62") && val.length >= 10 && val.length <= 15,
      {
        message: "Nomor WhatsApp tidak valid (harus 10-15 digit, diawali 08/62/+62)",
      }
    ),
  biteshipAreaId: z.string().min(1, "Wilayah wajib dipilih dari saran yang muncul."),
  provinsi: z.string().min(1, "Provinsi wajib diisi."),
  kota: z.string().min(1, "Kota/Kabupaten wajib diisi."),
  kecamatan: z.string().min(1, "Kecamatan wajib diisi."),
  kodepos: z.string().min(5, "Kode pos minimal 5 digit.").max(5, "Kode pos maksimal 5 digit."),
  detailAlamat: z.string().min(5, "Alamat terlalu pendek (minimal 5 karakter).").max(500),
  patokan: z.string().max(200, "Patokan maksimal 200 karakter.").optional(),
  simpanAlamat: z.boolean().optional(),
  labelAlamat: z.string().max(50).optional(),
  catatanPesanan: z.string().max(500, "Catatan maksimal 500 karakter.").optional(),
  kurir: z.string().min(1, "Kurir pengiriman wajib dipilih."),
  layananKurir: z.string().min(1, "Layanan kurir wajib dipilih."),
  syaratKetentuan: z
    .boolean()
    .refine((val) => val === true, {
      message: "Anda harus menyetujui Syarat & Ketentuan",
    }),
});

export type CheckoutInput = z.input<typeof CheckoutSchema>;
export type CheckoutOutput = z.output<typeof CheckoutSchema>;
