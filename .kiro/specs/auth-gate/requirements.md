# Requirements Document

## Introduction

Fitur **Auth Gate** adalah mekanisme perlindungan akses pada aplikasi Ruang Seduh yang memastikan halaman-halaman tertentu hanya dapat diakses oleh pengguna yang sudah login. Terdapat dua area yang dilindungi:

1. **Checkout** — Pengguna (guest) bebas menjelajahi toko dan menambahkan produk ke keranjang, namun wajib login sebelum dapat menyelesaikan proses checkout.
2. **Konten Blog** — Pengguna bebas melihat daftar artikel di halaman blog, namun wajib login untuk membuka dan membaca isi artikel (halaman detail blog).

Autentikasi menggunakan NextAuth dengan provider Google yang sudah ada di aplikasi. Setelah login berhasil, pengguna diarahkan kembali ke halaman yang semula ingin mereka akses.

---

## Glossary

- **Auth_Gate**: Komponen atau mekanisme yang memblokir akses ke halaman tertentu bagi pengguna yang belum login.
- **Guest**: Pengguna yang belum melakukan autentikasi (tidak memiliki sesi aktif).
- **Authenticated_User**: Pengguna yang sudah login dan memiliki sesi NextAuth yang valid.
- **Checkout_Page**: Halaman di `/checkout` tempat pengguna menyelesaikan pembelian.
- **Blog_List_Page**: Halaman di `/blog` yang menampilkan daftar semua artikel.
- **Blog_Detail_Page**: Halaman di `/blog/[slug]` yang menampilkan isi lengkap sebuah artikel.
- **Login_Page**: Halaman atau modal yang memungkinkan pengguna melakukan autentikasi via Google.
- **Redirect_URL**: URL tujuan yang disimpan sementara agar pengguna dapat diarahkan kembali setelah login berhasil.
- **Session**: Sesi autentikasi NextAuth yang menyimpan informasi pengguna yang sedang login.
- **Auth_Prompt**: Tampilan UI yang menginformasikan pengguna bahwa mereka perlu login untuk mengakses konten, beserta tombol untuk memulai proses login.

---

## Requirements

### Requirement 1: Akses Bebas ke Halaman Toko

**User Story:** Sebagai guest, saya ingin bisa menjelajahi produk di toko dan menambahkan produk ke keranjang tanpa harus login, sehingga saya bisa mempertimbangkan pembelian sebelum membuat akun.

#### Acceptance Criteria

1. THE Auth_Gate SHALL mengizinkan Guest mengakses halaman `/toko` tanpa autentikasi.
2. THE Auth_Gate SHALL mengizinkan Guest menambahkan produk ke keranjang belanja tanpa autentikasi.
3. THE Auth_Gate SHALL mengizinkan Guest melihat isi keranjang belanja tanpa autentikasi.

---

### Requirement 2: Proteksi Halaman Checkout

**User Story:** Sebagai pemilik toko, saya ingin memastikan hanya pengguna yang sudah login yang bisa melakukan checkout, sehingga data pesanan terhubung dengan akun pengguna yang valid.

#### Acceptance Criteria

1. WHEN Guest mengakses halaman `/checkout`, THE Auth_Gate SHALL menampilkan Auth_Prompt yang menjelaskan bahwa login diperlukan untuk melanjutkan checkout.
2. WHEN Guest mengakses halaman `/checkout`, THE Auth_Gate SHALL menyimpan `/checkout` sebagai Redirect_URL sebelum memulai proses login.
3. WHEN Authenticated_User berhasil login dari Auth_Prompt checkout, THE Auth_Gate SHALL mengarahkan Authenticated_User ke halaman `/checkout`.
4. WHILE Authenticated_User memiliki Session yang valid, THE Auth_Gate SHALL mengizinkan Authenticated_User mengakses halaman `/checkout` tanpa hambatan.
5. THE Auth_Prompt pada halaman checkout SHALL menampilkan ringkasan item di keranjang agar Guest mengetahui pesanan mereka tidak hilang setelah login.

---

### Requirement 3: Akses Bebas ke Daftar Blog

**User Story:** Sebagai guest, saya ingin bisa melihat daftar artikel blog tanpa harus login, sehingga saya bisa memutuskan artikel mana yang ingin saya baca.

#### Acceptance Criteria

1. THE Auth_Gate SHALL mengizinkan Guest mengakses halaman `/blog` dan melihat daftar artikel tanpa autentikasi.
2. THE Auth_Gate SHALL menampilkan judul, gambar sampul, tanggal, dan nama penulis setiap artikel kepada Guest di halaman `/blog`.

---

### Requirement 4: Proteksi Halaman Detail Blog

**User Story:** Sebagai pengelola konten, saya ingin konten artikel lengkap hanya bisa dibaca oleh pengguna yang sudah login, sehingga konten berkualitas mendorong pengguna untuk mendaftar.

#### Acceptance Criteria

1. WHEN Guest mengakses halaman `/blog/[slug]`, THE Auth_Gate SHALL menampilkan Auth_Prompt sebagai pengganti konten artikel, tanpa mengungkapkan isi artikel.
2. WHEN Guest mengakses halaman `/blog/[slug]`, THE Auth_Gate SHALL menyimpan URL `/blog/[slug]` yang bersangkutan sebagai Redirect_URL sebelum memulai proses login.
3. WHEN Authenticated_User berhasil login dari Auth_Prompt blog, THE Auth_Gate SHALL mengarahkan Authenticated_User ke halaman `/blog/[slug]` yang semula ingin diakses.
4. WHILE Authenticated_User memiliki Session yang valid, THE Auth_Gate SHALL mengizinkan Authenticated_User membaca seluruh konten artikel di halaman `/blog/[slug]`.
5. THE Auth_Prompt pada halaman detail blog SHALL menampilkan judul artikel dan gambar sampul artikel yang ingin dibaca, sehingga Guest mengetahui konten apa yang akan mereka dapatkan setelah login.

---

### Requirement 5: Tampilan Auth Prompt

**User Story:** Sebagai guest, saya ingin melihat pesan yang jelas dan menarik ketika saya perlu login, sehingga saya memahami mengapa login diperlukan dan termotivasi untuk melakukannya.

#### Acceptance Criteria

1. THE Auth_Prompt SHALL menampilkan pesan yang menjelaskan mengapa login diperlukan untuk halaman yang sedang diakses.
2. THE Auth_Prompt SHALL menampilkan tombol "Masuk dengan Google" yang memulai alur autentikasi NextAuth.
3. WHEN pengguna mengklik tombol "Masuk dengan Google" pada Auth_Prompt, THE Auth_Gate SHALL memulai proses `signIn("google")` dengan parameter `callbackUrl` yang berisi Redirect_URL.
4. THE Auth_Prompt SHALL konsisten secara visual dengan desain aplikasi Ruang Seduh (menggunakan palet warna `#4B2E1C`, `#8B5E3C`, `#D4956A`, `#FDF6EE`).
5. IF proses login gagal atau dibatalkan oleh pengguna, THEN THE Auth_Gate SHALL mengembalikan pengguna ke halaman sebelumnya tanpa menampilkan error yang membingungkan.

---

### Requirement 6: Redirect Setelah Login

**User Story:** Sebagai pengguna yang baru login, saya ingin langsung diarahkan ke halaman yang ingin saya akses sebelumnya, sehingga pengalaman saya tidak terganggu oleh proses autentikasi.

#### Acceptance Criteria

1. WHEN Authenticated_User berhasil login, THE Auth_Gate SHALL mengarahkan Authenticated_User ke Redirect_URL yang tersimpan.
2. IF Redirect_URL tidak tersedia atau tidak valid, THEN THE Auth_Gate SHALL mengarahkan Authenticated_User ke halaman utama (`/`).
3. THE Auth_Gate SHALL menggunakan mekanisme `callbackUrl` bawaan NextAuth untuk mengelola Redirect_URL, sehingga tidak memerlukan penyimpanan state tambahan.
