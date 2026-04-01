"use client";

import dynamic from "next/dynamic";
import "./globals.css";
import Navbar from "../components/layout/Navbar";
import { usePathname } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import Script from "next/script";
import { useEffect } from "react";
import { Analytics } from "@vercel/analytics/react";

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
      <body className="overflow-x-hidden bg-white">
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="afterInteractive"
        />
        <Script id="ga-script" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
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
