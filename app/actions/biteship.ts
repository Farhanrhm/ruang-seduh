"use server";

export interface BiteshipArea {
  id: string;
  name: string;
  administrative_division_level_1_name: string; // Province
  administrative_division_level_2_name: string; // City
  administrative_division_level_3_name: string; // District
  postal_code: number;
}

// Simple in-memory cache for the server action
const areaCache = new Map<string, { data: BiteshipArea[], timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 5; // 5 minutes

export async function cariWilayahBiteship(keyword: string): Promise<{ success: boolean; data?: BiteshipArea[]; error?: string }> {
  try {
    if (!keyword || keyword.length < 3) {
      return { success: false, error: "Kata kunci minimal 3 karakter." };
    }

    const cacheKey = keyword.toLowerCase().trim();
    const cached = areaCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return { success: true, data: cached.data };
    }

    const apiKey = process.env.BITESHIP_API_KEY;
    if (!apiKey) {
      console.error("BITESHIP_API_KEY is missing in environment variables.");
      return { success: false, error: "Layanan pencarian wilayah sedang tidak tersedia, coba lagi sebentar." };
    }

    // Pengecekan environment prefix (hanya warning di log)
    const isProd = process.env.NODE_ENV === "production";
    if (isProd && apiKey.startsWith("biteship_test_")) {
      console.warn("WARNING: Menggunakan Biteship TEST key di environment Production!");
    } else if (!isProd && apiKey.startsWith("biteship_live_")) {
      console.warn("WARNING: Menggunakan Biteship LIVE key di environment Development/Sandbox!");
    }

    const response = await fetch(`https://api.biteship.com/v1/maps/areas?countries=ID&input=${encodeURIComponent(keyword)}&type=single`, {
      method: "GET",
      headers: {
        "Authorization": apiKey,
      },
    });

    if (!response.ok) {
      const errBodyText = await response.text().catch(() => "Gagal membaca body error");
      const safeErrBody = errBodyText.substring(0, 500); // Batasi maks 500 karakter
      
      console.error(`Biteship API error: ${response.status} - ${response.statusText} | Body: ${safeErrBody}`);
      
      if (response.status === 429) {
        return { success: false, error: "Terlalu banyak pencarian, tunggu sebentar." };
      }
      
      return { success: false, error: "Layanan pencarian wilayah sedang tidak tersedia, coba lagi sebentar." };
    }

    const result = await response.json();
    
    if (result.success && result.areas) {
      const data = result.areas as BiteshipArea[];
      areaCache.set(cacheKey, { data, timestamp: Date.now() });
      return { success: true, data };
    }

    // Jika format sukses tapi struktur areas tidak ada (berjaga-jaga jika API berubah)
    if (result.areas && result.areas.length === 0) {
       return { success: true, data: [] };
    }

    console.error(`Biteship API unexpected format: ${JSON.stringify(result).substring(0, 500)}`);
    return { success: false, error: "Layanan pencarian wilayah sedang tidak tersedia, coba lagi sebentar." };
  } catch (error) {
    // Tangkap error jaringan atau error sistem lainnya
    console.error("cariWilayahBiteship exception:", error instanceof Error ? error.message : error);
    return { success: false, error: "Layanan pencarian wilayah sedang tidak tersedia, coba lagi sebentar." };
  }
}

export interface ShippingRate {
  courier_name: string;
  courier_service_name: string;
  duration: string;
  price: number;
}

// Simple in-memory rate limiting (IP/Session based is better done via middleware or real cache, 
// but for this phase we'll use a basic global counter or just rely on server-side execution speed).
// We'll implement a basic one based on areaId and weight to avoid spamming the API.
const rateCache = new Map<string, { data: ShippingRate[], timestamp: number }>();
const RATE_CACHE_TTL = 1000 * 60 * 10; // 10 minutes

export async function hitungOngkirBiteship(destinationAreaId: string, totalWeightGram: number): Promise<{ success: boolean; data?: ShippingRate[]; error?: string }> {
  try {
    if (!destinationAreaId) return { success: false, error: "Tujuan pengiriman belum dipilih." };
    
    if (totalWeightGram < 1) {
      return { success: false, error: "Berat produk tidak valid. Mohon periksa kembali keranjang Anda." };
    }
    
    // Asumsikan berat kemasan kardus/bubble wrap rata-rata 150g per pesanan
    const finalWeight = totalWeightGram + 150; 
    const apiKey = process.env.BITESHIP_API_KEY;
    
    if (!apiKey) {
      console.error("BITESHIP_API_KEY is missing in environment variables.");
      return { success: false, error: "Konfigurasi server bermasalah." };
    }

    const originAreaId = process.env.BITESHIP_ORIGIN_AREA_ID;
    const activeCouriersRaw = process.env.BITESHIP_ACTIVE_COURIERS;

    if (!originAreaId || !activeCouriersRaw) {
      console.error("BITESHIP_ORIGIN_AREA_ID atau BITESHIP_ACTIVE_COURIERS tidak disetel di environment variables.");
      return { success: false, error: "Konfigurasi toko bermasalah." };
    }
    
    const activeCouriers = activeCouriersRaw.replace(/\s+/g, '');

    const cacheKey = `${destinationAreaId}-${finalWeight}-${activeCouriers}`;
    const cached = rateCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < RATE_CACHE_TTL) {
      return { success: true, data: cached.data };
    }

    const payload = {
      origin_area_id: originAreaId,
      destination_area_id: destinationAreaId,
      couriers: activeCouriers,
      items: [
        {
          name: "Produk Ruang Seduh",
          description: "Pesanan kopi dan alat seduh",
          value: 100000,
          length: 20,
          width: 20,
          height: 10,
          weight: finalWeight,
          quantity: 1
        }
      ]
    };

    const response = await fetch("https://api.biteship.com/v1/rates/couriers", {
      method: "POST",
      headers: {
        "Authorization": apiKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const responseBodyText = await response.text().catch(() => "Gagal membaca body");
    
    if (!response.ok) {
      console.error(`Biteship Rates API error: ${response.status} - Body: ${responseBodyText.substring(0, 500)}`);
      if (response.status === 429) {
         return { success: false, error: "Terlalu banyak permintaan, tunggu sebentar." };
      }
      
      let errorMessage = "Layanan ongkos kirim sedang tidak tersedia, coba lagi sebentar.";
      try {
        const parsedErr = JSON.parse(responseBodyText);
        if (parsedErr.error) {
          errorMessage = `API Biteship: ${parsedErr.error}`;
        }
      } catch (e) {}
      
      // Feature flag untuk dummy data
      const useDummy = process.env.NODE_ENV !== "production" && process.env.USE_DUMMY_SHIPPING === "true";
      
      if (useDummy) {
        console.warn(`Fallback ke dummy kurir karena: ${errorMessage}`);
        return { 
          success: true, 
          data: [
            {
              courier_name: "JNE",
              courier_service_name: "Reguler (Simulasi)",
              duration: "2-3 hari",
              price: 15000
            },
            {
              courier_name: "SiCepat",
              courier_service_name: "BEST (Simulasi)",
              duration: "1 hari",
              price: 20000
            }
          ] 
        };
      }
      
      return { success: false, error: errorMessage };
    }

    const result = JSON.parse(responseBodyText);
    
    if (result.success && result.pricing) {
      if (result.pricing.length === 0) {
        // Mode test bisa jadi membatasi rute
        console.warn(`Peringatan: Biteship mengembalikan tarif kosong untuk Origin: ${originAreaId} ke Dest: ${destinationAreaId}. Payload: ${JSON.stringify(payload)}. Cek apakah kurir diaktifkan atau keterbatasan mode test.`);
        return { success: true, data: [] };
      }

      const data: ShippingRate[] = result.pricing.map((p: any) => ({
        courier_name: p.courier_name,
        courier_service_name: p.courier_service_name,
        duration: p.duration,
        price: p.price,
      }));
      
      rateCache.set(cacheKey, { data, timestamp: Date.now() });
      return { success: true, data };
    }

    return { success: false, error: "Tidak ada kurir yang tersedia untuk rute ini." };
  } catch (error: any) {
    console.error("\n=== ERROR CATCH hitungOngkirBiteship ===");
    console.error("1. Pesan Error:", error.message || error);
    if (error.cause) console.error("2. Penyebab:", error.cause);
    console.error("3. Payload yang dicoba dikirim:", JSON.stringify({
      origin_area_id: process.env.BITESHIP_ORIGIN_AREA_ID,
      destination_area_id: destinationAreaId,
      couriers: process.env.BITESHIP_ACTIVE_COURIERS,
      items: [{ weight: totalWeightGram + 150 }]
    }, null, 2));
    console.error("==========================================\n");
    
    // Feature flag untuk dummy data
    const useDummy = process.env.NODE_ENV !== "production" && process.env.USE_DUMMY_SHIPPING === "true";
    
    if (useDummy) {
      console.warn(`Fallback exception ke dummy kurir.`);
      return { 
        success: true, 
        data: [
          {
            courier_name: "JNE",
            courier_service_name: "Reguler (Simulasi)",
            duration: "2-3 hari",
            price: 15000
          },
          {
            courier_name: "SiCepat",
            courier_service_name: "BEST (Simulasi)",
            duration: "1 hari",
            price: 20000
          }
        ] 
      };
    }

    return { success: false, error: "Layanan ongkos kirim sedang tidak tersedia, coba lagi sebentar." };
  }
}

