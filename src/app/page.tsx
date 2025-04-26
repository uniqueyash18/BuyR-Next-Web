"use client";

import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function HomePage() {
  const router = useRouter();
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);  
  useEffect(() => {
    // Check if user is authenticated
    // Redirect based on authentication status
    if (isAuthenticated) {
      router.push("/home");
    } else {
      router.push("/home");
      // router.push("/auth/login");
    }
  }, [router]);

  // Return a loading state while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">BuyR</h2>
        <p className="text-gray-500">Redirecting...</p>
      </div>
    </div>
  );
}
