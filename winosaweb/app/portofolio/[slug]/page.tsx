import { notFound } from "next/navigation";
import styles from "./detail.module.css";

import HeroSection from "@/components/sectionsPorto/sectionDetailProject/HeroSection";
import InfoSection from "@/components/sectionsPorto/sectionDetailProject/InfoSection";
import CaseStudySection from "@/components/sectionsPorto/sectionDetailProject/CaseStudySection";
import GallerySection from "@/components/sectionsPorto/sectionDetailProject/GallerySection";
import NextProjectSection from "@/components/sectionsPorto/sectionDetailProject/NextProjectSection";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const PLACEHOLDER = "https://via.placeholder.com/1200x800?text=No+Image";

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const detailRes = await fetch(
    `http://localhost:5000/api/portfolio/${slug}`,
    { cache: "no-store" }
  );
  if (!detailRes.ok) notFound();

  const detailJson = await detailRes.json();
  const data = detailJson.data;
  if (!data) notFound();

  // Wajib ada hero image
  const heroImage = data.heroImage || data.thumbnail || data.image;
  if (!heroImage) notFound();

  const listRes = await fetch(
    `http://localhost:5000/api/portfolio`,
    { cache: "no-store" }
  );
  const listJson = await listRes.json();
  const projects = listJson.data ?? [];

  const currentIndex = projects.findIndex((p: any) => p.slug === slug);
  const nextRaw = projects[(currentIndex + 1) % projects.length];

  const project = {
    heroImage,
    title:        data.title       || "",
    description:  data.longDesc    || data.shortDesc  || data.description || "",
    category:     data.category    || "Portfolio",
    client:       data.client      || "-",
    year:         data.year        || new Date(data.createdAt).getFullYear().toString(),
    duration:     data.duration    || "",
    role:         data.role        || "",
    technologies: Array.isArray(data.techStack) ? data.techStack : [],
    challenge:    data.challenge   || "",
    solution:     data.solution    || "",
    result:       data.result      || "",
    metrics:      Array.isArray(data.metrics) && data.metrics.length > 0 ? data.metrics : [],
    gallery:      Array.isArray(data.gallery)
                    ? data.gallery.filter((img: string) => !!img)
                    : [],
    projectUrl:   data.projectUrl  || "",
    slug:         data.slug,
  };

  const nextProject = nextRaw ? {
    slug:        nextRaw.slug,
    title:       nextRaw.title,
    description: nextRaw.shortDesc || nextRaw.description || "Explore this project.",
    image:       nextRaw.thumbnail || nextRaw.image || PLACEHOLDER,
  } : null;

  const hasCaseStudy = project.challenge || project.solution || project.result;

  return (
    <main className={styles.detailPage}>
      <HeroSection project={project} />
      <InfoSection project={project} />
      {hasCaseStudy && <CaseStudySection project={project} />}
      {project.gallery.length > 0 && <GallerySection project={project} />}
      {nextProject && <NextProjectSection nextProject={nextProject} />}
    </main>
  );
}