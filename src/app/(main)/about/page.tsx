"use client";

import { useRouter } from "next/navigation";
import { FadeInSection } from "@/components/transitions";

// About Us HTML content
const aboutUs = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>BuyR</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 16px;
      font-size: 16px;
    }

    h1, h2, h3 {
      margin: 16px 0;
    }

    p {
      margin-bottom: 15px;
    }

    ul {
      list-style-type: none;
      padding: 0;
    }

    li {
      margin-bottom: 10px;
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
      body {
        font-size: 18px;
      }

      h1 {
        font-size: 24px;
      }
      h2, h3 {
        font-size: 16px;
      }
    }
  </style>
</head>
<body>
  <h1>About Us - BuyR</h1>
  <p>Welcome to BuyR, your one-stop destination for unbeatable offers and deals from the most popular brands. Our mission is to help you save money while shopping for your favourite products. At BuyR, we collaborate directly with brands to bring you exclusive cashback deals that you won't find anywhere else.</p>
  <p>Whether you're shopping for fashion, electronics, home goods, or anything in between, BuyR ensures you get the best value for your money. Our platform is designed to provide you with an effortless shopping experience, allowing you to track and receive cashback seamlessly. Join our community of savvy shoppers today and start saving with every purchase!</p>
  
  <h1>Contact Us</h1>
  <p>For any questions or concerns, please contact our support team at <span title="Click to copy">+91 83187 29508</span>.</p>
  </body>
</html>
`;

export default function AboutPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-16">
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
              <h1 className="text-xl font-semibold text-gray-800 ml-4">About Us</h1>
            </div>
            
            <div className="p-6">
              <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: aboutUs }}
              />
            </div>
          </div>
        </FadeInSection>
      </div>
    </div>
  );
} 