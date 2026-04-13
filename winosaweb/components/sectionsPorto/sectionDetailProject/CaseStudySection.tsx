"use client";

import { motion } from "framer-motion";
import FadeUp from "@/components/animation/FadeUp";
import styles from "@/app/portofolio/[slug]/detail.module.css";
import { useTranslate } from "@/lib/useTranslate";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translateHybrid } from "@/lib/translateHybrid";
import { useEffect, useState } from "react";

interface CaseStudySectionProps {
  project: {
    challenge: string;
    solution: string;
    result: string;
    metrics?: Array<{ value: string; label: string }>;
  };
}

const STEPS = [
  { key: "challenge" as const, stepKey: "step01" as const, num: "01" },
  { key: "solution"  as const, stepKey: "step02" as const, num: "02" },
  { key: "result"    as const, stepKey: "step03" as const, num: "03" },
];

export default function CaseStudySection({ project }: CaseStudySectionProps) {
  const { t, tApi } = useTranslate();
  const { language } = useLanguageStore();
  const [translated, setTranslated] = useState(project);

  useEffect(() => {
    const run = async () => {
      const [challenge, solution, result] = await Promise.all([
        translateHybrid(project.challenge, language, tApi),
        translateHybrid(project.solution,  language, tApi),
        translateHybrid(project.result,    language, tApi),
      ]);

      const metrics = project.metrics
        ? await Promise.all(
            project.metrics.map(async (m) => ({
              ...m,
              label: await translateHybrid(m.label, language, tApi),
            }))
          )
        : [];

      setTranslated({ ...project, challenge, solution, result, metrics });
    };
    run();
  }, [project, language]);

  const stepTitles: Record<string, string> = {
    challenge: t("portfolioCaseStudy", "challenge"),
    solution:  t("portfolioCaseStudy", "solution"),
    result:    t("portfolioCaseStudy", "result"),
  };

  return (
    <FadeUp>
      <section
        className={styles.caseStudySectionA}
        aria-labelledby="case-study-title"
      >
        <div className={styles.caseStudyContainerA}>

          {/* Header */}
          <motion.div
            className={styles.caseStudyHeaderA}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <span className={styles.infoEyebrow}>
              <span className={styles.infoEyebrowLine} />
              {t("portfolioCaseStudy", "title")}
            </span>
          </motion.div>

          {/* Steps */}
          <motion.div
            className={styles.caseStudyFlowA}
            role="list"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.18 } },
            }}
          >
            {STEPS.map(({ key, stepKey, num }) => (
              <motion.div
                key={key}
                role="listitem"
                className={styles.caseStudyBlockA}
                variants={{
                  hidden: { opacity: 0, x: -40 },
                  visible: { opacity: 1, x: 0 },
                }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className={styles.caseStudyNumberA} aria-hidden="true">
                  {num}
                </span>

                <div className={styles.caseStudyBlockContent}>
                  <span className={styles.caseStudyStepA}>
                    {t("portfolioCaseStudy", stepKey)}
                  </span>
                  <h3 className={styles.caseStudyTitleA}>
                    {stepTitles[key]}
                  </h3>
                  <p className={styles.caseStudyTextA}>
                    {translated[key]}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Metrics — opsional */}
          {translated.metrics && translated.metrics.length > 0 && (
            <motion.div
              className={styles.metricsWrapperA}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <div className={styles.metricsGridA} role="list">
                {translated.metrics.map((m, i) => (
                  <motion.div
                    key={i}
                    role="listitem"
                    className={styles.metricCardA}
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                      delay: i * 0.1,
                      duration: 0.5,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    viewport={{ once: true }}
                  >
                    <span className={styles.metricValueA}>{m.value}</span>
                    <span className={styles.metricLabelA}>{m.label}</span>
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