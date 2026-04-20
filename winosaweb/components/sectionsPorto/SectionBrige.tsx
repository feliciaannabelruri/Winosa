"use client";

import { motion } from "framer-motion";
import FadeUp from "@/components/animation/FadeUp";
import styles from "@/app/portofolio/portfolio.module.css";
import { useTranslate } from "@/lib/useTranslate";

const stats = [
  { icon: "◉", value: "24+", labelKey: "team" },
  { icon: "◉", value: "15+", labelKey: "projects" },
  { icon: "◉", value: "100%", labelKey: "quality" },
];

export default function SectionBridge() {
  const { t } = useTranslate();

  return (
    <FadeUp>
      <section
        className={styles.bridgeSection}
        aria-labelledby="portfolio-bridge-title"
      >
        <div className={styles.bridgeInner}>

          {/* LEFT — quote */}
          <motion.div
            className={styles.bridgeLeft}
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <div className={styles.bridgeEyebrow} aria-hidden="true">
              <span className={styles.bridgeEyebrowLine} />
              Our belief
            </div>

            <h2
              id="portfolio-bridge-title"
              className={styles.bridgeQuote}
            >
              {t("portfolioBridge", "title")}
            </h2>
          </motion.div>

          {/* RIGHT — stats */}
          <motion.div
            className={styles.bridgeRight}
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
            viewport={{ once: true }}
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.labelKey}
                className={styles.bridgeStatCard}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
                viewport={{ once: true }}
              >
                <div className={styles.bridgeStatIcon} aria-hidden="true">
                  {stat.icon}
                </div>
                <div>
                  <div className={styles.bridgeStatLabel}>
                    {t("portfolioExplanation.stats", stat.labelKey)}
                  </div>
                  <div className={styles.bridgeStatValue}>{stat.value}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </section>
    </FadeUp>
  );
}