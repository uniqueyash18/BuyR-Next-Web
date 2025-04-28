"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FadeInSection } from "@/components/transitions";
import Image from "next/image";
import imagePath from "@/constants/imagePath";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export default function ProfilePage() {
  const router = useRouter();
  const userData = useSelector((state: RootState) => state.user.user) || {
    name: "John Doe",
    email: "john.doe@example.com",
    phoneNumber: "+91 98765 43210",
    currentAdminReference: {
      name: "Admin User"
    }
  };    
  

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-indigo-50 pt-4 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        <FadeInSection delay={0.1}>
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            <div className="p-5 border-b border-gray-100 flex items-center">
              <button 
                onClick={() => router.back()}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-2xl font-bold text-gray-800 ml-4">My Profile</h1>
            </div>
            
            <div className="p-8">
              <FadeInSection delay={0.2}>
                <div className="flex flex-col items-center mb-8">
                  <div className="relative">
                    <div className="absolute -top-2 -left-2 w-24 h-24 bg-indigo-100 rounded-full opacity-50"></div>
                    <div className="absolute -bottom-2 -right-2 w-24 h-24 bg-purple-100 rounded-full opacity-50"></div>
                    <div className="relative z-10">
                      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                        <Image 
                          src={imagePath.userImg || "/images/user-placeholder.png"} 
                          alt="Profile" 
                          width={128} 
                          height={128} 
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </FadeInSection>
              
              <FadeInSection delay={0.3}>
                <div className="space-y-6 max-w-md mx-auto">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      NAME
                    </label>
                    <input
                      type="text"
                      value={userData?.name}
                      readOnly
                      className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 text-gray-700 focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      EMAIL
                    </label>
                    <input
                      type="email"
                      value={userData?.email}
                      readOnly
                      className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 text-gray-700 focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      PHONE NUMBER
                    </label>
                    <input
                      type="text"
                      value={userData?.phoneNumber}
                      readOnly
                      className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 text-gray-700 focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CURRENT ADMIN
                    </label>
                    <input
                      type="text"
                      value={userData?.currentAdminReference?.name}
                      readOnly
                      className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 text-gray-700 focus:outline-none"
                    />
                  </div>
                </div>
              </FadeInSection>
            </div>
          </div>
        </FadeInSection>
      </div>
    </div>
  );
} 