"use client";

import { useReportWebVitals } from "next/web-vitals";

export default function WebVitals() {
  useReportWebVitals((metric) => {
    const isDev = typeof window !== "undefined" && window.location.hostname === "localhost";
    
    // Tampilkan di console jika mode development
    if (isDev) {
      console.log(`[Web Vitals] ${metric.name}:`, Math.round(metric.value));
    }

    // Kirim metrik ke endpoint khusus untuk monitoring di production
    // Filter properti 'entries' untuk menghindari TypeError: Converting circular structure to JSON
    const body = JSON.stringify(metric, (key, value) => 
      key === 'entries' ? undefined : value
    );
    const url = "/api/vitals";

    // Gunakan navigator.sendBeacon jika didukung agar request tidak terputus saat user menutup halaman
    if (navigator.sendBeacon) {
      navigator.sendBeacon(url, body);
    } else {
      fetch(url, { body, method: "POST", keepalive: true }).catch((err) => {
        console.error("Gagal mengirim web vitals:", err);
      });
    }
  });

  return null;
}
