import 'dotenv/config';
import { createClient } from 'next-sanity';
import { prisma } from '../lib/prisma';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_TOKEN, 
  useCdn: false,
});

async function main() {
  console.log("Menonaktifkan dan me-rename slug produk lama di Prisma...");
  const productsInDb = await prisma.product.findMany();
  for (const p of productsInDb) {
    try {
      await prisma.product.update({
        where: { id: p.id },
        data: { 
          slug: `${p.slug}-old-${Math.floor(Math.random() * 100000)}`,
          isActive: false,
          sanityId: null
        }
      });
    } catch(e) {} // Abaikan jika sudah di-rename
  }
  console.log(`✓ ${productsInDb.length} produk di Prisma berhasil dinonaktifkan.`);

  console.log("Mengambil semua produk dari Sanity...");
  const products = await client.fetch('*[_type == "product"]{_id}');
  console.log(`Ditemukan ${products.length} produk di Sanity. Mulai menghapus...`);

  for (const p of products) {
    await client.delete(p._id);
    console.log(`✓ Dihapus dari Sanity: ${p._id}`);
  }
  
  console.log("✅ PEMBERSIHAN SELESAI. Silakan import ulang 1 file seed saja.");
}

main().finally(() => prisma.$disconnect());
