import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

// 1. Buat connection pool dari library pg biasa
const connectionString = process.env.DATABASE_URL || "";
const pool = new Pool({ connectionString });

// 2. Gunakan driver adapter PrismaPg
const adapter = new PrismaPg(pool);

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// 3. Masukkan config `adapter` ke PrismaClient
export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;