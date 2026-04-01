"use client";

import { motion } from "framer-motion";
import FadeUp from "@/components/animation/FadeUp";
import Image from "next/image";
import Link from "next/link";
import styles from "@/app/portofolio/[slug]/detail.module.css";
import { useTranslate } from "@/lib/useTranslate";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translateHybrid } from "@/lib/translateHybrid";
import { useEffect, useState } from "react";

interface NextProjectSectionProps {
  nextProject: {
    slug: string;
    title: string;
    description: string;
    image: string;
  };
}

export default function NextProjectSection({ nextProject }: NextProjectSectionProps) {
  const { t, tApi } = useTranslate();
  const { language } = useLanguageStore();

  const [translated, setTranslated] = useState(nextProject);

  useEffect(() => {
    const run = async () => {
      const mapped = {
        ...nextProject,
        title: await translateHybrid(nextProject.title, language, tApi),
        description: await translateHybrid(nextProject.description, language, tApi),
      };

      setTranslated(mapped);
    };

    run();
  }, [nextProject, language]);

  return (
    <FadeUp>
      <section
        className={styles.nextProjectSection}
        aria-labelledby="next-project-title"
      >
        <div className={styles.nextProjectContainer}>

          <motion.h2
            id="next-project-title"
            className={styles.nextProjectLabel}
          >
            {t("portfolioDetail", "nextProject")}
          </motion.h2>

          <motion.div>
            <Link
              href={`/portofolio/${nextProject.slug}`}
              aria-label={`View next project ${translated.title}`}
              className={styles.nextProjectCard}
            >

              <div className={styles.nextProjectImageWrapper}>
                <Image
                  src={nextProject.image}
                  alt={translated.title}
                  fill
                  style={{ objectFit: "cover" }}
                  className={styles.nextProjectImage}
                />
              </div>

              <div className={styles.nextProjectContent}>

                <h3 className={styles.nextProjectTitle}>
                  {translated.title}
                </h3>

                <p className={styles.nextProjectDescription}>
                  {translated.description}
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