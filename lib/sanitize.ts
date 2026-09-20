/**
 * Sanitasi error dan masking data sensitif untuk mencegah kebocoran kredensial
 * atau detail internal database ke client maupun log publik.
 */

export function sanitizeErrorMessage(error: unknown, fallbackMessage = "Terjadi kesalahan pada sistem. Silakan coba lagi nanti."): string {
  if (!error) return fallbackMessage;

  const rawMessage = error instanceof Error ? error.message : String(error);

  // Deteksi kode error Prisma umum
  if (rawMessage.includes("P1001")) {
    return "Tidak dapat terhubung ke server database. Silakan coba beberapa saat lagi.";
  }
  if (rawMessage.includes("P1013")) {
    return "Konfigurasi koneksi database tidak valid.";
  }
  if (rawMessage.includes("P2002")) {
    return "Data dengan informasi tersebut sudah terdaftar.";
  }
  if (rawMessage.includes("P2025")) {
    return "Data yang diminta tidak ditemukan.";
  }

  // Jika memuat indikasi connection string atau protokol, jangan teruskan teks mentah
  if (
    rawMessage.includes("postgresql://") ||
    rawMessage.includes("postgres://") ||
    rawMessage.includes("datasource.url") ||
    rawMessage.includes("password") ||
    rawMessage.includes("credential")
  ) {
    return fallbackMessage;
  }

  // Jika pesan adalah pesan validasi yang aman dan singkat (misal dari Zod atau business logic)
  if (rawMessage.length < 150 && !rawMessage.includes("at ") && !rawMessage.includes("prisma")) {
    return rawMessage;
  }

  return fallbackMessage;
}

export function maskSecret(value?: string): string {
  if (!value) return "(tidak diatur)";
  if (value.length <= 4) return "****";
  return `${value.slice(0, 2)}****${value.slice(-2)}`;
}
