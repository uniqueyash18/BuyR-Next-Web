"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { isEmpty } from 'lodash';
import { useGenericQuery } from '@/hooks/useQuery';
import { FadeInSection } from '@/components/transitions';
import { showError } from '@/utils/helperFunctions';

interface DealData {
  _id: string;
  productName: string;
  actualPrice: number;
  finalCashBackForUser: number;
  imageUrl?: string;
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
    imageUrl?: string;
    brand?: {
      name: string;
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
    lessAmount?: number;
    termsAndCondition?: string;
    postUrl?: string;
    slotAlloted?: number;
    slotCompletedCount?: number;
    exchangeDealProducts?: string[];
  };
  lessAmount?: number;
  adminCommission?: number;
  refundDays?: number;
  createdAt?: string;
  termsAndCondition?: string;
  postUrl?: string;
  slotAlloted?: number;
  slotCompletedCount?: number;
  exchangeDealProducts?: string[];
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: DealData;
}

// For client components in Next.js App Router, we need to use React.use() to unwrap params
export default function DealDetailPage({params}: any) {
  const router = useRouter();
  const [dealData, setDealData] = useState<DealData | null>(null);
  
  // Unwrap the params Promise using React.use()
  const unwrappedParams = React.use(params) as { id: string };
  const { id } = unwrappedParams;
  
  // Fetch deal data using custom useQuery hook
  const { data, isLoading, error, refetch } = useGenericQuery<ApiResponse>(
    ['dealDetail', id],
    `/user/deal/detail/${id}`
  );

  useEffect(() => {
    if (data?.data) {
      setDealData(data.data);
    } else if (error) {
      showError(error?.message || 'Failed to load deal details');
    }
  }, [data, error]);

  // Handle back navigation
  const handleBack = () => {
    router.back();
  };

  // Share product link
  const shareProductLink = (id: string) => {
    if (navigator.share) {
      navigator.share({
        title: 'Check out this deal',
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      const url = window.location.href;
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  // Calculate slots left
  const slotsLeft = dealData?.parentDealId?.slotAlloted
    ? Number(dealData?.parentDealId?.slotAlloted) - Number(dealData?.parentDealId?.slotCompletedCount || 0)
    : dealData?.slotAlloted
      ? Number(dealData?.slotAlloted) - Number(dealData?.slotCompletedCount || 0)
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={handleBack}
            className="flex items-center text-gray-700 hover:text-gray-900 transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h1 className="text-xl font-bold text-gray-800">Deal Details</h1>
          <button
            onClick={() => shareProductLink(dealData?._id || '')}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto px-4 py-8">
          <FadeInSection delay={0.1}>
            {/* Product Image */}
            <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
              <div className="relative h-80 md:h-96 w-full">
                <Image
                  unoptimized
                  src={
                    dealData?.parentDealId?.imageUrl ||
                    dealData?.parentDealId?.brand?.image ||
                    dealData?.imageUrl ||
                    dealData?.brand?.image ||
                    '/images/placeholder.png'
                  }
                  alt={dealData?.parentDealId?.productName || dealData?.productName || 'Product'}
                  fill
                  className="object-contain p-4"
                />
              </div>

              {slotsLeft > 0 && (
                <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-red-600 rounded-full px-4 py-2 shadow-lg">
                  <p className="text-white text-sm font-medium animate-pulse">
                    Hurry! {slotsLeft} slots left
                  </p>
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
                {dealData?.parentDealId?.productName || dealData?.productName}
              </h1>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {/* Brand */}
                {(dealData?.parentDealId?.brand?.name || dealData?.brand?.name) && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <span className="text-gray-500 text-sm block mb-1">Brand</span>
                    <span className="text-gray-800 font-medium">
                      {dealData?.parentDealId?.brand?.name || dealData?.brand?.name}
                    </span>
                  </div>
                )}

                {/* Deal Type */}
                {(dealData?.parentDealId?.dealCategory?.name || dealData?.dealCategory?.name) && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <span className="text-gray-500 text-sm block mb-1">Deal Type</span>
                    <span className="text-gray-800 font-medium">
                      {dealData?.parentDealId?.dealCategory?.name || dealData?.dealCategory?.name}
                    </span>
                  </div>
                )}

                {/* Platform */}
                {(dealData?.parentDealId?.platForm?.name || dealData?.platForm?.name) && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <span className="text-gray-500 text-sm block mb-1">Platform</span>
                    <span className="text-gray-800 font-medium">
                      {dealData?.parentDealId?.platForm?.name || dealData?.platForm?.name}
                    </span>
                  </div>
                )}

                {/* Product Price */}
                {(dealData?.parentDealId?.actualPrice || dealData?.actualPrice) && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <span className="text-gray-500 text-sm block mb-1">Product Price</span>
                    <span className="text-red-600 font-medium text-lg md:text-xl">
                      ₹{Number(dealData?.parentDealId?.actualPrice || dealData?.actualPrice).toFixed(0)}
                    </span>
                  </div>
                )}

                {/* Less Amount */}
                {(dealData?.parentDealId?.lessAmount || dealData?.lessAmount) && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <span className="text-gray-500 text-sm block mb-1">Less Amount</span>
                    <span className="text-gray-800 font-medium text-lg md:text-xl">
                      ₹{Number(Number(dealData?.lessAmount) + Number(dealData?.adminCommission)).toFixed(0)}
                    </span>
                  </div>
                )}

                {/* Commission Amount */}
                {(Number(dealData?.finalCashBackForUser) > Number(dealData?.parentDealId?.actualPrice || dealData?.actualPrice)) && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <span className="text-gray-500 text-sm block mb-1">Commission Amount</span>
                    <span className="text-green-600 font-medium text-lg md:text-xl">
                      ₹{Number(Number(dealData?.finalCashBackForUser) - Number(dealData?.parentDealId?.actualPrice || dealData?.actualPrice)).toFixed(0)}
                    </span>
                  </div>
                )}

                {/* Return Amount */}
                {dealData?.finalCashBackForUser && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <span className="text-gray-500 text-sm block mb-1">Return Amount</span>
                    <span className="text-green-600 font-medium text-lg md:text-xl">
                      ₹{Number(dealData?.finalCashBackForUser).toFixed(0)}
                    </span>
                  </div>
                )}

                {/* Refund Period */}
                {dealData?.createdAt && dealData?.refundDays && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <span className="text-gray-500 text-sm block mb-1">Refund Period</span>
                    <span className="text-gray-800 font-medium">
                      {dealData?.refundDays} days
                    </span>
                  </div>
                )}

                {/* Exchange Products */}
                {!isEmpty(dealData?.parentDealId?.exchangeDealProducts || dealData?.exchangeDealProducts) && (
                  <div className="bg-gray-50 rounded-xl p-4 col-span-2 md:col-span-4">
                    <span className="text-gray-500 text-sm block mb-1">Exchange Products</span>
                    <span className="text-gray-800 font-medium">
                      {((dealData?.parentDealId?.exchangeDealProducts || dealData?.exchangeDealProducts) || []).map((itm: string) => `${itm}, `)}
                    </span>
                  </div>
                )}
              </div>

              {/* Terms and Conditions */}
              {(dealData?.parentDealId?.termsAndCondition || dealData?.termsAndCondition) && (
                <div className="mt-8">
                  <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">Deal Terms & Conditions</h2>
                  <div className="bg-gray-50 rounded-xl p-6">
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {dealData?.parentDealId?.termsAndCondition || dealData?.termsAndCondition}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
              <button
                onClick={() => window.open(dealData?.parentDealId?.postUrl || dealData?.postUrl, '_blank')}
                className="group w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-medium text-lg
                  hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg
                  hover:shadow-xl relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center gap-2">
                  <span>Get This Deal</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </button>

              <Link
                href={`/orderForm`}
                className="group block w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-4 rounded-xl font-medium text-lg text-center
                  hover:from-green-700 hover:to-teal-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg
                  hover:shadow-xl relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-700 to-teal-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span>Fill Order Form</span>
                </div>
              </Link>
            </div>
          </FadeInSection>
        </div>
      )}
    </div>
  );
} 