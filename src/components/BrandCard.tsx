"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface BrandCardProps {
  item: {
    _id: string;
    name: string;
    image?: string;
  };
  index: number;
}

// Function to generate random pastel color
const getRandomColor = () => {
  const colors = [
    'bg-blue-100',
    'bg-green-100',
    'bg-yellow-100',
    'bg-pink-100',
    'bg-purple-100',
    'bg-indigo-100',
    'bg-red-100',
    'bg-orange-100',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export default function BrandCard({ item, index }: BrandCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const randomColor = getRandomColor();

  return (
    <motion.div
      className="bg-gray-100 rounded-xl overflow-hidden shadow-md"
      whileHover={{ scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="relative h-40 w-full bg-white">
        {!item.image ? (
          <div className={`h-full w-full ${randomColor} flex items-center justify-center p-4`}>
            <h2 className="text-2xl font-bold text-gray-800 text-center">
              {item.name}
            </h2>
          </div>
        ) : (
          <Image
            src={item.image}
            alt={item?.name || "Brand"}
            fill
            className="object-contain p-4"
          />
        )}
      </div>
      <div className="p-3">
        <h3 className="text-lg font-bold text-black">{item?.name}</h3>
      </div>
    </motion.div>
  );
} 