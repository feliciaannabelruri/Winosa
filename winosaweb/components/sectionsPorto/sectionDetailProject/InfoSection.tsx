"use client";

import { motion } from "framer-motion";
import FadeUp from "@/components/animation/FadeUp";
import styles from "@/app/portofolio/[slug]/detail.module.css";
import { useTranslate } from "@/lib/useTranslate";

interface InfoSectionProps {
  project: {
    client: string;
    year: string;
    duration?: string;
    role?: string;
    technologies: string[];
  };
}

export default function InfoSection({ project }: InfoSectionProps) {
  const { t } = useTranslate();

  return (
    <FadeUp>
      <section
        className={styles.infoSection}
        aria-label="Project overview"
      >
        <div className={styles.infoContainer}>

          <motion.h2
            className={styles.sectionTitle}
          >
            {t("portfolioDetail", "overview")}
          </motion.h2>

          <div className={styles.infoGrid}>

            <div className={styles.infoCard}>
              <span className={styles.infoLabel}>
                {t("portfolioDetail", "client")}
              </span>

              <span className={styles.infoValue}>
                {project.client}
              </span>
            </div>

            <div className={styles.infoCard}>
              <span className={styles.infoLabel}>
                {t("portfolioDetail", "year")}
              </span>

              <span className={styles.infoValue}>
                {project.year}
              </span>
            </div>

          </div>

          <div className={styles.techStack}>
            <h3 className={styles.techStackTitle}>
              {t("portfolioDetail", "technologies")}
            </h3>

            <div className={styles.techTags}>
              {project.technologies.map((tech, index) => (

                <span
                  key={index}
                  className={styles.techTag}
                >
                  {tech}
                </span>

              ))}
            </div>

          </div>

        </div>
      </section>
    </FadeUp>
  );
}