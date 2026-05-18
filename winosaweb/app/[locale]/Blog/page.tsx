import Footer from "@/components/layout/Footer";
import SectionBlogHero from "@/components/sectionBlog/SectionHero";
import SectionBlog from "@/components/sectionBlog/SectionBlog";
import { getSiteSettings } from "@/lib/getSiteSettings";
import { translateArray } from "@/lib/serverTranslate";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params) {
  const { locale } = await params;
  const s = await getSiteSettings();
  const titles: Record<string, string> = {
    en: `Blog | ${s?.metaTitle || "Winosa Digital Agency"}`,
    nl: `Blog | ${s?.metaTitle || "Winosa Digital Agency"}`,
    id: `Blog | ${s?.metaTitle || "Winosa Digital Agency"}`,
  };
  const descs: Record<string, string> = {
    en: "Insights, tutorials, and updates from the Winosa team.",
    nl: "Inzichten, tutorials en updates van het Winosa-team.",
    id: "Insight, tutorial, dan pembaruan dari tim Winosa.",
  };
  return {
    title: titles[locale] ?? titles.en,
    description: s?.metaDescription || descs[locale] || descs.en,
    alternates: {
      canonical: `/${locale}/Blog`,
      languages: { en: "/en/Blog", nl: "/nl/Blog", id: "/id/Blog" },
    },
    openGraph: {
      title: titles[locale] ?? titles.en,
      description: s?.metaDescription || "",
      images: [s?.logo || "/og-image.jpg"],
    },
  };
}

async function getTrendingBlogs() {
  const ML_SERVICE_URL = process.env.NEXT_PUBLIC_ML_URL || "http://localhost:5001";
  try {
    const res = await fetch(`${ML_SERVICE_URL}/trending?limit=3`, {
      cache: "no-store",
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) throw new Error();
    const data = await res.json();
    if (Array.isArray(data.data) && data.data.length > 0) return data.data;
    throw new Error();
  } catch {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/trending?limit=3`, { cache: "no-store" });
      const data = await res.json();
      return Array.isArray(data.data) ? data.data : [];
    } catch { return []; }
  }
}

async function getBlogsData() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog?limit=100`, { cache: "no-store" });
    if (!res.ok) throw new Error();
    const data = await res.json();
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.data)) return data.data;
    return [];
  } catch { return []; }
}

export default async function BlogPage({ params }: Params) {
  const { locale } = await params;

  const [blogs, trendingBlogs] = await Promise.all([
    getBlogsData(),
    getTrendingBlogs(),
  ]);

  // ✅ Translate blog titles and excerpts server-side
  const [translatedBlogs, translatedTrending] = await Promise.all([
    translateArray<any>(locale, blogs, ["title", "excerpt", "description"]),
    translateArray<any>(locale, trendingBlogs, ["title", "excerpt"]),
  ]);

  return (
    <main>
      <SectionBlogHero />
      <SectionBlog initialBlogs={translatedBlogs} trendingBlogs={translatedTrending} />
      <Footer />
    </main>
  );
}