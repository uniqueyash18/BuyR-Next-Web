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
        isRefreshing: false
    });

    const { currentPage, allNotification, loadMore, isLoading, isRefreshing } = state;
    const updateState = (data: any) => setState(state => ({ ...state, ...data }));

    const { mutate: getAllNotification } = usePostData(
        "/commonApi/getAllNotifications",
        {
            onSuccess: async (data: any) => {
                updateState({
                    allNotification: currentPage === 0 ? data?.data : [...allNotification, ...data?.data],
                    isLoading: false,
                    currentPage: data?.data?.length >= 10 ? currentPage + 1 : 0,
                    loadMore: !data?.data || data?.data.length < 10 ? false : true,
                });
            },
            onError: async (error: any) => {
                updateState({ isLoading: false });
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
                router.push(`/deal/${item?.dealId?.parentDealId?._id || item?.dealId?._id}`);
                break;
            case "newBrandDealCreated":
                router.push(`/deals/brand/${item?.brandId?._id}`);
                break;
        }
    };

    const handleLoadMore = () => {
        if (loadMore) {
            updateState({ isLoading: true });
            getAllNotification({ offset: currentPage * 10, limit: 10 });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-indigo-50 pt-4 pb-16">
            <div className="max-w-4xl mx-auto px-4">
                <FadeInSection delay={0.1}>
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                        <div className="p-5 border-b border-gray-100 flex items-center">
                            <button
                                onClick={() => router.back()}
                                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <h1 className="text-2xl font-bold text-gray-800 ml-4">Notifications</h1>
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
                                    <FadeInSection key={item._id + index} delay={0.1 * index}>
                                        <button
                                            onClick={() => onPressNotification(item)}
                                            className="w-full p-4 hover:bg-gray-50 transition-colors text-left"
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="relative w-10 h-10 flex-shrink-0">
                                                    <Image
                                                        src="/images/logo.png"
                                                        alt="Notification"
                                                        fill
                                                        className="object-contain"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-gray-800 font-medium line-clamp-2">
                                                        {item.title}
                                                    </h3>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        {dayjs(item.createdAt).format("DD MMM YYYY hh:mm A")}
                                                    </p>
                                                </div>
                                            </div>
                                        </button>
                                    </FadeInSection>
                                ))
                            )}
                        </div>

                        {loadMore && (
                            <div className="p-4 text-center">
                                <button
                                    onClick={handleLoadMore}
                                    disabled={isLoading}
                                    className="text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50"
                                >
                                    {isLoading ? "Loading..." : "Load More"}
                                </button>
                            </div>
                        )}
                    </div>
                </FadeInSection>
            </div>
        </div>
    );
} 