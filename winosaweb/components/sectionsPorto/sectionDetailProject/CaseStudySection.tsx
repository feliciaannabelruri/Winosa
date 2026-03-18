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
    metrics?: Array<{
      value: string;
      label: string;
    }>;
  };
}

export default function CaseStudySection({ project }: CaseStudySectionProps) {

  const { t, tApi } = useTranslate();
  const { language } = useLanguageStore();

  // ✅ state hasil translate
  const [translated, setTranslated] = useState(project);

  useEffect(() => {

    const run = async () => {

      const mapped = {
        ...project,
        challenge: await translateHybrid(project.challenge, language, tApi),
        solution: await translateHybrid(project.solution, language, tApi),
        result: await translateHybrid(project.result, language, tApi),
        metrics: project.metrics
          ? await Promise.all(
              project.metrics.map(async (m) => ({
                ...m,
                label: await translateHybrid(m.label, language, tApi),
              }))
            )
          : [],
      };

      setTranslated(mapped);

    };

    run();

  }, [project, language]);

  return (
    <FadeUp>
      <section className={styles.caseStudySection}>
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
              visible: { transition: { staggerChildren: 0.2 } },
            }}
          >

            {/* CHALLENGE */}
            <motion.div
              className={styles.caseStudyBlock}
              variants={{ hidden: { opacity: 0, y: 60 }, visible: { opacity: 1, y: 0 } }}
            >
              <span className={styles.caseStudyStep}>
                {t("portfolioCaseStudy", "step01")}
              </span>

              <h3 className={styles.caseStudyTitle}>
                {t("portfolioCaseStudy", "challenge")}
              </h3>

              <p className={styles.caseStudyText}>
                {translated.challenge}
              </p>
            </motion.div>

            {/* SOLUTION */}
            <motion.div
              className={styles.caseStudyBlock}
              variants={{ hidden: { opacity: 0, y: 60 }, visible: { opacity: 1, y: 0 } }}
            >
              <span className={styles.caseStudyStep}>
                {t("portfolioCaseStudy", "step02")}
              </span>

              <h3 className={styles.caseStudyTitle}>
                {t("portfolioCaseStudy", "solution")}
              </h3>

              <p className={styles.caseStudyText}>
                {translated.solution}
              </p>
            </motion.div>

            {/* RESULT */}
            <motion.div
              className={styles.caseStudyBlock}
              variants={{ hidden: { opacity: 0, y: 60 }, visible: { opacity: 1, y: 0 } }}
            >
              <span className={styles.caseStudyStep}>
                {t("portfolioCaseStudy", "step03")}
              </span>

              <h3 className={styles.caseStudyTitle}>
                {t("portfolioCaseStudy", "result")}
              </h3>

              <p className={styles.caseStudyText}>
                {translated.result}
              </p>
            </motion.div>

          </motion.div>

          {/* METRICS (optional) */}
          {translated.metrics && translated.metrics.length > 0 && (
            <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {translated.metrics.map((m, i) => (
                <div key={i}>
                  <div className="text-3xl font-bold text-black">
                    {m.value}
                  </div>
                  <div className="text-sm text-black/60">
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>
    </FadeUp>
  );
}