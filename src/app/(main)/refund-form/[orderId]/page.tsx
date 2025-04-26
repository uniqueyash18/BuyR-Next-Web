"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import * as Yup from 'yup';
import { useGenericQuery } from '@/hooks/useQuery';
import usePostData from '@/hooks/usePostData';
import { showError, showSuccess } from '@/utils/helperFunctions';
import { FadeInSection } from '@/components/transitions';
import { CustomForm } from '@/components/CustomForm';
import type { Field } from '@/components/CustomForm/types';

// API endpoints
const SUBMIT_REVIEW_FORM = '/user/order/reviewFormSubmit';
const UPDATE_ORDER = '/user/order/update';

interface RefundFormData {
  profileName: string;
  orderId: string;
  deliveredScreenshot: string;
  reviewScreenshot: string;
  sellerFeedback: string;
  reviewLink: string;
  paymentId: string;
}

interface OrderData {
  _id: string;
  reviewerName?: string;
  orderIdOfPlatForm?: string;
  deliveredScreenShot?: string;
  reviewScreenShot?: string;
  sellerFeedback?: string;
  reviewLink?: string;
  paymentId?: string;
  orderFormStatus?: string;
  dealId?: {
    _id?: string;
  };
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: OrderData;
}

export default function RefundFormPage({ params }: { params: { orderId: string } }) {
  const router = useRouter();
  const [resetKey, setResetKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Get orderId directly from params
  const { orderId } = params;

  // Fetch order data
  const { data: orderData, isLoading: isOrderLoading } = useGenericQuery<ApiResponse>(
    ['orderDetail', orderId],
    `/user/order/getOrderById/${orderId}`
  );

  // Check if review form is rejected
  const isReviewFormRejected = (status?: string) => {
    return status === 'review_rejected';
  };

  // Submit review form mutation
  const { mutate: submitReviewForm } = usePostData<ApiResponse, Error, any>(
    isReviewFormRejected(orderData?.data?.orderFormStatus) 
      ? UPDATE_ORDER
      : SUBMIT_REVIEW_FORM,
    {
      onSuccess: (data) => {
        setIsLoading(false);
        showSuccess(data?.message || 'Form submitted successfully');
        router.push('/orders');
      },
      onError: (error) => {
        setIsLoading(false);
        showError(error?.message || 'Failed to submit form');
      },
    }
  );

  // Form validation schema
  const validationSchema = Yup.object().shape({
    profileName: Yup.string().required('Name is required'),
    orderId: Yup.string().required('Order ID is required'),
    deliveredScreenshot: Yup.string().required('Delivered Screenshot is required'),
    reviewScreenshot: Yup.string().required('Review/Rating Screenshot is required'),
    reviewLink: Yup.string().required('Review/Rating Link is required'),
    paymentId: Yup.string().required('Paytm/ Gpay/ upi Id is required'),
  });

  // Form fields
  const fields: Field[] = [
    {
      name: 'profileName',
      label: 'Profile name/ Reviewer name',
      type: 'text',
      initialValue: orderData?.data?.reviewerName || '',
      isEditable: true,
    },
    {
      name: 'orderId',
      label: 'Order Id',
      type: 'text',
      initialValue: orderData?.data?.orderIdOfPlatForm || '',
      isEditable: true,
    },
    {
      name: 'deliveredScreenshot',
      label: 'Delivered Screenshot',
      type: 'image',
      initialValue: orderData?.data?.deliveredScreenShot || '',
      subHeading: 'Image must be below 4 mb and in jpg/png format',
    },
    {
      name: 'reviewScreenshot',
      label: 'Review/Rating Screenshot',
      type: 'image',
      initialValue: orderData?.data?.reviewScreenShot || '',
      subHeading: 'Image must be below 4 mb and in jpg/png format',
    },
    {
      name: 'sellerFeedback',
      label: 'Seller Feedback Screenshot',
      type: 'image',
      initialValue: orderData?.data?.sellerFeedback || '',
      subHeading: 'Image must be below 4 mb and in jpg/png format',
    },
    {
      name: 'reviewLink',
      label: 'Review/Rating Link',
      type: 'text',
      initialValue: orderData?.data?.reviewLink || '',
      isEditable: true,
    },
    {
      name: 'paymentId',
      label: 'Paytm/ Gpay/ upi Id',
      type: 'text',
      initialValue: orderData?.data?.paymentId || '',
      isEditable: true,
    },
  ];

  // Handle form submission
  const handleSubmit = (values: { [key: string]: any }) => {
    setIsLoading(true);
    // Prepare the data to be sent to the API
    const formData = {
      orderId: orderId, // Include the orderId in the request body
      reviewLink: values.reviewLink,
      deliveredScreenShot: values.deliveredScreenshot,
      reviewScreenShot: values.reviewScreenshot,
      sellerFeedback: values.sellerFeedback,
      paymentId: values.paymentId,
      reviewerName: values.profileName,
      orderIdOfPlatForm: values.orderId,
    };

    // Submit the form data
    submitReviewForm(formData);
  };

  // Handle form reset
  const handleReset = () => {
    setResetKey(prevKey => prevKey + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <FadeInSection>
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Header */}
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
              <h1 className="text-2xl font-bold text-gray-800 ml-4">Refund Form</h1>
            </div>
          </div>

          {isOrderLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <CustomForm
                key={resetKey}
                fields={fields}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              />
              
              <div className="flex justify-center mt-4">
                <button
                  onClick={handleReset}
                  className="text-red-600 hover:text-red-800 font-medium"
                >
                  Reset
                </button>
              </div>
            </div>
          )}
        </div>
      </FadeInSection>
    </div>
  );
} 