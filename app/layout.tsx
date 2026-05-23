import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DongPlay — Nonton Donghua Gratis No Ads",
  description: "Nonton donghua subtitle gratis, tanpa iklan. Stream donghua terbaru dari Dailymotion dan Okru.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={inter.className}>
      <body className="bg-[#0a0a0f] text-[#e2e8f0] min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-14">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
