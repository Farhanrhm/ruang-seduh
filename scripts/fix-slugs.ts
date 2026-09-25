import { prisma } from '../lib/prisma';

async function main() {
  console.log("Mengecek produk dengan slug yang duplikat...");
  const products = await prisma.product.findMany();
  let count = 0;
  for (const product of products) {
    const newSlug = `${product.slug}-old-${Math.floor(Math.random() * 10000)}`;
    await prisma.product.update({
      where: { id: product.id },
      data: { slug: newSlug }
    });
    count++;
  }
  console.log(`Berhasil mengubah ${count} slug produk lama.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
