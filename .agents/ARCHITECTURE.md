# Architecture & Technical Stack

Dokumen ini menjelaskan fondasi arsitektur teknis dan *stack* yang digunakan dalam proyek **Ruang Seduh**. Tujuannya agar pengembangan sistem selalu berpatokan pada teknologi yang telah disepakati dan tidak bercampur aduk dengan _pattern_ lain.

## 1. Stack Utama (Core Technologies)
- **Framework Utama:** Next.js (menggunakan **App Router** `app/` directory).
- **Bahasa Pemrograman:** TypeScript (diwajibkan *strongly-typed*).
- **Styling:** Tailwind CSS v4 (Sintaks modern, terintegrasi via `@tailwindcss/postcss` tanpa `tailwind.config.js`).
- **Database & ORM:** PostgreSQL dengan Prisma ORM.
- **CMS (Headless):** Sanity Studio (mengelola entitas produk, stok, dan gambar).
- **Autentikasi:** NextAuth.js (mengelola sesi pengguna dan *login*).
- **State Management:** Zustand (Digunakan spesifik untuk *client-state* dinamis seperti isi keranjang belanja / UI *drawer*).
- **Integrasi Pihak Ketiga:** Midtrans (Payment Gateway), Resend (Transactional Email).

## 2. Pola Arsitektur (Architectural Patterns)
- **Server Components (RSC) by Default:**
  Sebagian besar *routing* dan tata letak (`layout.tsx`, `page.tsx`) harus berupa *Server Components* untuk meningkatkan performa SEO dan mempercepat pemuatan awal halaman.
- **Client Components secara Selektif:**
  Direktif `"use client"` hanya disematkan pada komponen yang membutuhkan interaksi pengguna aktif (seperti tombol *Add to Cart*, formulir *checkout*, menggunakan *hooks* React seperti `useState`, `useEffect`, atau berinteraksi dengan Zustand).
- **Data Fetching:**
  Sebisa mungkin menggunakan *Server Actions* bawaan Next.js untuk *mutation* data (seperti _checkout_) dan pengambilan data server (*fetching* langsung di dalam komponen *Server*).

## 3. Struktur Direktori
- `app/` : Menyimpan rute halaman, layout, dan *Server Actions* (khusus App Router).
- `components/` : Kumpulan antarmuka UI *reusable* (seperti Navbar, Footer, Kartu Produk).
- `lib/` : Utilitas pendukung, seperti inisialisasi *client* Prisma, Zod schema, *formatting* mata uang, dsb.
- `sanity/` : Konfigurasi *schema* CMS untuk mengelola struktur data produk.
- `prisma/` : Konfigurasi *schema database* relasional.
- `store/` : Tempat menyimpan *store* Zustand.
- `types/` : Definisi spesifik tipe TypeScript jika diperlukan secara global.

## 4. Standar Validasi dan Keamanan
- Semua pengolahan input pengguna dari sisi *Client* menuju *Server Actions* atau API Route **harus divalidasi** menggunakan Zod Schema.
- Integrasi *webhook* (Midtrans/Sanity) harus melakukan pemeriksaan validasi kriptografi atau *secret token* untuk memastikan permintaan benar-benar datang dari penyedia layanan tersebut (tidak palsu).
