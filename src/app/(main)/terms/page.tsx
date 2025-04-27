"use client";

import { useRouter } from "next/navigation";
import { FadeInSection } from "@/components/transitions";

// Terms and Conditions HTML content
const termsCondition = `
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
  <h1>Terms and Conditions</h1>
  <h3>1. Introduction</h3>
  <p>Welcome to BuyR. These Terms and Conditions ("Terms") govern your use of our app and services. By using BuyR, you agree to these Terms. If you do not agree with any part of these Terms, please do not use our app.</p>

  <h3>2. Services</h3>
  <p>BuyR provides offers and cashback deals on products from various brands. These deals are time-limited and subject to change without notice.</p>

  <h3>3. Eligibility</h3>
  <p>To use BuyR, you must be at least 18 years old or have parental consent if you are a minor.</p>

  <h3>4. Cashback Eligibility</h3>
  <ul>
    <li>Cashback will be awarded only when all specified terms and conditions are met.</li>
    <li>Orders must be placed within the campaign period to qualify for cashback.</li>
    <li>The order form must be completed correctly after purchase.</li>
    <li>Cashback will be tracked within 24-48 hours of the transaction.</li>
    <li>Customers can raise a ticket for any missing cashback.</li>
  </ul>

  <h3>5. Cashback Confirmation and Payout</h3>
  <ul>
    <li>Cashback will be confirmed within 15-30 days after the refund form is filled.</li>
    <li>Customers must provide accurate information on the refund form. Incorrect forms will result in the forfeiture of cashback.</li>
  </ul>

  <h3>6. Rights and Limitations</h3>
  <ul>
    <li>BuyR reserves the right to cancel orders or cashback if terms are not followed.</li>
    <li>BuyR is not responsible for any loss resulting from incorrect information provided by the customer.</li>
  </ul>

  <h3>7. Modifications</h3>
  <p>BuyR reserves the right to modify these Terms at any time. Continued use of the app after any changes implies acceptance of the new Terms.</p>

  <h3>8. Contact Us</h3>
  <p>For any questions or concerns, please contact our support team at <span title="Click to copy">+91 83187 29508</span>.</p>
  </body>
</html>
`;

export default function TermsPage() {
  const router = useRouter();

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
              <h1 className="text-xl font-semibold text-gray-800 ml-4">Terms & Conditions</h1>
            </div>
            
            <div className="p-6">
              <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: termsCondition }}
              />
            </div>
          </div>
        </FadeInSection>
      </div>
    </div>
  );
} 