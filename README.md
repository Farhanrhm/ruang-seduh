#  Ruang Seduh
**Platform Eksplorasi & Jurnal Kopi Digital Nusantara.**

Ruang Seduh adalah aplikasi web modern yang dirancang khusus untuk para pecinta kopi (Home Brewers) di Indonesia. Dari mencatat resep seduhan harian, mengeksplorasi biji kopi Nusantara, hingga belajar teknik manual brew yang presisi.

---

##  Fitur Utama

* ** Katalog Toko Kopi:** Beli biji kopi pilihan (Lokal & Impor) dengan detail *Roast Level*, *Process*, dan *Tasting Notes*.
* ** Jurnal Seduh Personal:** Catat eksperimen kopimu (rasio, suhu, alat, dan catatan rasa) agar tidak lupa resep terbaikmu.
* ** Panduan Seduh Interaktif:** Tutorial step-by-step berbagai metode seduh yang dikelola secara dinamis via Sanity CMS.
* ** Ruang Diskusi:** Berinteraksi dengan komunitas melalui sistem komentar yang mendukung *Like*, *Replies*, serta fitur Admin (Pin & Hapus).
* ** Keranjang & Checkout:** Sistem belanja *seamless* dengan notifikasi Invoice otomatis ke email melalui Resend.
* ** UI/UX Premium:** Antarmuka responsif dengan tema estetik yang hangat dan nyaman di mata.

---

##  Tech Stack

* **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Database:** [Prisma](https://www.prisma.io/) & PostgreSQL
* **CMS:** [Sanity.io](https://www.sanity.io/)
* **Auth:** [NextAuth.js](https://next-auth.js.org/)
* **Email:** [Resend](https://resend.com/)
* **State:** [Zustand](https://zustand-demo.pmnd.rs/)

---

##  Cara Menjalankan Proyek

### 1. Instal Dependensi
```bash
npm install
```
### 2. Konfigurasi Environment
Buat file .env.local dan isi dengan kredensial Database, Google Auth, Resend, dan Sanity.

### 3. Sinkronisasi Database
```bash
npx prisma db push
```

### 4. Jalankan Server
```bash
npm run dev
```
