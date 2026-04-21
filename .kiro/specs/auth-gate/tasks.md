# Implementation Plan: Auth Gate

## Overview

Implementasi mekanisme perlindungan akses (auth gate) pada halaman `/checkout` dan `/blog/[slug]` menggunakan React Server Components dan NextAuth.js v4 yang sudah ada. Pendekatan: server-side gate dengan `getServerSession`, komponen `AuthPrompt` kontekstual, dan `TombolLoginGate` sebagai client component yang dapat digunakan ulang.

## Tasks

- [x] 1. Buat utility functions untuk gate logic dan validasi callbackUrl
  - Buat file `lib/auth-gate.ts` berisi fungsi `checkGate(session)` yang mengembalikan `"allowed"` atau `"blocked"`
  - Buat fungsi `validateCallbackUrl(url)` yang mengembalikan `"/"` untuk URL tidak valid (null, undefined, string kosong, atau URL eksternal yang tidak diawali `/`)
  - Buat fungsi `buildCallbackUrl(path)` yang mengembalikan path itu sendiri
  - _Requirements: 2.1, 4.1, 6.2, 6.3_

- [x] 2. Buat komponen `TombolLoginGate`
  - [x] 2.1 Implementasi `TombolLoginGate` sebagai Client Component di `components/TombolLoginGate.tsx`
    - Terima props `callbackUrl: string` dan `label?: string` (default: `"Masuk dengan Google"`)
    - Panggil `signIn("google", { callbackUrl })` saat tombol diklik
    - Gunakan palet warna Ruang Seduh (`#4B2E1C`, `#D4956A`, `#FDF6EE`)
    - _Requirements: 5.2, 5.3, 5.4_

  - [x] 2.2 Tulis property test untuk `TombolLoginGate` — Property 6
    - **Property 6: TombolLoginGate selalu meneruskan callbackUrl ke signIn**
    - **Validates: Requirements 5.3**
    - Generate berbagai callbackUrl valid, verifikasi `signIn` dipanggil dengan callbackUrl yang sama persis

- [x] 3. Buat komponen `AuthPromptBlog`
  - [x] 3.1 Implementasi `AuthPromptBlog` sebagai Server Component di `components/AuthPromptBlog.tsx`
    - Terima props `title: string`, `imageUrl?: string`, `slug: string`
    - Tampilkan judul artikel, gambar sampul (preview), pesan kontekstual mengapa login diperlukan
    - Render `TombolLoginGate` dengan `callbackUrl="/blog/${slug}"`
    - Gunakan palet warna Ruang Seduh
    - _Requirements: 4.1, 4.5, 5.1, 5.4_

  - [ ]* 3.2 Tulis property test untuk `AuthPromptBlog` — Property 5
    - **Property 5: AuthPromptBlog selalu menampilkan data artikel yang diberikan**
    - **Validates: Requirements 4.5**
    - Generate berbagai data artikel valid, verifikasi judul artikel selalu muncul di output render

- [x] 4. Buat komponen `AuthPromptCheckout`
  - [x] 4.1 Implementasi `AuthPromptCheckout` sebagai Client Component di `components/AuthPromptCheckout.tsx`
    - Baca data cart dari `useCartStore` (client-side Zustand)
    - Tampilkan ringkasan item cart (nama, jumlah, harga), pesan kontekstual, dan `TombolLoginGate` dengan `callbackUrl="/checkout"`
    - Gunakan palet warna Ruang Seduh
    - _Requirements: 2.1, 2.5, 5.1, 5.4_

  - [ ]* 4.2 Tulis unit test untuk `AuthPromptCheckout`
    - Test: merender tombol "Masuk dengan Google"
    - Test: menampilkan ringkasan item cart yang diberikan
    - _Requirements: 2.5, 5.2_

- [x] 5. Checkpoint — Pastikan semua komponen baru dapat di-compile tanpa error
  - Pastikan semua tests pass, tanyakan kepada user jika ada pertanyaan.

- [x] 6. Tulis utility tests untuk `lib/auth-gate.ts`
  - [x] 6.1 Tulis property test untuk `checkGate` — Property 1
    - **Property 1: Gate memblokir semua guest dari halaman yang dilindungi**
    - **Validates: Requirements 2.1, 4.1**
    - Generate berbagai state session tidak valid (null, undefined, expired), verifikasi selalu mengembalikan `"blocked"`

  - [x] 6.2 Tulis property test untuk `checkGate` — Property 2
    - **Property 2: Gate mengizinkan semua authenticated user**
    - **Validates: Requirements 2.4, 4.4**
    - Generate berbagai session valid dengan `user.id` berupa string arbitrer, verifikasi selalu mengembalikan `"allowed"`

  - [x] 6.3 Tulis property test untuk `buildCallbackUrl` — Property 3
    - **Property 3: CallbackUrl selalu mencerminkan path yang diakses**
    - **Validates: Requirements 2.2, 4.2**
    - Generate berbagai path valid (`/checkout`, `/blog/` + slug arbitrer), verifikasi output sama persis dengan input

  - [x] 6.4 Tulis property test untuk `validateCallbackUrl` — Property 4
    - **Property 4: Fallback redirect ke `/` untuk callbackUrl tidak valid**
    - **Validates: Requirements 6.2**
    - Generate berbagai nilai tidak valid (null, undefined, string kosong, URL eksternal), verifikasi selalu mengembalikan `"/"`

- [x] 7. Modifikasi `app/checkout/page.tsx` — tambahkan server-side gate
  - Ubah `app/checkout/page.tsx` menjadi Server Component wrapper
  - Pindahkan logika form yang ada ke `components/CheckoutForm.tsx` sebagai Client Component (dengan `"use client"`)
  - Di server component baru: panggil `getServerSession(authOptions)`, jika tidak ada session render `AuthPromptCheckout`, jika ada session render `CheckoutForm`
  - _Requirements: 2.1, 2.4_

- [ ]* 7.1 Tulis unit test untuk `app/checkout/page.tsx`
  - Test: menampilkan `AuthPromptCheckout` ketika tidak ada session
  - Test: menampilkan `CheckoutForm` ketika ada session valid
  - _Requirements: 2.1, 2.4_

- [x] 8. Modifikasi `app/blog/[slug]/page.tsx` — tambahkan server-side gate
  - Tambahkan logika gate di awal fungsi page, setelah fetch data artikel dari Sanity
  - Jika tidak ada session: ambil data minimal (title + mainImage) → render `AuthPromptBlog`
  - Jika ada session: lanjutkan render normal seperti sekarang (tidak ada perubahan pada logika yang sudah ada)
  - _Requirements: 4.1, 4.2, 4.4, 4.5_

- [ ]* 8.1 Tulis unit test untuk `app/blog/[slug]/page.tsx`
  - Test: menampilkan `AuthPromptBlog` ketika tidak ada session
  - Test: menampilkan konten artikel ketika ada session valid
  - _Requirements: 4.1, 4.4_

- [x] 9. Final checkpoint — Pastikan semua tests pass dan integrasi berjalan
  - Pastikan semua tests pass, tanyakan kepada user jika ada pertanyaan.

## Notes

- Tasks bertanda `*` bersifat opsional dan dapat dilewati untuk MVP yang lebih cepat
- Setiap task mereferensikan requirements spesifik untuk keterlacakan
- `TombolLoginGate` dapat digunakan ulang oleh kedua Auth Prompt
- `AuthPromptCheckout` harus menjadi Client Component karena membaca Zustand store
- `AuthPromptBlog` dapat menjadi Server Component karena data diteruskan via props
- Property tests menggunakan `fast-check`, unit tests menggunakan `vitest` + `@testing-library/react`
