import { Coffee } from "lucide-react";

export default function LoadingJurnal() {
  return (
    <div className="min-h-screen bg-[#FDF6EE] pt-24 pb-24">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl animate-pulse">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 border-b border-[#8B5E3C]/10 pb-8">
          <div>
            <div className="h-12 w-64 bg-[#8B5E3C]/10 rounded-2xl mb-4"></div>
            <div className="h-6 w-96 max-w-full bg-[#8B5E3C]/10 rounded-xl"></div>
          </div>
          <div className="h-14 w-48 bg-[#8B5E3C]/10 rounded-full"></div>
        </div>

        {/* Skeleton Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-[2rem] border border-[#8B5E3C]/5 shadow-sm p-8 flex flex-col h-[380px]">
              {/* Header skeleton */}
              <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 bg-[#FDF6EE] rounded-2xl flex items-center justify-center border border-[#8B5E3C]/5">
                  <Coffee className="w-6 h-6 text-[#8B5E3C]/20" />
                </div>
                <div className="h-8 w-24 bg-yellow-50 rounded-full border border-yellow-100"></div>
              </div>
              
              {/* Title skeleton */}
              <div className="h-8 w-3/4 bg-[#8B5E3C]/10 rounded-xl mb-4"></div>
              
              {/* Badges skeleton */}
              <div className="flex items-center gap-2 mb-6">
                <div className="h-7 w-20 bg-[#FDF6EE] rounded-md"></div>
                <div className="h-7 w-16 bg-[#FDF6EE] rounded-md"></div>
              </div>
              
              {/* Text skeleton */}
              <div className="space-y-2 mt-auto mb-6">
                <div className="h-4 w-full bg-[#8B5E3C]/5 rounded-md"></div>
                <div className="h-4 w-5/6 bg-[#8B5E3C]/5 rounded-md"></div>
                <div className="h-4 w-4/6 bg-[#8B5E3C]/5 rounded-md"></div>
              </div>

              {/* Footer skeleton */}
              <div className="pt-5 border-t border-[#8B5E3C]/10 flex items-center justify-between mt-auto">
                <div className="h-4 w-28 bg-[#8B5E3C]/10 rounded-md"></div>
                <div className="flex gap-2">
                  <div className="h-8 w-8 bg-[#8B5E3C]/5 rounded-xl"></div>
                  <div className="h-8 w-8 bg-[#8B5E3C]/5 rounded-xl"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
