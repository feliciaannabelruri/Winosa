"use client";

import { motion } from "framer-motion";
import FadeUp from "@/components/animation/FadeUp";
import styles from "@/app/portofolio/portfolio.module.css";
import { useTranslate } from "@/lib/useTranslate";

interface ExplanationData {
  badge?: string;
  title1?: string;
  title2?: string;
  description?: string;
}

export default function SectionExplanation({ explanationData }: { explanationData?: ExplanationData | null }) {
  const { t } = useTranslate();

  const badge       = explanationData?.badge       || t("portfolioExplanation", "badge");
  const title1      = explanationData?.title1      || t("portfolioExplanation", "title1");
  const title2      = explanationData?.title2      || t("portfolioExplanation", "title2");
  const description = explanationData?.description || t("portfolioExplanation", "description");

  return (
    <FadeUp>
      <section
        className={styles.explanationSection}
        aria-labelledby="portfolio-explanation-title"
      >
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
            <motion.span
              className={styles.explanationBadge}
              variants={{
                hidden: { opacity: 0, y: 60 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.8 }}
            >
              {badge}
            </motion.span>

            <motion.h2
              id="portfolio-explanation-title"
              className={styles.explanationTitle}
              variants={{
                hidden: { opacity: 0, y: 60 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.8 }}
            >
              {title1}{" "}
              <span>
                {title2}
              </span>
            </motion.h2>

            <motion.p
              className={styles.explanationText}
              variants={{
                hidden: { opacity: 0, y: 60 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.8 }}
            >
              {description}
            </motion.p>
          </motion.div>
        </div>
      </section>
    </FadeUp>
  );
}