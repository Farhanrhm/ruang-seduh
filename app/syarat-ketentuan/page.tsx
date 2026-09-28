import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Syarat & Ketentuan | Ruang Seduh",
  description: "Syarat dan ketentuan layanan Ruang Seduh.",
};

export default function SyaratKetentuan() {
  return (
    <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <h1 className="text-3xl md:text-5xl font-judul text-[var(--color-brand-text)] mb-6">Syarat & Ketentuan</h1>
      <p className="text-[var(--color-brand-text-muted)] mb-12 text-sm">Berlaku efektif sejak: 1 Oktober 2026</p>
      
      <div className="space-y-10 font-teks text-[var(--color-brand-text)] leading-relaxed">
        <section>
          <p className="text-lg">
            Selamat datang di Ruang Seduh. Syarat dan Ketentuan ini mengatur akses dan penggunaan Anda atas situs web dan layanan toko online kami. Dengan membuat akun, mengakses, atau melakukan transaksi di situs ini, Anda menyatakan telah membaca, memahami, dan menyetujui seluruh ketentuan di bawah ini. Syarat dan Ketentuan ini tunduk pada hukum yang berlaku di Republik Indonesia, khususnya Undang-Undang Perlindungan Konsumen No. 8 Tahun 1999 dan Peraturan Pemerintah No. 80 Tahun 2019 tentang PMSE.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-judul mb-4">1. Akun Pengguna</h2>
          <ul className="list-decimal pl-5 space-y-3 text-lg">
            <li>Anda bertanggung jawab penuh atas keamanan dan kerahasiaan kredensial akun Anda (login yang ditautkan via Google OAuth).</li>
            <li>Segala aktivitas transaksi yang berasal dari akun Anda akan dianggap sebagai tindakan sah dari Anda. Jika Anda mencurigai adanya penyalahgunaan akun, segera laporkan ke layanan pelanggan kami.</li>
            <li>Kami berhak menonaktifkan atau menangguhkan akun pengguna apabila terindikasi melakukan tindakan penipuan, pelanggaran hukum, atau penyalahgunaan layanan.</li>
          </ul>
        </section>
        
        <section>
          <h2 className="text-2xl font-judul mb-4">2. Pemesanan Produk</h2>
          <ul className="list-decimal pl-5 space-y-3 text-lg">
            <li>Semua pesanan yang Anda buat melalui situs web bergantung pada ketersediaan stok produk.</li>
            <li>Informasi terkait asal biji kopi, proses, <em>roast level</em>, dan <em>tasting notes</em> dicantumkan sejelas mungkin (mengacu pada data dari Roaster atau <em>Quality Control</em> kami). Namun, persepsi rasa (<em>tasting notes</em>) dapat bervariasi bergantung pada cara penyeduhan dan sensitivitas individu.</li>
            <li>Anda diwajibkan memastikan seluruh informasi pengiriman, termasuk kelengkapan alamat dan varian gilingan (<em>grind size</em>) sudah akurat sebelum menyelesaikan <em>checkout</em>. Kami tidak bertanggung jawab atas kegagalan pengiriman akibat kesalahan input alamat oleh pelanggan.</li>
          </ul>
        </section>
        
        <section>
          <h2 className="text-2xl font-judul mb-4">3. Harga dan Pembayaran</h2>
          <ul className="list-decimal pl-5 space-y-3 text-lg">
            <li>Seluruh harga yang tercantum di situs adalah dalam mata uang Rupiah (IDR). Harga yang tertera sudah termasuk pajak.</li>
            <li>Biaya pengiriman dihitung secara otomatis oleh sistem mitra logistik kami (Biteship) berdasarkan alamat tujuan dan berat total (termasuk <em>packaging</em> kardus/bubble wrap pembulatan).</li>
            <li>Ruang Seduh berhak membatalkan pesanan secara sepihak dan mengembalikan dana pengguna sepenuhnya apabila terjadi kesalahan teknis pada sistem yang mengakibatkan harga atau deskripsi produk tampil tidak semestinya (<em>pricing error</em>).</li>
            <li>Pembayaran diproses dengan aman melalui <em>payment gateway</em> resmi (Midtrans). Batas waktu pembayaran (kedaluwarsa) untuk pesanan adalah <strong>60 menit</strong> (1 jam) sejak pesanan dibuat. Jika pembayaran tidak diselesaikan dalam batas waktu tersebut, pesanan akan dibatalkan otomatis oleh sistem.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-judul mb-4">4. Pengiriman Barang (Penting)</h2>
          <ul className="list-decimal pl-5 space-y-3 text-lg">
            <li>Pesanan akan dikemas dan diserahkan kepada pihak ekspedisi maksimal 1-2 hari kerja setelah status pembayaran dikonfirmasi lunas ("PAID").</li>
            <li>Kami selalu berupaya mengemas barang secara maksimal (menggunakan <em>bubble wrap</em> dan kardus luar) untuk mencegah kerusakan produk kopi dan peralatan seduh.</li>
            <li><strong>Tanggung Jawab Pengiriman:</strong> Apabila terjadi kendala, keterlambatan parah, kehilangan, atau kerusakan parah selama masa transit di pihak ekspedisi, Ruang Seduh akan bertanggung jawab penuh untuk mencarikan solusi (seperti penggantian barang atau pengembalian dana) bagi Anda. Setelah masalah Anda terselesaikan, pihak Ruang Seduh-lah yang akan menuntut klaim asuransi kerugian ke pihak ekspedisi, sehingga Anda tidak perlu repot berurusan dengan pihak logistik terkait klaim asuransi.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-judul mb-4">5. Garansi Alat Seduh (Non-Perishable)</h2>
          <ul className="list-decimal pl-5 space-y-3 text-lg">
            <li>Peralatan kopi (seperti <em>grinder</em> elektrik, <em>kettle</em> listrik) tunduk pada masa garansi resmi yang diberikan oleh merek atau distributor utama alat tersebut.</li>
            <li>Kebijakan klaim garansi untuk kerusakan akibat pemakaian wajar (bukan <em>human error</em> seperti jatuh atau terendam air) harus mengacu pada kartu garansi yang disertakan di dalam kemasan.</li>
          </ul>
          <p className="text-lg mt-3 italic text-[var(--color-brand-text-muted)]">
            (Catatan: Untuk kebijakan retur barang akibat cacat pabrik atau kesalahan pengiriman, silakan merujuk ke <a href="/kebijakan-pengembalian" className="text-[var(--color-brand-accent-strong)] hover:underline font-medium">Kebijakan Pengembalian</a>).
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-judul mb-4">6. Kekayaan Intelektual</h2>
          <p className="text-lg">
            Seluruh konten di situs ini, termasuk namun tidak terbatas pada teks (artikel jurnal, panduan seduh), grafik, logo, gambar produk, dan struktur <em>codebase</em> adalah milik Ruang Seduh dan dilindungi oleh undang-undang Hak Cipta. Penggunaan komersial tanpa izin tertulis dilarang keras.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-judul mb-4">7. Yurisdiksi dan Penyelesaian Sengketa</h2>
          <p className="text-lg">
            Segala bentuk perselisihan yang timbul sehubungan dengan layanan Ruang Seduh akan diselesaikan terlebih dahulu melalui musyawarah mufakat. Jika tidak tercapai penyelesaian, maka sengketa akan diselesaikan melalui yurisdiksi Pengadilan Negeri setempat.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-judul mb-4">8. Kontak Kami</h2>
          <p className="text-lg">
            Jika Anda memiliki pertanyaan mengenai Syarat dan Ketentuan ini, silakan hubungi kami di:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-2 text-lg">
            <li><strong>WhatsApp:</strong> 081234567890 (Hanya Chat)</li>
            <li><strong>Email:</strong> support@ruangseduh.id</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
