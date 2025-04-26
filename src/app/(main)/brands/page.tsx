"use client";

import { FadeInSection, AnimatedGrid } from "@/components/transitions";
import usePostData from "@/hooks/usePostData";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import BrandCard from "@/components/BrandCard";

// Add interface for brand data
interface Brand {
  _id: string;
  name: string;
  image?: string;
}

interface BrandsResponse {
  data: Brand[];
  message: string;
  status: number;
}

export default function BrandsPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const [brandData, setBrandData] = useState<Brand[]>([]);
  const [loadMore, setLoadMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  
  const { mutate: getBrands, isPending } = usePostData("/user/brand/getActiveBrands", {
    onSuccess: async ({ data }: any) => {
      setBrandData(currentPage === 0 ? data : [...brandData, ...data]);
      setIsLoading(false);
      setCurrentPage(data?.length > 0 ? currentPage + 1 : 0);
      setLoadMore(data?.length === 10);
    },
    onError: async (error: any) => {
      console.error("Error loading brands:", error);
      setIsLoading(false);
    },
  });

  // Initial load
  useEffect(() => {
    getBrands({ offset: 0, limit: 10 });
  }, []);

  // Load more when scrolling to bottom
  const handleLoadMore = () => {
    if (!isPending && loadMore) {
      getBrands({ offset: currentPage * 10, limit: 10 });
    }
  };

  if (isLoading && brandData.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4">
        <div className="animate-pulse space-y-6">
          <div className="h-12 bg-gray-200 rounded-xl w-1/3" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (brandData.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Brands Found</h2>
          <p className="text-gray-600 mb-4">There are no brands available at the moment.</p>
          <button 
            onClick={() => router.push("/")}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="p-4 space-y-8 max-w-7xl mx-auto">
        <FadeInSection delay={0.1}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-700 bg-clip-text text-transparent">
              All Brands
            </h1>
          </div>
        </FadeInSection>

        <FadeInSection delay={0.2}>
          <AnimatedGrid staggerDelay={0.05}>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {brandData.map((brand: Brand, index: number) => (
                <Link 
                  href={`/deals/brand/${brand._id}`} 
                  key={brand._id}
                >
                  <BrandCard item={brand} index={index} />
                </Link>
              ))}
            </div>
          </AnimatedGrid>
        </FadeInSection>

        {loadMore && (
          <div className="flex justify-center mt-8">
            <button
              onClick={handleLoadMore}
              disabled={isPending}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isPending ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading...
                </>
              ) : (
                'Load More'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 