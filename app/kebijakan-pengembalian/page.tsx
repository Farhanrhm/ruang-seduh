import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Kebijakan Pengembalian | Ruang Seduh",
  description: "Kebijakan pengembalian dana dan retur barang di Ruang Seduh.",
};

export default function KebijakanPengembalian() {
  return (
    <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <h1 className="text-3xl md:text-5xl font-judul text-[var(--color-brand-text)] mb-6">Kebijakan Pengembalian</h1>
      <p className="text-[var(--color-brand-text-muted)] mb-12 text-sm">Terakhir diperbarui: 26 September 2026</p>
      
      <div className="space-y-10 font-teks text-[var(--color-brand-text)] leading-relaxed">
        <section>
          <h2 className="text-2xl font-judul mb-4">1. Ketentuan Umum Pengembalian</h2>
          <p className="text-lg">
            Kepuasan Anda saat berbelanja alat dan biji kopi adalah prioritas utama kami. Jika Anda tidak sepenuhnya puas dengan pembelian Anda atau menemukan kendala, kami siap membantu. Pengembalian barang (retur) hanya berlaku untuk kasus <strong>cacat produk bawaan pabrik, kesalahan pengiriman dari pihak kami, atau kerusakan mayor selama transit</strong> (diwajibkan melampirkan bukti video unboxing tanpa jeda).
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-judul mb-4">2. Pengembalian Biji Kopi (Perishable Goods)</h2>
          <p className="text-lg">
            Mengingat sifat biji kopi sebagai produk konsumsi yang kualitasnya sensitif terhadap paparan udara (perishable), kami <strong>tidak dapat menerima</strong> pengembalian atau penukaran untuk produk kopi yang segel kemasannya telah dibuka, kecuali terdapat kesalahan murni dari pihak pengemasan kami (contoh: pesanan Gayo, yang dikirim Toraja).
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-judul mb-4">3. Peralatan Seduh & Aksesori (Non-Perishable)</h2>
          <p className="text-lg mb-3">
            Untuk pembelian peralatan dan aksesori kopi keras (seperti dripper, scale, atau server), Anda memiliki batas waktu <strong>7 hari kalender</strong> sejak barang berstatus diterima di sistem ekspedisi untuk mengajukan klaim pengembalian.
          </p>
          <p className="text-lg mb-2">Syarat wajib pengembalian peralatan:</p>
          <ul className="list-disc pl-5 space-y-2 text-lg">
            <li>Barang <strong>belum pernah digunakan</strong> untuk menyeduh dan kondisinya sama persis seperti saat Anda menerimanya.</li>
            <li>Seluruh kelengkapan, buku manual, dan kemasan asli bawaan (termasuk segel plastik) dalam keadaan utuh.</li>
            <li>Dapat menunjukkan struk digital atau invoice pembelian resmi dari Ruang Seduh.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-judul mb-4">4. Proses Pengajuan Retur</h2>
          <p className="text-lg">
            Untuk memulai proses pengajuan retur, silakan hubungi tim dukungan layanan pelanggan (Customer Support) kami melalui email di <a href="mailto:support@ruangseduh.com" className="text-[var(--color-brand-accent-strong)] hover:underline font-medium">support@ruangseduh.com</a>. Mohon cantumkan <strong>Nomor Pesanan (Order ID)</strong> Anda dan lampirkan <strong>Video Unboxing</strong> yang jelas sebagai bukti pendukung klaim.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-judul mb-4">5. Mekanisme Pengembalian Dana (Refund)</h2>
          <p className="text-lg">
            Setelah barang retur Anda tiba di fasilitas kami, tim Quality Control akan melakukan pengecekan. Kami akan segera memberi tahu Anda mengenai persetujuan atau penolakan pengembalian dana tersebut. Jika disetujui, dana akan diproses untuk dikembalikan secara otomatis ke metode pembayaran asli Anda, yang biasanya membutuhkan waktu <strong>3 hingga 5 hari kerja</strong> tergantung pada bank atau penyedia pembayaran Anda.
          </p>
        </section>

        <div className="mt-16 p-8 bg-white/60 backdrop-blur-sm rounded-3xl shadow-sm border border-[var(--color-brand-border)] flex flex-col items-start gap-4">
          <div>
            <h3 className="text-xl font-judul mb-2 text-[var(--color-brand-text)]">Butuh Bantuan Lebih Lanjut?</h3>
            <p className="text-[var(--color-brand-text-muted)] text-lg">Tim penyeduh kami selalu siap membantu menjawab setiap pertanyaan terkait pesanan Anda.</p>
          </div>
          <Link href="/" className="inline-flex items-center justify-center bg-[var(--color-brand-accent)] text-white px-8 py-3 rounded-full font-medium hover:bg-[var(--color-brand-accent-strong)] transition-all hover:-translate-y-0.5 shadow-md hover:shadow-lg mt-2">
            Hubungi Ruang Seduh
          </Link>
        </div>
      </div>
    </div>
  );
}
