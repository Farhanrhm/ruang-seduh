import 'dotenv/config';
import { Category } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { createClient } from 'next-sanity';

// Parse arguments
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const isForce = args.includes('--force');

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2023-05-03',
  useCdn: false, // Must be false to get fresh data
});

async function main() {
  console.log(`🔄 Memulai proses sinkronisasi produk dari Sanity ke Prisma...${isDryRun ? ' [DRY-RUN MODE]' : ''}`);
  
  const stats = {
    created: 0,
    updated: 0,
    deactivated: [] as string[],
    reactivated: 0,
    failed: 0,
  };

  try {
    const query = `*[_type == "product"]{
      _id,
      name,
      slug,
      price,
      description,
      category,
      imageUrl,
      "imageUrlFallback": image.asset->url,
      weight,
      grindOptions
    }`;
    
    const sanityProducts = await client.fetch(query);
    
    if (!sanityProducts || sanityProducts.length === 0) {
      console.warn('⚠️ Peringatan: Query Sanity mengembalikan 0 produk. Menghentikan proses demi keamanan (mencegah soft delete massal).');
      process.exit(1);
    }
    
    console.log(`📦 Menemukan ${sanityProducts.length} produk di Sanity.\n`);

    // Fetch existing Prisma products for comparison and soft-delete detection
    const existingPrismaProducts = await prisma.product.findMany();
    const existingMap = new Map(existingPrismaProducts.map(p => [p.sanityId, p]));

    const processedSanityIds = new Set<string>();

    for (const item of sanityProducts) {
      try {
        if (!item.name) throw new Error('Produk tidak memiliki nama (name is undefined).');

        let productSlug = item.slug?.current;
        if (!productSlug) {
          productSlug = slugify(item.name);
          console.warn(`⚠️ Peringatan: Produk "${item.name}" tidak memiliki slug dari Sanity. Menggunakan fallback slug: "${productSlug}"`);
        }

        let prismaCategory: Category = 'BEANS';
        const sanityCategory = (item.category || '').toUpperCase();
        
        if (sanityCategory === 'BIJI KOPI') {
          prismaCategory = 'BEANS';
        } else if (sanityCategory === 'ALAT SEDUH') {
          prismaCategory = 'EQUIPMENT';
        } else if (sanityCategory === 'AKSESORIS') {
          prismaCategory = 'EQUIPMENT';
        } else {
          throw new Error(`Kategori "${item.category}" tidak dikenali untuk produk "${item.name}".`);
        }

        const resolvedImageUrl = item.imageUrl || item.imageUrlFallback || null;

        let resolvedDescription = '';
        if (typeof item.description === 'string') {
          resolvedDescription = item.description;
        } else if (Array.isArray(item.description)) {
          resolvedDescription = item.description
            .map((block: any) => block.children?.map((child: any) => child.text).join(''))
            .filter(Boolean)
            .join('\n');
        }

        // Weight validation & active status
        const weight = item.weight;
        let isActive = true;
        let deactivationReason = '';

        if (weight === undefined || weight === null || weight < 1) {
          isActive = false;
          deactivationReason = 'Berat kosong atau < 1g';
          console.warn(`⚠️ WARNING: Produk "${item.name}" memiliki berat tidak valid (${weight}). Dinonaktifkan (isActive=false).`);
        } else if (weight < 50 || weight > 5000) {
          console.warn(`⚠️ WARNING: Produk "${item.name}" memiliki berat kurang wajar (${weight}g). Mohon periksa kembali di Sanity.`);
        }

        const existingItem = existingMap.get(item._id);
        
        // Track stats
        if (!existingItem) {
          stats.created++;
          if (!isActive) stats.deactivated.push(`${item.name} (${deactivationReason})`);
        } else {
          stats.updated++;
          if (existingItem.isActive === false && isActive === true) {
            stats.reactivated++;
          }
          if (existingItem.isActive === true && isActive === false) {
            stats.deactivated.push(`${item.name} (${deactivationReason})`);
          }
        }

        if (!isDryRun) {
          try {
            await prisma.product.upsert({
              where: { sanityId: item._id },
              update: {
                name: item.name,
                slug: productSlug,
                price: item.price || 0,
                description: resolvedDescription || item.name,
                category: prismaCategory,
                imageUrl: resolvedImageUrl,
                weight: weight || 1, // Store 1 if missing, but it will be inactive
                grindOptions: item.grindOptions || [],
                isActive: isActive,
              },
              create: {
                sanityId: item._id,
                name: item.name,
                slug: productSlug,
                price: item.price || 0,
                description: resolvedDescription || item.name,
                category: prismaCategory,
                imageUrl: resolvedImageUrl,
                weight: weight || 1,
                grindOptions: item.grindOptions || [],
                isActive: isActive,
                stock: 100,
              },
            });
            console.log(`✓ Tersinkronisasi: ${item.name} (${isActive ? 'Aktif' : 'Nonaktif'})`);
          } catch (prismaError: any) {
            if (prismaError.code === 'P2002') {
              throw new Error(`Slug duplikat terdeteksi pada kolom: ${prismaError.meta?.target?.join(', ')}. Slug "${productSlug}" sudah digunakan.`);
            }
            throw prismaError;
          }
        } else {
          console.log(`[DRY-RUN] Akan sinkronisasi: ${item.name} (${isActive ? 'Aktif' : 'Nonaktif'})`);
        }

        processedSanityIds.add(item._id);
      } catch (itemError: any) {
        console.error(`✗ Gagal: ${item.name || 'Produk Tanpa Nama'} (${item._id}) - Pesan: ${itemError.message}`);
        stats.failed++;
      }
    }
    
    // Soft deletes handling
    const toSoftDelete = existingPrismaProducts.filter(p => p.sanityId && !processedSanityIds.has(p.sanityId) && p.isActive);
    
    if (toSoftDelete.length > 0) {
      if (toSoftDelete.length > existingPrismaProducts.length / 2 && !isForce) {
        console.warn(`\n⚠️ Peringatan: Lebih dari 50% produk (${toSoftDelete.length} dari ${existingPrismaProducts.length}) akan dinonaktifkan (soft delete).`);
        console.warn(`Gunakan flag --force untuk melanjutkan aksi ini.`);
        if (!isDryRun) process.exit(1);
      } else {
        for (const p of toSoftDelete) {
          stats.deactivated.push(`${p.name} (Dihapus/Unpublish di Sanity)`);
          if (!isDryRun) {
            await prisma.product.update({
              where: { id: p.id },
              data: { isActive: false }
            });
            console.log(`✓ Soft delete (Dinonaktifkan): ${p.name}`);
          } else {
            console.log(`[DRY-RUN] Akan dinonaktifkan (Soft delete): ${p.name}`);
          }
        }
      }
    }

    console.log('\n=============================================');
    console.log(`✅ PROSES SINKRONISASI SELESAI ${isDryRun ? '[DRY-RUN]' : ''}`);
    console.log(`+ Dibuat Baru       : ${stats.created}`);
    console.log(`~ Diperbarui        : ${stats.updated}`);
    console.log(`↑ Diaktifkan Kembali: ${stats.reactivated}`);
    console.log(`↓ Dinonaktifkan     : ${stats.deactivated.length}`);
    if (stats.deactivated.length > 0) {
      stats.deactivated.forEach(d => console.log(`  - ${d}`));
    }
    console.log(`✗ Gagal             : ${stats.failed}`);
    console.log('=============================================\n');

  } catch (error: any) {
    console.error('💥 ERROR FATAL SAAT SINKRONISASI:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
