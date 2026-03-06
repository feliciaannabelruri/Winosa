"use client";

import { motion } from "framer-motion";
import FadeUp from "@/components/animation/FadeUp";
import styles from "@/app/portofolio/portfolio.module.css";
import { useTranslate } from "@/lib/useTranslate";

export default function SectionExplanation() {
  const { t } = useTranslate();

  return (
    <FadeUp>
      <section className={styles.explanationSection}>
        <div className={styles.explanationContainer}>
          <motion.div
            className={styles.explanationContent}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.2,
                },
              },
            }}
          >

            {/* BADGE */}
            <motion.span
              className={styles.explanationBadge}
              variants={{
                hidden: { opacity: 0, y: 60 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.8 }}
            >
              {t("portfolioExplanation", "badge")}
            </motion.span>


            {/* TITLE */}
            <motion.h2
              className={styles.explanationTitle}
              variants={{
                hidden: { opacity: 0, y: 60 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.8 }}
            >
              {t("portfolioExplanation", "title1")}{" "}
              <span>
                {t("portfolioExplanation", "title2")}
              </span>
            </motion.h2>


            {/* DESCRIPTION */}
            <motion.p
              className={styles.explanationText}
              variants={{
                hidden: { opacity: 0, y: 60 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.8 }}
            >
              {t("portfolioExplanation", "description")}
            </motion.p>


            {/* STATS */}
            <motion.div
              className={styles.highlightStats}
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.2,
                  },
                },
              }}
            >

              {/* TEAM */}
              <motion.div
                className={styles.highlightItem}
                variants={{
                  hidden: { opacity: 0, y: 60 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.8 }}
              >
                <h3 className={styles.highlightNumber}>
                  24+
                </h3>
                <p className={styles.highlightLabel}>
                  {t("portfolioExplanation.stats", "team")}
                </p>
              </motion.div>


              {/* PROJECTS */}
              <motion.div
                className={styles.highlightItem}
                variants={{
                  hidden: { opacity: 0, y: 60 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.8 }}
              >
                <h3 className={styles.highlightNumber}>
                  15+
                </h3>
                <p className={styles.highlightLabel}>
                  {t("portfolioExplanation.stats", "projects")}
                </p>
              </motion.div>


              {/* QUALITY */}
              <motion.div
                className={styles.highlightItem}
                variants={{
                  hidden: { opacity: 0, y: 60 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.8 }}
              >
                <h3 className={styles.highlightNumber}>
                  100%
                </h3>
                <p className={styles.highlightLabel}>
                  {t("portfolioExplanation.stats", "quality")}
                </p>
              </motion.div>

            </motion.div>

          </motion.div>
        </div>
      </section>
    </FadeUp>
  );
}
