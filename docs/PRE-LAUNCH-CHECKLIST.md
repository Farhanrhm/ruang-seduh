# Ruang Seduh - Pre-Launch Checklist

Dokumen ini berisi daftar fitur, perbaikan backend, dan konfigurasi yang harus diselesaikan sebelum aplikasi diluncurkan ke *production*.

## Backend & Database (Schema.prisma)

- [ ] **Simpan `shippingCost` di tabel Order**: Saat ini, nilai ongkos kirim di UI dihitung sebagai turunan `(totalAmount - subtotal)`. Jika ada diskon atau promo di masa depan, perhitungan ini akan menjadi tidak akurat. Pastikan `shippingCost` disimpan sebagai kolom mandiri di tabel `Order` saat _checkout_.
- [ ] **Simpan `expiredAt` di tabel Order**: Tambahkan kolom batas kedaluwarsa pembayaran (misal: 15 menit atau 24 jam setelah pesanan dibuat dari Midtrans) untuk dirender di UI "Batas waktu pembayaran habis".
- [ ] **Simpan `awb` (Nomor Resi)**: Tambahkan kolom untuk melacak nomor resi ekspedisi agar fitur "Lacak Pesanan" dapat dirender di halaman profil untuk pesanan berstatus `SHIPPED`.
- [ ] **Endpoint "Buat Ulang Pembayaran"**: Sediakan fungsi (endpoint) bagi pengguna untuk memanggil ulang API pembuatan pesanan (*re-checkout*) untuk pesanan `PENDING` yang kehilangan `snapToken` atau yang batas waktu bayarnya telah habis, alih-alih hanya mengandalkan tombol "Beli Lagi" dari keranjang.

## Konfigurasi Produksi

- [ ] **Matikan Dummy Shipping & Mode Uji**: Pastikan di environment produksi (`NODE_ENV === "production"`), aplikasi sudah terkoneksi penuh dengan Biteship API. Tampilan lencana "Mode Uji" (*dummy badge*) di UI pesanan profil dirancang untuk hanya muncul saat proses _development_.
- [ ] **Verifikasi Midtrans Client Key**: Ganti kunci `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY` di `.env.production` dengan Production Client Key Midtrans asli.

