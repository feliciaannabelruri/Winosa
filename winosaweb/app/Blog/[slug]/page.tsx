"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import Footer from "@/components/layout/Footer";
import FadeUp from "@/components/animation/FadeUp";
import { useTranslate } from "@/lib/useTranslate";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translateHybrid } from "@/lib/translateHybrid";

type Blog = {
  _id: string;
  title: string;
  content: string;
  excerpt?: string;
  image?: string;
  author?: string;
  tags?: string[];
  createdAt: string;
  slug: string;
};

export default function BlogDetailPage() {

  const { t, tApi } = useTranslate();
  const { language } = useLanguageStore();

  const params = useParams();
  const slug = params?.slug as string;

  const [blog, setBlog] = useState<Blog | null>(null);
  const [related, setRelated] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ translated state
  const [translatedBlog, setTranslatedBlog] = useState<Blog | null>(null);
  const [translatedRelated, setTranslatedRelated] = useState<Blog[]>([]);

  // ================= FETCH =================
  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      try {
        const detailRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/blog/${slug}`
        );

        if (!detailRes.ok) {
          setBlog(null);
          return;
        }

        const detailData = await detailRes.json();
        setBlog(detailData.data);

        const listRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/blog`
        );
        const listData = await listRes.json();

        const filtered = (listData.data || [])
          .filter((item: Blog) => item.slug !== slug)
          .slice(0, 3);

        setRelated(filtered);

      } catch (err) {
        console.error(err);
        setBlog(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  // ================= AUTO TRANSLATE =================
  useEffect(() => {

    if (!blog) return;

    const run = async () => {

      const mapped = {
        ...blog,
        title: await translateHybrid(blog.title, language, tApi),
        content: await translateHybrid(blog.content, language, tApi),
        excerpt: blog.excerpt
          ? await translateHybrid(blog.excerpt, language, tApi)
          : "",
        tags: blog.tags?.length
          ? [await translateHybrid(blog.tags[0], language, tApi)]
          : [],
      };

      setTranslatedBlog(mapped);

    };

    run();

  }, [blog, language]);

  // ================= TRANSLATE RELATED =================
  useEffect(() => {

    if (!related.length) return;

    const run = async () => {

      const mapped = await Promise.all(
        related.map(async (post) => ({
          ...post,
          title: await translateHybrid(post.title, language, tApi),
          excerpt: post.excerpt
            ? await translateHybrid(post.excerpt, language, tApi)
            : "",
        }))
      );

      setTranslatedRelated(mapped);

    };

    run();

  }, [related, language]);

  // ================= SAFE DATA =================
  const safeBlog = translatedBlog || blog;
  const safeRelated = translatedRelated.length ? translatedRelated : related;

  // ================= LOADING =================
  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        {t("global", "loading")}
      </main>
    );
  }

  if (!safeBlog) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        {t("blogDetail", "notFound")}
      </main>
    );
  }

  const category = safeBlog.tags?.[0] || t("blogDetail", "article");

  return (
    <main className="w-full bg-white overflow-x-hidden">

      {/* HERO */}
      <section
        className="relative w-full h-[75vh] flex items-end"
        style={{
          backgroundImage: `url(${safeBlog.image || "/bg/bg1.jpg"})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-16 text-white">
          <FadeUp>

            <span className="inline-block px-4 py-1 rounded-full border border-white text-xs mb-4">
              {category}
            </span>

            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              {safeBlog.title}
            </h1>

            <div className="text-sm text-white/80 flex gap-4">
              <span>
                {t("blogDetail", "by")}{" "}
                {safeBlog.author || t("blogDetail", "defaultAuthor")}
              </span>

              <span>•</span>

              <span>
                {new Date(safeBlog.createdAt).toLocaleDateString()}
              </span>
            </div>

          </FadeUp>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-[30%] bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* ARTICLE */}
      <section className="max-w-5xl mx-auto px-6 py-32 text-black">
        <FadeUp>
          <motion.article
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: safeBlog.content }}
          />
        </FadeUp>
      </section>

      {/* RELATED */}
      <section className="w-full py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-black">

          <FadeUp>
            <h2 className="text-2xl font-bold mb-12">
              {t("blogDetail", "related")}
            </h2>
          </FadeUp>

          <div className="grid md:grid-cols-3 gap-10">

            {safeRelated.map((post) => (

              <div key={post._id} className="group relative">

                <div className="relative h-[420px] flex flex-col bg-white rounded-[28px] border border-black p-6">

                  <div className="h-48 w-full rounded-[20px] overflow-hidden bg-gray-200 mb-5">
                    {post.image && (
                      <img src={post.image} className="w-full h-full object-cover" />
                    )}
                  </div>

                  <h3 className="font-semibold text-lg mb-3">
                    {post.title}
                  </h3>

                  <p className="text-sm text-black/70">
                    {post.excerpt}
                  </p>

                  <div className="mt-auto pt-6">
                    <Link
                      href={`/Blog/${post.slug}`}
                      className="inline-block px-6 py-2 rounded-full border border-black text-sm hover:bg-black/10"
                    >
                      {t("blogDetail", "readMore")}
                    </Link>
                  </div>

                </div>

              </div>

            ))}

          </div>

        </div>
      </section>

      <Footer />

    </main>
  );
}