'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { FadeInSection } from '@/components/transitions';
import GradientButton from '@/components/GradientButton';
import { useGenericQuery } from '@/hooks/useQuery';
import { showError } from '@/utils/helperFunctions';
import dayjs from 'dayjs';
import React from 'react';

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
  paymentStatus?: string;
  orderFormStatus?: string;
  orderIdOfPlatForm?: string;
  orderDate?: string;
  rejectReason?: string;
  orderScreenShot?: string;
  deliveredScreenShot?: string;
  reviewScreenShot?: string;
  sellerFeedback?: string;
  reviewLink?: string;
  reviewerName?: string;
}

interface OrderData {
  _id?:string;
  dealId: DealData;
  orderIdOfPlatForm?: string;
  orderFormStatus: string;
  orderDate?: string;
  paymentStatus?: string;
  refundDays?: number;
  reviewerName?: string;
  rejectReason?: string;
  exchangeDealProducts?: Array<string>;
  orderScreenShot?: string;
  deliveredScreenShot?: string;
  reviewScreenShot?: string;
  sellerFeedback?: string;
  finalCashBackForUser?: string;
  reviewLink?:string
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: OrderData;
}

export default function OrderDetailPage({ params }: any) {
  // Unwrap the params Promise using React.use()
  const unwrappedParams = React.use(params) as { orderId: string };
  const { orderId } = unwrappedParams;

  const router = useRouter();
  const [dealData, setDealData] = useState<DealData | null>(null);
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{ title: string; img: string } | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);

  // Fetch deal data using custom useQuery hook
  const { data, isLoading, error, refetch } = useGenericQuery<ApiResponse>(
    ['orderDetail', orderId || ''],
    `/user/order/getOrderById/${orderId || ''}`
  );

  useEffect(() => {
    if (data?.data) {
      setDealData(data?.data?.dealId);
      setOrderData(data?.data);
    } else if (error) {
      showError(error?.message || 'Failed to load deal details');
    }
  }, [data, error]);

  const handleViewImage = (title: string, img: string) => {
    setSelectedImage({ title, img });
    setIsImageModalOpen(true);
  };

  const handleCloseImageModal = () => {
    setIsImageModalOpen(false);
    setSelectedImage(null);
  };

  const handleFillReviewForm = () => {
    router.push(`/refund-form/${data?.data?._id}`);
  };

  const handleUpdateReviewForm = () => {
    router.push(`/refund-form/${data?.data?._id}`);
  };

  const handleUpdateOrderForm = () => {
    router.push(`/orderForm/${data?.data?._id}`);
  };

  const checkIsOrderAccepted = (status?: string) => {
    return status === 'accepted';
  };

  const checkIsReviewFormRejected = (status?: string) => {
    return status === 'reviewFormRejected';
  };

  const checkIsOrderFormRejected = (status?: string) => {
    return status === 'rejected';
  };

  // Function to check order status
  const checkOrderStatus = (status: string) => {
    switch (status) {
      case 'reviewFormSubmitted':
        return 'Review Submitted';
      case 'accepted':
        return 'Order Accepted';
      case 'rejected':
        return 'Order Rejected';
      case 'pending':
        return 'Order Pending';
      case 'reviewFormRejected':
        return 'Review Rejected';
      case 'reviewFormAccepted':
        return 'Review Accepted';
    }
  };

  const checkIsAnyFormRejected = (status?: string) => {
    return status === 'rejected' || status === 'reviewFormRejected';
  };
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  // Function to check if order is pending
  const checkIsOrderPending = (status: string) => {
    return status === "pending" || status === "reviewFormSubmitted";
  };

  const getStatusColor = (status: string) => {
    if (checkIsAnyFormRejected(status)) {
      return "text-red-600";
    } else if (checkIsOrderPending(status) || status === "reviewFormSubmitted") {
      return "text-yellow-600";
    } else {
      return "text-green-600";
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <FadeInSection>
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Header with Status Badge */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <button
                onClick={() => router.back()}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-2xl font-bold text-gray-800 ml-4">My Order Details</h1>
            </div>
            {orderData?.paymentStatus && (
              <div className={`px-4 py-2 rounded-full ${getStatusColor(orderData?.orderFormStatus)}`}>
                <span className="font-medium capitalize">{checkOrderStatus(orderData.orderFormStatus)}</span>
              </div>
            )}
          </div>

          {/* Product Card */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
            <div className="relative h-64 w-full bg-gray-50">
              {(orderData?.dealId?.parentDealId?.imageUrl || orderData?.dealId?.imageUrl) &&<Image
                unoptimized
                src={orderData?.dealId?.parentDealId?.imageUrl || orderData?.dealId?.imageUrl || ''}
                alt={orderData?.dealId?.parentDealId?.productName || orderData?.dealId?.productName || 'Product'}
                fill
                className="object-contain p-4"
              />}
            </div>
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                {orderData?.dealId?.parentDealId?.productName || orderData?.dealId?.productName}
              </h2>

              <div className="flex flex-wrap gap-2 mb-4">
                {(orderData?.dealId?.parentDealId?.brand?.name || orderData?.dealId?.brand?.name) && (
                  <div className="bg-blue-100 px-3 py-1 rounded-full">
                    <span className="text-sm font-medium text-blue-800">
                      {orderData?.dealId?.parentDealId?.brand?.name || orderData?.dealId?.brand?.name}
                    </span>
                  </div>
                )}
                {(orderData?.dealId?.parentDealId?.dealCategory?.name || orderData?.dealId?.dealCategory?.name) && (
                  <div className="bg-purple-100 px-3 py-1 rounded-full">
                    <span className="text-sm font-medium text-purple-800">
                      {orderData?.dealId?.parentDealId?.dealCategory?.name || orderData?.dealId?.dealCategory?.name}
                    </span>
                  </div>
                )}
                {(orderData?.dealId?.parentDealId?.platForm?.name || orderData?.dealId?.platForm?.name) && (
                  <div className="bg-green-100 px-3 py-1 rounded-full">
                    <span className="text-sm font-medium text-green-800">
                      {orderData?.dealId?.parentDealId?.platForm?.name || orderData?.dealId?.platForm?.name}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Return Amount</p>
                  <p className="text-xl font-bold text-green-600">₹{Number(orderData?.dealId?.finalCashBackForUser || 0).toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="text-sm font-medium text-gray-700">{orderData?.orderIdOfPlatForm || ''}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Details Card */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Order Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Order Status */}
              {orderData?.orderFormStatus && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Order Status</p>
                  <p className="font-medium capitalize text-blue-500">{checkOrderStatus(orderData.orderFormStatus)}</p>
                </div>
              )}

              {/* Order Date */}
              {orderData?.orderDate && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Order Date</p>
                  <p className="font-medium text-gray-500">{dayjs(orderData.orderDate).format('DD MMMM YYYY')}</p>
                </div>
              )}

              {/* Refund Period or Payment Status */}
              {orderData?.paymentStatus !== 'paid' ? (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Refund Period</p>
                  <p className="font-medium text-gray-500">{orderData?.dealId?.refundDays} days</p>
                </div>
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Payment Status</p>
                  <p className="font-medium capitalize text-gray-500">{orderData?.paymentStatus}</p>
                </div>
              )}

              {/* Profile Name */}
              {orderData?.reviewerName && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Profile Name</p>
                  <p className="font-medium text-gray-500">{orderData.reviewerName}</p>
                </div>
              )}
            </div>

            {/* Order Rejection Reason */}
            {orderData?.rejectReason && checkIsAnyFormRejected(orderData.orderFormStatus) && (
              <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-100">
                <p className="text-sm font-medium text-red-800 mb-1">Rejection Reason</p>
                <p className="text-red-600">{orderData.rejectReason}</p>
              </div>
            )}
          </div>

          {/* Pricing Details Card */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Pricing Details
            </h3>

            <div className="space-y-3">
              {/* Price */}
              {(orderData?.dealId?.parentDealId?.actualPrice || orderData?.dealId?.actualPrice) && (
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Price (MRP of Product)</span>
                  <span className="font-medium text-red-500">₹{Number(orderData?.dealId?.parentDealId?.actualPrice || orderData?.dealId?.actualPrice).toFixed(0)}</span>
                </div>
              )}

              {/* Commission Amount */}
              {(Number(orderData?.dealId?.finalCashBackForUser) > Number(dealData?.parentDealId?.actualPrice || dealData?.actualPrice)) && (
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Commission Amount</span>
                  <span className="font-medium text-green-500">₹{Number(Number(orderData?.dealId?.finalCashBackForUser) - Number(dealData?.parentDealId?.actualPrice || dealData?.actualPrice)).toFixed(0)}</span>
                </div>
              )}

              {/* Return Amount */}
              {orderData?.dealId?.finalCashBackForUser && (
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Return Amount</span>
                  <span className="font-medium text-green-500">₹{Number(orderData?.dealId?.finalCashBackForUser).toFixed(0)}</span>
                </div>
              )}

              {/* Exchange Product */}
              {orderData?.exchangeDealProducts && orderData?.exchangeDealProducts?.length > 0 && (
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Exchange Product</span>
                  <span className="font-medium">{orderData?.exchangeDealProducts?.map((product: string) => product).join(', ')}</span>
                </div>
              )}
            </div>
          </div>

          {/* Review Link */}
          {orderData?.reviewLink && (
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Review Link
              </h3>
              <a
                href={orderData.reviewLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-blue-500 hover:text-blue-700 transition-colors"
              >
                <span className="truncate">{orderData.reviewLink}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          )}

          {/* Terms and Condition */}
          {(dealData?.parentDealId?.termsAndCondition || dealData?.termsAndCondition) && (
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Deal Terms & Condition
              </h3>
              <p className="text-gray-600 text-sm bg-gray-50 p-4 rounded-lg">
                {dealData?.parentDealId?.termsAndCondition || dealData?.termsAndCondition}
              </p>
            </div>
          )}

          {/* Screenshots Section */}
          {(orderData?.orderScreenShot || orderData?.deliveredScreenShot || orderData?.reviewScreenShot || orderData?.sellerFeedback) && (
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Screenshots
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Order Screenshot */}
                {orderData?.orderScreenShot && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-gray-800">Order Screenshot</h4>
                      <button
                        onClick={() => handleViewImage('Order Screenshot', orderData.orderScreenShot!)}
                        className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm"
                      >
                        View
                      </button>
                    </div>
                    <div className="relative h-32 w-full bg-white rounded overflow-hidden">
                      <Image
                        src={orderData?.orderScreenShot || ''}
                        alt="Order Screenshot"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                )}

                {/* Delivered Screenshot */}
                {orderData?.deliveredScreenShot && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-gray-800">Delivered Screenshot</h4>
                      <button
                        onClick={() => handleViewImage('Delivered Screenshot', orderData.deliveredScreenShot!)}
                        className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm"
                      >
                        View
                      </button>
                    </div>
                    <div className="relative h-32 w-full bg-white rounded overflow-hidden">
                      <Image
                        src={orderData?.deliveredScreenShot || ''}
                        alt="Delivered Screenshot"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                )}

                {/* Review Screenshot */}
                {orderData?.reviewScreenShot && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-gray-800">Review Screenshot</h4>
                      <button
                        onClick={() => handleViewImage('Review Screenshot', orderData.reviewScreenShot!)}
                        className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm"
                      >
                        View
                      </button>
                    </div>
                    <div className="relative h-32 w-full bg-white rounded overflow-hidden">
                      <Image
                        src={orderData?.reviewScreenShot || ''}
                        alt="Review Screenshot"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                )}

                {/* Seller Feedback Screenshot */}
                {orderData?.sellerFeedback && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-gray-800">Seller Feedback Screenshot</h4>
                      <button
                        onClick={() => handleViewImage('Seller Feedback Screenshot', orderData.sellerFeedback!)}
                        className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm"
                      >
                        View
                      </button>
                    </div>
                    <div className="relative h-32 w-full bg-white rounded overflow-hidden">
                      <Image
                        src={orderData?.sellerFeedback || ''}
                        alt="Seller Feedback Screenshot"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-4">
            {(checkIsOrderAccepted(orderData?.orderFormStatus) || checkIsReviewFormRejected(orderData?.orderFormStatus)) && (
              <GradientButton
                onClick={checkIsReviewFormRejected(orderData?.orderFormStatus) ? handleUpdateReviewForm : handleFillReviewForm}
                className="w-full"
              >
                {checkIsReviewFormRejected(orderData?.orderFormStatus) ? 'Update Review Form' : 'Fill Review Form'}
              </GradientButton>
            )}

            {checkIsOrderFormRejected(orderData?.orderFormStatus) && (
              <GradientButton
                onClick={handleUpdateOrderForm}
                className="w-full"
              >
                Update Order Form
              </GradientButton>
            )}
          </div>
        </div>
      </FadeInSection>

      {/* Image Modal */}
      {isImageModalOpen && selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-4 max-w-4xl w-full mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">{selectedImage.title}</h3>
              <button
                onClick={handleCloseImageModal}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="relative h-96 w-full bg-gray-50 rounded-lg overflow-hidden">
              {isImageLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                </div>
              )}
              <Image
                src={selectedImage.img}
                alt={selectedImage.title}
                fill
                className="object-contain"
                onLoadStart={() => setIsImageLoading(true)}
                onLoad={() => setIsImageLoading(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 