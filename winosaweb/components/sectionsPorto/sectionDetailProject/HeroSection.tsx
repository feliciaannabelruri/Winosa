"use client";

import { motion } from "framer-motion";
import FadeUp from "@/components/animation/FadeUp";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import styles from "@/app/[locale]/portofolio/[slug]/detail.module.css";
import { useTranslate } from "@/lib/useTranslate";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translateHybrid } from "@/lib/translateHybrid";
import { useEffect, useState } from "react";
import { useLocaleRouter } from "@/lib/useLocaleRouter";

interface HeroSectionProps {
  project: {
    title: string;
    description: string;
    longDescription?: string;
    category: string;
    client: string;
    year: string;
    duration?: string;
    role?: string;
    technologies: string[];
    projectUrl?: string;
  };
}

export default function HeroSection({ project }: HeroSectionProps) {
  const { t, tApi } = useTranslate();
  const { language } = useLanguageStore();
  const { localePath } = useLocaleRouter();
  const [translated, setTranslated] = useState(project);

  useEffect(() => {
    setTranslated(project);
    const run = async () => {
      const [title, category] = await Promise.all([
        translateHybrid(project.title, language, tApi),
        translateHybrid(project.category, language, tApi),
      ]);
      setTranslated(prev => ({ ...prev, title, category }));
    };
    run();
  }, [project, language]);

  const infoPills = [
    { label: t("portfolioDetailMisc", "client"),   value: project.client   },
    { label: t("portfolioDetailMisc", "year"),     value: project.year      },
    { label: t("portfolioDetailMisc", "duration"), value: project.duration  },
    { label: t("portfolioDetailMisc", "role"),     value: project.role      },
  ].filter(p => p.value && p.value !== '-');

  return (
    <FadeUp disableInView>
      <section className={styles.heroNew} aria-labelledby="project-hero-title">

        <div className={styles.heroNewGrid} aria-hidden="true" />
        <div className={styles.heroNewGlow} aria-hidden="true" />

        {/* Back button — stay left */}
        <div className={styles.heroNewBackWrapper}>
          <Link href={localePath("/portofolio")} className={styles.heroNewBack}>
            <ArrowLeft size={14} />
            {t("backButton", "portfolio")}
          </Link>
        </div>

        {/* Center content */}
        <div className={styles.heroNewInner}>

          <motion.span
            className={styles.heroNewCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {translated.category}
          </motion.span>

          <motion.h1
            id="project-hero-title"
            className={styles.heroNewTitle}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            {translated.title}
          </motion.h1>

          <motion.p
            className={styles.heroNewDesc}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {translated.description}
          </motion.p>

          {/* Info Pills — Client, Year, Duration, Role */}
          {infoPills.length > 0 && (
            <motion.div
              className={styles.heroNewPills}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {infoPills.map((pill, i) => (
                <span key={i} className={styles.heroNewPill}>
                  <span className={styles.heroNewPillLabel}>{pill.label}</span>
                  {pill.value}
                </span>
              ))}
            </motion.div>
          )}

          {/* Tech Stack Pills */}
          {project.technologies?.length > 0 && (
            <motion.div
              className={styles.heroNewTechRow}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.38 }}
            >
              {project.technologies.map((tech, i) => (
                <span key={i} className={styles.heroNewTechTag}>
                  {tech}
                </span>
              ))}
            </motion.div>
          )}

          {/* Visit Button */}
          {project.projectUrl && (
            <motion.a
              href={project.projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.heroNewBtn}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
            >
              {t("portfolioDetailMisc", "visitProject")}
            </motion.a>
          )}

        </div>

        <div className={styles.heroNewFade} aria-hidden="true" />
      </section>
    </FadeUp>
  );
}
