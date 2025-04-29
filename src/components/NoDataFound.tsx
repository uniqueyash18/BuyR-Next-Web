"use client";

export default function NoDataFound() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative w-64 h-64 mb-6">
        <svg
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Background Circle */}
          <circle cx="100" cy="100" r="90" fill="#F8FAFC" />
          
          {/* Outer Ring */}
          <circle cx="100" cy="100" r="85" stroke="#E2E8F0" strokeWidth="2" />
          
          {/* Magnifying Glass */}
          <circle cx="80" cy="80" r="40" stroke="#94A3B8" strokeWidth="3" fill="none" />
          <path
            d="M120 120L140 140"
            stroke="#94A3B8"
            strokeWidth="3"
            strokeLinecap="round"
          />
          
          {/* X Mark */}
          <path
            d="M60 60L80 80M60 80L80 60"
            stroke="#EF4444"
            strokeWidth="3"
            strokeLinecap="round"
          />
          
          {/* Decorative Elements */}
          <circle cx="100" cy="100" r="60" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4 4" />
          <circle cx="100" cy="100" r="70" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4 4" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-gray-600 mb-2">No Results Found</h3>
      <p className="text-gray-500 text-center max-w-md">
        We couldn't find any matches for your search. Try different keywords or check back later.
      </p>
    </div>
  );
} 