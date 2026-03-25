import Footer from "@/components/layout/Footer";
import SectionBlogHero from "@/components/sectionBlog/SectionHero";
import SectionBlog from "@/components/sectionBlog/SectionBlog";

/* ================= SEO ================= */

export const metadata = {
  title: "Blog | Winosa Digital Agency",
  description:
    "Insights, tutorials, and case studies about web development, UI UX design, and digital technology from Winosa Digital Agency.",

  keywords: [
    "web development blog",
    "ui ux blog",
    "digital agency insights",
    "technology articles",
    "winosa blog",
  ],

  openGraph: {
    title: "Blog | Winosa Digital Agency",
    description:
      "Insights, tutorials, and case studies about web development and digital technology.",
    url: "https://winosa.com/blog",
    siteName: "Winosa Digital Agency",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Winosa Blog",
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Blog | Winosa Digital Agency",
    description:
      "Insights and tutorials about web development, UI UX, and technology.",
    images: ["/og-image.jpg"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

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