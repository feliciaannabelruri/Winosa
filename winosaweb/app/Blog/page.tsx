import Footer from "@/components/layout/Footer";
import SectionBlogHero from "@/components/sectionBlog/SectionHero";
import SectionBlog from "@/components/sectionBlog/SectionBlog";

// ===============================
// SEO METADATA
// ===============================
import { getSiteSettings } from '@/lib/getSiteSettings';

export async function generateMetadata() {
  const s = await getSiteSettings();
  return {
    title: s?.metaTitle ? `Blog | ${s.metaTitle}` : 'Blog | Winosa Digital Agency',
    description: s?.metaDescription || 'Insights and tutorials about web development.',
    openGraph: {
      title: s?.metaTitle || 'Blog | Winosa Digital Agency',
      description: s?.metaDescription || '',
      images: [s?.logo || '/og-image.jpg'],
    },
  };
}

// ===============================
// PAGE LOGIC (ML Trending + Fallback Backend)
// ===============================
async function getTrendingBlogs() {
  const ML_SERVICE_URL = process.env.NEXT_PUBLIC_ML_URL || 'http://localhost:5001';
  
  try {
    const res = await fetch(`${ML_SERVICE_URL}/trending?limit=3`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) throw new Error(`ML trending error: ${res.status}`);
    const data = await res.json();
    if (Array.isArray(data.data) && data.data.length > 0) return data.data;
    throw new Error('Empty ML trending response');
  } catch (mlErr) {
    console.warn('ML trending unavailable, fallback to backend:', mlErr);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/blog/trending?limit=3`,
        { cache: 'no-store' }
      );
      const data = await res.json();
      if (Array.isArray(data.data)) return data.data;
      return [];
    } catch {
      return [];
    }
  }
}

async function getBlogsData() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/blog`,
      { cache: "no-store" }
    );
    if (!res.ok) throw new Error("Fetch blog gagal");
    const data = await res.json();

    if (Array.isArray(data)) return data;
    if (Array.isArray(data.data)) return data.data;
    return [];
  } catch (err) {
    console.error(err);
    return [];
  }
}

export default async function BlogPage() {
  const [blogs, trendingBlogs] = await Promise.all([
    getBlogsData(),
    getTrendingBlogs(),
  ]);

  return (
    <main>
      <SectionBlogHero />
      <SectionBlog initialBlogs={blogs} trendingBlogs={trendingBlogs} />
      <Footer />
    </main>
  );
}