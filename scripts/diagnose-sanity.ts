import 'dotenv/config';
import { createClient } from 'next-sanity';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2023-05-03',
  useCdn: false,
});

async function run() {
  const query = `*[_type == "product"]`;
  const result = await client.fetch(query);
  
  console.log('Total documents (including drafts if visible):', result.length);
  
  if (result.length > 0) {
    console.log('\n--- RAW JSON DARI SANITY (1 PRODUK) ---');
    console.log(JSON.stringify(result[0], null, 2));
  } else {
    console.log('Tidak ada produk yang ditemukan.');
  }
}

run().catch(console.error);
