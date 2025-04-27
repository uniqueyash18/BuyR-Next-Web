"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FadeInSection } from "@/components/transitions";

export default function TutorialPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 pt-4 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        <FadeInSection delay={0.1}>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center">
              <button 
                onClick={() => router.back()}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-xl font-semibold text-gray-800 ml-4">Tutorial</h1>
            </div>
            
            <div className="relative h-[calc(100vh-200px)]">
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
                </div>
              )}
              <iframe 
                src="https://buyrapp.in/tutorials"
                className="w-full h-full border-0"
                onLoad={() => setLoading(false)}
                title="Tutorial"
              />
            </div>
          </div>
        </FadeInSection>
      </div>
    </div>
  );
} 