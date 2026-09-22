# Design System: Ruang Seduh

Sistem desain ini menjadi landasan antarmuka (UI) Ruang Seduh, dibangun untuk memberikan tampilan modern yang fungsional, membumi, bersih, dan konsisten—mematuhi prinsip `antislop-ui`. Seluruh nilai di sini direpresentasikan sebagai variabel CSS untuk kemudahan konfigurasi dan mode gelap di masa depan.

## 1. Identitas Inti & Filosofi
Tampilan Ruang Seduh harus terasa **hangat, terstruktur, dan modern** tanpa ornamen berlebih (seperti *glow* tanpa fungsi). Elemen mendukung hierarki visual yang jelas.

## 2. Palet Warna (Color Palette)

Warna ditetapkan sebagai variabel global dan difungsikan berdasarkan niat (intent) spesifik:

**Warna Dasar & Netral:**
- **Base (Latar Utama):** `--color-brand-base: #FDF6EE` (Krem hangat/oat)
- **Surface (Latar Kartu/Elemen):** `--color-brand-surface: #FFFFFF`
- **Text (Teks Utama):** `--color-brand-text: #4B2E1C` (Cokelat espresso untuk fokus tertinggi)
- **Text Muted (Teks Sekunder/Placeholder):** `--color-brand-text-muted: #8B5E3C`
- **Border:** `--color-brand-border: rgb(139 94 60 / 0.15)` (Garis pembatas halus)

**Aksen & Brand:**
- **Accent:** `--color-brand-accent: #D4956A` (Aksen utama, digunakan pada titik kunci seperti ikon atau tautan)
- **Accent Strong:** `--color-brand-accent-strong: #A9683C` (Teks/tautan beraksen yang membutuhkan rasio kontras 4.5:1 terhadap `--color-brand-base`)
> *Catatan:* Untuk tombol aksi utama, gunakan Espresso (`#4B2E1C`) dengan teks Krem agar kontras tetap tinggi. Jangan jadikan warna Accent biasa sebagai latar utama tombol bersanding teks putih.

**Fungsional / Status:** (Dipasangkan dengan turunan opacity/tint untuk latar *badge*)
- **Success (Selesai, Valid):** `--color-brand-success: #4A7C59`
- **Warning (Menunggu, Peringatan):** `--color-brand-warning: #B7791F`
- **Danger (Error, Batal):** `--color-brand-danger: #B5483A`
- **Info (Proses, Normal):** `--color-brand-info: #4A6FA5`

## 3. Tipografi (Typography Scale)
Pasangan *Lora* (Heading) dan *Inter* (Body). Menggunakan nilai **fluid (clamp)** agar terbaca jelas baik di desktop maupun ponsel.

- **Display / H1:** `clamp(2rem, 4vw + 1rem, 3.5rem)` (32px - 56px) - *Lora*
- **H2:** `clamp(1.5rem, 2.5vw + 1rem, 2.25rem)` (24px - 36px) - *Lora*
- **H3:** `1.25rem` (20px) - *Lora*
- **Body / Paragraf:** `1rem` (16px minimal, mencegah *auto-zoom* iOS pada input) - *Inter*
- **Small / Caption:** `0.875rem` (14px) - *Inter*

**Pengaturan Tambahan:** 
- Angka Harga dan Kuantitas (troli/transaksi) menggunakan aturan *tabular-nums* agar rata vertikal.
- Judul disarankan menggunakan *text-wrap: balance*.

## 4. Struktur (Radius & Shadow)
Bentuk tidak boleh asal membulat (pill) tanpa fungsi. Pengaturan yang disetujui:
- **Card Radius:** `--radius-card: 1rem` (16px) untuk kartu, dialog, dan gambar produk.
- **Control Radius:** `--radius-control: 0.5rem` (8px) untuk input, tombol, select.
- **Badge Radius:** `--radius-badge: 9999px` (Pill khusus untuk penanda sekunder/status).
- **Bayangan (Shadow):** Menggunakan bayangan lembut untuk batas hirarki. Hindari bayangan `shadow-xl` / melayang berlebihan jika tidak ada pergerakan dimensi (*ground plane*).

## 5. Status & Interaksi (UI States)
Setiap elemen interaktif harus menangani status berikut:
- **Focus:** Cincin fokus global yang terlihat jelas (`focus-visible:ring-2 focus-visible:ring-[#8B5E3C]`).
- **Hover/Active:** Transisi transparan (opacity down) atau peningkatan kontras warna latar, dan efek tekan skala sangat minor (`active:scale-[0.98]`).
- **Disabled:** Opacity diturunkan menjadi 50% (`opacity-50`) dan kursor `not-allowed`.
- **Loading:** Menggunakan spinner/animasi halus (skeleton).
- **Gerak (Motion):** Easing halus (`transition-all duration-200`) dan hormati `prefers-reduced-motion`.

## 6. Aksesibilitas
- Kontras minimum teks utama dengan latar: 4.5:1.
- Kontras minimum elemen antarmuka (UI border/icons): 3:1.
- Selalu gunakan `aria-label` untuk ikon tombol yang berdiri sendiri.
- Jangan jadikan warna sebagai satu-satunya indikator status (gabungkan warna + ikon/teks).

## 7. Set Ikon

Library: **Lucide React** (thin-stroke rounded).

Alasan pilihan: Lucide cocok dengan karakter Ruang Seduh yang bersih dan membumi. Stroke tipis selaras dengan tipografi Inter yang ringan di body teks, tanpa berteriak. Ikon dipilih berdasarkan relevansi konten (Map untuk direktori, BookMarked untuk jurnal, BookOpen untuk panduan, Users untuk blog/komunitas), bukan estetika generic.

Tidak semua ikon Lucide boleh dipakai bebas. Ikon yang dilarang tanpa alasan spesifik: Sparkle, Star, Zap, Diamond, Robot (tanda AI generic). Jika tidak ada ikon Lucide yang relevan untuk suatu elemen, lebih baik tidak menggunakan ikon sama sekali.

## 8. Liveliness Dials

Dideklarasikan per tipe halaman:

| Halaman | ENERGY | RHYTHM | MOTION | Catatan |
|---------|--------|--------|--------|---------|
| Beranda | 2 | 1 | 2 | RHYTHM 1 sadar: satu section padat lebih kuat dari template. MOTION 2: kartu fitur fade+slide via ScrollReveal, navbar shadow muncul setelah 60px scroll. |
| Toko | 2 | 2 | 2 | Grid produk dengan filter. |
| Direktori | 2 | 2 | 2 | Grid + search. |
| Blog/Jurnal | 1 | 1 | 1 | Konten-first, minim dekorasi. |

**Batasan MOTION 2:** Tidak ada endless loop, tidak ada parallax, tidak ada stagger lebih dari 4 elemen sekaligus. Setiap animasi memiliki tujuan UX tertulis (mengarahkan mata, memberi batas kontekstual). `prefers-reduced-motion` dihormati penuh via CSS.
