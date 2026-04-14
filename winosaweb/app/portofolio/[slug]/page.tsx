import { notFound } from "next/navigation";
import styles from "./detail.module.css";
import Footer from "@/components/layout/Footer";

import HeroSection from "@/components/sectionsPorto/sectionDetailProject/HeroSection";
import InfoSection from "@/components/sectionsPorto/sectionDetailProject/InfoSection";
import CaseStudySection from "@/components/sectionsPorto/sectionDetailProject/CaseStudySection";
import GallerySection from "@/components/sectionsPorto/sectionDetailProject/GallerySection";
import NextProjectSection from "@/components/sectionsPorto/sectionDetailProject/NextProjectSection";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;

  /* ===============================
     FETCH DETAIL
  =============================== */
  const detailRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/portfolio/${slug}`,
    { cache: "no-store" }
  );

  if (!detailRes.ok) notFound();

  const detailJson = await detailRes.json();
  const data = detailJson?.data;

  if (!data) notFound();

  /* ===============================
     FETCH LIST
  =============================== */
  const listRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/portfolio`,
    { cache: "no-store" }
  );

  const listJson = await listRes.json();
  const projects = listJson?.data || [];

  if (!projects.length) notFound();

  /* ===============================
     NEXT PROJECT SAFE
  =============================== */
  const currentIndex = projects.findIndex(
    (p: any) => p.slug === slug
  );

  const nextRaw =
    currentIndex !== -1
      ? projects[(currentIndex + 1) % projects.length]
      : projects[0];

  /* ===============================
     MAPPING DATA
  =============================== */
  const project = {
    heroImage: data.heroImage || data.image || "/no-image.jpg",
    title: data.title || "Untitled Project",
    description:
      data.shortDesc ||
      data.description ||
      "Project description coming soon.",
    longDescription: data.longDesc || "",
    category: data.category || "Portfolio",
    client: data.client || "-",
    year:
      data.year ||
      (data.createdAt
        ? new Date(data.createdAt).getFullYear().toString()
        : "-"),
    duration: data.duration || "",
    role: data.role || "",
    technologies: data.techStack || [],
    challenge: data.challenge || "",
    solution: data.solution || "",
    result: data.result || "",
    metrics: data.metrics || [],
    gallery: data.gallery?.length ? data.gallery : [], 
    projectUrl: data.projectUrl || "",
  };

  const nextProject = {
    slug: nextRaw?.slug || "",
    title: nextRaw?.title || "Next Project",
    description: nextRaw?.shortDesc || nextRaw?.description || "Explore this project.",
    image: nextRaw?.thumbnail || nextRaw?.image || "/no-image.jpg",
    category: nextRaw?.category || "",
  };

  /* ===============================
     RENDER
  =============================== */
  return (
    <main className={styles.detailPage}>
      <HeroSection project={project} />
      <InfoSection project={project} />
      <CaseStudySection project={project} />
      <GallerySection project={project} />
      <NextProjectSection nextProject={nextProject} />
      <Footer />
    </main>
  );
}