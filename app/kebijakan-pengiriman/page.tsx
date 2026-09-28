import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Kebijakan Pengiriman | Ruang Seduh",
  description: "Kebijakan pengiriman dan estimasi logistik Ruang Seduh.",
};

export default function KebijakanPengiriman() {
  return (
    <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <h1 className="text-3xl md:text-5xl font-judul text-[var(--color-brand-text)] mb-6">Kebijakan Pengiriman</h1>
      <p className="text-[var(--color-brand-text-muted)] mb-12 text-sm">Berlaku efektif sejak: 1 Oktober 2026</p>
      
      <div className="space-y-10 font-teks text-[var(--color-brand-text)] leading-relaxed">
        <section>
          <p className="text-lg">
            Kami memahami bahwa kesegaran biji kopi adalah hal yang sangat penting. Oleh karena itu, Ruang Seduh bekerja sama dengan mitra logistik tepercaya untuk memastikan pesanan Anda tiba dengan aman dan tepat waktu.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-judul mb-4">1. Jadwal Pemrosesan Pesanan</h2>
          <ul className="list-decimal pl-5 space-y-3 text-lg">
            <li><strong>Waktu Operasional Pengemasan:</strong> Senin hingga Jumat, pukul 09.00 - 17.00 WIB. (Sabtu, Minggu, dan Hari Libur Nasional tidak ada pengiriman).</li>
            <li><strong>Batas Waktu Pesanan (Cut-Off Time):</strong>
              <ul className="list-disc pl-5 mt-2 space-y-2">
                <li>Pesanan yang pembayarannya dikonfirmasi sebelum pukul <strong>14.00 WIB</strong> akan diupayakan untuk diproses dan diserahkan ke kurir pada hari yang sama.</li>
                <li>Pesanan yang dibayar setelah pukul 14.00 WIB akan diproses pada hari kerja berikutnya.</li>
              </ul>
            </li>
            <li><strong>Masa Kemas:</strong> Dalam kondisi normal, pesanan akan dikemas dalam <strong>1-2 hari kerja</strong>. Pada periode promo besar atau peluncuran biji kopi baru, masa kemas mungkin memerlukan tambahan waktu.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-judul mb-4">2. Penghitungan Ongkos Kirim & Ekspedisi</h2>
          <ul className="list-decimal pl-5 space-y-3 text-lg">
            <li>Kami menggunakan sistem kurir terintegrasi dari pihak ketiga (<strong>Biteship</strong>) untuk memunculkan pilihan tarif ekspedisi terbaik ke lokasi Anda secara <em>real-time</em>.</li>
            <li>Total berat pengiriman yang dihitung saat <em>checkout</em> bukan hanya berat bersih kopi atau alat seduh, melainkan telah <strong>ditambahkan estimasi berat kemasan pengaman</strong> (boks kardus dan <em>bubble wrap</em>) sebesar ±150 gram per pesanan. Hal ini untuk memastikan tarif ekspedisi akurat dan paket terlindungi secara maksimal.</li>
            <li>Kami mengirim pesanan dari pusat <em>roastery</em> kami yang berlokasi di Jakarta.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-judul mb-4">3. Ketentuan Pengiriman Same Day / Instant</h2>
          <ul className="list-decimal pl-5 space-y-3 text-lg">
            <li>Layanan kurir Instant (misal: GoSend/GrabExpress) tersedia untuk jangkauan maksimal pengiriman jarak dekat dari <em>roastery</em> kami.</li>
            <li>Pesanan Instant wajib dikonfirmasi lunas sebelum pukul <strong>14.00 WIB</strong>. Lewat dari jam tersebut, kurir akan dipanggil pada pagi hari kerja berikutnya.</li>
            <li>Pastikan ada penerima yang siaga di alamat tujuan, serta nomor telepon yang dicantumkan aktif agar kurir tidak kesulitan saat mengantar.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-judul mb-4">4. Lacak Pesanan (Tracking)</h2>
          <p className="text-lg">
            Setelah paket Anda diserahkan kepada kurir (JNE, SiCepat, AnterAja, Paxel, dll.), sistem kami atau penyedia kurir terkait akan memperbarui nomor resi (AWB). Anda dapat melacak status pengiriman melalui tautan resi di detail pesanan Anda, atau mengeceknya langsung melalui situs web resmi ekspedisi pilihan.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-judul mb-4">5. Kendala Pengiriman & Tanggung Jawab</h2>
          <p className="text-lg mb-3">
            Kami menjamin paket diserahkan ke pihak ekspedisi dalam kondisi baru, tersegel baik, dan aman. Namun, kami menyadari bahwa risiko di perjalanan bisa terjadi.
          </p>
          <ul className="list-disc pl-5 space-y-3 text-lg">
            <li><strong>Keterlambatan Ekspedisi:</strong> Estimasi waktu tiba (ETA) murni bergantung pada operasional jasa logistik. Jika paket melebihi estimasi tiba yang wajar, hubungi kami dan tim kami akan membantu melakukan <em>follow-up</em> (pelacakan) ke pihak ekspedisi.</li>
            <li><strong>Barang Rusak/Hilang:</strong> Apabila paket hilang atau rusak parah karena kesalahan kurir, <strong>Anda tidak perlu khawatir</strong>. Sesuai UU Perlindungan Konsumen, Anda cukup melapor kepada kami beserta bukti (Video Unboxing). Kami akan mencari solusi secepatnya (mengganti pesanan atau membatalkan pesanan/refund), lalu kami yang akan mengurus tuntutan klaim asuransi ke pihak logistik terkait.</li>
          </ul>
        </section>

        <div className="mt-16 p-8 bg-white/60 backdrop-blur-sm rounded-3xl shadow-sm border border-[var(--color-brand-border)] flex flex-col items-start gap-4">
          <div>
            <h3 className="text-xl font-judul mb-2 text-[var(--color-brand-text)]">Butuh Bantuan Logistik?</h3>
            <p className="text-[var(--color-brand-text-muted)] text-lg">Bila Anda butuh mengubah detail alamat sebelum paket diproses, segera hubungi tim kami.</p>
          </div>
          <Link href="/" className="inline-flex items-center justify-center bg-[var(--color-brand-accent)] text-white px-8 py-3 rounded-full font-medium hover:bg-[var(--color-brand-accent-strong)] transition-all hover:-translate-y-0.5 shadow-md hover:shadow-lg mt-2">
            Hubungi Customer Support
          </Link>
        </div>
      </div>
    </div>
  );
}
