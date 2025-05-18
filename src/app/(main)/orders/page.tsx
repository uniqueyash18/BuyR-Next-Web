"use client";

import { AnimatedGrid, FadeInSection } from "@/components/transitions";
import usePostData from "@/hooks/usePostData";
import { AppDispatch } from "@/redux/store";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

// Extend dayjs with plugins
dayjs.extend(utc);
dayjs.extend(timezone);

// Define order interface based on the React Native code
interface Order {
  _id: string;
  orderDate: string;
  orderFormStatus: string;
  paymentStatus: string;
  dealId: {
    _id: string;
    productName: string;
    actualPrice: number;
    imageUrl?: string;
    brand?: {
      image?: string;
    };
    finalCashBackForUser?: number;
    parentDealId?: {
      productName?: string;
      actualPrice?: number;
      imageUrl?: string;
      brand?: {
        image?: string;
      };
    };
  };
  image?: string;
  name?: string;
  productName?: string;
  orderPrice?: number;
  lessAmount?: number;
}

// Define filter types
type FilterType = 'brand' | 'category' | 'platform';

export default function OrdersPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [activeFilterType, setActiveFilterType] = useState<FilterType>('brand');

  // Filter states
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<any>(null);
  const [selectedPlatformFilter, setSelectedPlatformFilter] = useState<any>(null);
  const [selectedBrandFilter, setSelectedBrandFilter] = useState<any>(null);

  // Filter options
  const [categoryFilter, setCategoryFilter] = useState<any[]>([]);
  const [platformFilter, setPlatformFilter] = useState<any[]>([]);
  const [brandFilter, setBrandFilter] = useState<any[]>([]);

  // Use the post data hook for fetching orders
  const {
    mutate: fetchOrders,
    data: orderData,
    isLoading: isOrdersLoading,
    isPending: isFetching
  } = usePostData<any, Error, any>('/user/order/getOrderList', {
    onSuccess: (data) => {
      // Update filter options when data is loaded
      if (data?.relatedData) {
        setCategoryFilter(data?.relatedData?.categories || []);
        setPlatformFilter(data?.relatedData?.platforms || []);
        setBrandFilter(data?.relatedData?.brands || []);
      }
    }
  });
  // State to accumulate orders
  const [accumulatedOrders, setAccumulatedOrders] = useState<Order[]>([]);

  // Fetch orders when component mounts or filters change
  useEffect(() => {
    // Reset accumulated orders when filters change
    if (currentPage === 1) {
      setAccumulatedOrders([]);
    }

    fetchOrders({
      selectedCategoryFilter: selectedCategoryFilter?._id ? [selectedCategoryFilter?._id] : null,
      selectedPlatformFilter: selectedPlatformFilter?._id ? [selectedPlatformFilter?._id] : null,
      selectedBrandFilter: selectedBrandFilter?._id ? [selectedBrandFilter?._id] : null,
      selectedDate: selectedDate ? dayjs(selectedDate).format('YYYY-MM-DD') : null,
      offset: (currentPage - 1) * 10,
      limit: 10,
    });
  }, [currentPage, selectedCategoryFilter, selectedPlatformFilter, selectedBrandFilter, selectedDate]);

  // Update accumulated orders when new data arrives
  useEffect(() => {
    if (orderData?.orders) {
      if (currentPage === 1) {
        setAccumulatedOrders(orderData?.orders);
      } else {
        setAccumulatedOrders(prev => [...prev, ...orderData?.orders]);
      }
    }
  }, [orderData, currentPage]);

  const hasNextPage = orderData?.orders?.length === 10 ? true : false;

  // Handle load more
  const handleLoadMore = () => {
    if (hasNextPage && !isFetching) {
      setCurrentPage(prev => prev + 1);
      // No need to explicitly fetch here as the useEffect will handle it
    }
  };

  // Function to handle date selection
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setIsDateModalOpen(false);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Function to handle filter application
  const applyFilter = () => {
    setIsFilterModalOpen(false);
    setCurrentPage(1); // Reset to first page when filter changes
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

  // Function to check if order is pending
  const checkIsOrderPending = (status: string) => {
    return status === "pending" || status === "reviewFormSubmitted";
  };

  // Function to check if any form is rejected
  const checkIsAnyFormRejected = (status: string) => {
    return status === "rejected" || status === "reviewFormRejected";
  };

  // Function to get status color
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
    <div className="min-h-screen bg-gray-50 pt-4 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <FadeInSection delay={0.1}>
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">My Orders</h1>
          </div>
        </FadeInSection>

        {/* Filters */}
        <FadeInSection delay={0.2}>
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              {/* Filter Button */}
              <button
                onClick={() => setIsFilterModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700 font-medium">Filter</span>
              </button>

              {/* Date Filter */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsDateModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700 font-medium">
                    {selectedDate ? dayjs(selectedDate).format('DD-MM-YYYY') : 'Select Date'}
                  </span>
                </button>

                {selectedDate && (
                  <button
                    onClick={() => {
                      setSelectedDate(null);
                      setCurrentPage(1); // Reset to first page when filter changes
                    }}
                    className="p-2 text-gray-500 hover:text-gray-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        </FadeInSection>

        {/* Orders List */}
        <AnimatedGrid className="space-y-4">
          {isOrdersLoading && currentPage === 1 ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
            </div>
          ) : accumulatedOrders.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <p className="text-gray-500">No orders found</p>
            </div>
          ) : (
            accumulatedOrders.map((order: Order, index: number) => (
              <FadeInSection key={order._id} delay={0.1 + index * 0.05}>
                <div
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
                  onClick={() => router.push(`/orders/${order._id}?dealId=${order.dealId._id}`)}
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Product Image */}
                    <div className="relative w-full md:w-32 h-32 md:h-auto">
                      <Image
                        src={order.dealId?.parentDealId?.imageUrl || order.dealId?.parentDealId?.brand?.image || order.dealId?.imageUrl || order.dealId?.brand?.image || '/images/placeholder.jpg'}
                        alt={order.dealId?.parentDealId?.productName || order.dealId?.productName || 'Product'}
                        fill
                        className="object-contain"
                      />
                    </div>

                    {/* Order Details */}
                    <div className="flex-1 p-4">
                      <div className="flex flex-col md:flex-row justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {order.dealId?.parentDealId?.productName || order.dealId?.productName}
                        </h3>
                        <span className="text-sm text-gray-500">
                          {dayjs(order.orderDate).format('DD MMMM YYYY')}
                        </span>
                      </div>

                      <div className="flex flex-col md:flex-row justify-between mb-2">
                        <div className="text-gray-600">
                          Price: ₹{order?.orderPrice|| order.dealId?.parentDealId?.actualPrice || order.dealId?.actualPrice}
                        </div>
                        <div className="text-gray-600">
                          Refund: ₹{ order?.orderPrice && order?.lessAmount ? Number(order?.orderPrice) - Number(order?.lessAmount) :  order.dealId?.finalCashBackForUser}
                        </div>
                      </div>

                      <div className={`font-medium ${getStatusColor(order.orderFormStatus)}`}>
                        Order Status: {order.paymentStatus === 'paid' ? 'Payment Paid' : checkOrderStatus(order.orderFormStatus)}
                      </div>

                      <div className="mt-3 flex justify-end">
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeInSection>
            ))
          )}
        </AnimatedGrid>

        {/* Load More Button */}
        {hasNextPage && !isOrdersLoading && (
          <div className="flex justify-center my-6">
            <button
              onClick={handleLoadMore}
              disabled={isFetching}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Load More Orders
            </button>
          </div>
        )}

        {/* Date Picker Modal */}
        {isDateModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Select Date</h3>
              <input
                type="date"
                className="w-full p-2 border border-gray-300 rounded-lg mb-4 text-gray-800 placeholder:text-gray-400"
                max={dayjs().format('YYYY-MM-DD')}
                onChange={(e) => {
                  if (e.target.value) {
                    handleDateSelect(new Date(e.target.value));
                  }
                }}
              />
              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 text-gray-800"
                  onClick={() => setIsDateModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  onClick={() => {
                    if (selectedDate) {
                      handleDateSelect(selectedDate);
                    }
                  }}
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Filter Modal */}
        {isFilterModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Select Options</h3>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setIsFilterModalOpen(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex flex-1 overflow-hidden">
                {/* Filter Types */}
                <div className="w-1/3 bg-gray-100 overflow-y-auto">
                  {['brand', 'category', 'platform'].map((type) => (
                    <button
                      key={type}
                      className={`w-full text-left px-4 py-3 border-l-4 ${activeFilterType === type
                          ? 'border-blue-600 bg-white'
                          : 'border-transparent'
                        }`}
                      onClick={() => setActiveFilterType(type as FilterType)}
                    >
                      <span className="font-medium capitalize text-gray-800">
                        {type === 'brand' ? 'Brand' : type === 'category' ? 'Category' : 'Platform'}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Filter Options */}
                <div className="w-2/3 bg-white p-4 overflow-y-auto">
                  <h4 className="font-medium mb-3 capitalize text-gray-800">
                    {activeFilterType === 'brand'
                      ? 'Select the Deal Brand'
                      : activeFilterType === 'category'
                        ? 'Select the Type of Deal'
                        : 'Select the Deal Platform'}
                  </h4>

                  <div className="space-y-2">
                    {activeFilterType === 'brand' && brandFilter.map((item) => (
                      <div
                        key={item._id}
                        className={`flex justify-between items-center p-3 border rounded-lg cursor-pointer ${selectedBrandFilter?._id === item._id
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                          }`}
                        onClick={() => setSelectedBrandFilter(
                          selectedBrandFilter?._id === item._id ? null : item
                        )}
                      >
                        <span className="text-gray-800" >{item.name}</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className={`h-5 w-5 ${selectedBrandFilter?._id === item._id
                              ? 'text-blue-600'
                              : 'text-gray-400'
                            }`}
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    ))}

                    {activeFilterType === 'category' && categoryFilter.map((item) => (
                      <div
                        key={item._id}
                        className={`flex justify-between items-center p-3 border rounded-lg cursor-pointer ${selectedCategoryFilter?._id === item._id
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                          }`}
                        onClick={() => setSelectedCategoryFilter(
                          selectedCategoryFilter?._id === item._id ? null : item
                        )}
                      >
                        <span className="text-gray-800">{item.name}</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className={`h-5 w-5 ${selectedCategoryFilter?._id === item._id
                              ? 'text-blue-600'
                              : 'text-gray-400'
                            }`}
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    ))}

                    {activeFilterType === 'platform' && platformFilter.map((item) => (
                      <div
                        key={item._id}
                        className={`flex justify-between items-center p-3 border rounded-lg cursor-pointer ${selectedPlatformFilter?._id === item._id
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                          }`}
                        onClick={() => setSelectedPlatformFilter(
                          selectedPlatformFilter?._id === item._id ? null : item
                        )}
                      >
                        <span className="text-gray-800">{item.name}</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className={`h-5 w-5 ${selectedPlatformFilter?._id === item._id
                              ? 'text-blue-600'
                              : 'text-gray-400'
                            }`}
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <button
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-colors duration-200"
                  onClick={applyFilter}
                >
                  Apply Filter
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 