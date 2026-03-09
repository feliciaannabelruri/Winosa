"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import FadeUp from "@/components/animation/FadeUp";
import styles from "@/app/portofolio/portfolio.module.css";
import Image from "next/image";
import Link from "next/link";
import { useTranslate } from "@/lib/useTranslate";

// ── Type update: pakai field baru, fallback ke field lama ────────────────────
type Project = {
  _id:        string;
  title:      string;
  shortDesc?: string;
  description?: string; // legacy fallback
  thumbnail?: string;
  image?:     string;   // legacy fallback
  slug:       string;
  category:   string;
};

type FilterType =
  | "All"
  | "Company Web"
  | "Enterprise System"
  | "Product/Platform"
  | "Web Application"
  | "UI/UX Design"
  | "Branding";

export default function SectionPortoCards({ data }: { data: Project[] }) {
  const { t } = useTranslate();

  const [activeFilter, setActiveFilter] = useState<FilterType>("All");
  const [currentIndex, setCurrentIndex] = useState(0);

  const filters: FilterType[] = [
    "All", "Company Web", "Enterprise System",
    "Product/Platform", "Web Application", "UI/UX Design", "Branding",
  ];

  const filteredProjects =
    activeFilter === "All"
      ? data
      : data.filter(p => p.category === activeFilter);

  const handleNext = () =>
    setCurrentIndex(p => (p + 1) % filteredProjects.length);

  const handlePrev = () =>
    setCurrentIndex(p => (p - 1 + filteredProjects.length) % filteredProjects.length);

  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter);
    setCurrentIndex(0);
  };

  const getCardStyle = (index: number): React.CSSProperties => {
    const diff = index - currentIndex;
    const total = filteredProjects.length;
    let d = diff;
    if (Math.abs(diff) > total / 2) d = diff > 0 ? diff - total : diff + total;
    return {
      transform:    `translateX(${d * 100}%) scale(${1 - Math.abs(d) * 0.15})`,
      opacity:       Math.abs(d) > 1 ? 0 : 1 - Math.abs(d) * 0.4,
      zIndex:        10 - Math.abs(d),
      filter:        d === 0 ? "blur(0px)" : "blur(4px)",
      pointerEvents: d === 0 ? "auto" : "none",
    };
  };

  return (
    <FadeUp>
      <motion.section
        id="portfolio-cards"
        className={styles.cardsSection}
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        {/* Filter */}
        <div className={styles.filterContainer}>
          {filters.map(filter => (
            <button
              key={filter}
              className={`${styles.filterBtn} ${activeFilter === filter ? styles.filterActive : ""}`}
              onClick={() => handleFilterChange(filter)}
            >
              {t("portfolioFilters", filter)}
            </button>
          ))}
        </div>

        {filteredProjects.length === 0 ? (
          <div className={styles.emptyState}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>🔍</div>
            <h3 style={{ fontWeight: 600 }}>{t("portfolio", "empty")}</h3>
          </div>
        ) : (
          <>
            {/* Carousel */}
            <div className={styles.carouselWrapper}>
              <button className={`${styles.navButton} ${styles.navLeft}`} onClick={handlePrev}>‹</button>

              <div className={styles.carouselContainer}>
                {filteredProjects.map((project, index) => {
                  // Gunakan thumbnail, fallback ke image (field lama)
                  const imgSrc = project.thumbnail || project.image || "";
                  const desc   = project.shortDesc  || project.description || "";

                  return (
                    <div
                      key={project._id}
                      className={styles.carouselCard}
                      style={getCardStyle(index)}
                    >
                      {/* Image */}
                      <div className={styles.cardImage}>
                        {imgSrc ? (
                          <Image
                            src={imgSrc}
                            alt={project.title}
                            fill
                            style={{ objectFit: "cover" }}
                            unoptimized
                            priority={index === currentIndex}
                          />
                        ) : (
                          <div style={{
                            width: "100%", height: "100%",
                            background: "linear-gradient(135deg, #f9f9f9 0%, #f0f0f0 100%)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}>
                            <span style={{ color: "#ccc", fontSize: "2rem" }}>📁</span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className={styles.cardContent}>
                        <h3 className={styles.cardTitle}>{project.title}</h3>
                        <p className={styles.cardDescription}>{desc}</p>
                        <div className={styles.cardFooter}>
                          <span className={styles.cardCategory}>
                            {t("portfolioFilters", project.category)}
                          </span>
                          <Link href={`/portofolio/${project.slug}`} className={styles.learnMore}>
                            {t("portfolio", "learnMore")} <span>→</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button className={`${styles.navButton} ${styles.navRight}`} onClick={handleNext}>›</button>
            </div>

            {/* Dots */}
            <div className={styles.dotsContainer}>
              {filteredProjects.map((_, index) => (
                <button
                  key={index}
                  className={`${styles.dot} ${index === currentIndex ? styles.dotActive : ""}`}
                  onClick={() => setCurrentIndex(index)}
                />
              ))}
            </div>
          </>
        )}
      </motion.section>
    </FadeUp>
  );
}