"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import FadeUp from "@/components/animation/FadeUp";
import EmptyState from "@/components/UI/EmptyState";
import { useTranslate } from "@/lib/useTranslate";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translateHybrid } from "@/lib/translateHybrid";

type Blog = {
  _id: string;
  title: string;
  content: string;
  excerpt?: string;
  image?: string;
  tags?: string[];
  slug: string;
  createdAt: string;
};

type Props = {
  initialBlogs?: Blog[];
};

export default function SectionBlog({ initialBlogs }: Props) {

  const { t, tApi } = useTranslate();
  const { language } = useLanguageStore();

  const [blogs, setBlogs] = useState<Blog[]>(
    Array.isArray(initialBlogs) ? initialBlogs : []
  );

  const [translatedBlogs, setTranslatedBlogs] = useState<Blog[]>(
    Array.isArray(initialBlogs) ? initialBlogs : []
  );

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    if (!blogs.length) return;

    setTranslatedBlogs(blogs);

    const run = async () => {
      for (const blog of blogs) {
        const translated: Blog = {
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

        setTranslatedBlogs((prev) => {
          const updated = [...prev];
          const index = updated.findIndex((b) => b._id === blog._id);
          if (index !== -1) updated[index] = translated;
          return updated;
        });
      }
    };

    run();
  }, [blogs, language]);

  const filteredBlogs = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();
    const active = activeCategory.toLowerCase();

    return translatedBlogs.filter((blog) => {
      const title = blog.title?.toLowerCase() || "";
      const content = blog.content?.toLowerCase() || "";
      const blogCategory = (blog.tags?.[0] || "").toLowerCase();

      const matchSearch =
        searchTerm === ""
          ? true
          : title.includes(searchTerm) || content.includes(searchTerm);

      const matchCategory =
        active === "all" ? true : blogCategory === active;

      return matchSearch && matchCategory;
    });
  }, [translatedBlogs, search, activeCategory]);

  const categories = ["All", "Insight", "Design", "Tech", "Tutorial", "News", "Case Study"];

  return (
    <section
      className="w-full bg-white py-32 overflow-hidden"
      aria-labelledby="blog-section-title"
    >
      <div className="max-w-7xl mx-auto px-6 text-black">

        <FadeUp>
          <h2 id="blog-section-title" className="text-3xl font-bold mb-8">
            {t("blogSection", "title")}
          </h2>
        </FadeUp>

        <FadeUp>
          <div className="flex gap-4 mb-6">

            <label htmlFor="blog-search" className="sr-only">
              Search blog
            </label>

            <input
              id="blog-search"
              type="text"
              placeholder={t("blogSection", "search")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-5 py-2 rounded-full border border-black text-sm"
            />
          </div>
        </FadeUp>

        <FadeUp>
          <div
            className="flex justify-end gap-3 mb-14 flex-wrap"
            role="group"
            aria-label="Filter blog categories"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                aria-pressed={activeCategory === cat}
                className={`px-5 py-2 rounded-full border text-sm ${
                  activeCategory === cat
                    ? "bg-black text-white"
                    : "border-black hover:bg-black/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </FadeUp>

        {filteredBlogs.length === 0 ? (
          <EmptyState
            title={t("blogSection", "emptyTitle")}
            description={t("blogSection", "emptyDesc")}
          />
        ) : (
          <motion.div className="flex flex-col gap-8">
            {filteredBlogs.map((blog) => (
              <motion.div
                key={blog._id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <BlogCard blog={blog} />
              </motion.div>
            ))}
          </motion.div>
        )}

      </div>
    </section>
  );
}

function BlogCard({ blog }: { blog: Blog }) {

  const { t } = useTranslate();
  const category = blog.tags?.[0] || "";

  return (
    <article className="group relative">

      <div
        className="pointer-events-none absolute -inset-5 rounded-[32px] bg-[radial-gradient(circle,rgba(255,200,0,0.45)_0%,rgba(255,200,0,0.25)_35%,transparent_70%)] opacity-0 blur-[60px] group-hover:opacity-100"
        aria-hidden="true"
      />

      <div className="relative flex gap-6 bg-white border border-black rounded-[28px] px-8 py-8 transition group-hover:-translate-y-1 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)]">

        <div className="w-28 h-28 rounded-2xl overflow-hidden bg-gray-100">
          {blog.image ? (
            <img
              src={blog.image}
              className="w-full h-full object-cover"
              alt={blog.title}
            />
          ) : (
            <div className="w-full h-full bg-gray-200" aria-hidden="true" />
          )}
        </div>

        <div className="flex-1">

          <span className="text-xs font-semibold text-black/60">
            {category}
          </span>

          <h3 className="font-bold text-lg mt-1 mb-2">
            {blog.title}
          </h3>

          <p className="text-sm text-black/70 mb-4">
            {blog.excerpt || blog.content?.slice(0, 120) || ""}
          </p>

          <Link
            href={`/Blog/${blog.slug}`}
            aria-label={`Read more about ${blog.title}`}
            className="inline-block px-6 py-2 rounded-full border border-black text-sm hover:bg-black/10"
            onClick={() => {
              sessionStorage.setItem(
                "selectedBlog",
                JSON.stringify(blog)
              );
            }}
          >
            {t("blogSection", "readMore")}
          </Link>

        </div>

      </div>
    </article>
  );
}