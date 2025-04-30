"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FadeInSection } from "@/components/transitions";
import Image from "next/image";
import usePostData from "@/hooks/usePostData";
import { showError } from "@/utils/helperFunctions";
import dayjs from "dayjs";
import NoDataFound from "@/components/NoDataFound";

interface INotification {
    _id: string;
    userId: string;
    adminId?: string;
    dealId?: any;
    orderId?: IOrder;
    brandId?: any;
    title: string;
    body: string;
    type: "order" | "deal" | "orderFormUpdate" | "newBrandDealCreated";
    createdAt: string;
    updatedAt: string;
    __v?: number;
}

interface IOrder {
    _id: string;
    userId: string;
    dealId: any;
    dealOwner: string;
    reviewerName: string;
    orderIdOfPlatForm: string;
    orderScreenShot: string;
    exchangeDealProducts: any[];
    paymentStatus: string;
    orderFormStatus: string;
}

export default function NotificationsPage() {
    const router = useRouter();
    const [state, setState] = useState({
        currentPage: 0,
        allNotification: [] as INotification[],
        loadMore: true,
        isLoading: true,
        loadMoreLoading: false,
        isRefreshing: false,
    });

    const { currentPage, allNotification, loadMore, isLoading, isRefreshing, loadMoreLoading } = state;
    const updateState = (data: any) => setState(state => ({ ...state, ...data }));

    const { mutate: getAllNotification } = usePostData(
        "/commonApi/getAllNotifications",
        {
            onSuccess: async ( data : any) => {
                updateState({
                    allNotification: currentPage === 0 ? data?.data : [...allNotification, ...data?.data],
                    isLoading: false,
                    currentPage: data?.data?.length >= 10 ? currentPage + 1 : 0,
                    loadMore: !data?.data || data?.data.length < 10 ? false : true,
                    loadMoreLoading: false,
                });
            },
            onError: async (error: any) => {
                updateState({ isLoading: false, loadMoreLoading: false });
                showError(error?.message || "Failed to fetch notifications");
            },
        }
    );

    useEffect(() => {
        getAllNotification({ offset: currentPage * 10, limit: 10 });
    }, []);

    const onPressNotification = (item: INotification) => {
        switch (item?.type) {
            case "order":
                router.push(`/orders/${item?.orderId?._id}`);
                break;
            case "deal":
                router.push(`/deal/${item?.dealId}`);
                break;
            case "newBrandDealCreated":
                router.push(`/deals/brand/${item?.brandId}`);
                break;
        }
    };

    const handleRefresh = () => {
        updateState({ isRefreshing: true });
        getAllNotification({ offset: 0, limit: 10 });
    };

    const handleLoadMore = () => {
        if (loadMore) {
            updateState({ loadMoreLoading: true });
            getAllNotification({ offset: currentPage * 10, limit: 10 });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-indigo-50 pt-4 pb-16">
            <div className="max-w-4xl mx-auto px-4">
                <FadeInSection delay={0.1}>
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => router.back()}
                                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
                            </div>
                            <button
                                onClick={handleRefresh}
                                disabled={isRefreshing}
                                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={`h-5 w-5 text-gray-600 ${isRefreshing ? 'animate-spin' : ''}`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            </button>
                        </div>

                        <div className="divide-y divide-gray-100">
                            {isLoading && allNotification.length === 0 ? (
                                <div className="p-8 text-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                </div>
                            ) : allNotification.length === 0 ? (
                                <NoDataFound />
                            ) : (
                                allNotification.map((item, index) => (
                                    <FadeInSection key={item._id+index} delay={0.1}>
                                        <button
                                            onClick={() => onPressNotification(item)}
                                            className="w-full p-4 hover:bg-gray-50 transition-colors text-left group"
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="relative w-12 h-12 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100 group-hover:bg-gray-200 transition-colors">
                                                    <Image
                                                        src="/images/logo.png"
                                                        alt="Notification"
                                                        fill
                                                        className="object-contain p-2"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-gray-800 font-medium line-clamp-2 group-hover:text-blue-600 transition-colors">
                                                        {item.title}
                                                    </h3>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        {dayjs(item.createdAt).format("DD MMM YYYY hh:mm A")}
                                                    </p>
                                                </div>
                                                <div className="flex-shrink-0">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </button>
                                    </FadeInSection>
                                ))
                            )}
                        </div>

                        {loadMore && !loadMoreLoading && (
                            <div className="p-4 text-center border-t border-gray-100">
                                <button
                                    onClick={handleLoadMore}
                                    disabled={loadMoreLoading}
                                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loadMoreLoading ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Loading...
                                        </>
                                    ) : (
                                        <>
                                            Load More
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </FadeInSection>
            </div>
        </div>
    );
} 