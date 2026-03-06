"use client";

import { motion } from "framer-motion";
import FadeUp from "@/components/animation/FadeUp";
import Link from "next/link";
import { useTranslate } from "@/lib/useTranslate";

export default function SectionBlogHero() {

  const { t } = useTranslate();

  return (
    <FadeUp>
      <section
        className="relative w-full min-h-screen flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: "url('/bg/bg9.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/50" />

        <motion.div
          className="relative z-10 max-w-6xl mx-auto px-6 text-center text-white"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.2 } },
          }}
        >

          {/* BADGE */}
          <motion.div
            className="flex items-center justify-center gap-4 mb-8"
            variants={{
              hidden: { opacity: 0, y: 60 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.8 }}
          >
            <span className="w-10 h-px bg-white/60" />

            <span className="px-6 py-2 rounded-full border border-white/70 text-xs font-semibold tracking-wider">
              {t("blogHero", "badge")}
            </span>

            <span className="w-10 h-px bg-white/60" />
          </motion.div>

          {/* TITLE */}
          <motion.h1
            className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight"
            variants={{
              hidden: { opacity: 0, y: 60 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.8 }}
          >
            {t("blogHero", "title")}
          </motion.h1>

          {/* DESCRIPTION */}
          <motion.p
            className="text-white/90 text-lg max-w-2xl mx-auto mb-12 leading-relaxed"
            variants={{
              hidden: { opacity: 0, y: 60 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.8 }}
          >
            {t("blogHero", "description")}
          </motion.p>

          {/* BUTTON */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 60 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.8 }}
          >
            <Link
              href="/Contact"
              className="inline-block px-8 py-3 rounded-full border border-white text-white font-semibold transition hover:bg-white/20"
            >
              {t("blogHero", "cta")}
            </Link>
          </motion.div>

        </motion.div>

        <div className="absolute bottom-0 left-0 w-full h-[30%] bg-gradient-to-t from-white to-transparent" />
      </section>
    </FadeUp>
  );
}