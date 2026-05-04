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

  const infoItems = [
    { label: t("portfolioDetail", "client"), value: project.client },
    { label: t("portfolioDetail", "year"),   value: project.year },
    ...(project.duration ? [{ label: "Duration", value: project.duration }] : []),
    ...(project.role     ? [{ label: "Role",     value: project.role     }] : []),
  ];

  return (
    <FadeUp>
      <section className={styles.infoSectionA} aria-labelledby="project-overview-title">
        <div className={styles.infoContainerA}>

          {/* Eyebrow (judul section*/}
          <motion.div
            className={styles.infoHeaderA}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <span className={styles.infoEyebrow}>
              <span className={styles.infoEyebrowLine} />
              {t("portfolioDetail", "overview")}
            </span>
          </motion.div>

          {/* Info cards */}
          <motion.div
            className={styles.infoGridA}
            role="list"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.1 } },
            }}
          >
            {infoItems.map((item, i) => (
              <motion.div
                key={i}
                role="listitem"
                className={styles.infoCardA}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.5 }}
              >
                <span className={styles.infoLabelA}>{item.label}</span>
                <span className={styles.infoValueA}>{item.value}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Tech Stack */}
          {project.technologies?.length > 0 && (
            <motion.div
              className={styles.techStackA}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <h3 className={styles.techStackTitleA}>
                {t("portfolioDetail", "technologies")}
              </h3>
              <div className={styles.techTagsA} role="list">
                {project.technologies.map((tech, i) => (
                  <motion.span
                    key={i}
                    role="listitem"
                    className={styles.techTagA}
                    initial={{ opacity: 0, scale: 0.85 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.06, duration: 0.4 }}
                    viewport={{ once: true }}
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}

        </div>
      </section>
    </FadeUp>
  );
}