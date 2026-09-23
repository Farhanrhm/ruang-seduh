"use server";
import { headers } from "next/headers";

// Rate limiter for serverless environment (best-effort per instance)
const rateLimitMap = new Map<string, { count: number, timestamp: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10;

export interface BiteshipArea {
  id: string;
  name: string;
  administrative_division_level_1_name: string; // Provinsi
  administrative_division_level_2_name: string; // Kota/Kabupaten
  administrative_division_level_3_name: string; // Kecamatan
  postal_code: number;
}

// Simple in-memory cache for area searches with size limit to prevent memory leak
const areaCache = new Map<string, { data: BiteshipArea[], timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 60 * 24; // 24 hours
const MAX_CACHE_SIZE = 500;

export async function cariWilayahBiteship(query: string) {
  if (!query || query.length < 3) return { success: false, error: "Query terlalu pendek" };

  // Best-effort Rate Limiting
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "unknown";
  
  if (ip !== "unknown") {
    const now = Date.now();
    const requestData = rateLimitMap.get(ip) || { count: 0, timestamp: now };
    
    if (now - requestData.timestamp < RATE_LIMIT_WINDOW) {
      if (requestData.count >= MAX_REQUESTS_PER_WINDOW) {
        return { success: false, error: "Terlalu banyak permintaan, coba lagi sebentar." };
      }
      requestData.count++;
    } else {
      requestData.count = 1;
      requestData.timestamp = now;
    }
    
    // Prevent unbounded growth of rateLimitMap
    if (rateLimitMap.size > 1000) rateLimitMap.clear();
    rateLimitMap.set(ip, requestData);
  }

  const cacheKey = query.toLowerCase().trim();
  const cached = areaCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return { success: true, data: cached.data };
  }

  try {
    const apiKey = process.env.BITESHIP_API_KEY;
    if (!apiKey) {
      console.error("BITESHIP_API_KEY is missing in environment variables.");
      return { success: false, error: "Konfigurasi server bermasalah." };
    }

    const response = await fetch(`https://api.biteship.com/v1/maps/areas?input=${encodeURIComponent(query)}`, {
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
      if (areaCache.size >= MAX_CACHE_SIZE) {
        areaCache.clear();
      }
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
  isDummy?: boolean;
}

export type OngkirResult = 
  | { success: true; data: ShippingRate[]; isDummy?: boolean }
  | { success: false; code: string; message: string };

const rateCache = new Map<string, { data: ShippingRate[], timestamp: number }>();
const RATE_CACHE_TTL = 1000 * 60 * 10; // 10 minutes

export async function hitungOngkirBiteship(destinationAreaId: string, totalWeightGram: number): Promise<OngkirResult> {
  const useDummy = process.env.USE_DUMMY_SHIPPING === "true";
  if (useDummy && process.env.NODE_ENV === "production") {
    throw new Error("Konfigurasi tidak valid: Dummy shipping tidak boleh aktif di production!");
  }

  const dummyData: ShippingRate[] = [
    { courier_name: "JNE", courier_service_name: "Reguler (Simulasi)", duration: "2-3 hari", price: 15000, isDummy: true },
    { courier_name: "SiCepat", courier_service_name: "BEST (Simulasi)", duration: "1 hari", price: 20000, isDummy: true }
  ];

  try {
    if (!destinationAreaId) return { success: false, code: "INVALID_INPUT", message: "Pilih alamat pengiriman untuk melihat ongkos kirim." };
    if (totalWeightGram < 1) return { success: false, code: "INVALID_INPUT", message: "Berat produk tidak valid. Mohon periksa kembali keranjang Anda." };
    
    const finalWeight = totalWeightGram + 150; 
    const apiKey = process.env.BITESHIP_API_KEY;
    const originAreaId = process.env.BITESHIP_ORIGIN_AREA_ID;
    const activeCouriersRaw = process.env.BITESHIP_ACTIVE_COURIERS;
    
    if (!apiKey || !originAreaId || !activeCouriersRaw) {
      if (useDummy) return { success: true, data: dummyData, isDummy: true };
      return { success: false, code: "CONFIG_MISSING", message: "Layanan ongkos kirim sedang tidak tersedia, coba lagi sebentar." };
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

    if (process.env.NODE_ENV !== "production") {
      console.log("\n[BITESHIP DIAGNOSTICS] Calculating rates...");
      console.log(`- Origin Area ID: ${originAreaId || "(KOSONG)"} (sumber: env.BITESHIP_ORIGIN_AREA_ID)`);
      console.log(`- Destination Area ID: ${destinationAreaId}`);
      console.log(`- Active Couriers: ${activeCouriers}`);
      console.log(`- Total Weight (items + packaging 150g): ${finalWeight}g`);
      console.log(`- Payload Items: ${JSON.stringify(payload.items)}`);
    }

    const response = await fetch("https://api.biteship.com/v1/rates/couriers", {
      method: "POST",
      headers: {
        "Authorization": apiKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const responseBodyText = await response.text().catch(() => "Gagal membaca body");
    
    if (process.env.NODE_ENV !== "production") {
      console.log(`[BITESHIP RESPONSE] Status: ${response.status}`);
      console.log(`[BITESHIP RESPONSE BODY]: ${responseBodyText.substring(0, 1000)}`);
    }
    
    if (!response.ok) {
      if (useDummy) return { success: true, data: dummyData, isDummy: true };
      
      if (response.status === 429) {
         return { success: false, code: "RATE_LIMITED", message: "Terlalu banyak permintaan, tunggu sebentar." };
      }
      if (response.status === 401 || response.status === 403) {
         return { success: false, code: "UNAUTHORIZED", message: "Layanan ongkos kirim sedang tidak tersedia, coba lagi sebentar." };
      }
      
      try {
        const parsedErr = JSON.parse(responseBodyText);
        if (parsedErr.error) {
          console.error(`API Biteship Error: ${parsedErr.error}`); // Log the specific error server-side
        }
      } catch (e) {}
      
      return { success: false, code: "UPSTREAM_ERROR", message: "Layanan ongkos kirim sedang tidak tersedia, coba lagi sebentar." };
    }

    const result = JSON.parse(responseBodyText);
    
    if (result.success && result.pricing) {
      if (result.pricing.length === 0) {
        if (process.env.NODE_ENV !== "production") {
          console.warn(`[BITESHIP WARNING] Tarif kosong untuk Origin: ${originAreaId} ke Dest: ${destinationAreaId}.`);
        }
        return { success: false, code: "NO_COURIER_AVAILABLE", message: "Belum ada layanan pengiriman ke wilayah ini." };
      }

      const data: ShippingRate[] = result.pricing.map((p: any) => ({
        courier_name: p.courier_name,
        courier_service_name: p.courier_service_name,
        duration: p.duration,
        price: p.price,
      }));
      
      if (rateCache.size >= MAX_CACHE_SIZE) {
        rateCache.clear();
      }
      rateCache.set(cacheKey, { data, timestamp: Date.now() });
      return { success: true, data };
    }

    return { success: false, code: "UPSTREAM_ERROR", message: "Layanan ongkos kirim bermasalah." };
  } catch (error: any) {
    console.error("\n=== ERROR CATCH hitungOngkirBiteship ===");
    console.error("1. Pesan Error:", error.message || error);
    if (error.cause) console.error("2. Penyebab:", error.cause);
    console.error("\n[Biteship] Gagal memuat tarif kurir.");
    
    if (useDummy) return { success: true, data: dummyData, isDummy: true };

    return { success: false, code: "UPSTREAM_ERROR", message: "Layanan ongkos kirim sedang tidak tersedia, coba lagi sebentar." };
  }
}
