"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useTranslate } from "@/lib/useTranslate";
import { useState } from "react";

const FadeUp = dynamic(() => import("@/components/animation/FadeUp"));

export default function SectionMap() {
  const [loadMap, setLoadMap] = useState(false);
  const { t } = useTranslate();

  return (
    <FadeUp>
      <section
        className="w-full bg-white py-32"
        aria-labelledby="map-title"
      >
        <div className="max-w-7xl mx-auto px-6 text-black">

          {/* header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2
              id="map-title"
              className="text-4xl font-bold mb-4"
            >
              {t("map", "title")}
            </h2>

            <p
              id="map-description"
              className="text-black/70"
            >
              {t("map", "subtitle")}
            </p>
          </motion.div>

          {/* map container */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="rounded-[28px] overflow-hidden border border-black shadow-[0_16px_40px_rgba(0,0,0,0.08)]"
          >

            {!loadMap ? (
              <div className="flex flex-col items-center justify-center h-[450px] bg-gray-100 gap-4">

                <p className="text-black/60">
                  Click to load map
                </p>

                {/* BUTTON TIDAK DIUBAH HOVER */}
                <button
                  onClick={() => setLoadMap(true)}
                  className="px-6 py-3 bg-black text-white rounded-full"
                >
                  Load Map
                </button>

              </div>
            ) : (
              <iframe
                title="Company location on Google Maps"
                src="https://maps.google.com/maps?q=Bandar%20Lampung&output=embed"
                width="100%"
                height="450"
                loading="lazy"
                className="w-full"
              />
            )}

          </motion.div>

        </div>
      </section>
    </FadeUp>
  );
}