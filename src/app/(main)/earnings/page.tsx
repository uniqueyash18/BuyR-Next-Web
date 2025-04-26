"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FadeInSection } from '@/components/transitions';
import imagePath from '@/constants/imagePath';
import { useGenericQuery } from '@/hooks/useQuery';
import { isEmpty } from 'lodash';

interface NavigationItem {
  title: string;
  screen: string;
  image: string;
  subtitle: string;
}

interface UserEarningResponse {
  totalCashback: number;
  message: string;
  status: number;
}

export default function EarningsPage() {
  const router = useRouter();
  const [state, setState] = useState({
    totalEaring: 0,
  });

  const { data, isPending, isError, refetch } = useGenericQuery<UserEarningResponse>(
    ["userEarning"],
    "/user/order/userEarning"
  );

  useEffect(() => {
    if (!isEmpty(data)) {
      console.log(data,'datadata')
      setState({ totalEaring: data?.totalCashback || 0 });
    }
  }, [data]);

  const navigationItems: NavigationItem[] = [
    {
      title: 'Order Details',
      screen: '/orders',
      image: imagePath.orderDetails,
      subtitle: 'View your order history and details',
    },
    {
      title: 'Wallet',
      screen: '/transactions',
      image: imagePath.walletNew,
      subtitle: 'View your wallet balance and transactions',
    },
    {
      title: 'Get help',
      screen: '/contact',
      image: imagePath.help,
      subtitle: 'Contact us for any assistance',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <FadeInSection>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">My Earnings</h1>
            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl">
              <div>
                <p className="text-sm text-gray-600">Total Earnings</p>
                {isPending ? (
                  <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  <p className="text-3xl font-bold text-purple-600">₹{state.totalEaring.toFixed(2)}</p>
                )}
              </div>
              <Image
                src={imagePath.walletNew}
                alt="Wallet"
                width={48}
                height={48}
                className="text-purple-600"
              />
            </div>
          </div>

          <div className="grid gap-4">
            {navigationItems.map((item, index) => (
              <button
                key={index}
                onClick={() => router.push(item.screen)}
                className="w-full bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow flex items-center justify-between"
              >
                <div className="flex items-center space-x-4">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={24}
                    height={24}
                    className="text-gray-600"
                  />
                  <div className="text-left">
                    <h3 className="font-medium text-gray-800">{item.title}</h3>
                    <p className="text-sm text-gray-500">{item.subtitle}</p>
                  </div>
                </div>
                <Image
                  src={imagePath.downArrow}
                  alt="Navigate"
                  width={24}
                  height={24}
                  className="text-gray-400"
                />
              </button>
            ))}
          </div>
        </div>
      </FadeInSection>
    </div>
  );
} 