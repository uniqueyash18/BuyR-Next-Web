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

export default function BrandCard({ item, index }: BrandCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="bg-gray-100 rounded-xl overflow-hidden shadow-md"
      whileHover={{ scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="relative h-40 w-full bg-white">
        <Image
          src={item.image || "/images/placeholder.png"}
          alt={item?.name || "Brand"}
          fill
          className="object-contain p-4"
        />
      </div>
      <div className="p-3">
        <h3 className="text-lg font-bold text-black">{item.name}</h3>
      </div>
    </motion.div>
  );
} 