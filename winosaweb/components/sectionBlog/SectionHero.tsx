"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useTranslate } from "@/lib/useTranslate";

export default function SectionBlogHero() {
  const { t } = useTranslate();

  return (
    <section
      aria-labelledby="blog-hero-title"
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* background */}
      <Image
        src="/bg/bg9.jpg"
        alt=""
        fill
        priority
        quality={75}
        sizes="100vw"
        className="object-cover z-0"
      />

      {/* smooth overlay (tidak ngeblok) */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />

      <motion.div
        className="relative z-20 max-w-6xl mx-auto px-6 text-center text-white"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.15 } },
        }}
        style={{ transform: "translateZ(0)" }}
      >

        {/* badge */}
        <motion.div
          className="flex items-center justify-center gap-4 mb-8"
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.5 }}
        >
          <span className="w-10 h-px bg-white/50" aria-hidden="true" />

          <span
            className="px-6 py-2 rounded-full border border-white/70 text-xs font-semibold tracking-wider backdrop-blur-sm"
            role="text"
          >
            {t("blogHero", "badge")}
          </span>

          <span className="w-10 h-px bg-white/50" aria-hidden="true" />
        </motion.div>

        {/* title */}
        <motion.h1
          id="blog-hero-title"
          className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight"
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.6 }}
        >
          {t("blogHero", "title")}
        </motion.h1>

        {/* description */}
        <motion.p
          className="text-white/90 text-lg max-w-2xl mx-auto mb-12 leading-relaxed"
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.6 }}
        >
          {t("blogHero", "description")}
        </motion.p>

        {/* CTA */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.6 }}
        >
          <Link
            href="/Contact"
            aria-label={`Contact us about ${t("blogHero", "title")}`}
            className="inline-block px-8 py-3 rounded-full border border-white text-white font-semibold transition hover:bg-white/20"
          >
            {t("blogHero", "cta")}
          </Link>
        </motion.div>

      </motion.div>

      <div className="absolute bottom-0 left-0 w-full h-[35%] z-10 pointer-events-none bg-gradient-to-t from-white via-white/70 to-transparent" />
    </section>
  );
}