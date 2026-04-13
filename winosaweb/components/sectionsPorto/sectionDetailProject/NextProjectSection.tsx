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
    category?: string;
  };
}

export default function NextProjectSection({ nextProject }: NextProjectSectionProps) {
  const { t, tApi } = useTranslate();
  const { language } = useLanguageStore();
  const [translated, setTranslated] = useState(nextProject);

  useEffect(() => {
  const run = async () => {
    const [title, description, category] = await Promise.all([
      translateHybrid(nextProject.title,       language, tApi),
      translateHybrid(nextProject.description, language, tApi),
      translateHybrid(nextProject.category ?? "", language, tApi),
    ]);
    setTranslated({ ...nextProject, title, description, category });
  };
  run();
}, [nextProject, language]);

  return (
    <FadeUp>
      <section className={styles.nextProjectSectionA} aria-labelledby="next-project-heading">
        <div className={styles.nextProjectContainerA}>

          {/* Eyebrow */}
          <motion.div
            className={styles.nextProjectEyebrowA}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span className={styles.infoEyebrow}>
              <span className={styles.infoEyebrowLine} />
              <span id="next-project-heading">
                {t("portfolioDetail", "nextProject")}
              </span>
            </span>
          </motion.div>

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Link
              href={`/portofolio/${nextProject.slug}`}
              className={styles.nextProjectCardA}
              aria-label={`View next project: ${translated.title}`}
            >
              {/* Image side */}
              <div className={styles.nextProjectImageA}>
                <Image
                  src={nextProject.image}
                  alt={translated.title}
                  fill
                  style={{ objectFit: "cover" }}
                  className={styles.nextProjectImgA}
                />
                <div className={styles.nextProjectImageOverlay} aria-hidden="true" />
              </div>

              {/* Content side */}
              <div className={styles.nextProjectContentA}>
                {/* Kanan atas: shortDesc dari project berikutnya */}
                <div className={styles.nextProjectMeta}>
                  {translated.category && (
                    <span className={styles.nextProjectMetaLabel}>
                      {translated.category}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className={styles.nextProjectTitleA}>
                    {translated.title}
                  </h3>
                  {/* shortDescription — bukan longDescription */}
                  <p className={styles.nextProjectDescA}>
                    {translated.description}
                  </p>
                </div>

                <div className={styles.nextProjectFooter}>
                  <span className={styles.nextProjectCta}>
                    View project
                  </span>
                  <span className={styles.nextProjectArrowA} aria-hidden="true">
                    →
                  </span>
                </div>
              </div>

            </Link>
          </motion.div>

        </div>
      </section>
    </FadeUp>
  );
}