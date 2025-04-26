"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import GradientButton from "@/components/GradientButton";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* Animated 404 Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-9xl font-bold text-primary mb-2">404</h1>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Oops! Page Not Found
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              The page you are looking for might have been removed, had its name
              changed, or is temporarily unavailable.
            </p>
          </motion.div>
        </motion.div>

        {/* Animated Illustration */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
          className="mb-12 relative h-64 mx-auto"
        >
          <Image
            src="/images/404-illustration.svg"
            alt="404 Illustration"
            width={300}
            height={300}
            className="mx-auto"
            priority
          />
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <GradientButton
            variant="primary"
            onClick={() => window.history.back()}
            className="min-w-[160px]"
            fullWidth
          >
            Go Back
          </GradientButton>
          <Link href="/" className="min-w-[160px]">
            <GradientButton variant="outline" fullWidth>
              Return Home
            </GradientButton>
          </Link>
        </motion.div>
      </div>
    </div>
  );
} 