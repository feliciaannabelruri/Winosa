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
  const gallery = project.gallery ?? [];

  if (gallery.length === 0) return null;

  return (
    <FadeUp>
      <section className={styles.gallerySectionA} aria-labelledby="project-gallery-title">
        <div className={styles.galleryContainerA}>

          <motion.div
            className={styles.galleryHeaderA}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <span className={styles.infoEyebrow}>
              <span className={styles.infoEyebrowLine} />
              {t("portfolioDetail", "gallery")}
            </span>
            {gallery.length >= 3 && (
              <span className={styles.galleryScrollHint}>scroll →</span>
            )}
          </motion.div>

          {/* 1 gambar */}
          {gallery.length === 1 && (
            <motion.div
              className={styles.gallerySolo}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Image
                src={gallery[0]}
                alt={`${project.title ?? "Project"} screenshot`}
                fill
                sizes="100vw"
                style={{ objectFit: "cover" }}
                className={styles.galleryImageA}
              />
              <div className={styles.galleryItemOverlay} aria-hidden="true" />
            </motion.div>
          )}

          {/* 2 gambar */}
          {gallery.length === 2 && (
            <motion.div
              className={styles.galleryDuo}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.12 } },
              }}
            >
              {gallery.map((img, i) => (
                <motion.div
                  key={i}
                  className={styles.galleryDuoItem}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.6 }}
                >
                  <Image
                    src={img}
                    alt={`${project.title ?? "Project"} screenshot ${i + 1}`}
                    fill
                    sizes="50vw"
                    style={{ objectFit: "cover" }}
                    className={styles.galleryImageA}
                  />
                  <div className={styles.galleryItemOverlay} aria-hidden="true" />
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* 3+ filmstrip */}
          {gallery.length >= 3 && (
            <motion.div
              className={styles.galleryFilmstrip}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              role="list"
            >
              {gallery.map((img, i) => (
                <motion.div
                  key={i}
                  role="listitem"
                  className={`${styles.galleryFilmItem} ${i === 0 ? styles.galleryFilmItemWide : ""}`}
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  viewport={{ once: true }}
                >
                  <Image
                    src={img}
                    alt={`${project.title ?? "Project"} screenshot ${i + 1}`}
                    fill
                    sizes="(max-width: 768px) 80vw, 40vw"
                    style={{ objectFit: "cover" }}
                    className={styles.galleryImageA}
                  />
                  <div className={styles.galleryItemOverlay} aria-hidden="true" />
                  <span className={styles.galleryFilmNumber} aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          )}

        </div>
      </section>
    </FadeUp>
  );
}