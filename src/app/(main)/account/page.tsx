"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FadeInSection, AnimatedGrid } from "@/components/transitions";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { onLogOut } from "@/redux/actions/auth";

// Define the account list item type
interface AccountListItem {
  id: number;
  title: string;
  onPress: () => void;
  leftIcon: string;
  topTitle?: string;
}

export default function AccountPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(false);
  
  // Get user data from Redux store
  const userData = useSelector((state: RootState) => state.user.user) || {
    name: "John Doe",
    email: "john@example.com",
    avatar: "/images/avatar-placeholder.svg"
  };

  // Mock logout function - replace with actual API call
  const handleLogout = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      dispatch(onLogOut());
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Define account menu items
  const listItems: AccountListItem[] = [
    {
      id: 1,
      title: "My Profile",
      onPress: () => router.push("/profile"),
      leftIcon: "/images/profile.svg",
      topTitle: "My Account"
    },
    {
      id: 2,
      title: "My Earnings",
      onPress: () => router.push("/earnings"),
      leftIcon: "/images/wallet.svg",
    },
    {
      id: 3,
      title: "Contact Us",
      onPress: () => router.push("/contact"),
      leftIcon: "/images/contact.svg",
      topTitle: "General"
    },
    {
      id: 4,
      title: "Join As Mediator",
      onPress: () => {
        if (window.confirm("Wanna Join Us As A Mediator?")) {
          window.open("https://wa.me/1234567890", "_blank");
        }
      },
      leftIcon: "/images/link.svg",
    },
    {
      id: 5,
      title: "Tutorial",
      onPress: () => router.push("/tutorial"),
      leftIcon: "/images/tutorial.svg",
    },
    {
      id: 6,
      title: "About",
      onPress: () => router.push("/about"),
      leftIcon: "/images/about.svg",
    },
    {
      id: 7,
      title: "Terms & Conditions",
      onPress: () => router.push("/terms"),
      leftIcon: "/images/terms.svg",
    },
    {
      id: 8,
      title: "Logout",
      onPress: () => {
        if (window.confirm("Are you sure you want to log out?")) {
          handleLogout();
        }
      },
      leftIcon: "/images/logout.svg",
    },
  ];

  // Group items by topTitle
  const groupedItems = listItems.reduce((acc, item) => {
    const group = item.topTitle || "Other";
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(item);
    return acc;
  }, {} as Record<string, AccountListItem[]>);

  return (
    <div className="min-h-screen bg-gray-50 pt-4 pb-16">
      <div className="max-w-3xl mx-auto px-4">
        {/* User Profile Header */}
        <FadeInSection delay={0.1}>
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6 flex items-center">
            <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4 bg-gray-100">
              <Image
                src={userData.avatar || "/images/avatar-placeholder.svg"}
                alt="Profile"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">{userData.name}</h2>
              <p className="text-gray-500">{userData.email}</p>
            </div>
          </div>
        </FadeInSection>

        {/* Account Menu Items */}
        <AnimatedGrid className="space-y-6">
          {Object.entries(groupedItems).map(([group, items], groupIndex) => (
            <FadeInSection key={group} delay={0.1 + groupIndex * 0.05}>
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {group !== "Other" && (
                  <div className="px-6 py-3 bg-gray-50 border-b border-gray-100">
                    <h3 className="text-sm font-medium text-gray-500">{group}</h3>
                  </div>
                )}
                <div className="divide-y divide-gray-100">
                  {items.map((item) => (
                    <button
                      key={item.id}
                      onClick={item.onPress}
                      className="w-full flex items-center px-6 py-4 hover:bg-gray-50 transition-colors duration-150"
                    >
                      <div className="relative w-6 h-6 mr-4">
                        <Image
                          src={item.leftIcon}
                          alt={item.title}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <span className="text-gray-700 font-medium">{item.title}</span>
                      <div className="ml-auto">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </FadeInSection>
          ))}
        </AnimatedGrid>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 flex flex-col items-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-700">Logging out...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
