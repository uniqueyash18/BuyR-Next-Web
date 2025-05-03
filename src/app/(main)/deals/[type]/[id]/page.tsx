'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { FadeInSection, AnimatedGrid } from '@/components/transitions';
import usePostData from '@/hooks/usePostData';
import DealCard from '@/components/DealCard';
import { isEmpty } from 'lodash';

// Define interfaces
interface Deal {
  _id: string;
  productName: string;
  actualPrice: number;
  finalCashBackForUser: number;
  imageUrl?: string;
  brand?: {
    _id: string;
    name: string;
    image: string;
  };
  dealCategory?: {
    _id: string;
    name: string;
    image: string;
  };
  platForm?: {
    _id: string;
    name: string;
    image: string;
  };
  parentDealId?: {
    imageUrl?: string;
    brand?: {
      image: string;
    };
    dealCategory?: {
      name: string;
    };
    platForm?: {
      name: string;
    };
    productName?: string;
    actualPrice?: number;
  };
}

interface FilterOption {
  _id: string;
  name: string;
}

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  options: FilterOption[];
  selectedOption: FilterOption | null;
  onSelect: (option: FilterOption | null) => void;
  onApply: () => void;
}

// Filter Modal Component
const FilterModal = ({ isOpen, onClose, title, options, selectedOption, onSelect, onApply }: FilterModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4 overflow-hidden">
      <div className="bg-white rounded-xl p-4 w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col relative">
        <div className="flex justify-between items-center mb-4 sticky top-0 bg-white z-10">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="overflow-y-auto flex-grow mb-4">
          {options.map((option) => (
            <div 
              key={option._id}
              onClick={() => onSelect(selectedOption?._id === option._id ? null : option)}
              className={`flex justify-between items-center p-3 mb-2 rounded-lg cursor-pointer border ${
                selectedOption?._id === option._id 
                  ? 'border-purple-600 bg-purple-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="text-gray-800">{option.name}</span>
              {selectedOption?._id === option._id ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          ))}
        </div>
        
        <div className="sticky bottom-0 bg-white pt-2">
          <button 
            onClick={onApply}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 transition-colors"
          >
            Apply Filter
          </button>
        </div>
      </div>
    </div>
  );
};

export default function AllDealsPage() {
  const router = useRouter();
  const params = useParams();
  const type = params.type as string;
  const id = params.id as string;

  // State management
  const [currentPage, setCurrentPage] = useState(0);
  const [allDealsData, setAllDealsData] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadMore, setLoadMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filter states
  const [filterModal, setFilterModal] = useState(false);
  const [filterType, setFilterType] = useState<'brand' | 'category' | 'platform'>('brand');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<FilterOption | null>(null);
  const [selectedPlatformFilter, setSelectedPlatformFilter] = useState<FilterOption | null>(null);
  const [selectedBrandFilter, setSelectedBrandFilter] = useState<FilterOption | null>(null);
  const [filteredData, setFilteredData] = useState<Deal[]>([]);

  // Filter options
  const [categoryFilter, setCategoryFilter] = useState<FilterOption[]>([]);
  const [platformFilter, setPlatformFilter] = useState<FilterOption[]>([]);
  const [brandFilter, setBrandFilter] = useState<FilterOption[]>([]);

  // Get page title based on type
  const getPageTitle = () => {
    if (type === 'brand') return 'Brand Deals';
    if (type === 'category') return 'Category Deals';
    if (type === 'platform') return 'Platform Deals';
    return 'All Deals';
  };

  // Fetch deals data
  const { mutate: getAllDeals, isPending } = usePostData('/user/deal/getDealsByIds', {
    onSuccess: async (data: any) => {
      setAllDealsData(
        currentPage === 0 ? data?.data : [...allDealsData, ...data?.data]
      );
      setIsLoading(false);

      // Set filter options
      if (currentPage === 0) {
        setCategoryFilter(data?.relatedData?.categories || []);
        setPlatformFilter(data?.relatedData?.platforms || []);
        setBrandFilter(data?.relatedData?.brands || []);
      }
      setCurrentPage(data?.data?.length > 0 ? currentPage + 1 : 0);
      setLoadMore(data?.data?.length === 10);
      setFilterModal(false);
      setIsRefreshing(false);
    },
    onError: async (error: any) => {
      console.error('Error loading deals:', error);
      setIsLoading(false);
      setIsRefreshing(false);
    },
  });

  // Initial load
  useEffect(() => {
    getAllDeals({
      type,
      id,
      selectedCategoryFilter: selectedCategoryFilter?._id ? [selectedCategoryFilter._id] : null,
      selectedPlatformFilter: selectedPlatformFilter?._id ? [selectedPlatformFilter._id] : null,
      selectedBrandFilter: selectedBrandFilter?._id ? [selectedBrandFilter._id] : null,
      offset: currentPage * 10,
      limit: 10,
    });
  }, []);

  // Handle load more
  const handleLoadMore = () => {
    if (!isPending && loadMore) {
      getAllDeals({
        type,
        id,
        selectedCategoryFilter: selectedCategoryFilter?._id ? [selectedCategoryFilter._id] : null,
        selectedPlatformFilter: selectedPlatformFilter?._id ? [selectedPlatformFilter._id] : null,
        selectedBrandFilter: selectedBrandFilter?._id ? [selectedBrandFilter._id] : null,
        offset: currentPage * 10,
        limit: 10,
      });
    }
  };


  // Handle filter apply
  const handleApplyFilter = () => {
    setCurrentPage(0);
    getAllDeals({
      type,
      id,
      selectedCategoryFilter: selectedCategoryFilter?._id ? [selectedCategoryFilter._id] : null,
      selectedPlatformFilter: selectedPlatformFilter?._id ? [selectedPlatformFilter._id] : null,
      selectedBrandFilter: selectedBrandFilter?._id ? [selectedBrandFilter._id] : null,
      offset: 0,
      limit: 10,
    });
  };


  // Loading state
  if (isLoading && allDealsData.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4">
        <div className="animate-pulse space-y-6">
          <div className="h-12 bg-gray-200 rounded-xl w-1/3" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (allDealsData.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Deals Found</h2>
          <p className="text-gray-600 mb-4">There are no deals available for this {type}.</p>
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
        {/* Header */}
        <FadeInSection delay={0.1}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-700 bg-clip-text text-transparent">
              {getPageTitle()}
            </h1>
          </div>
        </FadeInSection>

        {/* Filter Section */}
        {!isEmpty(allDealsData) && (
          <FadeInSection delay={0.2}>
            <div className="flex flex-col sm:flex-row gap-4">
              {type === 'dealCategory' ? (
                <button
                  onClick={() => {
                    setFilterType('brand');
                    setFilterModal(true);
                  }}
                  className="flex items-center justify-between px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <span className="text-gray-700">
                    {isEmpty(selectedBrandFilter) ? "Filter By Brand" : selectedBrandFilter.name}
                  </span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setFilterType('category');
                    setFilterModal(true);
                  }}
                  className="flex items-center justify-between px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <span className="text-gray-700">
                    {isEmpty(selectedCategoryFilter) ? "Filter By Category" : selectedCategoryFilter.name}
                  </span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              )}

              <button
                onClick={() => {
                  setFilterType('platform');
                  setFilterModal(true);
                }}
                className="flex items-center justify-between px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <span className="text-gray-700">
                  {isEmpty(selectedPlatformFilter) ? "Filter By Platform" : selectedPlatformFilter.name}
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </FadeInSection>
        )}

        {/* Deals Grid */}
        <FadeInSection delay={0.3}>
          <AnimatedGrid staggerDelay={0.05}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {(isEmpty(filteredData) ? allDealsData : filteredData).map((deal: Deal, index: number) => (
                <div
                  key={deal._id + index}
                >
                  <DealCard item={deal} index={index} />
                </div>
              ))}
            </div>
          </AnimatedGrid>
        </FadeInSection>

        {/* Load More Button */}
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

      {/* Filter Modal */}
      <FilterModal
        isOpen={filterModal}
        onClose={() => setFilterModal(false)}
        title={filterType === 'category' ? 'Select Category' : filterType === 'platform' ? 'Select Platform' : 'Select Brand'}
        options={filterType === 'category' ? categoryFilter : filterType === 'platform' ? platformFilter : brandFilter}
        selectedOption={
          filterType === 'category'
            ? selectedCategoryFilter
            : filterType === 'platform'
              ? selectedPlatformFilter
              : selectedBrandFilter
        }
        onSelect={(option) => {
          if (filterType === 'category') {
            setSelectedCategoryFilter(option);
          } else if (filterType === 'platform') {
            setSelectedPlatformFilter(option);
          } else {
            setSelectedBrandFilter(option);
          }
        }}
        onApply={handleApplyFilter}
      />
    </div>
  );
} 