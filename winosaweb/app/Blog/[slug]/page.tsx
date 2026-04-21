import { Metadata } from 'next';
import BlogDetailClient from '@/components/sectionBlog/BlogDetailClient';
import Footer from '@/components/layout/Footer';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ slug: string }>;
}

async function getBlogData(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/${slug}`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch (error) {
    console.error('Error fetching blog:', error);
    return null;
  }
}

async function getRelatedBlogs(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/${slug}/recommendations?limit=3`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogData(slug);

  if (!blog) {
    return { title: 'Blog Not Found | Winosa' };
  }

  // Use SEO fields if available, fallback to title/excerpt
  const title = blog.metaTitle || `${blog.title} | Winosa Blog`;
  const description = blog.metaDescription || blog.excerpt || blog.content.substring(0, 160).replace(/<[^>]*>/g, '');
  const keywords = blog.metaKeywords || (blog.tags ? blog.tags.join(', ') : '');

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: 'article',
      url: `https://winosa.com/Blog/${slug}`,
      images: [blog.image || '/og-image.jpg'],
      authors: [blog.author || 'Winosa Team'],
      publishedTime: blog.createdAt,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [blog.image || '/og-image.jpg'],
    },
    alternates: {
      canonical: `https://winosa.com/Blog/${slug}`,
    },
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const blog = await getBlogData(slug);

  if (!blog) {
    notFound();
  }

  const related = await getRelatedBlogs(slug);

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
              "name": blog.author || "Winosa Team"
            },
            "datePublished": blog.createdAt,
            "description": blog.excerpt || blog.metaDescription,
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `https://winosa.com/Blog/${slug}`
            }
          })
        }}
      />

      <BlogDetailClient initialBlog={blog} relatedBlogs={related} />
      <Footer />
    </main>
  );
}