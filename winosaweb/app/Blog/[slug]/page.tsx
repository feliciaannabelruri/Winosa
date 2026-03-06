"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import Footer from "@/components/layout/Footer";
import FadeUp from "@/components/animation/FadeUp";
import { useTranslate } from "@/lib/useTranslate";

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

  const { t } = useTranslate();
  const params = useParams();
  const slug = params?.slug as string;

  const [blog, setBlog] = useState<Blog | null>(null);
  const [related, setRelated] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ COMMENT STATE TIDAK AKAN HILANG
  const [comments, setComments] = useState<
    { name: string; message: string }[]
  >(() => {
    if (typeof window === "undefined") return [];
    if (!slug) return [];
    const saved = localStorage.getItem(`comments-${slug}`);
    return saved ? JSON.parse(saved) : [];
  });

  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

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

        const filtered =
          (listData.data || [])
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

  // ✅ SAVE COMMENTS
  useEffect(() => {
    if (!slug) return;
    localStorage.setItem(
      `comments-${slug}`,
      JSON.stringify(comments)
    );
  }, [comments, slug]);

  const handlePost = () => {

    if (!name.trim() || !message.trim()) return;

    setComments([
      ...comments,
      { name, message }
    ]);

    setName("");
    setMessage("");

  };

  // ================= LOADING =================

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        {t("global", "loading")}
      </main>
    );
  }

  if (!blog) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        {t("blogDetail", "notFound")}
      </main>
    );
  }

  return (

    <main className="w-full bg-white overflow-x-hidden">

      {/* HERO */}
      <section
        className="relative w-full h-[75vh] flex items-end"
        style={{
          backgroundImage: `url(${blog.image || "/bg/bg1.jpg"})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-16 text-white">

          <FadeUp>

            <span className="inline-block px-4 py-1 rounded-full border border-white text-xs mb-4">
              {blog.tags?.[0] || t("blogDetail", "article")}
            </span>

            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              {blog.title}
            </h1>

            <div className="text-sm text-white/80 flex gap-4">
              <span>
                {t("blogDetail", "by")}{" "}
                {blog.author || t("blogDetail", "defaultAuthor")}
              </span>
              <span>•</span>
              <span>
                {new Date(blog.createdAt).toLocaleDateString()}
              </span>
            </div>

          </FadeUp>

        </div>

        <div className="absolute bottom-0 left-0 w-full h-[30%] bg-gradient-to-t from-white to-transparent" />

      </section>


      {/* ARTICLE */}
      <section className="max-w-5xl mx-auto px-6 py-32 text-black">
        <FadeUp>
          <motion.article className="prose prose-lg max-w-none">
            {blog.content}
          </motion.article>
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

            {related.map((post) => (

              <div key={post._id} className="group relative">

                {/* 🔥 GLOW CONSISTENT */}
                <div
                  className="
                    pointer-events-none
                    absolute -inset-6
                    rounded-[40px]
                    bg-[radial-gradient(circle,rgba(255,200,0,0.65)_0%,rgba(255,200,0,0.45)_35%,transparent_75%)]
                    opacity-0
                    blur-[80px]
                    transition-all duration-500
                    group-hover:opacity-100
                  "
                />

                <div
                  className="
                    relative
                    h-[420px] flex flex-col bg-white
                    rounded-[28px]
                    border border-black
                    p-6
                    transition-all duration-500
                    group-hover:-translate-y-1
                    group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)]
                  "
                >

                  <div className="h-48 w-full rounded-[20px] overflow-hidden bg-gray-200 mb-5">
                    {post.image && (
                      <img
                        src={post.image}
                        className="w-full h-full object-cover"
                        alt={post.title}
                      />
                    )}
                  </div>

                  <div className="flex flex-col flex-grow">
                    <h3 className="font-semibold text-lg mb-3 line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-sm text-black/70 line-clamp-3">
                      {post.excerpt}
                    </p>

                    <div className="mt-auto pt-6">
                      <Link
                        href={`/Blog/${post.slug}`}
                        className="inline-block px-6 py-2 rounded-full border border-black text-sm text-black hover:bg-black/10 transition"
                      >
                        {t("blogDetail", "readMore")}
                      </Link>
                    </div>
                  </div>

                </div>

              </div>

            ))}

          </div>

        </div>
      </section>


      {/* COMMENTS */}
      <section className="w-full py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-black">

          <FadeUp>
            <h2 className="text-2xl font-bold mb-12">
              {t("blogDetail", "comments")}
            </h2>
          </FadeUp>

          <div className="grid md:grid-cols-2 gap-10 mb-16">
            {comments.map((c, i) => (
              <div
                key={i}
                className="border border-black rounded-[28px] p-6"
              >
                <p className="font-semibold mb-2">{c.name}</p>
                <p className="text-sm text-black/70">{c.message}</p>
              </div>
            ))}
          </div>

          <FadeUp>
            <div className="border border-black rounded-[28px] p-8">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("blogDetail", "yourName")}
                className="w-full px-5 py-3 border border-black rounded-full mb-6"
              />

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t("blogDetail", "writeComment")}
                className="w-full min-h-[140px] px-6 py-4 border border-black rounded-[20px]"
              />

              <button
                onClick={handlePost}
                className="mt-6 px-8 py-3 rounded-full border border-black hover:bg-black/10"
              >
                {t("blogDetail", "post")}
              </button>
            </div>
          </FadeUp>

        </div>
      </section>

      <Footer />

    </main>
  );

}