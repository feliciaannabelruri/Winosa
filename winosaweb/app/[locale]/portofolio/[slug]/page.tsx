import { notFound } from "next/navigation";
import { Metadata } from "next";
import styles from "./detail.module.css";
import Footer from "@/components/layout/Footer";

import HeroSection from "@/components/sectionsPorto/sectionDetailProject/HeroSection";
import CaseStudySection from "@/components/sectionsPorto/sectionDetailProject/CaseStudySection";
import GallerySection from "@/components/sectionsPorto/sectionDetailProject/GallerySection";
import NextProjectSection from "@/components/sectionsPorto/sectionDetailProject/NextProjectSection";
import SimilarProjectsSection from "@/components/sectionsPorto/SimilarProjectsSection";
import AboutProjectSection from "@/components/sectionsPorto/sectionDetailProject/AboutProjectSection";
import TestimonialsSection from "@/components/sectionsPorto/sectionDetailProject/Testimonialssection";
import { translateObject, translateArray } from "@/lib/serverTranslate";

interface PageProps {
  params: Promise<{
    slug: string;
    locale: string;
  }>;
}

async function getProjectDetail(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/portfolio/${slug}`, { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data ?? null;
  } catch {
    return null;
  }
}

async function getAllProjects() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/portfolio`, { cache: "no-store" });
    if (!res.ok) return [];
    const json = await res.json();
    return json?.data ?? [];
  } catch {
    return [];
  }
}

async function getRecommendations(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/portfolio/${slug}/recommendations?limit=3`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const project = await getProjectDetail(slug);

  if (!project) {
    return { title: "Project Not Found | Winosa" };
  }

  const translated = await translateObject(locale, {
    title: project.title || "Project Detail",
    description: project.shortDesc || project.description || "Explore our case study.",
  });

  return {
    title: `${translated.title} | Winosa Portfolio`,
    description: translated.description,
    openGraph: {
      title: `${translated.title} | Winosa Portfolio`,
      description: translated.description,
      images: [project.heroImage || project.image || "/og-image.jpg"],
    },
    alternates: {
      canonical: `https://winosa.com/${locale}/portofolio/${slug}`,
      languages: {
        en: `https://winosa.com/en/portofolio/${slug}`,
        nl: `https://winosa.com/nl/portofolio/${slug}`,
        id: `https://winosa.com/id/portofolio/${slug}`,
      },
    },
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug, locale } = await params;

  const [data, projects, rawRelated] = await Promise.all([
    getProjectDetail(slug),
    getAllProjects(),
    getRecommendations(slug),
  ]);

  if (!data || !projects.length) notFound();

  // Find next project
  const currentIndex = projects.findIndex((p: any) => p.slug === slug);
  const nextRaw =
    currentIndex !== -1
      ? projects[(currentIndex + 1) % projects.length]
      : projects[0];

  // Pre-translate everything server-side for smooth performance
  const [translatedData, translatedNext, relatedProjects] = await Promise.all([
    translateObject(locale, {
      ...data,
      title: data.title || "Untitled Project",
      shortDesc: data.shortDesc || data.description || "Project description coming soon.",
      longDesc: data.longDesc || "",
      category: data.category || "Portfolio",
      client: data.client || "-",
      duration: data.duration || "",
      role: data.role || "",
      challenge: data.challenge || "",
      solution: data.solution || "",
      result: data.result || "",
      testimonials: Array.isArray(data.testimonials) ? data.testimonials : [],
    }),
    translateObject(locale, {
      slug: nextRaw?.slug || "",
      title: nextRaw?.title || "Next Project",
      description: nextRaw?.shortDesc || nextRaw?.description || "Explore this project.",
      image: nextRaw?.thumbnail || nextRaw?.image || "/no-image.jpg",
      category: nextRaw?.category || "",
    }),
    translateArray<any>(locale, rawRelated, ["title", "description"]),
  ]);

  const project = {
    heroImage: data.heroImage || data.image || "/no-image.jpg",
    title: translatedData.title,
    description: translatedData.shortDesc,
    longDescription: translatedData.longDesc,
    category: translatedData.category,
    client: translatedData.client,
    year: data.year || (data.createdAt ? new Date(data.createdAt).getFullYear().toString() : "-"),
    duration: translatedData.duration,
    role: translatedData.role,
    technologies: data.techStack || [],
    challenge: translatedData.challenge,
    solution: translatedData.solution,
    result: translatedData.result,
    metrics: data.metrics || [],
    gallery: data.gallery?.length ? data.gallery : [],
    projectUrl: data.projectUrl || "",
    testimonials: translatedData.testimonials,
  };

  return (
    <main className={styles.detailPage}>
      <HeroSection project={project} />
      <AboutProjectSection longDescription={project.longDescription} />
      <CaseStudySection project={project} />
      <TestimonialsSection testimonials={project.testimonials ?? []} />
      <GallerySection project={project} />

      {relatedProjects.length > 0 && (
        <SimilarProjectsSection relatedProjects={relatedProjects} />
      )}

      <NextProjectSection nextProject={translatedNext} />
      <Footer />
    </main>
  );
}