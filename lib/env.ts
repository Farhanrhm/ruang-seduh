import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  DIRECT_URL: z.string().url().optional(),
  
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  
  NEXTAUTH_URL: z.string().url().optional(),
  NEXTAUTH_SECRET: z.string().min(1),
  
  RESEND_API_KEY: z.string().min(1).optional(),
  
  SANITY_WEBHOOK_SECRET: z.string().min(1).optional(),
  
  BITESHIP_API_KEY: z.string().min(1),
  BITESHIP_ORIGIN_AREA_ID: z.string().min(1),
  BITESHIP_ACTIVE_COURIERS: z.string().optional(),
  
  MIDTRANS_SERVER_KEY: z.string().min(1),
  
  // Client side envs
  NEXT_PUBLIC_SANITY_PROJECT_ID: z.string().min(1),
  NEXT_PUBLIC_SANITY_DATASET: z.string().min(1),
  NEXT_PUBLIC_MIDTRANS_CLIENT_KEY: z.string().min(1),
});

export const parseEnv = () => {
  const parsed = envSchema.safeParse(process.env);
  
  if (!parsed.success) {
    console.error(
      "❌ Invalid environment variables:",
      JSON.stringify(parsed.error.format(), null, 4)
    );
    throw new Error("Invalid environment variables");
  }
  
  return parsed.data;
};

// Jalankan validasi secara otomatis saat modul ini dimuat
parseEnv();
