"use client";

import { motion } from "framer-motion";
import FadeUp from "@/components/animation/FadeUp";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
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
    projectUrl?: string;
  };
}

export default function HeroSection({ project }: HeroSectionProps) {
  const { t, tApi } = useTranslate();
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

        <div className={styles.heroSplitInner} style={{ marginTop: '-35px' }}>

          {/* LEFT — teks */}
          <motion.div
            className={styles.heroSplitLeft}
            style={{ paddingBottom: '50px' }}
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.15 } },
            }}
          >
          {/* Back button */}
            <Link
              href="/portofolio"
              className="inline-flex items-center gap-2 text-sm font-medium text-white/60 hover:text-white mb-6 group transition-colors duration-200"
            >
              <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform duration-200" />
              {t("backButton", "portfolio")}
            </Link>

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

            {/* Long description */}
            {displayText && (
              <motion.p
                className={styles.heroSplitDesc}
                variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.7 }}
              >
                {displayText}
              </motion.p>
            )}

            {project.projectUrl && (
              <motion.a
                href={project.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.7 }}
                whileHover={{ scale: 1.05, backgroundColor: '#f0f0f0' }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginTop: '24px',
                  padding: '12px 28px',
                  background: 'white',
                  color: '#0a0a0a',
                  borderRadius: '999px',
                  fontWeight: 600,
                  fontSize: '15px',
                  textDecoration: 'none',
                  width: 'fit-content',
                  cursor: 'pointer',
                }}
              >
                {t("portfolioDetailMisc", "visitProject")}
              </motion.a>
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
          </motion.div>

        </div>

        <div className={styles.heroSplitFade} aria-hidden="true" />
      </section>
    </FadeUp>
  );
}