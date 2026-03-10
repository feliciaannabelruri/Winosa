"use client";

import { motion } from "framer-motion";
import FadeUp from "@/components/animation/FadeUp";
import Image from "next/image";
import Link from "next/link";
import styles from "@/app/portofolio/[slug]/detail.module.css";
import { useTranslate } from "@/lib/useTranslate";

interface NextProjectSectionProps {
  nextProject: {
    slug: string;
    title: string;
    description: string;
    image: string;
  };
}

export default function NextProjectSection({ nextProject }: NextProjectSectionProps) {

  const { t } = useTranslate();

  return (
    <FadeUp>
      <section
        className={styles.nextProjectSection}
        aria-label="Next project"
      >

        <div className={styles.nextProjectContainer}>

          <motion.h2 className={styles.nextProjectLabel}>
            {t("portfolioDetail", "nextProject")}
          </motion.h2>

          <motion.div>

            <Link
              href={`/portofolio/${nextProject.slug}`}
              aria-label={`Open next project ${nextProject.title}`}
              className={styles.nextProjectCard}
            >

              <div className={styles.nextProjectImageWrapper}>
                <Image
                  src={nextProject.image}
                  alt={nextProject.title}
                  fill
                  sizes="(max-width:768px) 100vw, 50vw"
                  style={{ objectFit: "cover" }}
                  className={styles.nextProjectImage}
                />
              </div>

              <div className={styles.nextProjectContent}>

                <h3 className={styles.nextProjectTitle}>
                  {nextProject.title}
                </h3>

                <p className={styles.nextProjectDescription}>
                  {nextProject.description}
                </p>

                <span
                  className={styles.nextProjectArrow}
                  aria-hidden="true"
                >
                  →
                </span>

              </div>

            </Link>

          </motion.div>

          <motion.div className={styles.backToPortfolioWrapper}>
            <Link
              href="/portofolio"
              aria-label="Back to portfolio"
              className={styles.backToPortfolioButton}
            >
              ← {t("portfolioDetail", "backToPortfolio")}
            </Link>
          </motion.div>

        </div>

      </section>
    </FadeUp>
  );
}