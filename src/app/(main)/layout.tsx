import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import Header from "@/components/Header";

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
    <main className="pt-16">
      <Header />
      {children}
    </main>
  );
}
