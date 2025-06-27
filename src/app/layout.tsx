import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Buyr Web",
  description: "Your one-stop shop for deals and cashback",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
      <html lang="en">
        <head>
          <Script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3814802908513284"
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        </head>
        <body className={inter.className}>
          <main>
            {children}
          </main>
        </body>
      </html>
    </Providers>
  );
}
