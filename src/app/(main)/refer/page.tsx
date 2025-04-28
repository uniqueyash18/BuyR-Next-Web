"use client";

import { useState } from "react";
import Image from "next/image";
import GradientButton from "@/components/GradientButton";
import imagePath from "@/constants/imagePath";
import { FadeInSection } from "@/components/transitions";

export default function ReferPage() {
  const [copied, setCopied] = useState(false);
  const appLink = 'https://buyrapp.in/';
  
  const onPressSocialBox = async (title: string) => {
    const urlMap: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${appLink}`,
      whatsapp: `https://api.whatsapp.com/send?text=${appLink}`,
      email: `mailto:?body=${appLink}`,
      twitter: `https://twitter.com/intent/tweet?text=${appLink}`,
      instagram: `https://www.instagram.com/?url=${appLink}`,
      message: `sms:?body=${appLink}`,
    };
  
    const url = urlMap[title];
    
    if (url) {
      window.open(url, '_blank');
    } else {
      console.warn('Unsupported social media platform:', title);
    }
  };

  const shareBtns = [
    { title: 'facebook', image: imagePath.facebooklogo },
    { title: 'whatsapp', image: imagePath.whatsapp },
    { title: 'email', image: imagePath.email },
    { title: 'twitter', image: imagePath.twitter },
    { title: 'instagram', image: imagePath.instagram },
    { title: 'message', image: imagePath.message },
  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(appLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="relative">
        {/* Purple background with wave */}
        <div className="absolute top-0 left-0 w-full h-64 overflow-hidden">
          <Image 
            src={imagePath.purpleBack} 
            alt="Purple background" 
            width={1440} 
            height={320}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative z-10 p-4 max-w-7xl mx-auto">
          <FadeInSection delay={0.1}>
            <div className="bg-white rounded-xl p-6 shadow-md mt-16">
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <Image 
                    src={imagePath.referYourFrind} 
                    alt="Refer your friend" 
                    width={200} 
                    height={200}
                    className="w-32 h-32"
                  />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Invite Your Friends
                </h2>
                <p className="text-gray-600">
                  Share the joy of savings with your friends and earn rewards!
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <div className="flex flex-col items-center justify-center gap-4">
                  <h3 className="font-semibold text-gray-900">Your Referral Link</h3>
                  <div className="flex items-center gap-4 w-full max-w-md">
                    <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 font-mono text-sm overflow-hidden text-ellipsis flex-1">
                      {appLink}
                    </div>
                    <GradientButton
                      btnText={copied ? "Copied!" : "Copy Link"}
                      onPress={copyToClipboard}
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="font-semibold text-gray-900 mb-4 text-center">Share Via</h3>
                <div className="grid grid-cols-3 gap-4">
                  {shareBtns.map((item, index) => (
                    <button 
                      key={index}
                      onClick={() => onPressSocialBox(item.title)}
                      className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow flex items-center justify-center"
                    >
                      <Image 
                        src={item.image} 
                        alt={item.title} 
                        width={24} 
                        height={24}
                        className="w-6 h-6"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </FadeInSection>
        </div>
      </div>
    </div>
  );
} 