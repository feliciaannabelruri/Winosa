"use client";

import { motion } from "framer-motion";
import FadeUp from "@/components/animation/FadeUp";
import styles from "@/app/portofolio/[slug]/detail.module.css";
import { useTranslate } from "@/lib/useTranslate";

interface CaseStudySectionProps {
  project: {
    challenge: string;
    solution: string;
    result: string;
    metrics?: Array<{
      value: string;
      label: string;
    }>;
  };
}

export default function CaseStudySection({ project }: CaseStudySectionProps) {
  const { t } = useTranslate();

  return (
    <FadeUp>
      <section
        className={styles.caseStudySection}
        aria-label="Project case study"
      >
        <div className={styles.caseStudyContainer}>

          <motion.h2
            className={styles.sectionTitle}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {t("portfolioCaseStudy", "title")}
          </motion.h2>

          <motion.div
            className={styles.caseStudyFlow}
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

            <motion.div
              className={styles.caseStudyBlock}
              variants={{
                hidden: { opacity: 0, y: 60 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <span className={styles.caseStudyStep}>
                {t("portfolioCaseStudy", "step01")}
              </span>

              <h3 className={styles.caseStudyTitle}>
                {t("portfolioCaseStudy", "challenge")}
              </h3>

              <p className={styles.caseStudyText}>
                {project.challenge}
              </p>
            </motion.div>

            <motion.div
              className={styles.caseStudyBlock}
              variants={{
                hidden: { opacity: 0, y: 60 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <span className={styles.caseStudyStep}>
                {t("portfolioCaseStudy", "step02")}
              </span>

              <h3 className={styles.caseStudyTitle}>
                {t("portfolioCaseStudy", "solution")}
              </h3>

              <p className={styles.caseStudyText}>
                {project.solution}
              </p>
            </motion.div>

            <motion.div
              className={styles.caseStudyBlock}
              variants={{
                hidden: { opacity: 0, y: 60 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <span className={styles.caseStudyStep}>
                {t("portfolioCaseStudy", "step03")}
              </span>

              <h3 className={styles.caseStudyTitle}>
                {t("portfolioCaseStudy", "result")}
              </h3>

              <p className={styles.caseStudyText}>
                {project.result}
              </p>
            </motion.div>

          </motion.div>

        </div>
      </section>
    </FadeUp>
  );
}