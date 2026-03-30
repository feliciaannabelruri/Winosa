"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface FadeUpProps {
  children: ReactNode;
  delay?: number;
  disableInView?: boolean; // 🔥 tambahan
}

export default function FadeUp({
  children,
  delay = 0,
  disableInView = false,
}: FadeUpProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      {...(disableInView
        ? {
            animate: { opacity: 1, y: 0 }, // 🔥 langsung muncul
          }
        : {
            whileInView: { opacity: 1, y: 0 }, // default lama
            viewport: { once: true, amount: 0.2 },
          })}
      transition={{ duration: 0.8, delay }}
      style={{
        willChange: "transform, opacity",
        transform: "translateZ(0)", // 🔥 Safari & performance fix
      }}
    >
      {children}
    </motion.div>
  );
}
