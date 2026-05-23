import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DongPlay \u2014 Watch Donghua Free, No Ads",
  description:
    "Stream donghua (Chinese anime) for free. No ads, no popups. Watch Soul Land, Battle Through the Heavens, Perfect World, and more from official YouTube channels.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#0a0a0f] text-[#e2e8f0]">
        <Navbar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
