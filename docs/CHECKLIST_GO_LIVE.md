# CHECKLIST GO-LIVE (SANDBOX KE PRODUCTION)

Dokumen ini adalah daftar periksa wajib sebelum toko Ruang Seduh diluncurkan ke publik dan menerima transaksi uang sungguhan.

## 1. Persiapan Akun Midtrans
- [ ] Pastikan Anda sudah mendaftar dan akun Midtrans Anda sudah berstatus **Production** (biasanya memerlukan verifikasi KTP, NPWP, dan rekening bank).
- [ ] Buka dashboard Midtrans, alihkan *toggle* di pojok kiri atas dari **Sandbox** ke **Production**.
- [ ] Buka menu **Settings > Access Keys**. Salin `Server Key` dan `Client Key` untuk Production (biasanya berawalan `Mid-server-` dan `Mid-client-`).

## 2. Pengaturan Webhook Midtrans (Sangat Penting)
- [ ] Di dashboard Midtrans Production, buka menu **Settings > Configuration**.
- [ ] Isi kolom **Payment Notification URL** dengan: `https://[domain-asli-anda.com]/api/webhook/midtrans`
- [ ] Centang semua *event* (Payment Status, dll).

## 3. Konfigurasi Environment Vercel (Hosting)
- [ ] Buka dashboard Vercel -> Pilih Project `ruang-seduh` -> Masuk ke tab **Settings > Environment Variables**.
- [ ] Ubah (Edit) variabel berikut dengan nilai Production dari langkah 1:
  - `MIDTRANS_SERVER_KEY` = `Mid-server-xxxxxxxxx`
  - `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY` = `Mid-client-xxxxxxxxx`
- [ ] Pastikan variabel `NODE_ENV` bernilai `production` (biasanya otomatis oleh Vercel).
- [ ] Pastikan URL aplikasi utama diset di:
  - `NEXTAUTH_URL` = `https://[domain-asli-anda.com]`
- [ ] Setelah variabel diubah, pergi ke tab **Deployments**, klik titik tiga pada deployment terakhir, lalu pilih **Redeploy** agar konfigurasi baru terbaca.

## 4. Pengujian Akhir di Production
- [ ] Coba buat satu produk seharga Rp 1.000 (Produk Testing).
- [ ] Lakukan pembelian menggunakan email Anda sendiri.
- [ ] Lakukan pembayaran nyata (misal via QRIS / Gopay).
- [ ] Pastikan:
  - [ ] Halaman Sukses muncul setelah bayar.
  - [ ] Pesanan di Dashboard Admin berubah menjadi `PAID`.
  - [ ] Stok berkurang 1.
  - [ ] Email invoice terkirim ke email Anda.
- [ ] Jika semua sukses, hapus pesanan testing tersebut atau biarkan sebagai data awal, dan Anda siap berjualan!
