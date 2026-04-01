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
      <Image
        src="/bg/bg9.jpg"
        alt=""
        fill
        priority
        quality={75}
        sizes="100vw"
        className="object-cover z-0"
      />

      <div className="absolute inset-0 bg-black/50 z-10" />

      <motion.div
        className="relative z-20 max-w-6xl mx-auto px-6 text-center text-white"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.2 } },
        }}
        style={{ transform: "translateZ(0)" }}
      >

        <motion.div
          className="flex items-center justify-center gap-4 mb-8"
          variants={{
            hidden: { opacity: 0, y: 60 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <span className="w-10 h-px bg-white/60" aria-hidden="true" />

          <span
            className="px-6 py-2 rounded-full border border-white/70 text-xs font-semibold tracking-wider"
            role="text"
          >
            {t("blogHero", "badge")}
          </span>

          <span className="w-10 h-px bg-white/60" aria-hidden="true" />
        </motion.div>

        <motion.h1
          id="blog-hero-title"
          className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight"
          variants={{
            hidden: { opacity: 0, y: 60 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          {t("blogHero", "title")}
        </motion.h1>

        <motion.p
          className="text-white/90 text-lg max-w-2xl mx-auto mb-12 leading-relaxed"
          variants={{
            hidden: { opacity: 0, y: 60 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          {t("blogHero", "description")}
        </motion.p>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 60 },
            visible: { opacity: 1, y: 0 },
          }}
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

      <div
        className="absolute bottom-0 left-0 w-full h-[30%] z-10 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to top, rgba(255,255,255,1) 10%, rgba(255,255,255,0) 100%)",
        }}
      />
    </section>
  );
}