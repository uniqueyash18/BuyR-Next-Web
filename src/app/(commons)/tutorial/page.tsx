"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function TutorialsPage() {
  const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string } | null>(null);

  const platforms = [
    {
      name: "Amazon",
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlO7c1ph0372RPy2_DwWn7a8PX_i7xxSUYPw&s",
      tutorials: [
        {
          type: "video",
          src: "/images/Amazon/amazon_rating_submit.mp4",
          caption: "How to Submit Ratings on Amazon"
        },
        {
          type: "image",
          src: "/images/Amazon/AmazonRatingScreenshotSample.webp",
          caption: "Rating Screenshot Example"
        },
        {
          type: "image",
          src: "/images/Amazon/AmazonOrderSS.webp",
          caption: "Order Process Guide"
        },
        {
          type: "image",
          src: "/images/Amazon/AmazonReviewSubmitSample.webp",
          caption: "Review Submit Process"
        },
        {
          type: "image",
          src: "/images/Amazon/AmazonRatingScreenshotSampleLaptop.webp",
          caption: "Rating Process on Laptop"
        },
        {
          type: "image",
          src: "/images/Amazon/AmazonExchangeDealSampleOrderSS.webp",
          caption: "Exchange Deal Process"
        },
        {
          type: "image",
          src: "/images/Amazon/AmazonDelivered.webp",
          caption: "Delivery Confirmation"
        }
      ]
    },
    {
      name: "Flipkart",
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFAS1xR8ZdYCvsWvARhon_DyYInDgr2WpIPQ&s",
      tutorials: [
        {
          type: "video",
          src: "/images/Flipkart/flipkart_Review_Link.mp4",
          caption: "How to Submit Reviews on Flipkart"
        },
        {
          type: "image",
          src: "/images/Flipkart/FlipkartReviewScreenshotSample.webp",
          caption: "Review Screenshot Example"
        },
        {
          type: "image",
          src: "/images/Flipkart/FlipkartOrderSS.webp",
          caption: "Order Process Guide"
        },
        {
          type: "image",
          src: "/images/Flipkart/FlipkartRatingScreenshotSample.webp",
          caption: "Rating Process Guide"
        },
        {
          type: "image",
          src: "/images/Flipkart/FlipkartDeliveredWithReturnWindowClosedSample.webp",
          caption: "Delivery Confirmation"
        }
      ]
    },
    {
      name: "Nykaa",
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDjTRAMkw1ub06xFYGTzvD2eyeywq1-XYuCQ&s",
      tutorials: [
        {
          type: "image",
          src: "/images/MyntraNykaa/NykaaReviewScreenshot.webp",
          caption: "How to Submit Reviews on Nykaa"
        },
        {
          type: "image",
          src: "/images/MyntraNykaa/NykaaOrderScreenshot.webp",
          caption: "Order Process Guide"
        },
        {
          type: "image",
          src: "/images/MyntraNykaa/NykaaDeliveredScreenshot.webp",
          caption: "Delivery Confirmation Example"
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white py-16 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-4">Platform Tutorials</h1>
          <p className="text-xl mb-8">Learn how to use BuyR with different e-commerce platforms</p>
          <Link
            href="/"
            className="inline-block bg-white text-blue-600 font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30"
          >
            Back to Home
          </Link>
        </motion.div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {platforms.map((platform, platformIndex) => (
          <motion.section
            key={platform.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: platformIndex * 0.1 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-8 mb-12 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center border-b border-gray-200 pb-6 mb-8">
              <Image
                src={platform.logo}
                alt={`${platform.name} Logo`}
                width={60}
                height={60}
                className="rounded-lg mr-4"
              />
              <h2 className="text-3xl font-semibold text-gray-800">{platform.name} Tutorials</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {platform.tutorials.map((tutorial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <div className="relative aspect-video bg-gray-100">
                    {tutorial.type === "video" ? (
                      <video
                        controls
                        className="w-full h-full object-cover"
                      >
                        <source src={tutorial.src} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <Image
                        src={tutorial.src}
                        alt={tutorial.caption}
                        fill
                        className="object-cover cursor-pointer"
                        onClick={() => setSelectedImage({ src: tutorial.src, alt: tutorial.caption })}
                      />
                    )}
                  </div>
                  <div className="p-4 text-center">
                    <p className="text-gray-700 font-medium">{tutorial.caption}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        ))}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl w-full">
            <button
              className="absolute -top-12 right-0 text-white text-4xl font-bold hover:text-gray-300"
              onClick={() => setSelectedImage(null)}
            >
              ×
            </button>
            <Image
              src={selectedImage.src}
              alt={selectedImage.alt}
              width={1200}
              height={800}
              className="w-full h-auto rounded-lg"
            />
            <p className="text-white text-center mt-4">{selectedImage.alt}</p>
          </div>
        </div>
      )}
    </div>
  );
} 