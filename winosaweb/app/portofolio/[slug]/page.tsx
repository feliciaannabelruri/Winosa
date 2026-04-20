import { notFound } from "next/navigation";
import styles from "./detail.module.css";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import Image from "next/image";

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
  const currentIndex = projects.findIndex((p: any) => p.slug === slug);
  const nextRaw =
    currentIndex !== -1
      ? projects[(currentIndex + 1) % projects.length]
      : projects[0];

  /* ===============================
     FETCH ML RECOMMENDATIONS
  =============================== */
  let relatedProjects: any[] = [];
  try {
    const recRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/portfolio/${slug}/recommendations?limit=3`,
      { cache: "no-store" }
    );
    if (recRes.ok) {
      const recData = await recRes.json();
      relatedProjects = recData.data || [];
    }
  } catch {
    // silent — related section tidak muncul jika gagal
  }

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

      {/* ✅ BARU: Similar Projects dari ML */}
      {relatedProjects.length > 0 && (
        <section className="w-full bg-white py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-black mb-10">
              Similar Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedProjects.map((p: any) => (
                <Link
                  key={p.slug}
                  href={`/portofolio/${p.slug}`}
                  className="group block rounded-[20px] overflow-hidden border border-black/10 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="relative h-48 w-full bg-gray-100">
                    {(p.thumbnail || p.image) && (
                      <Image
                        src={p.thumbnail || p.image}
                        alt={p.title}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="p-5">
                    {p.category && (
                      <span className="text-xs font-semibold text-black/50 uppercase tracking-wide">
                        {p.category}
                      </span>
                    )}
                    <h3 className="font-bold text-black mt-1 mb-2 line-clamp-2">
                      {p.title}
                    </h3>
                    <p className="text-sm text-black/60 line-clamp-2">
                      {p.shortDesc || p.description || ""}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <NextProjectSection nextProject={nextProject} />
      <Footer />
    </main>
  );
}