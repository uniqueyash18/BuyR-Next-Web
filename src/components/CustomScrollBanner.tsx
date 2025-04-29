"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface BannerProps {
  data: Array<{
    _id: string;
    image: string;
    posterType: string;
    redirectUrl: string;
    brand?: {
      _id: string;
      name: string;
    };
    deal?: {
      _id: string;
      name: string;
    };
    dealCategory?: {
      _id: string;
      name: string;
    };
  }>;
  autoScrollInterval?: number;
}

export default function CustomScrollBanner({ data, autoScrollInterval = 5000 }: BannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % data.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + data.length) % data.length);
  };

  useEffect(() => {
    if (data.length <= 1) return;

    const startAutoScroll = () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      
      intervalRef.current = setInterval(() => {
        if (!isPaused && !isDragging) {
          handleNext();
        }
      }, autoScrollInterval);
    };

    startAutoScroll();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [data.length, autoScrollInterval, isPaused, isDragging]);

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  const handleDragEnd = (event: any, info: any) => {
    setIsDragging(false);
    const threshold = 50;
    
    if (Math.abs(info.offset.x) > threshold) {
      if (info.offset.x > 0) {
        handlePrev();
      } else {
        handleNext();
      }
    }
  };

  if (!data.length) return null;

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-[2/1] md:aspect-[3/1] rounded-xl overflow-hidden group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="region"
      aria-label="Image carousel"
    >
      <motion.div
        className="flex w-full h-full"
        animate={{
          x: `-${currentIndex * 100}%`,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        whileTap={{ cursor: "grabbing" }}
      >
        {data.map((item, index) => (
          <motion.div
            key={item._id}
            className="relative flex-shrink-0 w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Image
              src={item.image}
              alt={`Banner ${index + 1}`}
              fill
              className="object-stretch select-none"
              priority={index === 0}
              draggable={false}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Navigation Buttons */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full 
                 hover:bg-black/70 transition-all duration-200 opacity-0 group-hover:opacity-100
                 focus:outline-none focus:ring-2 focus:ring-white/50"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full 
                 hover:bg-black/70 transition-all duration-200 opacity-0 group-hover:opacity-100
                 focus:outline-none focus:ring-2 focus:ring-white/50"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
        {data.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-200
                      ${index === currentIndex ? "bg-white scale-125" : "bg-white/50 hover:bg-white/75"}`}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === currentIndex}
          />
        ))}
      </div>
    </div>
  );
} 