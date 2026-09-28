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
      <p className="text-[var(--color-brand-text-muted)] mb-12 text-sm">Berlaku efektif sejak: 1 Oktober 2026</p>
      
      <div className="space-y-10 font-teks text-[var(--color-brand-text)] leading-relaxed">
        <section>
          <p className="text-lg">
            Ruang Seduh berkomitmen untuk memberikan kualitas produk (biji kopi dan peralatan seduh) yang terbaik. Namun, jika terjadi kesalahan atau ketidaksesuaian pesanan, Anda dilindungi oleh Kebijakan Pengembalian ini sesuai dengan prinsip perlindungan konsumen.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-judul mb-4">1. Syarat Umum Pengembalian (Return)</h2>
          <p className="text-lg mb-3">
            Pengembalian barang dan dana (<em>refund</em>) <strong>HANYA BERLAKU</strong> untuk kondisi berikut:
          </p>
          <ul className="list-decimal pl-5 space-y-3 text-lg">
            <li><strong>Cacat Produk/Pabrik:</strong> Produk alat seduh tidak berfungsi sebagaimana mestinya saat pertama kali diterima.</li>
            <li><strong>Kesalahan Pengiriman:</strong> Barang yang Anda terima (jenis kopi, ukuran gilingan, atau warna alat) tidak sesuai dengan detail invoice/pesanan.</li>
            <li><strong>Kerusakan Mayor saat Pengiriman:</strong> Kemasan hancur, bocor, atau alat pecah akibat kelalaian logistik (<em>Syarat: wajib melampirkan video unboxing tanpa jeda/cut</em>).</li>
          </ul>
          <p className="text-lg mt-3">
            Batas waktu maksimal untuk melaporkan keluhan adalah <strong>2x24 jam</strong> sejak status resi ekspedisi dinyatakan "Diterima/Delivered".
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-judul mb-4">2. Pengecualian (Barang yang Tidak Dapat Dikembalikan)</h2>
          <ul className="list-decimal pl-5 space-y-3 text-lg">
            <li><strong>Biji Kopi (Perishable Goods):</strong> Karena sifat biji kopi yang rentan dan dipengaruhi faktor penyimpanan, kami <strong>TIDAK</strong> melayani retur atau <em>refund</em> jika segel kemasan kopi sudah dibuka, atau dengan alasan subyektif (misal: "Saya tidak suka profil rasanya" atau "Kurang cocok").</li>
            <li><strong>Peralatan yang Sudah Dipakai:</strong> Alat seduh yang sudah dicuci, digunakan untuk menyeduh, atau boks kemasan aslinya dibuang, tidak dapat ditukar kecuali mengalami malfungsi elektronik bawaan pabrik (klaim garansi).</li>
          </ul>
        </section>
        
        <section>
          <h2 className="text-2xl font-judul mb-4">3. Langkah Pengajuan Retur</h2>
          <p className="text-lg mb-3">Jika pesanan Anda memenuhi kriteria di atas, ikuti langkah berikut:</p>
          <ul className="list-decimal pl-5 space-y-3 text-lg">
            <li>Hubungi Layanan Pelanggan kami melalui email di <strong>support@ruangseduh.id</strong> atau WhatsApp di <strong>081234567890</strong>.</li>
            <li>Sertakan format: Nomor Pesanan (Order ID), Nama & Alamat Lengkap, Foto Resi di kemasan paket, dan <strong>Video Unboxing</strong> utuh (sebagai bukti mutlak untuk klaim kerusakan/salah kirim).</li>
            <li>Setelah kami validasi (maksimal 1x24 jam kerja), kami akan mengirimkan instruksi pengembalian barang ke gudang kami.</li>
            <li>Biaya ongkos kirim pengembalian akibat kesalahan pihak Ruang Seduh akan kami tanggung (Sistem <em>reimbursement</em>, mohon simpan resi pengiriman retur Anda).</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-judul mb-4">4. Mekanisme Pengembalian Dana (Refund)</h2>
          <ul className="list-decimal pl-5 space-y-3 text-lg">
            <li>Setelah paket retur Anda tiba di gudang dan lolos pengecekan (<em>Quality Control</em>), Anda berhak memilih untuk dikirimkan barang pengganti atau pengembalian dana (<em>refund</em>) penuh.</li>
            <li>Karena keterbatasan sistem pembayaran saat ini, proses pengembalian dana tidak dilakukan secara otomatis melalui <em>payment gateway</em>. Dana akan ditransfer <strong>secara manual</strong> ke rekening bank atas nama Anda.</li>
            <li>Proses transfer <em>refund</em> akan diselesaikan dalam waktu <strong>maksimal 3-5 hari kerja</strong> sejak barang retur lolos pengecekan tim kami.</li>
          </ul>
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
