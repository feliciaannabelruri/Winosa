"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useTranslate } from "@/lib/useTranslate";

const FadeUp = dynamic(() => import("@/components/animation/FadeUp"));

export default function SectionMap() {

  const { t } = useTranslate();

  return (
    <FadeUp>
      <section
        className="w-full bg-white py-32"
        aria-labelledby="map-title"
      >

        <div className="max-w-7xl mx-auto px-6 text-black">

          <motion.div
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >

            <h2
              id="map-title"
              className="text-4xl font-bold mb-4"
            >
              {t("map", "title")}
            </h2>

            <p className="text-black/70">
              {t("map", "subtitle")}
            </p>

          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true }}
            className="rounded-[28px] overflow-hidden border border-black shadow-[0_20px_50px_rgba(0,0,0,0.1)]"
          >

            <iframe
              title="Company location on Google Maps"
              src="https://maps.google.com/maps?q=Bandar%20Lampung&t=&z=13&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="450"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full"
            />

          </motion.div>

        </div>

      </section>
    </FadeUp>
  );
}