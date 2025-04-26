"use client";

import BrandCard from "@/components/BrandCard";
import CustomScrollBanner from "@/components/CustomScrollBanner";
import DealCard from "@/components/DealCard";
import NoDataFound from "@/components/NoDataFound";
import { FadeInSection } from "@/components/transitions";
import { getHomeData } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

export default function HomePage() {
  const { data: homeData, isLoading, error, refetch } = useQuery({
    queryKey: ["homeData"],
    queryFn: getHomeData,
    retry: 1, // Only retry once
  });
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4">
        <div className="animate-pulse space-y-6">
          <div className="h-48 bg-gray-200 rounded-xl" />
          <div className="h-40 bg-gray-200 rounded-xl" />
          <div className="h-64 bg-gray-200 rounded-xl" />
          <div className="h-64 bg-gray-200 rounded-xl" />
        </div>
      </div>
    );
  }
  if (error) {
    console.error("Error loading home data:", error);
    return <NoDataFound />;
  }
  // Ensure data exists before rendering
  if (!homeData) {
    return <NoDataFound />;
  }

  const { Poster, dealCategoryData, activelyDeals, brandData } = homeData;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="p-4 space-y-10 max-w-7xl mx-auto">
        {/* Banner Section */}
        {Poster && Poster.length > 0 && (
          <FadeInSection delay={0.1}>
            <div className="rounded-xl overflow-hidden shadow-lg">
              <CustomScrollBanner data={Poster} />
            </div>
          </FadeInSection>
        )}

        {/* Categories Section - Redesigned */}
        {dealCategoryData && dealCategoryData.length > 0 && (
          <FadeInSection delay={0.2}>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Your Favourite Categories</h2>
                <Link href="/categories" className="text-blue-600 hover:text-blue-800 transition-colors font-medium flex items-center">
                  View All
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {dealCategoryData.map((category: any) => (
                  <Link
                    href={`/deals/dealCategory/${category._id}`}
                    key={category._id}
                  >
                    <div
                      key={category._id}
                      className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 flex flex-col items-center justify-center text-center h-32"
                    >
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-black">{category.name}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </FadeInSection>
        )}

        {/* Deals Section - Horizontal Scroll */}
        {activelyDeals && activelyDeals.length > 0 && (
          <FadeInSection delay={0.3}>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent">Deals You May Like</h2>
                <Link href="/deals/all/all" className="text-green-600 hover:text-green-800 transition-colors font-medium flex items-center">
                  View All Deals
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              <div className="relative">
                <div className="flex overflow-x-auto pb-4 space-x-4 scrollbar-hide snap-x snap-mandatory">
                  {activelyDeals.map((deal: any, index: number) => (
                    <div key={deal._id} className="snap-start flex-shrink-0 w-64">
                      <DealCard item={deal} index={index} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeInSection>
        )}

        {/* Brands Section - Horizontal Scroll */}
        {brandData && brandData.length > 0 && (
          <FadeInSection delay={0.4}>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-700 bg-clip-text text-transparent">Your Favourite Brands</h2>
                <Link href="/brands" className="text-purple-600 hover:text-purple-800 transition-colors font-medium flex items-center">
                  View All
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              <div className="relative">
                <div className="flex overflow-x-auto pb-4 space-x-4 scrollbar-hide snap-x snap-mandatory">
                  {brandData.map((brand: any, index: number) => (
                    <Link
                      href={`/deals/brand/${brand._id}`}
                      key={brand._id}
                    >
                      <div key={brand._id} className="snap-start flex-shrink-0 w-64">
                        <BrandCard item={brand} index={index} />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </FadeInSection>
        )}
      </div>
    </div>
  );
} 