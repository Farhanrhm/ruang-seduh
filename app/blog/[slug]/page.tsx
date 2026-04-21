import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Coffee, User, MessageCircle, Pin, Trash2, Heart, ChevronDown } from "lucide-react";
import { PortableText } from "@portabletext/react";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { checkGate } from "@/lib/auth-gate";
import FormKomentar from "@/components/FormKomentar";
import TombolAksiKomentar from "@/components/TombolAksiKomentar";
import TombolLike from "@/components/TombolLike";
import AuthPromptBlog from "@/components/AuthPromptBlog";

interface SanityAsset {
  url: string;
  metadata?: { dimensions: { width: number; height: number; aspectRatio: number } };
}

interface BlogPost {
  title: string;
  slug: string;
  mainImage?: SanityAsset;
  publishedAt: string;
  body: any;
  authorName?: string;
  authorImage?: any;
}

const ptComponents = {
  types: {
    image: ({ value }: any) => {
      if (!value?.asset?._ref) return null;
      return (
        <div className="relative w-full my-10 rounded-2xl overflow-hidden shadow-md bg-black/5 flex items-center justify-center p-2 border border-[#8B5E3C]/5">
          <Image src={urlFor(value).url()} alt="Ilustrasi Blog" width={1200} height={800} className="w-full h-auto object-contain max-h-[80vh]" />
        </div>
      );
    }
  },
  block: {
    normal: ({children}: any) => <p className="mb-6 text-lg leading-relaxed text-[#8B5E3C]">{children}</p>,
    h1: ({children}: any) => <h1 className="font-judul text-4xl font-black mb-6 mt-14 text-[#4B2E1C]">{children}</h1>,
    h2: ({children}: any) => <h2 className="font-judul text-3xl font-bold mb-5 mt-12 text-[#4B2E1C] leading-tight">{children}</h2>,
    h3: ({children}: any) => <h3 className="font-judul text-2xl font-bold mb-4 mt-10 text-[#4B2E1C]">{children}</h3>,
    blockquote: ({children}: any) => <blockquote className="border-l-4 border-[#D4956A] pl-5 py-3 italic text-[#4B2E1C] bg-[#D4956A]/5 rounded-r-2xl my-10 font-medium text-lg">{children}</blockquote>,
  },
  marks: { strong: ({children}: any) => <strong className="font-bold text-[#4B2E1C]">{children}</strong> },
  list: {
    bullet: ({children}: any) => <ul className="list-disc pl-7 mb-8 space-y-3 text-lg text-[#8B5E3C] marker:text-[#D4956A]">{children}</ul>,
    number: ({children}: any) => <ol className="list-decimal pl-7 mb-8 space-y-3 text-lg text-[#8B5E3C] marker:text-[#D4956A]">{children}</ol>,
  }
};

export default async function BlogPostPage({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ slug: string }>, 
  searchParams: Promise<{ sort?: string }> 
}) {
  const { slug } = await params;
  const { sort = "terbaru" } = await searchParams;

  // 1. Ambil Data Artikel dari Sanity
  const query = `*[_type == "post" && slug.current == $slug][0]{
    title, "slug": slug.current,
    "mainImage": mainImage.asset->{ url, metadata { dimensions { width, height, aspectRatio } } },
    publishedAt, body, "authorName": author->name, "authorImage": author->image
  }`;
  const post = await client.fetch<BlogPost | null>(query, { slug });

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDF6EE] text-[#4B2E1C] px-4">
        <Coffee className="w-16 h-16 text-[#8B5E3C]/30 mb-6" />
        <h1 className="font-judul text-4xl font-black mb-4 tracking-tighter text-center">404 - Artikel Tidak Ditemukan</h1>
        <p className="font-teks text-[#8B5E3C] mb-10 text-center max-w-md">Maaf, artikel yang Anda cari mungkin sudah dipindahkan atau dihapus.</p>
        <Link href="/blog" className="px-6 py-3.5 bg-[#4B2E1C] text-[#FDF6EE] rounded-xl font-bold hover:bg-[#8B5E3C] transition-all shadow-md">← Kembali ke Halaman Blog</Link>
      </div>
    );
  }

  // 2. Cek Auth Gate — blokir guest sebelum fetch data berat
  const session = await getServerSession(authOptions);
  if (checkGate(session) === "blocked") {
    const imageUrl = post.mainImage?.url;
    return <AuthPromptBlog title={post.title} imageUrl={imageUrl} slug={slug} />;
  }
  const userDB = session?.user?.id ? await prisma.user.findUnique({ where: { id: session.user.id } }) : null;
  const isAdmin = userDB?.role === "ADMIN";

  // 3. Ambil Daftar Komentar dengan Logika Sorting
  let orderBy: any = { createdAt: "desc" };
  if (sort === "terlama") orderBy = { createdAt: "asc" };
  if (sort === "populer") orderBy = { likes: { _count: "desc" } };

  const komentarList = await prisma.comment.findMany({
    where: { postSlug: slug, parentId: null }, 
    include: { 
      user: true, 
      likes: true,
      replies: { include: { user: true, likes: true } } 
    },
    orderBy: [
      { isPinned: "desc" }, 
      orderBy
    ]
  });

  const imageMetadata = post.mainImage?.metadata?.dimensions;
  const isPortrait = imageMetadata && imageMetadata.height > imageMetadata.width;

  return (
    <div className="bg-[#FDF6EE] min-h-screen pt-24 pb-24 text-[#4B2E1C]">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link href="/blog" className="inline-flex items-center gap-2 text-[#8B5E3C] hover:text-[#4B2E1C] font-bold mb-12 transition-colors bg-white px-5 py-2.5 rounded-full shadow-sm border border-[#8B5E3C]/10 w-fit group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Kembali ke Daftar Artikel
        </Link>

        <h1 className="font-judul text-4xl md:text-5xl lg:text-6xl font-black text-[#4B2E1C] mb-10 leading-[1.1] tracking-tighter">{post.title}</h1>

        <div className="flex items-center gap-5 mb-12 pb-10 border-b border-[#8B5E3C]/10">
          {post.authorImage ? (
            <Image src={urlFor(post.authorImage).url()} alt={post.authorName || "Penulis"} width={64} height={64} className="rounded-full border-4 border-white shadow-lg object-cover h-16 w-16" />
          ) : (
            <div className="w-16 h-16 bg-[#4B2E1C] rounded-full flex items-center justify-center border-4 border-white shadow-lg"><User className="w-7 h-7 text-[#FDF6EE]" /></div>
          )}
          <div>
            <p className="font-judul text-xl font-bold text-[#4B2E1C]">{post.authorName || "Redaksi Ruang Seduh"}</p>
            <p className="font-teks text-[#8B5E3C] flex items-center gap-2 mt-1">
              <Calendar className="w-4.5 h-4.5 text-[#D4956A]" />
              {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : "-"}
            </p>
          </div>
        </div>

        {post.mainImage && imageMetadata && (
          <div className={`w-full relative rounded-3xl overflow-hidden mb-16 shadow-2xl border border-[#8B5E3C]/10 ${isPortrait ? 'bg-black/80 p-4' : 'bg-white'}`}>
            <Image src={post.mainImage.url} alt={post.title} width={imageMetadata.width} height={imageMetadata.height} className={`w-full h-auto object-contain mx-auto ${isPortrait ? 'max-h-[70vh]' : 'w-full'}`} priority />
          </div>
        )}

        <div className="font-teks px-1 max-w-3xl mx-auto mb-20 pb-20 border-b border-[#8B5E3C]/10">
          <PortableText value={post.body} components={ptComponents} />
        </div>

        {/* ======================================================== */}
        {/* BAGIAN KOMENTAR KOMPLEKS */}
        {/* ======================================================== */}
        <div className="mt-20 pt-16 max-w-3xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
            <div className="flex items-center gap-3">
              <MessageCircle className="w-8 h-8 text-[#D4956A]" />
              <h3 className="font-judul text-3xl font-black text-[#4B2E1C]">
                Ruang Diskusi <span className="text-[#8B5E3C] font-normal text-xl">({komentarList.length})</span>
              </h3>
            </div>

            {/* Filter Sorting */}
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-[#8B5E3C]/10 shadow-sm">
              <span className="text-xs font-bold text-[#8B5E3C] uppercase tracking-wider">Urutkan:</span>
              <div className="flex gap-3 text-sm font-bold">
                <Link href={`?sort=terbaru`} scroll={false} className={`hover:text-[#D4956A] ${sort === 'terbaru' ? 'text-[#D4956A]' : ''}`}>Terbaru</Link>
                <Link href={`?sort=populer`} scroll={false} className={`hover:text-[#D4956A] ${sort === 'populer' ? 'text-[#D4956A]' : ''}`}>Populer</Link>
              </div>
            </div>
          </div>
          
          <FormKomentar slug={slug} userId={session?.user?.id} />

          <div className="mt-12 space-y-10">
            {komentarList.map((komentar) => (
              <div key={komentar.id} className={`relative group ${komentar.isPinned ? 'bg-[#D4956A]/5 p-6 rounded-[2rem] border-2 border-[#D4956A]/20' : ''}`}>
                {komentar.isPinned && (
                  <div className="absolute -top-3 left-6 bg-[#D4956A] text-white text-[10px] font-black px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    <Pin className="w-3 h-3 fill-white" /> DISEMATKAN
                  </div>
                )}

                <div className="flex gap-4">
                  {komentar.user.image ? (
                    <Image src={komentar.user.image} alt="User" width={48} height={48} className="w-12 h-12 rounded-full border-2 border-white shadow-sm flex-shrink-0 object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-[#D4956A] flex items-center justify-center flex-shrink-0 border-2 border-white shadow-sm">
                      <User className="w-6 h-6 text-white" />
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-judul font-bold text-[#4B2E1C] flex items-center gap-2">
                        {komentar.user.name}
                        {komentar.user.role === 'ADMIN' && <span className="text-[9px] bg-[#4B2E1C] text-white px-1.5 py-0.5 rounded">ADMIN</span>}
                      </h4>
                      
                      {/* TOMBOL AKSI ADMIN: Hanya kirim prop yang dibutuhkan saja */}
                      <TombolAksiKomentar 
                        commentId={komentar.id} 
                        slug={slug} 
                        isAdmin={isAdmin} 
                        isPinned={komentar.isPinned}
                      />
                    </div>

                    <p className="text-xs text-[#8B5E3C] mb-3">{new Date(komentar.createdAt).toLocaleDateString('id-ID')}</p>
                    <p className="font-teks text-[#4B2E1C] leading-relaxed mb-4 whitespace-pre-wrap">{komentar.text}</p>

                    {/* Tombol Like Interaktif */}
                    <div className="flex items-center gap-6">
                      <TombolLike 
                        commentId={komentar.id}
                        slug={slug}
                        initialLikes={komentar.likes.length}
                        hasLiked={komentar.likes.some((like: any) => like.userId === session?.user?.id)}
                        isGuest={!session?.user?.id}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {komentarList.length === 0 && (
              <p className="text-center font-teks text-[#8B5E3C] italic mt-10">Belum ada diskusi untuk artikel ini. Jadilah yang pertama!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
