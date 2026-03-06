"use client";

import { motion } from "framer-motion";
import FadeUp from "@/components/animation/FadeUp";
import styles from "@/app/portofolio/portfolio.module.css";
import { useTranslate } from "@/lib/useTranslate";

export default function SectionBridge() {
  const { t } = useTranslate();

  return (
    <FadeUp>
      <section className={styles.bridgeSection}>
        <motion.div
          className={styles.bigTitle}
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <h2>
            {t("portfolioBridge", "title")}
          </h2>
        </motion.div>
      </section>
    </FadeUp>
  );
}
