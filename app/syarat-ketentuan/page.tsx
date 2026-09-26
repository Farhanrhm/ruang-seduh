import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Syarat & Ketentuan | Ruang Seduh",
  description: "Syarat dan ketentuan layanan Ruang Seduh.",
};

export default function SyaratKetentuan() {
  return (
    <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <h1 className="text-3xl md:text-5xl font-judul text-[var(--color-brand-text)] mb-6">Syarat & Ketentuan</h1>
      <p className="text-[var(--color-brand-text-muted)] mb-12 text-sm">Terakhir diperbarui: 26 September 2026</p>
      
      <div className="space-y-10 font-teks text-[var(--color-brand-text)] leading-relaxed">
        <section>
          <h2 className="text-2xl font-judul mb-4">1. Pendahuluan</h2>
          <p className="text-lg mb-3">
            Selamat datang di Ruang Seduh. Syarat dan Ketentuan ini merujuk pada prinsip <strong>Undang-Undang Perlindungan Konsumen No. 8 Tahun 1999</strong> yang berlaku di Republik Indonesia.
          </p>
          <p className="text-lg mb-3">
            Dengan mengakses dan menggunakan situs web kami, Anda secara sadar menyetujui untuk terikat oleh Syarat dan Ketentuan ini. Harap baca dengan saksama sebelum melakukan transaksi apa pun.
          </p>
          <p className="text-lg">
            Segala sengketa yang timbul dari layanan ini akan diselesaikan secara musyawarah. Jika tidak tercapai mufakat, maka akan diselesaikan melalui yurisdiksi Pengadilan Negeri Bandung.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-judul mb-4">2. Pemesanan dan Pembayaran</h2>
          <ul className="list-disc pl-5 space-y-3 text-lg">
            <li>Semua pesanan bergantung pada ketersediaan produk.</li>
            <li>Harga yang tercantum dalam Rupiah (IDR) dan dapat berubah sewaktu-waktu tanpa pemberitahuan sebelumnya.</li>
            <li>Pembayaran harus diselesaikan sepenuhnya melalui payment gateway terpercaya (Midtrans) sebelum pesanan diproses dan dikirim.</li>
          </ul>
        </section>
        
        <section>
          <h2 className="text-2xl font-judul mb-4">3. Pengiriman</h2>
          <p className="text-lg">
            Pesanan akan diproses dalam waktu 1-2 hari kerja setelah pembayaran dikonfirmasi. Waktu pengiriman bergantung pada layanan ekspedisi yang Anda pilih saat checkout. Kami akan berusaha semaksimal mungkin mengemas dengan aman, namun tidak bertanggung jawab atas keterlambatan atau kerusakan yang murni disebabkan oleh pihak ketiga (ekspedisi).
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-judul mb-4">4. Kebijakan Kualitas Produk Kopi</h2>
          <p className="text-lg">
            Kami menjamin semua biji kopi yang dikirimkan berada pada rentang kesegaran optimal (biasanya di-roast dalam kurun waktu maksimal 14 hari sebelum pengiriman). Untuk peralatan seduh, garansi mengikuti ketentuan resmi dari masing-masing prinsipal/merek alat tersebut.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-judul mb-4">5. Privasi dan Keamanan</h2>
          <p className="text-lg">
            Keamanan data Anda sangat penting bagi kami. Informasi pribadi yang Anda berikan akan dijaga kerahasiaannya dengan sistem keamanan mutakhir. Ketentuan lebih lengkap diatur dalam halaman <a href="/kebijakan-privasi" className="text-[var(--color-brand-accent-strong)] hover:underline font-medium">Kebijakan Privasi</a> kami.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-judul mb-4">6. Keadaan Kahar (Force Majeure)</h2>
          <p className="text-lg">
            Ruang Seduh dibebaskan dari segala tuntutan hukum atau ganti rugi atas keterlambatan, kegagalan pengiriman, atau kerusakan produk yang murni diakibatkan oleh kejadian di luar kendali wajar kami (Force Majeure), termasuk namun tidak terbatas pada bencana alam, huru-hara, kebijakan pemerintah, kecelakaan tak terduga, atau kelumpuhan sistem pihak ketiga penyedia jasa logistik.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-judul mb-4">7. Kesalahan Sistem dan Harga (Typo Pricing)</h2>
          <p className="text-lg">
            Ruang Seduh berhak membatalkan pesanan secara sepihak dan mengembalikan dana pengguna apabila terjadi kesalahan sistem yang mengakibatkan harga atau deskripsi produk tampil tidak semestinya (misalnya: salah ketik harga menjadi terlalu rendah).
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-judul mb-4">8. Tanggung Jawab Akun Pengguna</h2>
          <p className="text-lg">
            Apabila Anda membuat akun di situs ini, segala aktivitas transaksi dan kerahasiaan kata sandi (password) adalah tanggung jawab penuh Anda selaku pemilik akun. Kami berhak menonaktifkan akun yang terindikasi melakukan penipuan.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-judul mb-4">9. Hak Kekayaan Intelektual (HAKI)</h2>
          <p className="text-lg">
            Seluruh aset visual, logo, foto produk, desain web, dan teks di situs ini adalah hak milik Ruang Seduh. Dilarang keras menyalin atau menggunakan aset tersebut untuk tujuan komersial tanpa izin tertulis dari kami.
          </p>
        </section>
      </div>
    </div>
  );
}
