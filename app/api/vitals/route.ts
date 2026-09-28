import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const metric = JSON.parse(body);

    // Di skenario nyata, di sini kita bisa menyimpan metrik ke database, 
    // DataDog, Sentry, atau layanan analitik lainnya.
    // Untuk saat ini kita hanya mencatat di log server (production).
    
    // Hanya log jika nilainya melebihi batas "Good" dari Core Web Vitals untuk warning
    // LCP > 2500ms, FID > 100ms, CLS > 0.1, INP > 200ms
    let isPoor = false;
    if (metric.name === "LCP" && metric.value > 2500) isPoor = true;
    if (metric.name === "FID" && metric.value > 100) isPoor = true;
    if (metric.name === "CLS" && metric.value > 0.1) isPoor = true;
    if (metric.name === "INP" && metric.value > 200) isPoor = true;
    if (metric.name === "TTFB" && metric.value > 800) isPoor = true;

    if (isPoor) {
      console.warn(`[PERFORMANCE ALERT] ${metric.name} is poor: ${metric.value} (ID: ${metric.id}) on path ${metric.path || "unknown"}`);
    } else {
      // Uncomment untuk melihat semua metrik di server log
      // console.log(`[Web Vitals] ${metric.name}: ${metric.value}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Invalid metric data" }, { status: 400 });
  }
}
