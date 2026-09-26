import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Kebijakan Privasi | Ruang Seduh",
  description: "Kebijakan privasi dan pelindungan data pelanggan Ruang Seduh.",
};

export default function KebijakanPrivasi() {
  return (
    <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <h1 className="text-3xl md:text-5xl font-judul text-[var(--color-brand-text)] mb-6">Kebijakan Privasi</h1>
      <p className="text-[var(--color-brand-text-muted)] mb-12 text-sm">Terakhir diperbarui: 26 September 2026</p>
      
      <div className="space-y-10 font-teks text-[var(--color-brand-text)] leading-relaxed">
        <section>
          <h2 className="text-2xl font-judul mb-4">1. Pengumpulan Data Informasi</h2>
          <p className="text-lg">
            Saat Anda melakukan pembelian di Ruang Seduh atau mendaftar akun, kami mengumpulkan informasi identitas pribadi yang Anda berikan, seperti nama lengkap, alamat pengiriman, alamat penagihan, alamat email, dan nomor telepon aktif. Informasi ini kami butuhkan semata-mata untuk memproses pesanan dan memastikan barang sampai di tangan Anda dengan aman.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-judul mb-4">2. Keamanan Data Finansial</h2>
          <p className="text-lg">
            Semua transaksi pembayaran di platform kami ditangani dengan aman oleh <strong>Midtrans</strong> (Payment Gateway terlisensi Bank Indonesia). Ruang Seduh <strong>tidak pernah</strong> menyimpan detail kartu kredit, PIN, atau kata sandi perbankan Anda di dalam server kami. Segala enkripsi finansial berada di bawah standar PCI-DSS Midtrans.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-judul mb-4">3. Penggunaan Data</h2>
          <p className="text-lg mb-3">Data yang kami kumpulkan digunakan untuk:</p>
          <ul className="list-disc pl-5 space-y-2 text-lg">
            <li>Memverifikasi dan memproses transaksi belanja Anda.</li>
            <li>Melakukan pengiriman produk melalui pihak ketiga (layanan logistik/ekspedisi).</li>
            <li>Berkomunikasi dengan Anda mengenai status pesanan atau kendala pengiriman.</li>
            <li>Menawarkan pembaruan produk dan promosi spesial melalui Newsletter (hanya jika Anda telah berlangganan secara sadar).</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-judul mb-4">4. Pengungkapan kepada Pihak Ketiga</h2>
          <p className="text-lg">
            Kami <strong>tidak akan</strong> menjual, menyewakan, atau menukar informasi pribadi Anda kepada entitas luar mana pun demi keuntungan komersial. Data Anda hanya diteruskan secara aman kepada mitra yang membantu kami mengoperasikan platform (misal: jasa kurir untuk alamat pengiriman, dan penyedia email untuk konfirmasi otomatis), di mana mitra tersebut telah sepakat untuk menjaga kerahasiaan informasi ini.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-judul mb-4">5. Hak Anda atas Data</h2>
          <p className="text-lg">
            Sesuai dengan hak privasi Anda, Anda berhak untuk meminta salinan data pribadi yang kami simpan, meminta koreksi atas data yang tidak akurat, atau meminta penghapusan akun dan seluruh rekaman data Anda dari sistem kami. Silakan hubungi kami untuk melakukan hal ini.
          </p>
        </section>

        <div className="mt-16 p-8 bg-[var(--color-brand-base)] rounded-3xl shadow-sm border border-[var(--color-brand-border)]">
          <h3 className="text-xl font-judul mb-4 text-[var(--color-brand-text)]">Punya pertanyaan seputar privasi data?</h3>
          <p className="text-lg mb-6">
            Jika Anda memiliki kekhawatiran tentang privasi, silakan hubungi tim kami via surel ke <a href="mailto:privacy@ruangseduh.com" className="font-bold hover:underline">privacy@ruangseduh.com</a>.
          </p>
          <Link href="/" className="inline-block bg-[var(--color-brand-text)] text-white px-8 py-3 rounded-full font-medium hover:bg-[var(--color-brand-text-muted)] transition-all">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
