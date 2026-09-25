<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/coffee.svg" alt="Ruang Seduh Logo" width="120" height="120" />
  <h1>☕ Ruang Seduh</h1>
  <p><strong>Platform Eksplorasi & Jurnal Kopi Digital Nusantara.</strong></p>
  
  <p>
    <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-15-000000?style=flat-square&logo=next.js" alt="Next.js" /></a>
    <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" /></a>
    <a href="https://www.prisma.io/"><img src="https://img.shields.io/badge/Prisma-3982CE?style=flat-square&logo=Prisma&logoColor=white" alt="Prisma" /></a>
    <a href="https://www.sanity.io/"><img src="https://img.shields.io/badge/Sanity-F03E2F?style=flat-square&logo=Sanity&logoColor=white" alt="Sanity CMS" /></a>
  </p>
</div>

Ruang Seduh adalah aplikasi web modern yang dirancang khusus untuk para pecinta kopi (*Home Brewers*) di Indonesia. Dari mencatat resep seduhan harian, mengeksplorasi biji kopi Nusantara, hingga belajar teknik *manual brew* yang presisi.

---

## ✨ Fitur Utama

- 🛒 **Katalog Toko Kopi:** Beli biji kopi pilihan (Lokal & Impor) dengan detail *Roast Level*, *Process*, dan *Tasting Notes*.
- 📝 **Jurnal Seduh Personal:** Kalkulator rasio bawaan (*Smart Presets*) untuk mencatat eksperimen (rasio, suhu, alat, dan catatan rasa). Dilengkapi *Empty State* dan UI kelas *enterprise*.
- 📖 **Panduan Seduh Interaktif:** Tutorial *step-by-step* berbagai metode seduh yang dikelola secara dinamis via Sanity CMS.
- 💬 **Ruang Diskusi:** Berinteraksi dengan komunitas melalui sistem komentar bersarang (*Nested Comments*) yang mendukung *Like*, *Replies*, serta fitur *Moderasi Admin*.
- 💳 **Checkout Seamless:** Pengalaman belanja mulus dengan keranjang (*Zustand state*) dan notifikasi *Invoice* otomatis ke email melalui Resend.
- 🎨 **UI/UX Premium:** Antarmuka responsif dengan desain *glassmorphism* dan palet warna bumi (krem/cokelat) yang nyaman di mata.

---

## 🛠️ Tech Stack

- **Core:** Next.js 15 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS, Lucide Icons, Framer Motion (opsional)
- **Database & ORM:** PostgreSQL, Prisma Client
- **Headless CMS:** Sanity.io
- **Autentikasi:** NextAuth.js
- **Form & UX:** `react-textarea-autosize`, Server Actions (`useFormStatus`)
- **Email:** Resend API
- **State Management:** Zustand

---

## 🚀 Memulai Proyek Secara Lokal

Ikuti langkah-langkah di bawah ini untuk menjalankan Ruang Seduh di komputer Anda.

### 1. Prasyarat
- Node.js 18+ atau versi lebih baru
- npm, yarn, atau pnpm
- Akun PostgreSQL (misal: Supabase, Vercel Postgres, atau lokal)
- Akun Sanity (untuk mengelola konten artikel)

### 2. Kloning Repositori & Instalasi
```bash
git clone https://github.com/username/ruang-seduh.git
cd ruang-seduh
npm install
```

### 3. Pengaturan *Environment Variables*
Buat file `.env` dan `.env.local` di *root directory*. Lihat contoh format variabel yang dibutuhkan di file `.env.example` (jika ada), atau pastikan Anda memiliki kunci untuk:
- `DATABASE_URL`
- rahasia *NextAuth* (`NEXTAUTH_SECRET`, `NEXTAUTH_URL`)
- *Credentials* Resend (`RESEND_API_KEY`)
- *Credentials* Sanity (`NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`)

### 4. Setup Database (Prisma)
Sinkronkan skema database Anda:
```bash
npx prisma db push
npx prisma generate
```

### 5. Jalankan *Development Server*
```bash
npm run dev
```
Aplikasi sekarang berjalan di [http://localhost:3000](http://localhost:3000).

---

## 🤝 Kontribusi
Kami menyambut kontribusi dari komunitas pecinta kopi! Jika Anda menemukan kutu (*bug*) atau memiliki ide fitur baru, silakan buka *Issue* atau kirimkan *Pull Request*.

<div align="center">
  <p>Dibuat dengan 🤎 untuk Home Brewers Indonesia.</p>
</div>

