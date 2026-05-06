"use client";

import dynamic from "next/dynamic";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import { usePathname } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import Script from "next/script";
import { useEffect } from "react";
import { Analytics } from "@vercel/analytics/react";
import { Poppins, Inter } from "next/font/google";
import { useLanguageStore } from "@/store/useLanguageStore";

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

  const { setLanguage } = useLanguageStore();

  
  useEffect(() => {
  if (typeof window === "undefined") return;

  const savedLang = localStorage.getItem("lang");
  if (savedLang) {
    setLanguage(savedLang as any);
    return;
  }

  const userLang = navigator.language.toLowerCase();

  if (userLang.includes("id")) {
    setLanguage("id" as any);
  } else if (userLang.includes("nl")) {
    setLanguage("nl" as any);
  } else {
    setLanguage("en" as any);
  }
}, []);

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

        <AnimatePresence mode="sync">
          <PageTransition pathname={pathname}>
            {children}
          </PageTransition>

        </AnimatePresence>
        
        <Analytics />
      </body>
    </html>
  );
}