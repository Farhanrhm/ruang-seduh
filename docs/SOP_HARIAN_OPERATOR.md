# SOP HARIAN OPERATOR - RUANG SEDUH

Dokumen ini berisi panduan operasional standar harian bagi operator/pemilik Ruang Seduh untuk memproses pesanan dan mengelola stok.

## 🕒 RITME KERJA HARIAN

### 1. Pagi Hari (08:00 - 09:00 WIB)
*   **Buka Dashboard Admin:** Akses halaman `https://[domain-anda]/admin`.
*   **Cek Pesanan Masuk:** Buka tab **"Pesanan"**. Perhatikan pesanan yang memiliki label kuning `PAID` (Sudah Dibayar).
*   **Tindakan:** Klik tombol hitam **"Tandai Dikemas"** pada pesanan tersebut. Status akan berubah menjadi `PROCESSING`.
*   **Keamanan Ekstra (Opsional):** Jika merasa ada pesanan yang *nyangkut* karena gangguan internet semalam, klik tombol **"Sync Pembayaran Gantung"** di pojok kanan atas.

### 2. Siang Hari (Batas Cut-Off Pukul 14:00 WIB)
*   **Pengemasan Akhir:** Pastikan semua pesanan `PROCESSING` yang masuk sebelum jam 14:00 sudah dikemas rapi.
*   **Pesan Kurir (Biteship/Manual):** Dapatkan nomor resi dari pihak logistik (JNE, Sicepat, dll).
*   **Input Resi:** Pada kartu pesanan di Dashboard, klik tombol biru **"Input Resi"**. Masukkan nomor resi yang valid.
    *   *Catatan:* Begitu tombol "Kirim Resi" ditekan, pelanggan akan otomatis menerima email notifikasi bahwa barang sedang dikirim! Status berubah menjadi `SHIPPED`.

### 3. Sore Hari (17:00 WIB)
*   **Cek Komplain WhatsApp:** Periksa pesan WhatsApp toko (`+628123456789`). Jika ada pelanggan yang menekan tombol komplain dari profil mereka, selesaikan via chat.
*   **Cek Rekap Harian:** Buka tab **"Laporan"** di Dashboard Admin untuk melihat pemasukan dan stok terjual hari ini.

---

## 🛠 PANDUAN KHUSUS

### A. Cara Menangani Komplain & Refund
1.  Minta pelanggan mengirimkan **Video Unboxing** via WhatsApp.
2.  Jika Anda menyetujui komplain dan uang telah Anda transfer balik secara manual ke rekening pelanggan:
3.  Buka Dashboard Admin -> Tab **Pesanan**.
4.  Cari pesanan pelanggan tersebut, klik teks merah **"Batalkan & Refund Pesanan"**.
5.  Sistem otomatis membatalkan pesanan dan mengembalikan stok (+X) ke dalam *Stock Ledger*.

### B. Cara Menambah Stok Barang (Restock)
1.  Buka Dashboard Admin -> Tab **Manajemen Stok**.
2.  Pilih produk dari *dropdown*.
3.  Masukkan jumlah yang ditambah (misal: `10`), dan beri catatan "Restock Suplier A".
4.  Klik **"Update Stok"**.

### C. Auto-Complete (Pesanan Selesai Otomatis)
Anda tidak perlu menekan tombol **"Pesanan Selesai"** jika pelanggan lupa mengklik terima barang. Sistem memiliki *Cron Job* yang berjalan otomatis setiap tengah malam untuk mendeteksi pesanan `SHIPPED` yang sudah lebih dari 5 hari dan mengubahnya menjadi `DELIVERED`.
