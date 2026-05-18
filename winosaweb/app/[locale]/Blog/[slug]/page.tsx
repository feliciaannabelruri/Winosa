import { Metadata } from "next";
import BlogDetailClient from "@/components/sectionBlog/BlogDetailClient";
import Footer from "@/components/layout/Footer";
import { notFound } from "next/navigation";
import { translateObject, translateArray } from "@/lib/serverTranslate";

interface Props {
  params: Promise<{ slug: string; locale: string }>;
}

async function getBlogData(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/${slug}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch (error) {
    console.error("Error fetching blog:", error);
    return null;
  }
}

async function getRelatedBlogs(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/${slug}/recommendations?limit=3`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const rawBlog = await getBlogData(slug);

  if (!rawBlog) {
    return { title: "Blog Not Found | Winosa" };
  }

  // Pre-translate SEO fields
  const blog = await translateObject(locale, {
    title: rawBlog.title || "",
    excerpt: rawBlog.excerpt || "",
    metaTitle: rawBlog.metaTitle || "",
    metaDescription: rawBlog.metaDescription || "",
  });

  const title = blog.metaTitle || `${blog.title} | Winosa Blog`;
  const description = blog.metaDescription || blog.excerpt || "";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      url: `https://winosa.com/${locale}/Blog/${slug}`,
      images: [rawBlog.image || "/og-image.jpg"],
      authors: [rawBlog.author || "Winosa Team"],
      publishedTime: rawBlog.createdAt,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [rawBlog.image || "/og-image.jpg"],
    },
    alternates: {
      canonical: `https://winosa.com/${locale}/Blog/${slug}`,
      languages: {
        en: `https://winosa.com/en/Blog/${slug}`,
        nl: `https://winosa.com/nl/Blog/${slug}`,
        id: `https://winosa.com/id/Blog/${slug}`,
      },
    },
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug, locale } = await params;
  const rawBlog = await getBlogData(slug);

  if (!rawBlog) {
    notFound();
  }

  const rawRelated = await getRelatedBlogs(slug);

  // Translate both blog post and related blogs
  const [blog, related] = await Promise.all([
    translateObject(locale, {
      ...rawBlog,
      title: rawBlog.title || "",
      content: rawBlog.content || "",
      excerpt: rawBlog.excerpt || "",
    }),
    translateArray<any>(locale, rawRelated, ["title", "excerpt"]),
  ]);

  return (
    <main className="w-full bg-white">
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": blog.title,
            "image": blog.image,
            "author": {
              "@type": "Person",
              "name": blog.author || "Winosa Team",
            },
            "datePublished": blog.createdAt,
            "description": blog.excerpt || blog.metaDescription,
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `https://winosa.com/${locale}/Blog/${slug}`,
            },
          }),
        }}
      />

      <BlogDetailClient initialBlog={blog} relatedBlogs={related} />
      <Footer />
    </main>
  );
}