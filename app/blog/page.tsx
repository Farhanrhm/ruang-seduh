import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { client } from "@/lib/sanity";

export const revalidate = 0; 

async function getPosts() {
  const query = `
    *[_type == "post"] | order(publishedAt desc) {
      _id,
      title,
      "slug": slug.current,
      "imageUrl": mainImage.asset->url,
      publishedAt,
      "authorName": author->name
    }
  `;
  return await client.fetch(query);
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="bg-[#FDF6EE] min-h-screen pt-16 pb-24 text-[#4B2E1C]">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        
        {/* Header Blog */}
        <div className="mb-16 border-b border-[#8B5E3C]/10 pb-8 text-center md:text-left">
          <h1 className="font-judul text-5xl md:text-6xl font-black text-[#4B2E1C] mb-4 tracking-tighter">
            Jurnal & Cerita
          </h1>
          <p className="font-teks text-[#8B5E3C] text-lg max-w-2xl">
            Artikel seputar kopi, cerita dari kebun, dan tips menyeduh dari para ahli. Semuanya dikelola langsung via Sanity CMS.
          </p>
        </div>

        {/* Grid Artikel dari Sanity */}
        {posts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post: any) => (
              <article key={post._id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-[#8B5E3C]/10 group flex flex-col">
                <div className="h-56 overflow-hidden relative bg-[#FDF6EE]">
                  <div className="absolute inset-0 bg-[#8B5E3C]/10 group-hover:bg-transparent transition-colors z-10" />
                  {post.imageUrl ? (
                    <img 
                      src={post.imageUrl} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#8B5E3C]/30 font-judul">No Image</div>
                  )}
                </div>
                
                <div className="p-8 flex flex-col flex-1">
                  <span className="flex items-center gap-2 text-[#D4956A] text-xs font-bold uppercase tracking-wider mb-3">
                    <Calendar className="w-3.5 h-3.5" /> 
                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Baru'}
                  </span>
                  
                  <h2 className="font-judul text-2xl font-bold text-[#4B2E1C] mb-4 line-clamp-2 group-hover:text-[#D4956A] transition-colors leading-tight">
                    {post.title}
                  </h2>
                  
                  <div className="mt-auto pt-6 border-t border-[#8B5E3C]/10 flex items-center justify-between">
                    <span className="text-xs font-teks text-[#8B5E3C] font-medium">Oleh {post.authorName || 'Redaksi'}</span>
                    <Link href={`/blog/${post.slug}`} className="inline-flex items-center text-[#4B2E1C] font-bold text-sm hover:text-[#D4956A] transition-colors">
                      Baca <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-[#8B5E3C]/10">
            <h2 className="font-judul text-2xl font-bold text-[#4B2E1C] mb-2">Belum ada artikel.</h2>
            <p className="font-teks text-[#8B5E3C]">Silakan tulis artikel pertamamu di Sanity Studio (localhost:3333).</p>
          </div>
        )}

      </div>
    </div>
  );
}