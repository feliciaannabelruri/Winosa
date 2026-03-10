"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import FadeUp from "@/components/animation/FadeUp";
import EmptyState from "@/components/UI/EmptyState";
import { useTranslate } from "@/lib/useTranslate";

type Blog = {
  _id: string;
  title: string;
  content: string;
  excerpt?: string;
  image?: string;
  tags?: string[];   // ✅ category tersimpan di tags[0]
  slug: string;
  createdAt: string;
};

export default function SectionBlog() {

  const { t } = useTranslate();

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/blog`,
          { cache: "no-store" }
        );
        const data = await res.json();
        setBlogs(data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const filteredBlogs = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();
    const active = activeCategory.toLowerCase();

    return blogs.filter((blog) => {
      const title   = blog.title?.toLowerCase() || "";
      const content = blog.content?.toLowerCase() || "";

      // ✅ FIX: category tersimpan di tags[0], bukan field category
      const blogCategory = (blog.tags?.[0] || "").toLowerCase();

      const matchSearch =
        searchTerm === ""
          ? true
          : title.includes(searchTerm) || content.includes(searchTerm);

      const matchCategory =
        active === "all" ? true : blogCategory === active;

      return matchSearch && matchCategory;
    });
  }, [blogs, search, activeCategory]);

  const categories = ["All", "Insight", "Design", "Tech", "Tutorial", "News", "Case Study"];

  return (
    <section className="w-full bg-white py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 text-black">

        <FadeUp>
          <h2 className="text-3xl font-bold mb-8">
            {t("blogSection", "title")}
          </h2>
        </FadeUp>

        <FadeUp>
          <div className="flex gap-4 mb-6">
            <input
              type="text"
              placeholder={t("blogSection", "search")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-5 py-2 rounded-full border border-black text-sm"
            />
          </div>
        </FadeUp>

        <FadeUp>
          <div className="flex justify-end gap-3 mb-14 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full border text-sm transition ${
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

        {loading ? (
          <div className="text-center py-20">
            {t("global", "loading")}
          </div>
        ) : filteredBlogs.length === 0 ? (
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

  // ✅ category dari tags[0]
  const category = blog.tags?.[0] || "";

  return (
    <div className="group relative">

      <div className="pointer-events-none absolute -inset-5 rounded-[32px] bg-[radial-gradient(circle,rgba(255,200,0,0.45)_0%,rgba(255,200,0,0.25)_35%,transparent_70%)] opacity-0 blur-[60px] transition-all duration-500 group-hover:opacity-100" />

      <div className="relative flex gap-6 bg-white border border-black rounded-[28px] px-8 py-8 transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)]">

        <div className="w-28 h-28 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
          {blog.image ? (
            <img
              src={blog.image}
              className="w-full h-full object-cover"
              alt={blog.title}
            />
          ) : (
            <div className="w-full h-full bg-gray-200" />
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
            className="inline-block px-6 py-2 rounded-full border border-black text-sm text-black transition hover:bg-black/10"
          >
            {t("blogSection", "readMore")}
          </Link>
        </div>

      </div>
    </div>
  );
}