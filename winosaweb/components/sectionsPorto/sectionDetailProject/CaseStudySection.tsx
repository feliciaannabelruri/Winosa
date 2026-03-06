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
      <section className={styles.caseStudySection}>
        <div className={styles.caseStudyContainer}>

          {/* TITLE */}
          <motion.h2
            className={styles.sectionTitle}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {t("portfolioCaseStudy", "title")}
          </motion.h2>


          {/* FLOW */}
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

            {/* STEP 1 */}
            <motion.div
              className={styles.caseStudyBlock}
              variants={{
                hidden: { opacity: 0, y: 60 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.8 }}
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


            {/* STEP 2 */}
            <motion.div
              className={styles.caseStudyBlock}
              variants={{
                hidden: { opacity: 0, y: 60 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.8 }}
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


            {/* STEP 3 */}
            <motion.div
              className={styles.caseStudyBlock}
              variants={{
                hidden: { opacity: 0, y: 60 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.8 }}
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


          {/* METRICS */}
          {project.metrics && project.metrics.length > 0 && (
            <motion.div
              className={styles.metricsWrapper}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.15,
                  },
                },
              }}
            >
              <motion.h3
                className={styles.metricsTitle}
                variants={{
                  hidden: { opacity: 0, y: 60 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.8 }}
              >
                {t("portfolioCaseStudy", "impact")}
              </motion.h3>

              <div className={styles.metricsGrid}>
                {project.metrics.map((metric, index) => (
                  <motion.div
                    key={index}
                    className={styles.metricCard}
                    variants={{
                      hidden: { opacity: 0, y: 60 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    transition={{ duration: 0.7 }}
                  >
                    <span className={styles.metricValue}>
                      {metric.value}
                    </span>

                    <span className={styles.metricLabel}>
                      {metric.label}
                    </span>

                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

        </div>
      </section>
    </FadeUp>
  );
}
