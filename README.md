<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/coffee.svg" alt="Ruang Seduh Logo" width="120" height="120" />
  <h1>Ruang Seduh</h1>
  <p><strong>Platform Eksplorasi & Jurnal Kopi Digital Nusantara.</strong></p>
  
  <p>
    <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-15-000000?style=flat-square&logo=next.js" alt="Next.js" /></a>
    <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" /></a>
    <a href="https://www.prisma.io/"><img src="https://img.shields.io/badge/Prisma-3982CE?style=flat-square&logo=Prisma&logoColor=white" alt="Prisma" /></a>
    <a href="https://www.sanity.io/"><img src="https://img.shields.io/badge/Sanity-F03E2F?style=flat-square&logo=Sanity&logoColor=white" alt="Sanity CMS" /></a>
  </p>
</div>

Ruang Seduh adalah aplikasi web untuk para pembuat kopi rumahan di Indonesia. Aplikasi ini menyediakan alat untuk mencatat resep seduhan harian, mengeksplorasi biji kopi, dan membaca panduan teknik seduh manual.

---

## Fitur Utama

- Beli biji kopi (lokal maupun impor) dengan informasi tingkat sangrai, proses pengolahan, dan catatan rasa.
- Catat rasio, suhu, alat, dan hasil seduhan harian menggunakan kalkulator rasio bawaan.
- Baca panduan langkah demi langkah untuk berbagai metode seduh.
- Berdiskusi dengan pengguna lain melalui sistem komentar berbalas yang mendukung fitur suka dan moderasi.
- Belanja biji kopi melalui keranjang belanja dengan pengiriman faktur otomatis ke email.
- Akses aplikasi melalui ponsel atau komputer dengan antarmuka yang menyesuaikan ukuran layar.

---

## Tech Stack

- **Core:** Next.js 15 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS, Lucide Icons
- **Database & ORM:** PostgreSQL, Prisma Client
- **Headless CMS:** Sanity.io
- **Autentikasi:** NextAuth.js
- **Form:** react-textarea-autosize, Server Actions (useFormStatus)
- **Email:** Resend API
- **State Management:** Zustand

---

## Memulai Proyek Secara Lokal

Ikuti langkah-langkah di bawah ini untuk menjalankan Ruang Seduh di komputer Anda.

### 1. Prasyarat
- Node.js 18 atau versi lebih baru
- npm, yarn, atau pnpm
- Basis data PostgreSQL (Supabase, Vercel Postgres, atau lokal)
- Akun Sanity untuk mengelola konten artikel

### 2. Kloning Repositori & Instalasi
```bash
git clone https://github.com/username/ruang-seduh.git
cd ruang-seduh
npm install
```

### 3. Pengaturan Environment Variables
Buat file konfigurasi environment di direktori utama. Anda membutuhkan kunci untuk:
- `DATABASE_URL`
- `NEXTAUTH_SECRET` dan `NEXTAUTH_URL`
- `RESEND_API_KEY`
- `NEXT_PUBLIC_SANITY_PROJECT_ID` dan `NEXT_PUBLIC_SANITY_DATASET`

### 4. Setup Database
Sinkronkan skema database Anda:
```bash
npx prisma db push
npx prisma generate
```

### 5. Jalankan Development Server
```bash
npm run dev
```
Aplikasi sekarang berjalan di http://localhost:3000.

---

## Kontribusi
Jika Anda menemukan masalah (bug) atau memiliki kode perbaikan, silakan buka Issue atau kirimkan Pull Request.
