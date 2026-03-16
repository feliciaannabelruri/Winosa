"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import FadeUp from "@/components/animation/FadeUp";
import styles from "@/app/portofolio/portfolio.module.css";
import Image from "next/image";
import Link from "next/link";
import { useTranslate } from "@/lib/useTranslate";

type Project = {
  _id: string;
  title: string;
  description: string;
  image: string;
  slug: string;
  category: string;
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
    "All",
    "Company Web",
    "Enterprise System",
    "Product/Platform",
    "Web Application",
    "UI/UX Design",
    "Branding",
  ];

  const filteredProjects =
    activeFilter === "All"
      ? data
      : data.filter((project) => project.category === activeFilter);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredProjects.length);
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prev) =>
        (prev - 1 + filteredProjects.length) % filteredProjects.length
    );
  };

  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter);
    setCurrentIndex(0);
  };

  const getCardStyle = (index: number): React.CSSProperties => {
    const diff = index - currentIndex;
    const totalCards = filteredProjects.length;

    let normalizedDiff = diff;

    if (Math.abs(diff) > totalCards / 2) {
      normalizedDiff = diff > 0 ? diff - totalCards : diff + totalCards;
    }

    const isActive = normalizedDiff === 0;

    return {
      transform: `translateX(${normalizedDiff * 100}%) scale(${1 - Math.abs(normalizedDiff) * 0.15})`,
      opacity: Math.abs(normalizedDiff) > 1 ? 0 : 1 - Math.abs(normalizedDiff) * 0.4,
      zIndex: 10 - Math.abs(normalizedDiff),
      filter: isActive ? "blur(0px)" : "blur(4px)",
      pointerEvents: isActive ? "auto" : "none",
    };
  };

  return (
    <FadeUp>

      <motion.section
        id="portfolio-cards"
        className={styles.cardsSection}
        aria-label="Portfolio projects"
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >

        {/* FILTER */}
        <div className={styles.filterContainer}>
          {filters.map((filter) => (
            <button
              key={filter}
              tabIndex={0}
              aria-label={`Filter portfolio by ${filter}`}
              className={`${styles.filterBtn} ${
                activeFilter === filter ? styles.filterActive : ""
              }`}
              onClick={() => handleFilterChange(filter)}
            >
              {t("portfolioFilters", filter)}
            </button>
          ))}
        </div>

        {/* EMPTY */}
        {filteredProjects.length === 0 ? (

          <div className={styles.emptyState}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>🔍</div>
            <h3 style={{ fontWeight: 600 }}>
              {t("portfolio", "empty")}
            </h3>
          </div>

        ) : (

          <>
            {/* CAROUSEL */}
            <div className={styles.carouselWrapper}>

              <button
                aria-label="Previous project"
                className={`${styles.navButton} ${styles.navLeft}`}
                onClick={handlePrev}
              >
                ‹
              </button>

              <div className={styles.carouselContainer}>
                {filteredProjects.map((project, index) => (

                  <div
                    key={project._id}
                    className={styles.carouselCard}
                    style={getCardStyle(index)}
                  >

                    {/* IMAGE */}
<div className={styles.cardImage}>

  <Image
    src={project.image || "/no-image.jpg"}
    alt={project.title || "portfolio image"}
    fill
    sizes="(max-width: 768px) 100vw, 33vw"
    style={{ objectFit: "cover" }}
    priority={index === currentIndex}
  />

</div>

                    {/* CONTENT */}
                    <div className={styles.cardContent}>

                      <h3 className={styles.cardTitle}>
                        {project.title}
                      </h3>

                      <p className={styles.cardDescription}>
                        {project.description}
                      </p>

                      <div className={styles.cardFooter}>

                        <span className={styles.cardCategory}>
                          {t("portfolioFilters", project.category)}
                        </span>

                        <Link
                          href={`/portofolio/${project.slug}`}
                          aria-label={`Open project ${project.title}`}
                          className={styles.learnMore}
                        >
                          {t("portfolio", "learnMore")} <span>→</span>
                        </Link>

                      </div>

                    </div>

                  </div>

                ))}
              </div>

              <button
                aria-label="Next project"
                className={`${styles.navButton} ${styles.navRight}`}
                onClick={handleNext}
              >
                ›
              </button>

            </div>

            {/* DOTS */}
            <div className={styles.dotsContainer}>
              {filteredProjects.map((_, index) => (

                <button
                  key={index}
                  aria-label={`Go to project ${index + 1}`}
                  className={`${styles.dot} ${
                    index === currentIndex ? styles.dotActive : ""
                  }`}
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