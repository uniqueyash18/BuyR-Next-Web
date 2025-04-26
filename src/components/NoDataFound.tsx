"use client";

import Image from "next/image";

export default function NoDataFound() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-4">
      <div className="relative w-48 h-48 mb-4">
        <Image
          src="/images/no-data.png"
          alt="No Data Found"
          fill
          className="object-contain"
        />
      </div>
      <h2 className="text-xl font-semibold text-gray-700 mb-2">
        No Data Found
      </h2>
      <p className="text-gray-500 text-center">
        We couldn't find any data matching your criteria. Please try again later.
      </p>
    </div>
  );
} 