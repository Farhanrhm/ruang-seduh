import { getCliClient } from 'sanity/cli';

const client = getCliClient();

const toolMappings: Record<string, any[]> = {
  'panduan-v60': [
    { name: 'Dripper Hario V60', productLink: 'hario-v60-ceramic' },
    { name: 'Kertas Filter V60 02', productLink: 'hario-filter-02' },
    { name: 'Gooseneck Kettle', productLink: null },
    { name: 'Timbangan Digital', productLink: 'timbangan-kopi-timer' }
  ],
  'french-press': [
    { name: 'French Press', productLink: 'french-press-350ml' },
    { name: 'Ketel Air Panas', productLink: null },
    { name: 'Timbangan Digital', productLink: 'timbangan-kopi-timer' }
  ],
  'aeropress': [
    { name: 'AeroPress Maker', productLink: 'aeropress-clear' },
    { name: 'Kertas Filter AeroPress', productLink: 'aeropress-micro-filter' },
    { name: 'Timbangan Digital', productLink: 'timbangan-kopi-timer' }
  ],
  'moka-pot': [
    { name: 'Moka Pot (Bialetti)', productLink: 'bialetti-moka-express' },
    { name: 'Kompor Listrik / Gas Mini', productLink: null },
    { name: 'Ketel Air Panas', productLink: null }
  ],
  'kalita-wave': [
    { name: 'Dripper Kalita Wave 185', productLink: 'kalita-wave-185' },
    { name: 'Filter Kalita 185', productLink: 'kalita-filter-185' },
    { name: 'Gooseneck Kettle', productLink: null },
    { name: 'Timbangan Digital', productLink: 'timbangan-kopi-timer' }
  ],
  'chemex': [
    { name: 'Chemex 6-Cup', productLink: 'chemex-classic-6-cup' },
    { name: 'Filter Kertas Chemex', productLink: 'chemex-bonded-filters' },
    { name: 'Gooseneck Kettle', productLink: null },
    { name: 'Timbangan Digital', productLink: 'timbangan-kopi-timer' }
  ],
  'cold-brew': [
    { name: 'Hario Mizudashi / Kaca Jar', productLink: 'hario-mizudashi' },
    { name: 'Timbangan Digital', productLink: 'timbangan-kopi-timer' }
  ],
  'kopi-tubruk': [
    { name: 'Cangkir / Gelas Kaca', productLink: null },
    { name: 'Timbangan Digital', productLink: 'timbangan-kopi-timer' },
    { name: 'Ketel Air Panas', productLink: null }
  ],
  'syphon': [
    { name: 'Hario Syphon TCA-3', productLink: 'hario-syphon' },
    { name: 'Burner / Pemanas', productLink: null },
    { name: 'Pengaduk Bambu', productLink: null }
  ]
};

async function patchGuides() {
  console.log("Mulai memperbarui data Alat Dibutuhkan (Tools) di Sanity...");
  try {
    const guides = await client.fetch(`*[_type == "guide"]`);
    
    for (const guide of guides) {
      const slug = guide.slug?.current;
      if (slug && toolMappings[slug]) {
        // Menambahkan _key yang diperlukan oleh Sanity untuk array of objects
        const tools = toolMappings[slug].map(t => ({
          _key: Math.random().toString(36).substring(7),
          ...t
        }));
        
        console.log(`Memperbarui panduan: ${slug} (${tools.length} alat)`);
        await client.patch(guide._id).set({ tools }).commit();
      } else {
        // Mencoba pencocokan parsial jika slug tidak cocok sempurna
        const match = Object.keys(toolMappings).find(k => slug?.includes(k) || k.includes(slug));
        if (match) {
          const tools = toolMappings[match].map(t => ({
            _key: Math.random().toString(36).substring(7),
            ...t
          }));
          console.log(`Memperbarui panduan (pencocokan parsial): ${slug} -> ${match} (${tools.length} alat)`);
          await client.patch(guide._id).set({ tools }).commit();
        } else {
          console.log(`Lewati: ${slug} (tidak ada pemetaan alat)`);
        }
      }
    }
    console.log("Selesai! Semua panduan telah diperbarui dengan data Alat Dibutuhkan.");
  } catch (err) {
    console.error("Terjadi kesalahan:", err);
  }
}

patchGuides();
