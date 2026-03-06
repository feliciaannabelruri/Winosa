"use client";

import "./globals.css";
import Navbar from "../components/layout/Navbar";
import { usePathname } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import PageTransition from "@/components/animation/PageTransition";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <html lang="en">
      <body className="overflow-x-hidden bg-white">

        <Navbar />

        <AnimatePresence mode="wait">
          <PageTransition pathname={pathname}>
            {children}
          </PageTransition>
        </AnimatePresence>

      </body>
    </html>
  );
}
