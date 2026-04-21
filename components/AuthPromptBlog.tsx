import Image from "next/image";
import TombolLoginGate from "./TombolLoginGate";

interface AuthPromptBlogProps {
  title: string;
  imageUrl?: string;
  slug: string;
}

export default function AuthPromptBlog({ title, imageUrl, slug }: AuthPromptBlogProps) {
  return (
    <div className="min-h-screen bg-[#FDF6EE] flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg overflow-hidden border border-[#D4956A]/20">
        {/* Cover image */}
        <div className="relative w-full h-56 bg-[#8B5E3C]/10">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg
                className="w-16 h-16 text-[#8B5E3C]/30"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
          {/* Blur overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#4B2E1C]/60 to-transparent" />
        </div>

        {/* Content */}
        <div className="p-8 text-center">
          <h2 className="text-xl font-semibold text-[#4B2E1C] mb-3 leading-snug">
            {title}
          </h2>
          <p className="text-[#8B5E3C] mb-8">
            Masuk untuk membaca artikel ini secara lengkap
          </p>
          <TombolLoginGate callbackUrl={"/blog/" + slug} />
        </div>
      </div>
    </div>
  );
}
