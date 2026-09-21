import 'dotenv/config';
import { prisma } from '../lib/prisma';

async function verify() {
  const products = await prisma.product.findMany();
  console.log(`\n🔍 Verifikasi Data Prisma (Total Produk: ${products.length})\n`);
  
  for (const p of products) {
    console.log(`- Nama: ${p.name}`);
    console.log(`  sanityId : ${p.sanityId}`);
    console.log(`  Harga    : Rp ${p.price.toLocaleString('id-ID')}`);
    console.log(`  Stock    : ${p.stock}`);
    console.log(`  isActive : ${p.isActive}`);
    console.log(`  Kategori : ${p.category}`);
    console.log(`  Berat    : ${p.weight}g`);
    console.log(`  Gilingan : [${p.grindOptions.join(', ')}]`);
    console.log('----------------------------------------------------');
  }
  
  await prisma.$disconnect();
}

verify().catch(console.error);
