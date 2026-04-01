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
        aria-labelledby="project-overview-title"
      >
        <div className={styles.infoContainer}>

          <motion.h2
            id="project-overview-title"
            className={styles.sectionTitle}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            {t("portfolioDetail", "overview")}
          </motion.h2>

          <div className={styles.infoGrid} role="list">

            <div className={styles.infoCard} role="listitem">
              <span className={styles.infoLabel}>
                {t("portfolioDetail", "client")}
              </span>
              <span className={styles.infoValue}>
                {project.client}
              </span>
            </div>

            <div className={styles.infoCard} role="listitem">
              <span className={styles.infoLabel}>
                {t("portfolioDetail", "year")}
              </span>
              <span className={styles.infoValue}>
                {project.year}
              </span>
            </div>

          </div>

          {project.technologies?.length > 0 && (
            <div
              className={styles.techStack}
              role="region"
              aria-labelledby="tech-stack-title"
            >
              <h3
                id="tech-stack-title"
                className={styles.techStackTitle}
              >
                {t("portfolioDetail", "technologies")}
              </h3>

              <div className={styles.techTags} role="list">
                {project.technologies.map((tech, index) => (
                  <span
                    key={index}
                    role="listitem"
                    className={styles.techTag}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>
      </section>
    </FadeUp>
  );
}