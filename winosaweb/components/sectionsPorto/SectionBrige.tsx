"use client";

import { motion } from "framer-motion";
import FadeUp from "@/components/animation/FadeUp";
import styles from "@/app/[locale]/portofolio/portfolio.module.css";
import { useTranslate } from "@/lib/useTranslate";

interface StatItem {
  value: string;
  label: string;
}

interface BridgeData {
  quote?: string;
  stats?: StatItem[];
}

const DEFAULT_STATS: StatItem[] = [
  { value: "24+", label: "Team Members" },
  { value: "15+", label: "Projects Done" },
  { value: "100%", label: "Quality Guaranteed" },
];

export default function SectionBridge({ bridgeData }: { bridgeData?: BridgeData | null }) {
  const { t } = useTranslate();

  const quote = bridgeData?.quote || t("portfolioBridge", "title");
  const stats = bridgeData?.stats || DEFAULT_STATS;

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
              {quote}
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
                key={i}
                className={styles.bridgeStatCard}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
                viewport={{ once: true }}
              >
                <div className={styles.bridgeStatIcon} aria-hidden="true">
                  ◉
                </div>
                <div>
                  <div className={styles.bridgeStatLabel}>
                    {stat.label}
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
