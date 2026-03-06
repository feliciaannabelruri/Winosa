"use client";

import { motion } from "framer-motion";
import FadeUp from "@/components/animation/FadeUp";
import Link from "next/link";
import { useTranslate } from "@/lib/useTranslate";

export default function SectionStory() {

  const { t } = useTranslate();

  return (
    <FadeUp>
      <section className="relative w-full py-40 overflow-hidden bg-white">

        {/* GOLD RADIAL — TIDAK DIUBAH */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_80%_35%,rgba(255,215,100,0.45)_0%,rgba(255,215,100,0.25)_30%,transparent_55%)]" />

        <div className="absolute top-0 left-0 w-full h-[220px] z-0 bg-gradient-to-b from-white via-white to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-black">

          <motion.h2
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-bold mb-8 leading-tight"
          >
            {t("story", "titleLine1")}
            <br />
            {t("story", "titleLine2")}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-black/70 leading-relaxed text-lg mb-12 max-w-3xl"
          >
            {t("story", "description1")}
            <br /><br />
            {t("story", "description2")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Link
              href="/Contact"
              className="inline-flex items-center justify-center px-8 py-3 rounded-full border border-black text-black text-sm font-semibold transition hover:bg-black/10"
            >
              {t("story", "button")}
            </Link>
          </motion.div>

        </div>

        <div className="absolute bottom-0 left-0 w-full h-[320px] z-0 bg-gradient-to-t from-white via-white to-transparent pointer-events-none" />

      </section>
    </FadeUp>
  );
}