"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import usePostData from "@/hooks/usePostData";
import { showError } from "@/utils/helperFunctions";

interface INotification {
  _id: string;
  title: string;
  body: string;
  type: string;
  createdAt: string;
}

export default function NotificationIcon() {
  const router = useRouter();
  const [unreadCount, setUnreadCount] = useState(0);

  const { mutate: getUnreadCount } = usePostData(
    "/commonApi/getUnreadNotificationCount",
    {
      onSuccess: async ({ data }: any) => {
        setUnreadCount(data?.count || 0);
      },
      onError: async (error: any) => {
        showError(error?.message || "Failed to fetch notification count");
      },
    }
  );

  useEffect(() => {
    getUnreadCount({});
    // Refresh count every 30 seconds
    const interval = setInterval(() => {
      getUnreadCount({});
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <button
      onClick={() => router.push("/notifications")}
      className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-gray-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        />
      </svg>
      {unreadCount > 0 && (
        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
          {unreadCount}
        </span>
      )}
    </button>
  );
} 