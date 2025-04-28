"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface DealCardProps {
  item: {
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
    };
  };
  index: number;
}

export default function DealCard({ item, index }: DealCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  const imageUrl = item?.parentDealId?.imageUrl ||
    item?.parentDealId?.brand?.image ||
    item?.imageUrl ||
    item?.brand?.image;

  const categoryName = item?.parentDealId?.dealCategory?.name ||
    item?.dealCategory?.name;

  const platformName = item?.parentDealId?.platForm?.name ||
    item?.platForm?.name;

  const productName = item?.parentDealId?.productName ||
    item?.productName;

  const actualPrice = item?.parentDealId?.actualPrice ||
    item?.actualPrice;

  const handleViewDeal = () => {
    router.push(`/deal/${item._id}`);
  };

  return (
    <motion.div
      className="w-full sm:w-64 rounded-xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
      whileHover={{ y: -5 }}
    >
      {/* Card Header with Image */}
      <div className="relative">
        <div className="relative h-40 w-full bg-gradient-to-br bg-white-50 bg-white-100">
          {!!imageUrl ? <Image
            unoptimized
            src={imageUrl}
            alt={productName || "Product"}
            fill
            className="object-contain p-3"
          /> :
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          }
        </div>
        {/* Category Badge */}
        <div className="absolute top-3 left-3 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-medium shadow-sm">
          {categoryName}
        </div>

        {/* Platform Badge */}
        <div className="absolute top-3 right-3 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-medium shadow-sm">
          {platformName}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4">
        <h3 className="font-semibold text-sm capitalize mb-2 line-clamp-2 min-h-[2.5rem] text-black">
          {productName}
        </h3>

        <div className="flex items-center justify-between mb-3">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">Price</span>
            <span className="text-red-500 font-bold">
              ₹{Number(actualPrice).toFixed(0)}
            </span>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-xs text-gray-500">Refund</span>
            <span className="text-green-500 font-bold">
              ₹{Number(item.finalCashBackForUser).toFixed(0)}
            </span>
          </div>
        </div>
        <button 
          onClick={handleViewDeal}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2 rounded-lg text-sm font-medium transition-all duration-300 shadow-sm hover:shadow-md"
        >
          View Deal
        </button>
      </div>
    </motion.div>
  );
} 