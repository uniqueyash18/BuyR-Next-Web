"use client";

import BrandCard from "@/components/BrandCard";
import DealCard from "@/components/DealCard";
import NoDataFound from "@/components/NoDataFound";
import { FadeInSection } from "@/components/transitions";
import usePostData from "@/hooks/usePostData";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";

interface SearchResult {
  _id: string;
  productName: string;
  name: string;
  image?: string;
  imageUrl?: string;
  actualPrice: number;
  finalCashBackForUser: number;
  brand?: {
    name: string;
    image: string;
  };
  dealCategory?: {
    name: string;
    image: string;
  };
  platForm?: {
    name: string;
    image: string;
  };
  parentDealId?: {
    _id: string;
    name: string;
  };
}

export default function SearchPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<"deals" | "brands">("deals");
  const [page, setPage] = useState(0);
  const [items, setItems] = useState<any[]>([]);
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);

  const { data, isLoading, error, mutate } = usePostData<{ data: any[] }>(
    searchType === "brands" 
      ? "/user/brand/getActiveBrands" 
      : "/user/deal/activeDeals",
    {
      onSuccess: (data: { data: any[] }) => {
        if (page === 0) {
          setItems(data.data);
        } else {
          setItems(prev => [...prev, ...data.data]);
        }
      },
      onError: (error: Error) => {
        console.error("Search error:", error);
      }
    }
  );

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle search when debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(debouncedQuery.trim())}`);
      setPage(0);
      setItems([]);
      mutate({
        search: debouncedQuery.trim(),
        offset: 0,
        limit: 10
      });
    }
  }, [debouncedQuery, searchType]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
    mutate({
      search: searchQuery.trim(),
      offset: (page + 1) * 10,
      limit: 10
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-8">
        {/* Search Bar */}
        <FadeInSection delay={0.1}>
          <div className="space-y-4">
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search deals and brands..."
                  className="w-full h-14 pl-12 pr-4 rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 bg-white shadow-sm text-gray-400"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </form>

            {/* Search Type Toggle */}
            <div className="flex space-x-4">
              <button
                onClick={() => setSearchType("deals")}
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  searchType === "deals"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Deals
              </button>
              <button
                onClick={() => setSearchType("brands")}
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  searchType === "brands"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Brands
              </button>
            </div>
          </div>
        </FadeInSection>

        {/* Search Results */}
        <FadeInSection delay={0.2}>
          {isLoading && items.length === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="h-64 bg-gray-200 rounded-2xl animate-pulse"
                />
              ))}
            </div>
          ) : error ? (
            <NoDataFound />
          ) : items.length === 0 ? (
            <NoDataFound />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {items.map((item, index) => (
                  <div key={item?._id}>
                    {searchType === "deals" ? (
                      <DealCard item={item} index={index} />
                    ) : (
                      <BrandCard item={item} index={index} />
                    )}
                  </div>
                ))}
              </div>
              {data?.data?.length === 10 && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={handleLoadMore}
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    {isLoading ? "Loading..." : "Load More"}
                  </button>
                </div>
              )}
            </>
          )}
        </FadeInSection>
      </div>
    </div>
  );
} 