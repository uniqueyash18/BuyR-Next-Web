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


interface PageProps<T> {
  params: T;
  searchParams?: { [key: string]: string | string[] | undefined };
}

export const DealPage = async ({ params }: PageProps<{ id: any }>) => {
  'use client';
  
  const router = useRouter();
  const [dealData, setDealData] = useState<DealData | null>(null);

  // Fetch deal data using custom useQuery hook
  const { data, isLoading, error, refetch } = useGenericQuery<ApiResponse>(
    ['dealDetail', params.id],
    `/user/deal/detail/${params.id}`
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button 
            onClick={handleBack}
            className="flex items-center text-gray-700 hover:text-gray-900"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h1 className="text-xl font-bold text-gray-800">Deal Detail</h1>
          <button 
            onClick={() => shareProductLink(dealData?._id || '')}
            className="text-gray-700 hover:text-gray-900"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
        <div className="container mx-auto px-4 py-6">
          <FadeInSection delay={0.1}>
            {/* Product Image */}
            <div className="relative bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div className="relative h-80 w-full">
                <Image
                  src={
                    dealData?.parentDealId?.imageUrl || 
                    dealData?.parentDealId?.brand?.image || 
                    dealData?.imageUrl || 
                    dealData?.brand?.image || 
                    '/images/placeholder.png'
                  }
                  alt={dealData?.parentDealId?.productName || dealData?.productName || 'Product'}
                  fill
                  className="object-contain"
                />
              </div>
              
              {slotsLeft > 0 && (
                <div className="absolute top-2 right-2 bg-black bg-opacity-70 rounded-lg px-3 py-1">
                  <p className="text-white text-sm font-medium animate-pulse">
                    Hurry! {slotsLeft} slots left
                  </p>
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-4">
                {dealData?.parentDealId?.productName || dealData?.productName}
              </h1>

              <div className="space-y-3">
                {/* Brand */}
                {(dealData?.parentDealId?.brand?.name || dealData?.brand?.name) && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Brand</span>
                    <span className="text-gray-800 font-medium">
                      {dealData?.parentDealId?.brand?.name || dealData?.brand?.name}
                    </span>
                  </div>
                )}

                {/* Deal Type */}
                {(dealData?.parentDealId?.dealCategory?.name || dealData?.dealCategory?.name) && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Deal Type</span>
                    <span className="text-gray-800 font-medium">
                      {dealData?.parentDealId?.dealCategory?.name || dealData?.dealCategory?.name}
                    </span>
                  </div>
                )}

                {/* Platform */}
                {(dealData?.parentDealId?.platForm?.name || dealData?.platForm?.name) && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Platform</span>
                    <span className="text-gray-800 font-medium">
                      {dealData?.parentDealId?.platForm?.name || dealData?.platForm?.name}
                    </span>
                  </div>
                )}

                {/* Product Price */}
                {(dealData?.parentDealId?.actualPrice || dealData?.actualPrice) && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Product Price</span>
                    <span className="text-red-600 font-medium">
                      ₹{Number(dealData?.parentDealId?.actualPrice || dealData?.actualPrice).toFixed(0)}
                    </span>
                  </div>
                )}

                {/* Less Amount */}
                {(dealData?.parentDealId?.lessAmount || dealData?.lessAmount) && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Less Amount</span>
                    <span className="text-gray-800 font-medium">
                      ₹{Number(Number(dealData?.lessAmount) + Number(dealData?.adminCommission)).toFixed(0)}
                    </span>
                  </div>
                )}

                {/* Commission Amount */}
                {(Number(dealData?.finalCashBackForUser) > Number(dealData?.parentDealId?.actualPrice || dealData?.actualPrice)) && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Commission Amount</span>
                    <span className="text-green-600 font-medium">
                      ₹{Number(Number(dealData?.finalCashBackForUser) - Number(dealData?.parentDealId?.actualPrice || dealData?.actualPrice)).toFixed(0)}
                    </span>
                  </div>
                )}

                {/* Return Amount */}
                {dealData?.finalCashBackForUser && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Return Amount</span>
                    <span className="text-green-600 font-medium">
                      ₹{Number(dealData?.finalCashBackForUser).toFixed(0)}
                    </span>
                  </div>
                )}

                {/* Refund Period */}
                {dealData?.createdAt && dealData?.refundDays && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Refund Period</span>
                    <span className="text-gray-800 font-medium">
                      {dealData?.refundDays} days
                    </span>
                  </div>
                )}

                {/* Exchange Products */}
                {!isEmpty(dealData?.parentDealId?.exchangeDealProducts || dealData?.exchangeDealProducts) && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Exchange Product</span>
                    <span className="text-gray-800 font-medium">
                      {((dealData?.parentDealId?.exchangeDealProducts || dealData?.exchangeDealProducts) || []).map((itm: string) => `${itm}, `)}
                    </span>
                  </div>
                )}
              </div>

              {/* Terms and Conditions */}
              {(dealData?.parentDealId?.termsAndCondition || dealData?.termsAndCondition) && (
                <div className="mt-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">Deal Terms & Conditions</h2>
                  <p className="text-gray-600 text-sm">
                    {dealData?.parentDealId?.termsAndCondition || dealData?.termsAndCondition}
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button
                onClick={() => window.open(dealData?.parentDealId?.postUrl || dealData?.postUrl, '_blank')}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-medium 
                  hover:from-blue-700 hover:to-indigo-700 transition-colors duration-200"
              >
                Get This Deal
              </button>
              
              <Link 
                href={`/order-form/${dealData?._id}`}
                className="block w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 rounded-lg font-medium text-center
                  hover:from-green-700 hover:to-teal-700 transition-colors duration-200"
              >
                Fill Order Form
              </Link>
            </div>
          </FadeInSection>
        </div>
      )}
    </div>
  );
} 