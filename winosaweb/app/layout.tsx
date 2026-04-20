"use client";

import dynamic from "next/dynamic";
import "./globals.css";
import Navbar from "../components/layout/Navbar";
import { usePathname } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import Script from "next/script";
import { useEffect } from "react";
import { Analytics } from "@vercel/analytics/react";
import { Poppins, Inter } from "next/font/google";

// FONT //
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

// ANIMATION //
const PageTransition = dynamic(
  () => import("@/components/animation/PageTransition"),
  { ssr: false }
);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("config", "G-38LDC4SJK8", {
        page_path: pathname,
      });
    }
  }, [pathname]);

  return (
    <html lang="en">
  <body className={`${inter.className} overflow-x-hidden bg-white`}>

        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-38LDC4SJK8"
          strategy="afterInteractive"
        />
        <Script id="ga-script" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('js', new Date());
            gtag('config', 'G-38LDC4SJK8');
          `}
        </Script>

        <Navbar />

        <AnimatePresence mode="wait">
          <PageTransition pathname={pathname}>
            {children}
          </PageTransition>

        </AnimatePresence>
        
        <Analytics />
      </body>
    </html>
  );
}