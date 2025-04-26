"use client";

import { FadeInSection, AnimatedGrid } from "@/components/transitions";
import { useGenericQuery } from "@/hooks/useQuery";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

// Add interface for category data
interface Category {
  _id: string;
  name: string;
  image?: string;
}

interface CategoriesResponse {
  data: Category[];
  message: string;
  status: number;
}

export default function CategoriesPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const [categoryData, setCategoryData] = useState<Category[]>([]);
  const [loadMore, setLoadMore] = useState(true);
  
  const { data: categoriesResponse, isLoading, isFetching, refetch } = useGenericQuery<CategoriesResponse>(
    ["categories", currentPage.toString()],
    "/user/dealCategory/getActiveDealCategories",
    { 
      offset: currentPage * 10, 
      limit: 10 
    }
  );

  // Update category data when response changes
  useEffect(() => {
    if (categoriesResponse?.data) {
      const data = categoriesResponse.data;
      setCategoryData(currentPage === 0 ? data : [...categoryData, ...data]);
      setLoadMore(data.length < 10 ? false : true);
    }
  }, [categoriesResponse]);

  // Load more when scrolling to bottom
  const handleLoadMore = () => {
    if (!isFetching && loadMore) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (isLoading && categoryData.length === 0) {
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

  if (categoryData.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Categories Found</h2>
          <p className="text-gray-600 mb-4">There are no categories available at the moment.</p>
          <button 
            onClick={() => router.push("/")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
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
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              All Categories
            </h1>
          </div>
        </FadeInSection>

        <FadeInSection delay={0.2}>
          <AnimatedGrid staggerDelay={0.05}>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {categoryData.map((category: Category) => (
                <Link 
                  href={`/deals/dealCategory/${category?._id}`} 
                  key={category?._id}
                  className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 flex flex-col items-center justify-center text-center h-32 hover:border-blue-200 hover:bg-blue-50"
                >
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">{category?.name}</span>
                </Link>
              ))}
            </div>
          </AnimatedGrid>
        </FadeInSection>

        {loadMore && (
          <div className="flex justify-center mt-8">
            <button
              onClick={handleLoadMore}
              disabled={isFetching}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isFetching ? (
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