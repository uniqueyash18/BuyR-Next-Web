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
  const [ratings, setRatings] = useState({
    fiveStar: 0,
    fourStar: 0,
    threeStar: 0,
    twoStar: 0,
    oneStar: 0,
  });
  const [targetRating, setTargetRating] = useState(4.5);
  const [additionalFiveStars, setAdditionalFiveStars] = useState(0);
  const [showCalculator, setShowCalculator] = useState(false);
  
  const isAuthenticated = useSelector(
    (state: RootState) =>
      (state as { user: { isAuthenticated: boolean } }).user.isAuthenticated
  );

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/home");
    }
  }, [router]);

  // Calculate current average rating
  const calculateCurrentRating = () => {
    const totalRatings = ratings.fiveStar + ratings.fourStar + ratings.threeStar + ratings.twoStar + ratings.oneStar;
    if (totalRatings === 0) return 0;
    
    const weightedSum = (ratings.fiveStar * 5) + (ratings.fourStar * 4) + (ratings.threeStar * 3) + (ratings.twoStar * 2) + (ratings.oneStar * 1);
    return weightedSum / totalRatings;
  };

  // Calculate required 5-star ratings to reach target
  const calculateRequiredFiveStars = () => {
    const currentRating = calculateCurrentRating();
    if (currentRating >= targetRating) return 0;
    
    const totalRatings = ratings.fiveStar + ratings.fourStar + ratings.threeStar + ratings.twoStar + ratings.oneStar;
    const currentWeightedSum = (ratings.fiveStar * 5) + (ratings.fourStar * 4) + (ratings.threeStar * 3) + (ratings.twoStar * 2) + (ratings.oneStar * 1);
    
    // Formula: (currentWeightedSum + 5x) / (totalRatings + x) = targetRating
    // Solving for x: 5x - targetRating * x = targetRating * totalRatings - currentWeightedSum
    // x = (targetRating * totalRatings - currentWeightedSum) / (5 - targetRating)
    
    const required = Math.ceil((targetRating * totalRatings - currentWeightedSum) / (5 - targetRating));
    return Math.max(0, required);
  };

  const currentRating = calculateCurrentRating();
  const requiredFiveStars = calculateRequiredFiveStars();

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
                { label: "Rating Calculator", link: "#rating-calculator" },
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
                  { label: "Rating Calculator", link: "#rating-calculator" },
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

      {/* Rating Calculator Section */}
      <section id="rating-calculator" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Ecommerce Seller Rating Calculator
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Calculate your current average rating and find out how many 5-star reviews you need to reach your target rating.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 shadow-lg border border-blue-100"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Input Section */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Current Ratings</h3>
                
                {[
                  { label: "5-Star Reviews", key: "fiveStar", color: "text-green-600" },
                  { label: "4-Star Reviews", key: "fourStar", color: "text-blue-600" },
                  { label: "3-Star Reviews", key: "threeStar", color: "text-yellow-600" },
                  { label: "2-Star Reviews", key: "twoStar", color: "text-orange-600" },
                  { label: "1-Star Reviews", key: "oneStar", color: "text-red-600" },
                ].map((rating) => (
                  <div key={rating.key} className="flex items-center justify-between">
                    <label className={`font-medium ${rating.color}`}>
                      {rating.label}
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={ratings[rating.key as keyof typeof ratings]}
                      onChange={(e) => setRatings(prev => ({
                        ...prev,
                        [rating.key]: parseInt(e.target.value) || 0
                      }))}
                      className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center"
                    />
                  </div>
                ))}

                <div className="pt-4 border-t border-gray-200">
                  <label className="block font-medium text-gray-800 mb-2">
                    Target Rating
                  </label>
                  <select
                    value={targetRating}
                    onChange={(e) => setTargetRating(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={4.5}>4.5 Stars</option>
                    <option value={4.6}>4.6 Stars</option>
                    <option value={4.7}>4.7 Stars</option>
                    <option value={4.8}>4.8 Stars</option>
                    <option value={4.9}>4.9 Stars</option>
                    <option value={5.0}>5.0 Stars</option>
                  </select>
                </div>
              </div>

              {/* Results Section */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Results</h3>
                
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold text-gray-800 mb-2">
                      {currentRating.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-600">Current Average Rating</div>
                  </div>
                  
                  <div className="flex justify-center mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`w-6 h-6 ${
                          star <= Math.round(currentRating) 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-gray-300'
                        }`}
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  
                  <div className="text-center text-sm text-gray-600">
                    Total Reviews: {Object.values(ratings).reduce((a, b) => a + b, 0)}
                  </div>
                </div>

                {currentRating > 0 && (
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 text-white">
                    <div className="text-center">
                      <div className="text-2xl font-bold mb-2">
                        {requiredFiveStars}
                      </div>
                      <div className="text-sm opacity-90">
                        Additional 5-star reviews needed to reach {targetRating} stars
                      </div>
                    </div>
                  </div>
                )}

                {currentRating <= 3 && currentRating > 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gradient-to-r from-red-500 to-pink-600 rounded-xl p-4 text-white text-center"
                  >
                    <div className="text-sm font-medium">
                      ⚠️ Your rating is below 3.0. Consider improving your product quality and customer service.
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            <div className="mt-8 text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCalculator(!showCalculator)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-300"
              >
                {showCalculator ? 'Hide' : 'Show'} Advanced Calculator
              </motion.button>
            </div>

            {showCalculator && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 p-6 bg-gray-50 rounded-xl"
              >
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Advanced Calculations</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="bg-white p-4 rounded-lg">
                    <div className="font-medium text-gray-800 mb-2">To reach 4.5 stars:</div>
                    <div className="text-blue-600 font-bold">
                      {calculateRequiredFiveStars() === 0 ? 'Already achieved!' : `${calculateRequiredFiveStars()} additional 5-star reviews`}
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <div className="font-medium text-gray-800 mb-2">To reach 5.0 stars:</div>
                    <div className="text-blue-600 font-bold">
                      {Math.ceil((5 * Object.values(ratings).reduce((a, b) => a + b, 0) - (ratings.fiveStar * 5 + ratings.fourStar * 4 + ratings.threeStar * 3 + ratings.twoStar * 2 + ratings.oneStar * 1)) / 0) === Infinity ? 'Impossible with current ratings' : `${Math.ceil((5 * Object.values(ratings).reduce((a, b) => a + b, 0) - (ratings.fiveStar * 5 + ratings.fourStar * 4 + ratings.threeStar * 3 + ratings.twoStar * 2 + ratings.oneStar * 1)) / 0)} additional 5-star reviews`}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
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
