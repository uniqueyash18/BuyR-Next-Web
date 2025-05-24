"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { FadeInSection } from "@/components/transitions";
import NotificationIcon from "./NotificationIcon";

const Header = () => {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState(pathname);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const tabs = [
    { name: "HOME", path: "/home", icon: "/images/home.svg" },
    { name: "FORMS", path: "/orderForm", icon: "/images/form.svg" },
    { name: "MY ORDERS", path: "/orders", icon: "/images/order.svg" },
    { name: "REFER", path: "/refer", icon: "/images/refer.svg" },
    { name: "ACCOUNT", path: "/account", icon: "/images/account.svg" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
        ? "bg-white/90 backdrop-blur-md shadow-md py-2"
        : "bg-white py-3"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <FadeInSection delay={0.1}>
            <Link href="/home" className="flex items-center">
              <div className="relative w-20 h-15 mr-2">
                <Image
                  src="/images/logo.png"
                  alt="Logo"
                  fill
                  className="object-contain"
                />
              </div>
            </Link>
          </FadeInSection>

          {/* Desktop Navigation */}
          <FadeInSection delay={0.2}>
            <nav className="hidden md:flex items-center space-x-1">
              {tabs.map((tab) => (
                <Link
                  key={tab.path}
                  href={tab.path}
                  className={`flex items-center gap-2 py-2 px-4 rounded-lg transition-all duration-200 ${activeTab === tab.path
                    ? "text-blue-600 bg-blue-50 font-medium"
                    : "text-gray-600 hover:text-blue-500 hover:bg-gray-50"
                    }`}
                  onClick={() => setActiveTab(tab.path)}
                >
                  <div className="relative w-5 h-5">
                    <Image
                      src={tab.icon}
                      alt={tab.name}
                      fill
                      className={`object-contain transition-opacity duration-200 ${activeTab === tab.path ? "opacity-100" : "opacity-70"
                        }`}
                    />
                  </div>
                  <span className="text-sm">{tab.name}</span>
                </Link>
              ))}
              <Link href="/notifications">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </Link>
            </nav>
          </FadeInSection>

          {/* Mobile Menu Button */}
          <FadeInSection delay={0.2}>
            <div className="flex items-center gap-4 md:hidden">
              <Link href="/notifications">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </Link>
              <button
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </FadeInSection>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <FadeInSection delay={0.3}>
            <nav className="md:hidden py-4 space-y-2">
              {tabs.map((tab) => (
                <Link
                  key={tab.path}
                  href={tab.path}
                  className={`flex items-center gap-3 py-3 px-4 rounded-lg transition-all duration-200 ${activeTab === tab.path
                    ? "text-blue-600 bg-blue-50 font-medium"
                    : "text-gray-600 hover:text-blue-500 hover:bg-gray-50"
                    }`}
                  onClick={() => {
                    setActiveTab(tab.path);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <div className="relative w-5 h-5">
                    <Image
                      src={tab.icon}
                      alt={tab.name}
                      fill
                      className={`object-contain transition-opacity duration-200 ${activeTab === tab.path ? "opacity-100" : "opacity-70"
                        }`}
                    />
                  </div>
                  <span className="text-sm">{tab.name}</span>
                </Link>
              ))}
            </nav>
          </FadeInSection>
        )}
      </div>
    </header>
  );
};

export default Header; 