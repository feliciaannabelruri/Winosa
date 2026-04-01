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
      <section
        className={styles.gallerySection}
        aria-labelledby="project-gallery-title"
      >
        <div className={styles.galleryContainer}>

          <motion.h2
            id="project-gallery-title"
            className={styles.sectionTitle}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {t("portfolioDetail", "gallery")}
          </motion.h2>

          <motion.div
            className={styles.galleryGrid}
            role="list"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {gallery.map((image, index) => (
              <motion.div
                key={index}
                role="listitem"
                className={styles.galleryItem}
              >
                <Image
                  src={image}
                  alt={`${project.title || "Project"} gallery image ${index + 1}`}
                  width={600}
                  height={400}
                  sizes="(max-width:768px) 100vw, 33vw"
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