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
    category: string;
  };
}

export default function HeroSection({ project }: HeroSectionProps) {
  return (
    <FadeUp>
      <section className={styles.heroSection}>

        {/* IMAGE */}
        <div className={styles.heroImageWrapper}>
          <Image
            src={project.heroImage}
            alt={project.title}
            fill
            priority
            style={{ objectFit: "cover" }}
            className={styles.heroImage}
          />
          <div className={styles.heroOverlay} />
        </div>

        {/* CONTENT */}
        <motion.div
          className={styles.heroContent}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
        >

          <motion.span
            className={styles.heroCategory}
            variants={{
              hidden: { opacity: 0, y: 60 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.8 }}
          >
            {project.category}
          </motion.span>

          <motion.h1
            className={styles.heroTitle}
            variants={{
              hidden: { opacity: 0, y: 60 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.8 }}
          >
            {project.title}
          </motion.h1>

          <motion.p
            className={styles.heroDescription}
            variants={{
              hidden: { opacity: 0, y: 60 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.8 }}
          >
            {project.description}
          </motion.p>

        </motion.div>

      </section>
    </FadeUp>
  );
}
