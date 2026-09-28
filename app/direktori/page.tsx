import { prisma } from "@/lib/prisma";
import DirektoriList from "@/components/DirektoriList";

// ISR: Cache hasil direktori dasar selama 1 jam
export const revalidate = 3600;

export default async function DirektoriPage() {
  // Seed data awal jika database masih kosong
  const count = await prisma.coffeeDirectory.count();
  if (count === 0) {
    await prisma.coffeeDirectory.createMany({
      data: [
        { name: "Aceh Gayo Washed", origin: "Aceh Tengah, Sumatra", roastLevel: "Medium", notes: ["Black Cherry", "Nutty", "Clean Aftertaste"] },
        { name: "Toraja Sapan", origin: "Tana Toraja, Sulawesi", roastLevel: "Medium-Dark", notes: ["Spicy", "Dark Chocolate", "Tobacco"] },
        { name: "Bali Kintamani Natural", origin: "Kintamani, Bali", roastLevel: "Light-Medium", notes: ["Citrus", "Orange", "Brown Sugar"] },
        { name: "Flores Bajawa", origin: "Ngada, NTT", roastLevel: "Medium", notes: ["Nutty", "Caramel", "Full Body"] },
        { name: "Java Preanger", origin: "Pangalengan, Jawa Barat", roastLevel: "Medium", notes: ["Floral", "Brown Sugar", "Tea-like"] },
        { name: "Papua Wamena", origin: "Lembah Baliem, Papua", roastLevel: "Medium", notes: ["Cocoa", "Earth Tone", "Berries"] },
      ],
    });
  }

  // Fetch semua data tanpa filter
  const beans = await prisma.coffeeDirectory.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="bg-[#FDF6EE] min-h-screen pt-24 pb-24 text-[#4B2E1C]">
      <div className="container mx-auto px-4 md:px-8 max-w-5xl">
        <DirektoriList initialBeans={beans} />
      </div>
    </div>
  );
}