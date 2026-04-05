import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, BarChart3, Wrench, BookOpen } from "lucide-react";
import { PortableText } from "@portabletext/react";

// Komponen perapian teks (PortableText)
const ptComponents = {
  block: {
    normal: ({children}: any) => <p className="mb-6 text-lg leading-relaxed text-[#8B5E3C]">{children}</p>,
    h2: ({children}: any) => <h2 className="font-judul text-3xl font-bold mb-5 mt-12 text-[#4B2E1C]">{children}</h2>,
    h3: ({children}: any) => <h3 className="font-judul text-2xl font-bold mb-4 mt-8 text-[#4B2E1C]">{children}</h3>,
  },
  list: { number: ({children}: any) => <ol className="list-decimal pl-6 mb-8 space-y-4 text-lg text-[#8B5E3C] marker:text-[#D4956A] marker:font-bold">{children}</ol> },
};

export default async function GuideDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const query = `*[_type == "guide" && slug.current == $slug][0]{
    title, "mainImage": image, description, difficulty, time, tools, body
  }`;
  const guide = await client.fetch(query, { slug });

  if (!guide) return <div className="min-h-screen flex items-center justify-center text-2xl">Panduan Tidak Ditemukan</div>;

  return (
    <div className="bg-[#FDF6EE] min-h-screen pt-24 pb-24 text-[#4B2E1C]">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link href="/panduan" className="inline-flex items-center gap-2 text-[#8B5E3C] hover:text-[#4B2E1C] font-bold mb-10 bg-white px-5 py-2.5 rounded-full shadow-sm border border-[#8B5E3C]/10 w-fit group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Kembali ke Panduan
        </Link>

        {/* Gambar Cover Full Lebar */}
        {guide.mainImage && (
          <div className="w-full relative aspect-video md:aspect-[21/9] rounded-[2.5rem] overflow-hidden mb-12 shadow-2xl border border-[#8B5E3C]/10">
            <Image src={urlFor(guide.mainImage).url()} alt={guide.title} fill className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-8 md:p-12">
              <h1 className="font-judul text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tighter">
                {guide.title}
              </h1>
            </div>
          </div>
        )}

        {/* Bar Info Singkat */}
        <div className="flex flex-wrap gap-4 mb-12 pb-10 border-b border-[#8B5E3C]/10">
          <div className="bg-white px-5 py-3 rounded-2xl border border-[#8B5E3C]/10 flex items-center gap-3 shadow-sm">
            <BarChart3 className="w-5 h-5 text-[#D4956A]" />
            <div>
              <p className="text-[10px] font-bold text-[#8B5E3C] uppercase tracking-widest">Tingkat</p>
              <p className="font-black text-[#4B2E1C]">{guide.difficulty}</p>
            </div>
          </div>
          <div className="bg-white px-5 py-3 rounded-2xl border border-[#8B5E3C]/10 flex items-center gap-3 shadow-sm">
            <Clock className="w-5 h-5 text-[#D4956A]" />
            <div>
              <p className="text-[10px] font-bold text-[#8B5E3C] uppercase tracking-widest">Waktu</p>
              <p className="font-black text-[#4B2E1C]">{guide.time}</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-12 gap-12">
          {/* Sidebar Alat */}
          <div className="md:col-span-4 space-y-8">
            <div className="bg-white p-8 rounded-[2rem] border border-[#8B5E3C]/10 shadow-sm sticky top-28">
              <h3 className="font-judul text-xl font-bold text-[#4B2E1C] mb-6 flex items-center gap-2">
                <Wrench className="w-5 h-5 text-[#D4956A]" /> Alat Dibutuhkan
              </h3>
              <ul className="space-y-3">
                {guide.tools?.map((tool: string, i: number) => (
                  <li key={i} className="flex items-center gap-3 text-[#8B5E3C] font-teks font-medium bg-[#FDF6EE] px-4 py-3 rounded-xl border border-[#8B5E3C]/5">
                    <span className="w-1.5 h-1.5 bg-[#D4956A] rounded-full"></span> {tool}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Isi Panduan */}
          <div className="md:col-span-8 font-teks bg-white p-8 md:p-12 rounded-[2rem] border border-[#8B5E3C]/10 shadow-sm">
            <div className="flex items-center gap-3 mb-8 pb-6 border-b border-[#8B5E3C]/10">
              <BookOpen className="w-8 h-8 text-[#D4956A]" />
              <h2 className="font-judul text-3xl font-black text-[#4B2E1C]">Langkah Seduh</h2>
            </div>
            <PortableText value={guide.body} components={ptComponents} />
          </div>
        </div>

      </div>
    </div>
  );
}