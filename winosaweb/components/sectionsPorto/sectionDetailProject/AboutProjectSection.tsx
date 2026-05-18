"use client";

import { motion } from "framer-motion";
import FadeUp from "@/components/animation/FadeUp";
import styles from "@/app/[locale]/portofolio/[slug]/detail.module.css";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translateHybrid } from "@/lib/translateHybrid";
import { useTranslate } from "@/lib/useTranslate";
import { useEffect, useState } from "react";

interface AboutProjectSectionProps {
  longDescription: string;
}

export default function AboutProjectSection({ longDescription }: AboutProjectSectionProps) {
  const { tApi } = useTranslate();
  const { language } = useLanguageStore();
  const [text, setText] = useState(longDescription);

  useEffect(() => {
    if (!longDescription) return;
    translateHybrid(longDescription, language, tApi).then(setText);
  }, [longDescription, language]);

  if (!longDescription?.trim()) return null;

  return (
    <FadeUp>
      <section className={styles.aboutProjectSection}>
        <div className={styles.aboutProjectContainer}>
          <motion.div
            className={styles.aboutProjectInner}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <span className={styles.infoEyebrow}>
              <span className={styles.infoEyebrowLine} />
              About This Project
            </span>
            <p className={styles.aboutProjectText} style={{ textAlign: 'justify', width: '100%' }}>{text}</p>
          </motion.div>
        </div>
      </section>
    </FadeUp>
  );
}
