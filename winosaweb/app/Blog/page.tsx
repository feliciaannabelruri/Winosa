import Footer from "@/components/layout/Footer";
import SectionBlogHero from "@/components/sectionBlog/SectionHero";
import SectionBlog from "@/components/sectionBlog/SectionBlog";

/* ================= SEO ================= */

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

/* ================= PAGE ================= */

async function getBlogsData() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/blog`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) throw new Error("Fetch blog gagal");

    const data = await res.json();

    // handle semua kemungkinan response
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.data)) return data.data;

    return [];
  } catch (err) {
    console.error(err);
    return [];
  }
}

export default async function BlogPage() {
  const blogs = await getBlogsData();

  return (
    <main>
      <SectionBlogHero />

      {/* 🔥 KIRIM DATA */}
      <SectionBlog initialBlogs={blogs} />

      <Footer />
    </main>
  );
} 