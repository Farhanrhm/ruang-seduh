# Product Requirements Document (PRD)

**Nama Proyek:** Ruang Seduh
**Platform Utama:** Web (E-Commerce)
**Tech Stack Utama:** Next.js (App Router), Prisma, Sanity CMS, Midtrans

## 1. Visi Produk
Platform e-commerce yang berfokus pada pengalaman belajar menyeduh kopi di rumah secara menyenangkan, sekaligus menjual biji kopi dan peralatan seduh (*coffee gears*) berkualitas tinggi. Ruang Seduh dirancang untuk terasa ramah, tidak mengintimidasi pemula, dan profesional.

## 2. Target Pengguna (Audience)
- **Pemula:** Mereka yang baru ingin memulai hobi menyeduh kopi di rumah dan butuh panduan/rekomendasi produk sederhana.
- **Home-brewers:** Penyeduh kopi rumahan tingkat lanjut yang mencari biji kopi *fresh roast* dari _roastery_ lokal maupun alat seduh spesifik.

## 3. Ruang Lingkup MVP (Minimum Viable Product)
Fitur-fitur inti yang wajib berfungsi sempurna pada fase awal:
- **Katalog Belanja:** Sistem etalase dinamis untuk menampilkan produk biji kopi dan alat seduh.
- **Sistem Keranjang (Cart):** Pengelolaan *state* keranjang belanja *client-side* yang *seamless*.
- **Checkout & Pembayaran:** Integrasi langsung dengan Midtrans Payment Gateway untuk kemudahan transaksi (Virtual Account, E-Wallet, dll).
- **Manajemen Konten (CMS):** Menggunakan Sanity Studio agar pemilik toko dapat dengan mudah mengubah harga, deskripsi, gambar produk, dan ketersediaan stok tanpa harus mengubah kode.
- **Halaman Legalitas & Edukasi:** Halaman esensial seperti Syarat & Ketentuan, Kebijakan Pengembalian, dan artikel panduan dasar (jika ada).

## 4. Metrik Keberhasilan (Success Metrics)
- Kelancaran proses *checkout* tanpa terjadi kegagalan sistem (*zero error on critical path*).
- Waktu muat halaman (*page load time*) yang sangat cepat berkat SSR/SSG.
- Pembaruan produk dari CMS Sanity yang tersinkronisasi sempurna dan instan (atau melalui regenerasi statis) ke UI halaman toko.
- Rasio konversi tinggi karena UI yang memandu pengguna hingga pembayaran akhir.

## 5. Batasan (Out of Scope)
Hal-hal berikut **tidak** akan dikembangkan dalam fase MVP ini agar fokus tetap terjaga:
- *Tidak* membuat aplikasi *mobile* native (iOS/Android). Fokus sepenuhnya pada *Responsive Web Design* (Mobile-First).
- *Tidak* membuat fitur sosial media, forum, atau komunitas internal (*chat box* / *comment section*) antar pengguna.
- *Tidak* melayani *multicurrency* (hanya IDR Rupiah).
