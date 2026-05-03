"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslate } from "@/lib/useTranslate";

interface Project {
  slug: string;
  title: string;
  category?: string;
  thumbnail?: string;
  image?: string;
  shortDesc?: string;
  description?: string;
}

interface Props {
  relatedProjects: Project[];
}

export default function SimilarProjectsSection({ relatedProjects }: Props) {
  const { t } = useTranslate();

  if (!relatedProjects.length) return null;

  return (
    <section className="w-full bg-white py-14 px-6" aria-labelledby="similar-projects-title">
      <div className="max-w-6xl mx-auto">
        <h2
          id="similar-projects-title"
          className="text-2xl font-bold text-black mb-8"
        >
          {t("portfolioDetailMisc", "similarProjects")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {relatedProjects.map((p) => (
            <Link
              key={p.slug}
              href={`/portofolio/${p.slug}`}
              className="group block rounded-[20px] overflow-hidden border border-black/10 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="relative h-48 w-full bg-gray-100">
                {(p.thumbnail || p.image) && (
                  <Image
                    src={p.thumbnail || p.image!}
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
  );
}
