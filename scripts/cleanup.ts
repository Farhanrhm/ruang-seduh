import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const result = await prisma.order.updateMany({
    where: {
      status: 'PENDING',
      snapToken: null,
    },
    data: {
      status: 'CANCELLED',
    },
  });

  console.log(`Berhasil membatalkan ${result.count} pesanan lama yang tidak memiliki snapToken.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
