"use client";

import { motion } from "framer-motion";
import FadeUp from "@/components/animation/FadeUp";
import Image from "next/image";
import styles from "@/app/portofolio/[slug]/detail.module.css";
import { useTranslate } from "@/lib/useTranslate";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translateHybrid } from "@/lib/translateHybrid";
import { useEffect, useState } from "react";

interface HeroSectionProps {
  project: {
    heroImage: string;
    title: string;
    description: string;
    longDescription?: string;
    category: string;
  };
}

export default function HeroSection({ project }: HeroSectionProps) {

  const { tApi } = useTranslate();
  const { language } = useLanguageStore();

  //  state hasil translate
  const [translated, setTranslated] = useState(project);

  useEffect(() => {

  setTranslated(project);

  const run = async () => {

    const translatedTitle = await translateHybrid(project.title, language, tApi);

    setTranslated((prev) => ({
      ...prev,
      title: translatedTitle,
    }));


    const translatedCategory = await translateHybrid(project.category, language, tApi);

    setTranslated((prev) => ({
      ...prev,
      category: translatedCategory,
    }));


    if (project.longDescription) {

      const translatedDesc = await translateHybrid(
        project.longDescription,
        language,
        tApi
      );

      setTranslated((prev) => ({
        ...prev,
        longDescription: translatedDesc,
      }));

    }

  };

  run();

}, [project, language]);

  const firstParagraph = translated.longDescription
    ? translated.longDescription.split(/\n\n|\r\n\r\n/)[0].trim()
    : "";

  return (
    <FadeUp>
      <div style={{ position: "relative" }}>

        {/* HERO IMAGE + OVERLAY */}
        <section
          className={styles.heroSection}
          style={{ marginBottom: firstParagraph ? "0" : undefined }}
        >
          <div className={styles.heroImageWrapper}>
            <Image
              src={project.heroImage}
              alt={translated.title}
              fill
              priority
              sizes="100vw"
              style={{ objectFit: "cover" }}
              className={styles.heroImage}
            />
            <div className={styles.heroOverlay} />
          </div>

          {/* TITLE + CATEGORY */}
          <motion.div
            className={styles.heroContent}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.2 } },
            }}
          >
            <motion.span
              className={styles.heroCategory}
              variants={{ hidden: { opacity: 0, y: 60 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.8 }}
            >
              {translated.category}
            </motion.span>

            <motion.h1
              className={styles.heroTitle}
              variants={{ hidden: { opacity: 0, y: 60 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.8 }}
            >
              {translated.title}
            </motion.h1>
          </motion.div>
        </section>

        {/* LONG DESC */}
        {firstParagraph && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            viewport={{ once: true }}
            style={{
              position: "relative",
              marginTop: "-20px",
              zIndex: 2,
              padding: "0 25px 20px",
            }}
          >
            <p
              style={{
                fontSize: "clamp(1.05rem, 1.8vw, 1.2rem)",
                color: "#555",
                lineHeight: 1.9,
                maxWidth: "1100px",
                margin: "0 auto",
                textAlign: "center",
              }}
            >
              {firstParagraph}
            </p>
          </motion.div>
        )}

      </div>
    </FadeUp>
  );
}