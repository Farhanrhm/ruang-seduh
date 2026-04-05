import { client } from "@/sanity/lib/client";
import KatalogToko from "@/components/KatalogToko";

export const revalidate = 0; 

export default async function TokoPage() {
  const query = `*[_type == "product"] | order(_createdAt desc) {
    "id": _id,
    name,
    price,
    category,
    originCategory,
    "imageUrl": imageUrl,
    "sanityImage": image,
    description,
    origin,
    process,
    roast,
    notes,
    "createdAt": _createdAt
  }`;
  
  const products = await client.fetch(query);

  return (
    <div className="bg-[#FDF6EE] min-h-screen pt-24 pb-24 text-[#4B2E1C]">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <KatalogToko initialProducts={products} />
      </div>
    </div>
  );
}