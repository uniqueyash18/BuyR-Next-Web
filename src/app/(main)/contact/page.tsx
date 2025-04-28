"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FadeInSection } from "@/components/transitions";
import GradientButton from "@/components/GradientButton";
import Image from "next/image";
import imagePath from "@/constants/imagePath";

export default function ContactPage() {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const handlePhoneCall = () => {
    window.location.href = "tel:+918318729508";
  };

  const handleEmail = () => {
    window.location.href = "mailto:rohangill20.7@gmail.com";
  };

  const handleTextMessage = () => {
    window.location.href = "sms:+918318729508";
  };

  const handleWhatsApp = () => {
    window.open("https://wa.me/918318729508?text=I%20Have%20a%20query", "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-indigo-50 pt-4 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        <FadeInSection delay={0.1}>
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center">
                <button 
                  onClick={() => router.back()}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h1 className="text-2xl font-bold text-gray-800 ml-4">Contact Us</h1>
              </div>
              <div className="hidden md:block">
                <span className="text-sm text-gray-500">We're here to help!</span>
              </div>
            </div>
            
            <div className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <FadeInSection delay={0.2} className="w-full md:w-1/2">
                  <div className="relative">
                    <div className="absolute -top-4 -left-4 w-24 h-24 bg-indigo-100 rounded-full opacity-50"></div>
                    <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-purple-100 rounded-full opacity-50"></div>
                    <div className="relative z-10">
                      <Image 
                        src={imagePath.contactUsImg} 
                        alt="Contact Us" 
                        width={400} 
                        height={300} 
                        className="mx-auto drop-shadow-lg"
                      />
                    </div>
                  </div>
                </FadeInSection>
                
                <FadeInSection delay={0.3} className="w-full md:w-1/2">
                  <div className="space-y-6">
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold text-gray-800 mb-2">Get in Touch</h2>
                      <p className="text-gray-600">
                        Have questions or need assistance? We're here to help! Choose your preferred way to contact us.
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      <GradientButton
                        btnText="Get in Touch"
                        onClick={handlePhoneCall}
                        fullWidth
                        className="h-14 text-lg font-medium shadow-md hover:shadow-lg transition-all duration-300"
                      />
                      
                      <GradientButton
                        btnText="Drop Us an Mail"
                        onClick={handleEmail}
                        fullWidth
                        className="h-14 text-lg font-medium bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-md hover:shadow-lg transition-all duration-300"
                      />
                      
                      <GradientButton
                        btnText="Send a Message"
                        onClick={handleTextMessage}
                        fullWidth
                        className="h-14 text-lg font-medium bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg transition-all duration-300"
                      />
                      
                      <GradientButton
                        btnText="Chat on Whatsapp"
                        onClick={handleWhatsApp}
                        fullWidth
                        className="h-14 text-lg font-medium bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-md hover:shadow-lg transition-all duration-300"
                      />
                    </div>
                  </div>
                </FadeInSection>
              </div>
              
              <FadeInSection delay={0.4} className="mt-12 pt-8 border-t border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-50 p-6 rounded-xl text-center hover:bg-gray-100 transition-colors duration-300">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <h3 className="font-medium text-gray-800 mb-1">Phone</h3>
                    <p className="text-gray-600">+91 83187 29508</p>
                  </div>
                  
                  <div className="bg-gray-50 p-6 rounded-xl text-center hover:bg-gray-100 transition-colors duration-300">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="font-medium text-gray-800 mb-1">Email</h3>
                    <p className="text-gray-600">rohangill20.7@gmail.com</p>
                  </div>
                  
                  <div className="bg-gray-50 p-6 rounded-xl text-center hover:bg-gray-100 transition-colors duration-300">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <h3 className="font-medium text-gray-800 mb-1">WhatsApp</h3>
                    <p className="text-gray-600">Chat with us</p>
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