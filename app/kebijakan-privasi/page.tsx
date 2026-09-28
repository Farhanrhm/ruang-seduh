import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Kebijakan Privasi | Ruang Seduh",
  description: "Kebijakan privasi dan perlindungan data pribadi Ruang Seduh.",
};

export default function KebijakanPrivasi() {
  return (
    <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <h1 className="text-3xl md:text-5xl font-judul text-[var(--color-brand-text)] mb-6">Kebijakan Privasi</h1>
      <p className="text-[var(--color-brand-text-muted)] mb-12 text-sm">Berlaku efektif sejak: 1 Oktober 2026</p>
      
      <div className="space-y-10 font-teks text-[var(--color-brand-text)] leading-relaxed">
        <section>
          <p className="text-lg">
            Ruang Seduh ("kami") menghormati privasi Anda. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, memproses, dan melindungi informasi pribadi Anda ("Data Pribadi") saat Anda mengunjungi situs web kami, membuat akun, atau melakukan pembelian. Kebijakan ini disusun dengan merujuk pada Undang-Undang Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP).
          </p>
          <p className="text-lg mt-3">
            Dengan mengakses situs web kami dan memberikan Data Pribadi Anda, Anda menyetujui pengumpulan dan penggunaan data sesuai dengan kebijakan ini.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-judul mb-4">1. Data yang Kami Kumpulkan</h2>
          <p className="text-lg mb-3">Kami hanya mengumpulkan Data Pribadi yang relevan dan diperlukan untuk memberikan layanan kami, meliputi:</p>
          <ul className="list-disc pl-5 space-y-3 text-lg">
            <li><strong>Data Profil & Kontak:</strong> Nama lengkap, alamat email, dan nomor WhatsApp. Kami juga menerima nama dan email Anda dari penyedia layanan otentikasi pihak ketiga (Google) jika Anda mendaftar melalui fitur tersebut.</li>
            <li><strong>Data Transaksi & Pengiriman:</strong> Alamat lengkap pengiriman, detail pesanan (produk yang dibeli), serta metode pembayaran.</li>
            <li><strong>Data Teknis:</strong> Informasi sesi login (<em>session cookie</em>) yang digunakan secara eksklusif untuk menjaga Anda tetap masuk ke dalam sistem kami dengan aman. Saat ini, kami tidak menggunakan pelacak iklan pihak ketiga (seperti Meta Pixel).</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-judul mb-4">2. Tujuan Penggunaan Data</h2>
          <p className="text-lg mb-3">Kami menggunakan Data Pribadi Anda untuk tujuan berikut:</p>
          <ul className="list-disc pl-5 space-y-3 text-lg">
            <li><strong>Pemrosesan Transaksi:</strong> Memproses pesanan Anda, menghitung ongkos kirim (termasuk verifikasi wilayah), dan mengirimkan produk ke alamat Anda.</li>
            <li><strong>Pembayaran:</strong> Mengonfirmasi dan memfasilitasi transaksi finansial dengan aman.</li>
            <li><strong>Layanan Pelanggan:</strong> Menghubungi Anda terkait status pesanan, pertanyaan pelanggan, atau keluhan (retur).</li>
            <li><strong>Pemasaran (Opsional):</strong> Mengirimkan pembaruan, panduan seduh, dan penawaran promosi (<em>newsletter</em>) jika Anda telah secara eksplisit memberikan persetujuan di halaman pengaturan profil Anda.</li>
            <li><strong>Keamanan & Kepatuhan:</strong> Mencegah aktivitas penipuan dan mematuhi kewajiban hukum (seperti penyimpanan bukti transaksi elektronik).</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-judul mb-4">3. Pembagian Data dengan Pihak Ketiga</h2>
          <p className="text-lg mb-3">Untuk dapat memproses pesanan dan menjalankan operasional web, kami membagikan sebagian data Anda kepada mitra pihak ketiga terpilih yang memiliki standar keamanan yang ketat:</p>
          <ul className="list-disc pl-5 space-y-3 text-lg">
            <li><strong>Midtrans:</strong> Data pesanan, nama, kontak, dan alamat diteruskan ke Midtrans (beroperasi di Indonesia) selaku <em>Payment Gateway</em> untuk memproses pembayaran Anda.</li>
            <li><strong>Biteship:</strong> Data asal dan tujuan beserta berat barang diteruskan ke Biteship (beroperasi di Indonesia) untuk perhitungan ongkos kirim dan pembuatan resi.</li>
            <li><strong>Resend:</strong> Alamat email Anda diteruskan ke Resend (penyedia layanan email) untuk mengirimkan invoice dan email pemasaran.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-judul mb-4">4. Transfer Data ke Luar Wilayah Indonesia</h2>
          <p className="text-lg">
            Situs web, pangkalan data, dan sistem pengelolaan konten kami diselenggarakan menggunakan layanan komputasi awan (<em>cloud provider</em>) yang peladennya (server) berlokasi di luar wilayah Republik Indonesia. Dengan menyetujui kebijakan ini, Anda memahami dan mengizinkan bahwa Data Pribadi Anda diproses dan disimpan secara aman di yurisdiksi lain sesuai standar global.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-judul mb-4">5. Penyimpanan dan Keamanan Data</h2>
          <p className="text-lg">
            Kami menyimpan Data Pribadi Anda hanya selama diperlukan untuk memenuhi tujuan pengumpulannya, atau sebagaimana diwajibkan oleh peraturan perundang-undangan (misalnya, bukti transaksi finansial yang wajib disimpan 5-10 tahun).
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-judul mb-4">6. Hak Anda atas Data Pribadi</h2>
          <p className="text-lg mb-3">Sesuai dengan UU PDP, Anda memiliki hak-hak berikut:</p>
          <ul className="list-disc pl-5 space-y-3 text-lg">
            <li><strong>Akses & Pembaruan:</strong> Anda dapat melihat dan memperbarui Nama dan pengaturan Newsletter Anda di halaman Pengaturan Profil.</li>
            <li><strong>Pencabutan Persetujuan (Unsubscribe):</strong> Anda berhak berhenti menerima email pemasaran kapan saja melalui profil atau tautan di email.</li>
            <li><strong>Penghapusan Data:</strong> Anda berhak meminta penghapusan akun Anda dengan menghubungi layanan pelanggan kami. Data terkait pesanan historis akan dianominasi (<em>anonymized</em>) guna memenuhi ketentuan kepatuhan pajak.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
