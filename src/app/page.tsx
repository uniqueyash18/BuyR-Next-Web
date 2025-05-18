"use client";

import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HomePage() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isAuthenticated = useSelector(
    (state: RootState) =>
      (state as { user: { isAuthenticated: boolean } }).user.isAuthenticated
  );

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/home");
    }
  }, [router]);

  console.log(process.env.NEXT_PUBLIC_API_URL, "asdf");

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <header className="fixed w-full backdrop-blur-md bg-white/80 shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center"
            >
              <img
                src="/images/logo.png"
                alt="BuyR Logo"
                width={50}
                height={50}
                className="mr-2"
              />
            
            </motion.div>
            
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-4">
            <Link
                href="/auth/login"
                className="text-blue-600 font-medium hover:text-blue-700 transition-colors"
              >
                Login
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-600 hover:text-blue-600 focus:outline-none"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isMobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {[
                { label: "Features", link: "#features" },
                { label: "How It Works", link: "#how-it-works" },
                { label: "Download", link: process.env.NEXT_PUBLIC_API_URL + "buyr.apk" },
                { label: "Tutorials", link: "/tutorial" },
                { label: "Login", link: "/auth/login" },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link
                    href={item?.link}
                    className="text-gray-600 hover:text-blue-600 transition-colors duration-300 relative group"
                  >
                    {item?.label}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </motion.div>
              ))}
            </nav>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {[
                  { label: "Features", link: "#features" },
                  { label: "How It Works", link: "#how-it-works" },
                  { label: "Download", link: process.env.NEXT_PUBLIC_API_URL + "buyr.apk" },
                  { label: "Tutorials", link: "/tutorial" },
                ].map((item, index) => (
                  <Link
                    key={index}
                    href={item?.link}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item?.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
              Get Paid for Your Reviews
            </h2>
            <p className="text-xl max-w-3xl mx-auto mb-8 text-blue-50">
              Shop, review, and earn money back. Join thousands of smart
              shoppers who get refunds for their honest product ratings and
              reviews.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href={process.env.NEXT_PUBLIC_API_URL + "buyr.apk"}
                download
                className="inline-block bg-white text-blue-600 font-bold py-4 px-8 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30"
              >
                Download Now
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center text-gray-800 mb-12"
          >
            Why Choose BuyR
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "💰",
                title: "Earn Real Money",
                description:
                  "Get actual refunds transferred directly to your account after completing reviews.",
              },
              {
                icon: "🛒",
                title: "Shop Quality Products",
                description:
                  "Browse through hundreds of products from trusted sellers and brands.",
              },
              {
                icon: "⭐",
                title: "Simple Process",
                description:
                  "Our streamlined system makes it easy to buy, review, and claim your refund.",
              },
              {
                icon: "🔒",
                title: "Secure Payments",
                description:
                  "Your financial information is protected with bank-grade security.",
              },
              {
                icon: "📱",
                title: "Mobile Friendly",
                description:
                  "Shop and submit reviews from anywhere using our intuitive mobile app.",
              },
              {
                icon: "🔔",
                title: "Instant Notifications",
                description:
                  "Get alerts for new deals and refund status updates.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="bg-white rounded-xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="text-4xl mb-4 transform hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="py-20 bg-gradient-to-b from-gray-50 to-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center text-gray-800 mb-12"
          >
            How It Works
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                number: "1",
                title: "Browse Deals",
                description:
                  "Find products with review rewards that interest you on our platform.",
              },
              {
                number: "2",
                title: "Purchase Product",
                description:
                  "Buy the product through our secure platform with your preferred payment method.",
              },
              {
                number: "3",
                title: "Submit Review",
                description:
                  "After receiving the product, leave an honest review or rating as requested.",
              },
              {
                number: "4",
                title: "Claim Refund",
                description:
                  "Fill out the refund form, and get your money back quickly and easily.",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center relative"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.description}</p>
                {index < 3 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 -ml-4"></div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section
        id="download"
        className="py-20 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-6">Download Our App</h2>
            <p className="text-xl max-w-2xl mx-auto mb-8 text-blue-50">
              Start earning rewards for your reviews today!
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <a
                href={process.env.NEXT_PUBLIC_API_URL + "buyr.apk"}
                download
                className="inline-block bg-white text-blue-600 font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30"
              >
                Download for Android
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Company",
                links: ["About Us", "Careers", "Press", "Blog"],
              },
              {
                title: "Support",
                links: ["Help Center", "Contact Us", "FAQs", "Community"],
              },
              {
                title: "Legal",
                links: [
                  "Privacy Policy",
                  "Terms of Service",
                  "Cookie Policy",
                  "Security",
                ],
              },
              {
                title: "Connect",
                links: ["Facebook", "Twitter", "Instagram", "LinkedIn"],
              },
            ].map((column, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="text-lg font-semibold mb-4 text-blue-400">
                  {column.title}
                </h3>
                <ul className="space-y-2">
                  {column.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href="#"
                        className="text-gray-300 hover:text-white transition-colors duration-300 relative group"
                      >
                        {link}
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mt-12 pt-8 border-t border-gray-800 text-center"
          >
            <p className="text-gray-400">
              &copy; 2024 BuyR. All rights reserved.
            </p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}
