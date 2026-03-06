"use client";

import { motion } from "framer-motion";
import { useTranslate } from "@/lib/useTranslate";

export default function SectionFrame() {
  const { t } = useTranslate();

  return (
    <section className="w-full bg-white py-20 md:py-32">

      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="text-center text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-10 md:mb-12 px-4"
      >
        {t("frame", "title")}
      </motion.h2>

      <motion.a
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        href="https://www.google.com/maps/place/Bandar+Lampung,+Indonesia"
        target="_blank"
        rel="noopener noreferrer"
        className="relative block w-full max-w-[1600px] mx-auto px-4"
      >

        <div className="relative w-full pt-[60%] md:pt-[50%]">

          <img
            src="/map.jpg"
            alt="Indonesia Map"
            className="absolute inset-0 w-full h-full object-contain"
          />

          <div
            className="absolute"
            style={{
              top: "61%",
              left: "71.3%",
              transform: "translate(-50%, -100%)",
            }}
          >

            <div className="map-pin"></div>
            <div className="map-stick"></div>

            <span className="absolute left-full ml-2 sm:ml-3 top-1/2 -translate-y-1/2 text-[10px] sm:text-xs text-black bg-white px-2 sm:px-3 py-1 rounded shadow whitespace-nowrap">
              {t("frame", "location")}
            </span>

          </div>

        </div>

      </motion.a>

    </section>
  );
}