import { notFound } from "next/navigation";
import styles from "./detail.module.css";

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


  // ambil project detail
  const detailRes = await fetch(
    `http://localhost:5000/api/portfolio/${slug}`,
    { cache: "no-store" }
  );

  if (!detailRes.ok) notFound();

  const detailJson = await detailRes.json();
  const data = detailJson.data;

  if (!data) notFound();

  //  ambil semua project untuk next project
  const listRes = await fetch(
    `http://localhost:5000/api/portfolio`,
    { cache: "no-store" }
  );

  const listJson = await listRes.json();
  const projects = listJson.data;

  const currentIndex = projects.findIndex(
    (p: any) => p.slug === slug
  );

  const nextRaw =
    projects[(currentIndex + 1) % projects.length];

  // MAPPING DATA (ANTI KOSONG)
  const project = {
    heroImage: data.image,
    title: data.title,
    description:
      data.description || "Project description coming soon.",
    category: data.category || "Portfolio",
    client: data.client || "-",
    year: new Date(data.createdAt)
      .getFullYear()
      .toString(),
    duration: "",
    role: "",
    technologies: [],
    challenge:
      data.description ||
      "Challenge details will be updated soon.",
    solution:
      data.description ||
      "Solution details will be updated soon.",
    result:
      "Project results will be available soon.",
    metrics: [],
    gallery: [data.image],
    slug: data.slug,
  };

  const nextProject = {
    slug: nextRaw.slug,
    title: nextRaw.title,
    description:
      nextRaw.description ||
      "Explore this project.",
    image: nextRaw.image,
  };

  return (
    <main className={styles.detailPage}>
      <HeroSection project={project} />
      <InfoSection project={project} />
      <CaseStudySection project={project} />
      <GallerySection project={project} />
      <NextProjectSection nextProject={nextProject} />
    </main>
  );
}
