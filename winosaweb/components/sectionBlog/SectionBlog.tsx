"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
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
  trendingBlogs?: Blog[];
};

export default function SectionBlog({ initialBlogs, trendingBlogs = [] }: Props) {
  const { t, tApi } = useTranslate();
  const { language } = useLanguageStore();

  const [blogs, setBlogs] = useState<Blog[]>(initialBlogs ?? []);
  const [translatedBlogs, setTranslatedBlogs] = useState<Blog[]>(initialBlogs ?? []);
  const [translatedTrending, setTranslatedTrending] = useState<Blog[]>(trendingBlogs ?? []);

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  /* translate trending */
  useEffect(() => {
    if (!trendingBlogs?.length) return;

    setTranslatedTrending(trendingBlogs);

    const run = async () => {
      for (const blog of trendingBlogs) {
        const translated: Blog = {
          ...blog,
          title: await translateHybrid(blog.title, language, tApi),
          excerpt: blog.excerpt
            ? await translateHybrid(blog.excerpt, language, tApi)
            : "",
          tags: blog.tags?.length
            ? [await translateHybrid(blog.tags[0], language, tApi)]
            : [],
        };

        setTranslatedTrending((prev) =>
          prev.map((b) => (b._id === blog._id ? translated : b))
        );
      }
    };

    run();
  }, [trendingBlogs, language]);

  /* translate main blogs */
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

        setTranslatedBlogs((prev) =>
          prev.map((b) => (b._id === blog._id ? translated : b))
        );
      }
    };

    run();
  }, [blogs, language]);

  /* filter */
  const filteredBlogs = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();
    const active = activeCategory.toLowerCase();

    return translatedBlogs.filter((blog) => {
      const title = blog.title?.toLowerCase() || "";
      const content = blog.content?.toLowerCase() || "";
      const category = (blog.tags?.[0] || "").toLowerCase();

      const matchSearch =
        !searchTerm || title.includes(searchTerm) || content.includes(searchTerm);

      const matchCategory = active === "all" || category === active;

      return matchSearch && matchCategory;
    });
  }, [translatedBlogs, search, activeCategory]);

  const categories = ["All", "Insight", "Design", "Tech", "Tutorial", "News", "Case Study"];

  return (
    <section
      className="w-full bg-white py-28 overflow-hidden"
      aria-labelledby="blog-section-title"
    >
      <div className="max-w-7xl mx-auto px-6 text-black">

        {/* trending */}
        {translatedTrending.length > 0 && (
          <FadeUp>
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-8">
                {t("blogSection", "trending")}
              </h2>

              <div className="flex gap-6 overflow-x-auto pb-6 pt-2 no-scrollbar">
                {translatedTrending.map((blog) => (
                  <Link
                    key={blog._id}
                    href={`/Blog/${blog.slug}`}
                    className="group min-w-[260px] max-w-[280px] flex flex-col bg-white rounded-[20px] overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="h-32 w-full bg-gray-100 overflow-hidden">
                      {blog.image && (
                        <Image
                          src={blog.image}
                          alt={blog.title}
                          width={280}
                          height={128}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>

                    <div className="p-4 flex flex-col gap-2">
                      <span className="text-xs text-black/50">
                        {blog.tags?.[0] || ""}
                      </span>
                      <h3 className="font-semibold text-sm line-clamp-2">
                        {blog.title}
                      </h3>
                      <p className="text-xs text-black/60 line-clamp-2">
                        {blog.excerpt}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </FadeUp>
        )}

        {/* title */}
        <FadeUp>
          <h2 id="blog-section-title" className="text-3xl font-bold mb-8">
            {t("blogSection", "title")}
          </h2>
        </FadeUp>

        {/* search */}
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
              className="flex-1 px-5 py-2 rounded-full border border-black text-sm transition-all duration-300 focus:scale-[1.02]"
            />
          </div>
        </FadeUp>

        {/* categories */}
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
                className={`px-5 py-2 rounded-full border text-sm transition-all duration-300 ${
                  activeCategory === cat
                    ? "bg-black text-white"
                    : "border-black hover:bg-black/10 hover:scale-105 active:scale-95"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </FadeUp>

        {/* list */}
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
                initial={{ opacity: 0, y: 30 }}
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

/* card */
function BlogCard({ blog }: { blog: Blog }) {
  const { t } = useTranslate();
  const category = blog.tags?.[0] || "";

  return (
    <article className="group relative">

      <div
        className="pointer-events-none absolute -inset-5 rounded-[32px] bg-[radial-gradient(circle,rgba(255,200,0,0.35)_0%,transparent_70%)] opacity-0 blur-[50px] group-hover:opacity-100 transition"
        aria-hidden="true"
      />

      <div className="relative flex gap-6 bg-white border border-black rounded-[28px] px-8 py-8 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">

        <div className="w-28 h-28 rounded-2xl overflow-hidden bg-gray-100">
          {blog.image ? (
            <Image
              src={blog.image}
              alt={blog.title}
              width={112}
              height={112}
              className="w-full h-full object-cover"
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
            className="inline-block px-6 py-2 rounded-full border border-black text-sm transition-all duration-300 hover:bg-black hover:text-white hover:scale-105 active:scale-95"
            onClick={() => {
              sessionStorage.setItem("selectedBlog", JSON.stringify(blog));
            }}
          >
            {t("blogSection", "readMore")}
          </Link>
        </div>

      </div>
    </article>
  );
}