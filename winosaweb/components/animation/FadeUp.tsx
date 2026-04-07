"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface FadeUpProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  distance?: number;
  disableInView?: boolean;
}

export default function FadeUp({
  children,
  delay = 0,
  duration = 0.7,
  distance = 40,
  disableInView = false,
}: FadeUpProps) {
  const animationProps = disableInView
    ? {
        animate: { opacity: 1, y: 0 },
      }
    : {
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-50px" },
      };

  return (
    <motion.div
      initial={{ opacity: 0, y: distance }}
      {...animationProps}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1], // smoother easing
      }}
      style={{
        willChange: "transform, opacity",
        transform: "translateZ(0)",
        backfaceVisibility: "hidden",
      }}
    >
      {children}
    </motion.div>
  );
}