"use client";

import { motion } from "framer-motion";
import FadeUp from "@/components/animation/FadeUp";
import Image from "next/image";
import styles from "@/app/portofolio/[slug]/detail.module.css";

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
  const firstParagraph = project.longDescription
    ? project.longDescription.split(/\n\n|\r\n\r\n/)[0].trim()
    : "";

  return (
    <FadeUp>
      <div style={{ position: "relative" }}>

        {/* HERO IMAGE + OVERLAY */}
        <section
          className={styles.heroSection}
          aria-label="Portfolio project hero"
          style={{ marginBottom: firstParagraph ? "0" : undefined }}
        >
          <div className={styles.heroImageWrapper}>
            <Image
              src={project.heroImage}
              alt={project.title}
              fill
              priority
              sizes="100vw"
              style={{ objectFit: "cover" }}
              className={styles.heroImage}
            />
            <div className={styles.heroOverlay} />
          </div>

          {/* TITLE + CATEGORY saja di dalam hero */}
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
              {project.category}
            </motion.span>

            <motion.h1
              className={styles.heroTitle}
              variants={{ hidden: { opacity: 0, y: 60 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.8 }}
            >
              {project.title}
            </motion.h1>
          </motion.div>
        </section>

        {/* LONG DESC — mulai dari dalam gradasi, mengalir ke bawah */}
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