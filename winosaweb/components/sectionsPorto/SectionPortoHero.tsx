"use client";

import { motion } from "framer-motion";
import { useTranslate } from "@/lib/useTranslate";
import styles from "@/app/portofolio/portfolio.module.css";

export default function SectionPortoHero() {
  const { t } = useTranslate();
  const title = t("portfolioHero", "title").split(" ");

  return (
    <section
      className={styles.hero}
      aria-labelledby="portfolio-hero-title"
    >
      {/* background layers */}
      <div className={styles.overlay} aria-hidden="true" />
      <div className={styles.heroBottomFade} aria-hidden="true" />

      {/* content */}
      <div className={styles.content}>
        <motion.h1
          id="portfolio-hero-title"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={styles.title}
        >
          {title[0]}{" "}
          <span>{title.slice(1).join(" ")}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className={styles.subtitle}
        >
          {t("portfolioHero", "subtitle")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <button
            type="button"
            onClick={() => {
              document.getElementById("projects")?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }}
            className={styles.exploreBtn}
          >
            Explore Projects
          </button>
        </motion.div>
      </div>
    </section>
  );
}