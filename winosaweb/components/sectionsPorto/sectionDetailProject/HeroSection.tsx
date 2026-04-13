"use client";

import { motion } from "framer-motion";
import FadeUp from "@/components/animation/FadeUp";
import Image from "next/image";
import styles from "@/app/portofolio/[slug]/detail.module.css";
import { useTranslate } from "@/lib/useTranslate";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translateHybrid } from "@/lib/translateHybrid";
import { useEffect, useState } from "react";

interface HeroSectionProps {
  project: {
    heroImage: string;
    title: string;
    description: string;
    longDescription?: string;
    category: string;
    client: string;
    year: string;
  };
}

export default function HeroSection({ project }: HeroSectionProps) {
  const { tApi } = useTranslate();
  const { language } = useLanguageStore();
  const [translated, setTranslated] = useState(project);

  useEffect(() => {
    setTranslated(project);
    const run = async () => {
      const [title, category] = await Promise.all([
        translateHybrid(project.title, language, tApi),
        translateHybrid(project.category, language, tApi),
      ]);
      setTranslated((prev) => ({ ...prev, title, category }));
      if (project.longDescription) {
        const longDescription = await translateHybrid(project.longDescription, language, tApi);
        setTranslated((prev) => ({ ...prev, longDescription }));
      }
    };
    run();
  }, [project, language]);

  const displayText = translated.longDescription?.trim() || translated.description;

  return (
    <FadeUp disableInView>
      <section className={styles.heroSplit} aria-labelledby="project-hero-title">

        {/* Background — matching halaman porto */}
        <div className={styles.heroSplitGrid} aria-hidden="true" />
        <div className={styles.heroSplitLight} aria-hidden="true" />
        <div className={styles.heroSplitOverlay} aria-hidden="true" />

        <div className={styles.heroSplitInner}>

          {/* LEFT — teks */}
          <motion.div
            className={styles.heroSplitLeft}
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.15 } },
            }}
          >
            {/* Kategori */}
            <motion.span
              className={styles.heroSplitCategory}
              variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.6 }}
            >
              {translated.category}
            </motion.span>

            {/* Judul */}
            <motion.h1
              id="project-hero-title"
              className={styles.heroSplitTitle}
              variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.7 }}
            >
              {translated.title}
            </motion.h1>

            {/* Long description — semua paragraf */}
            {displayText && (
              <motion.p
                className={styles.heroSplitDesc}
                variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.7 }}
              >
                {displayText}
              </motion.p>
            )}
          </motion.div>

          {/* RIGHT — gambar */}
          <motion.div
            className={styles.heroSplitRight}
            initial={{ opacity: 0, x: 60, rotate: 1 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className={styles.heroSplitImageCard}>
              <Image
                src={project.heroImage}
                alt={translated.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: "cover" }}
              />
              <div className={styles.heroSplitImageAccent} aria-hidden="true" />
            </div>

            {/* Floating badge */}
            <motion.div
              className={styles.heroSplitBadge}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <span className={styles.heroSplitBadgeDot} />
              Live Project
            </motion.div>
          </motion.div>

        </div>

        <div className={styles.heroSplitFade} aria-hidden="true" />
      </section>
    </FadeUp>
  );
}