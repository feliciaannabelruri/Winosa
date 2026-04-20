"use client";

import { motion } from "framer-motion";

export default function PageTransition({
  children,
  pathname,
}: {
  children: React.ReactNode;
  pathname: string;
}) {
  return (
    <div className="relative w-full min-h-screen bg-white overflow-hidden">
      <motion.div
        key={pathname}
        initial={{
          opacity: 0,
          scale: 1.04,
          filter: "blur(4px)",
        }}
        animate={{
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
        }}
        exit={{
          opacity: 0,
          scale: 0.98,
          filter: "blur(4px)",
        }}
        transition={{
          duration: 0.55,
          ease: [0.4, 0, 0.2, 1],
        }}
        style={{
          transformOrigin: "center center",
          willChange: "transform, opacity, filter",
        }}
        className="w-full min-h-screen bg-white"
      >
        {children}
      </motion.div>
    </div>
  );
}
