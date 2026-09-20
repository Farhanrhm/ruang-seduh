import { config } from "dotenv";
config({ path: ".env.local" });
config();

import { defineConfig } from "@prisma/config";

// Validasi struktural tanpa pernah mencetak isi string kredensial
function validateDatabaseUrlStructure(name: string, url?: string) {
  if (!url) return;

  if (!url.startsWith("postgresql://") && !url.startsWith("postgres://")) {
    console.warn(`[PERIKSA KONFIGURASI] ${name} harus diawali dengan postgresql:// atau postgres://`);
  }
  if (!url.includes("@")) {
    console.warn(`[PERIKSA KONFIGURASI] ${name} tidak memiliki simbol '@' sebagai pemisah antara kredensial dan host.`);
  }
}

validateDatabaseUrlStructure("DATABASE_URL", process.env.DATABASE_URL);
if (process.env.DIRECT_URL) {
  validateDatabaseUrlStructure("DIRECT_URL", process.env.DIRECT_URL);
}

export default defineConfig({
  schema: "./prisma/schema.prisma",
  datasource: {
    url: (process.env.DIRECT_URL || process.env.DATABASE_URL || "") as string,
  },
});
