"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslate } from "@/lib/useTranslate";

export default function SectionFrame() {
  const { t } = useTranslate();

  return (
    <section className="w-full bg-white py-20 md:py-32">

      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-10 md:mb-12 px-4"
      >
        {t("frame", "title")}
      </motion.h2>

      <motion.a
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        href="https://www.google.com/maps/place/Bandar+Lampung,+Indonesia"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Open location in Google Maps"
        className="relative block w-full max-w-[1600px] mx-auto px-4"
      >
        <div className="relative w-full pt-[60%] md:pt-[50%]">

          <Image
            src="/map.jpg"
            alt="Map showing company location in Bandar Lampung Indonesia"
            fill
            sizes="(max-width: 768px) 100vw, 1600px"
            className="absolute inset-0 w-full h-full object-contain"
          />

          {/* PIN (BUILT-IN, TIDAK TERGANTUNG GLOBAL CSS) */}
          <div
            className="absolute z-20"
            style={{
              top: "66%",
              left: "76.3%",
              transform: "translate(-50%, -100%)",
            }}
          >
            {/* kepala pin */}
            <div className="relative w-4 h-4 rounded-full bg-red-600 shadow-md">
              <div className="absolute inset-0 rounded-full bg-red-400 opacity-50 animate-ping"></div>
            </div>

            {/* batang */}
            <div className="w-[3px] h-4 bg-red-700 mx-auto rounded-full mt-[2px]"></div>

            {/* label */}
            <span className="absolute left-full ml-2 sm:ml-3 top-1/2 -translate-y-1/2 text-[10px] sm:text-xs text-black bg-white px-2 sm:px-3 py-1 rounded shadow whitespace-nowrap">
              {t("frame", "location")}
            </span>
          </div>

        </div>
      </motion.a>

    </section>
  );
}