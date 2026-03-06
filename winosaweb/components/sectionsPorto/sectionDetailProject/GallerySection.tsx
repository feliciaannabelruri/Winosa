"use client";

import { motion } from "framer-motion";
import FadeUp from "@/components/animation/FadeUp";
import Image from "next/image";
import styles from "@/app/portofolio/[slug]/detail.module.css";
import { useTranslate } from "@/lib/useTranslate";

interface GallerySectionProps {
  project: {
    title?: string;
    gallery?: string[];
  };
}

export default function GallerySection({ project }: GallerySectionProps) {
  const { t } = useTranslate();

  const gallery = project.gallery || [];

  return (
    <FadeUp>
      <section className={styles.gallerySection}>
        <div className={styles.galleryContainer}>

          {/* TITLE → translate fallback */}
          <motion.h2
            className={styles.sectionTitle}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {t("portfolioDetail", "gallery")}
          </motion.h2>

          {/* GALLERY GRID */}
          <motion.div
            className={styles.galleryGrid}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.15,
                },
              },
            }}
          >
            {gallery.map((image, index) => (
              <motion.div
                key={index}
                className={styles.galleryItem}
                variants={{
                  hidden: { opacity: 0, y: 60 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.7 }}
              >
                <Image
                  src={image}
                  alt={`${project.title || "Project"} ${t("portfolioDetail", "galleryImage")} ${index + 1}`}
                  width={600}
                  height={400}
                  style={{ objectFit: "cover" }}
                  className={styles.galleryImage}
                />
              </motion.div>
            ))}
          </motion.div>

        </div>
      </section>
    </FadeUp>
  );
}
