"use client";

import { motion } from "framer-motion";
import styles from "@/app/portofolio/portfolio.module.css";
import { useTranslate } from "@/lib/useTranslate";

const floatingShapes = [
  { size: 420, x: "72%", y: "-10%", delay: 0,   duration: 14, opacity: 0.18, color: "#ffffff" },
  { size: 260, x: "-8%", y: "55%",  delay: 2,   duration: 18, opacity: 0.15, color: "#ffffff" },
  { size: 180, x: "85%", y: "60%",  delay: 1,   duration: 12, opacity: 0.2,  color: "#c8680a" },
  { size: 120, x: "30%", y: "10%",  delay: 3,   duration: 16, opacity: 0.1,  color: "#7a4500" },
  { size: 80,  x: "55%", y: "75%",  delay: 0.5, duration: 10, opacity: 0.12, color: "#ffffff" },
  { size: 50,  x: "10%", y: "20%",  delay: 1.5, duration: 8,  opacity: 0.15, color: "#c8680a" },
];

export default function SectionPortoHero() {
  const { t } = useTranslate();

  const scrollToCards = () => {
    const cardsSection = document.getElementById("portfolio-cards");
    if (cardsSection) {
      cardsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className={styles.hero} aria-labelledby="portfolio-hero-title">

      {/* Animated background shapes */}
      <div className={styles.shapesLayer} aria-hidden="true">
        {floatingShapes.map((shape, i) => (
          <motion.div
            key={i}
            className={styles.floatingShape}
            style={{
              width: shape.size,
              height: shape.size,
              left: shape.x,
              top: shape.y,
              background: `radial-gradient(circle, ${shape.color} 0%, transparent 70%)`,
              opacity: shape.opacity,
            }}
            animate={{
              y: [0, -30, 0, 20, 0],
              x: [0, 15, -10, 5, 0],
              scale: [1, 1.08, 0.96, 1.04, 1],
            }}
            transition={{
              duration: shape.duration,
              delay: shape.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Subtle grid overlay */}
        <div className={styles.gridOverlay} />
      </div>

      <div className={styles.overlay} aria-hidden="true" />

      <motion.div
        className={styles.content}
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.18 } },
        }}
      >
        {/* Eyebrow badge */}
        <motion.div
          className={styles.heroBadge}
          variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.6 }}
        >
          <span className={styles.heroBadgeDot} aria-hidden="true" />
          Real Projects, Real Results
        </motion.div>

        <motion.h1
          id="portfolio-hero-title"
          className={styles.title}
          variants={{ hidden: { opacity: 0, y: 60 }, visible: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.8 }}
        >
          {t("portfolioHero", "title").split(" ")[0]}{" "}
          <span>{t("portfolioHero", "title").split(" ").slice(1).join(" ")}</span>
        </motion.h1>

        <motion.p
          className={styles.subtitle}
          variants={{ hidden: { opacity: 0, y: 60 }, visible: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.8 }}
        >
          {t("portfolioHero", "subtitle")}
        </motion.p>

        <motion.div
          className={styles.heroActions}
          variants={{ hidden: { opacity: 0, y: 60 }, visible: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.8 }}
        >
          <button
            type="button"
            aria-controls="portfolio-cards"
            aria-label="Scroll to portfolio projects"
            className={styles.heroButton}
            onClick={scrollToCards}
          >
            {t("portfolioHero", "button")}
            <span className={styles.arrow} aria-hidden="true">→</span>
          </button>
        </motion.div>
      </motion.div>

      {/* Bottom fade */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "35%",
          pointerEvents: "none",
          background: "linear-gradient(to top, rgba(255,255,255,1) 10%, rgba(255,255,255,0) 100%)",
        }}
      />
    </section>
  );
}