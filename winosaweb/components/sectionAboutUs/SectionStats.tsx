"use client";

import { motion } from "framer-motion";
import FadeUp from "@/components/animation/FadeUp";
import { useTranslate } from "@/lib/useTranslate";

export default function SectionStats() {

  const { t } = useTranslate();

  const stats = [
    { value: "50+", label: t("stats", "projects") },
    { value: "5+", label: t("stats", "experience") },
    { value: "20+", label: t("stats", "clients") },
    { value: "100%", label: t("stats", "commitment") },
  ];

  return (
    <FadeUp>
      <section className="relative w-full bg-white py-32 overflow-hidden">

        <div className="absolute -bottom-40 right-0 w-[600px] h-[600px] bg-yellow-300/30 blur-[150px] rounded-full" />

        <div className="absolute -top-20 left-0 w-full h-[200px] bg-gradient-to-b from-white via-white/80 to-transparent pointer-events-none" />

        <motion.div
          className="relative max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-black"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.15 },
            },
          }}
        >

          {stats.map((item, i) => (

            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, y: 80 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.8 }}
            >
              <div className="text-5xl font-bold mb-2">
                {item.value}
              </div>

              <p className="text-black/70">
                {item.label}
              </p>

            </motion.div>

          ))}

        </motion.div>

      </section>
    </FadeUp>
  );
}