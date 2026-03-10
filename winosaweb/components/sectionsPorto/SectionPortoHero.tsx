"use client";

import { motion } from "framer-motion";
import FadeUp from "@/components/animation/FadeUp";
import styles from "@/app/portofolio/portfolio.module.css";
import { useTranslate } from "@/lib/useTranslate";

export default function SectionPortoHero() {
  const { t } = useTranslate();

  const scrollToCards = () => {
    const cardsSection = document.getElementById("portfolio-cards");
    if (cardsSection) {
      cardsSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <FadeUp>
      <section
        className={styles.hero}
        aria-label="Portfolio hero section"
      >
        <div className={styles.overlay} />

        <motion.div
          className={styles.content}
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
        >
          <motion.h1
            className={styles.title}
            variants={{
              hidden: { opacity: 0, y: 60 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.8 }}
          >
            {t("portfolioHero", "title").split(" ")[0]}{" "}
            <span>
              {t("portfolioHero", "title").split(" ").slice(1).join(" ")}
            </span>
          </motion.h1>

          <motion.h2
            className={styles.tagline}
            variants={{
              hidden: { opacity: 0, y: 60 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.8 }}
          >
            {t("portfolioHero", "tagline")}
          </motion.h2>

          <motion.p
            className={styles.subtitle}
            variants={{
              hidden: { opacity: 0, y: 60 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.8 }}
          >
            {t("portfolioHero", "subtitle")}
          </motion.p>

          <motion.button
            aria-label="Scroll to portfolio projects"
            className={styles.heroButton}
            onClick={scrollToCards}
            variants={{
              hidden: { opacity: 0, y: 60 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.8 }}
          >
            {t("portfolioHero", "button")}
            <span
              className={styles.arrow}
              aria-hidden="true"
            >
              →
            </span>
          </motion.button>
        </motion.div>
      </section>
    </FadeUp>
  );
}