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
import EmptyState from "@/components/UI/EmptyState";

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
  const [translatedBlog, setTranslatedBlog] = useState<Blog | null>(null);

  const [related, setRelated] = useState<Blog[]>([]);
  const [translatedRelated, setTranslatedRelated] = useState<Blog[]>([]);

  const [loading, setLoading] = useState(true);

  const [comments, setComments] = useState<
  { name: string; message: string }[]
>(() => {
  if (typeof window === "undefined") return [];

  try {
    const slugKey = typeof window !== "undefined"
      ? window.location.pathname.split("/").pop()
      : null;

    if (!slugKey) return [];

    const saved = localStorage.getItem(`comments-${slugKey}`);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
});

  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  //  LOAD COMMENTS //
    useEffect(() => {
      if (!slug) return;

      try {
        const saved = localStorage.getItem(`comments-${slug}`);

        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setComments(parsed);
          } else {
            setComments([]);
          }
        } else {
          setComments([]);
        }

      } catch {
        setComments([]);
      }
    }, [slug]);

  // SAVE COMMENTS //
    useEffect(() => {
    if (!slug) return;

    if (!comments) return;

    try {
      localStorage.setItem(`comments-${slug}`, JSON.stringify(comments));
    } catch (err) {
      console.error("failed save comments", err);
    }

  }, [comments, slug]);


  const handlePost = () => {
    if (!name.trim() || !message.trim()) return;
    setComments([...comments, { name, message }]);
    setName("");
    setMessage("");
  };

  // FETCH //
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
        setTranslatedBlog(detailData.data);

        const recRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/blog/${slug}/recommendations?limit=3`
        );
        const recData = await recRes.json();
        setRelated(recData.data || []);
        setTranslatedRelated(recData.data || []);

      } catch (err) {
        console.error(err);
        setBlog(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  // TRANSLATE BLOG //
  useEffect(() => {
    if (!blog) return;

  
    setTranslatedBlog(blog);

    const run = async () => {

      const translated: Blog = {
        ...blog,
        title: await translateHybrid(blog.title, language, tApi),
        content: await translateHybrid(blog.content, language, tApi),
        excerpt: blog.excerpt
          ? await translateHybrid(blog.excerpt, language, tApi)
          : "",
        tags: blog.tags?.length
          ? await Promise.all(
              blog.tags.map((tag) =>
                translateHybrid(tag, language, tApi)
              )
            )
          : [],
      };

      setTranslatedBlog(translated);

    };

    run();
  }, [blog, language]);

  //  TRANSLATE RELATED //
  useEffect(() => {
    if (!related.length) return;

    const run = async () => {
      
        setTranslatedRelated(related);

        const run = async () => {

          for (const post of related) {

            const translated: Blog = {
              ...post,
              title: await translateHybrid(post.title, language, tApi),
              excerpt: post.excerpt
                ? await translateHybrid(post.excerpt, language, tApi)
                : "",
            };

            
            setTranslatedRelated((prev) => {
              const updated = [...prev];
              const index = updated.findIndex((p) => p.slug === post.slug);
              if (index !== -1) updated[index] = translated;
              return updated;
            });

          }

        };

        run();
    };

    run();
  }, [related, language]);

  // ================= LOADING =================
  if (loading) {
    return (
      <main className="w-full bg-white overflow-x-hidden animate-pulse">

        {/* HERO SKELETON */}
        <section
          aria-labelledby="blog-title"
          className="relative w-full h-[75vh] flex items-end" />

        {/* ARTICLE SKELETON */}
        <section className="max-w-5xl mx-auto px-6 py-32 space-y-4">
          <div className="h-4 bg-gray-200 rounded-full w-3/4" />
          <div className="h-4 bg-gray-200 rounded-full w-full" />
          <div className="h-4 bg-gray-200 rounded-full w-5/6" />
          <div className="h-4 bg-gray-200 rounded-full w-2/3" />
          <div className="h-4 bg-gray-200 rounded-full w-full" />
          <div className="h-4 bg-gray-200 rounded-full w-4/5" />
          <div className="h-4 bg-gray-200 rounded-full w-3/5" />
          <div className="h-4 bg-gray-200 rounded-full w-full" />
        </section>

        {/* RELATED SKELETON */}
        <section className="w-full py-32 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="h-7 bg-gray-200 rounded-full w-48 mb-12" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-[420px] flex flex-col bg-white rounded-[28px] border border-gray-100 p-6 gap-4">
                  <div className="h-48 w-full rounded-[20px] bg-gray-200" />
                  <div className="h-4 bg-gray-200 rounded-full w-3/4" />
                  <div className="h-4 bg-gray-200 rounded-full w-full" />
                  <div className="h-4 bg-gray-200 rounded-full w-2/3" />
                  <div className="mt-auto h-9 bg-gray-200 rounded-full w-32" />
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
    );
  }

  if (!translatedBlog) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        {t("blogDetail", "notFound")}
      </main>
    );
  }

  const category =
    translatedBlog.tags?.[0] || t("blogDetail", "article");

  return (
    <main className="w-full bg-white overflow-x-hidden">

      {/* HERO */}
      <section
        className="relative w-full h-[75vh] flex items-end"
        style={{
          backgroundImage: `url(${translatedBlog.image || "/bg/bg1.jpg"})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/40" aria-hidden="true" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-16 text-white">
          <FadeUp>

            <span className="inline-block px-4 py-1 rounded-full border border-white text-xs mb-4">
              {category}
            </span>

            <h1 id="blog-title" className="text-3xl md:text-5xl font-bold mb-4">
              {translatedBlog.title}
            </h1>

            <div className="text-sm text-white/80 flex gap-4">
              <span>
                {t("blogDetail", "by")}{" "}
                {translatedBlog.author || t("blogDetail", "defaultAuthor")}
              </span>

              <span aria-hidden="true">•</span>

              <span>
                {new Date(translatedBlog.createdAt).toLocaleDateString()}
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
            role="article"
            className="prose prose-lg max-w-none
              prose-headings:font-bold prose-headings:text-black
              prose-p:text-black/80 prose-p:leading-relaxed
              prose-a:text-blue-600 prose-a:underline
              prose-img:rounded-2xl prose-img:w-full
              prose-ul:list-disc prose-ol:list-decimal
              prose-blockquote:border-l-4 prose-blockquote:border-black/20 prose-blockquote:pl-4 prose-blockquote:italic
            "
            dangerouslySetInnerHTML={{ __html: translatedBlog.content }}
          />
        </FadeUp>
      </section>

      {/* RELATED */}
      <section
          aria-labelledby="related-title"
          className="w-full py-32 bg-white"
        >
        <div className="max-w-7xl mx-auto px-6 text-black">

          <FadeUp>
           <h2 id="related-title" className="text-2xl font-bold mb-12">
              {t("blogDetail", "related")}
            </h2>
          </FadeUp>

          {translatedRelated.length === 0 ? (
            <EmptyState
              icon="folder"
              title={t("blogDetail", "relatedEmpty")}
              description={t("blogDetail", "relatedEmptyDesc")}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

              {translatedRelated.map((post) => (

                <div key={post.slug} className="group relative">

                  <div className="pointer-events-none absolute -inset-6 rounded-[40px] bg-[radial-gradient(circle,rgba(255,200,0,0.65)_0%,rgba(255,200,0,0.45)_35%,transparent_75%)] opacity-0 blur-[80px] transition-all duration-500 group-hover:opacity-100" />

                  <div className="relative h-[420px] flex flex-col bg-white rounded-[28px] border border-black p-6 transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)]">

                    <div className="h-48 w-full rounded-[20px] overflow-hidden bg-gray-200 mb-5">

                      {post.image && (
                        <img
                          src={post.image}
                          alt={post.title || "Blog image"}
                          className="w-full h-full object-cover"
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
                          aria-label={`Read more about ${post.title}`}
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
          )}

        </div>
      </section>

        {/* COMMENTS */}
        <section
          aria-labelledby="comments-title"
          className="w-full py-20 bg-white"
        >
          <div className="max-w-7xl mx-auto px-6 text-black">

            <FadeUp>
              <h2 id="comments-title" className="text-2xl font-bold mb-8">
                {t("blogDetail", "comments")}
              </h2>
            </FadeUp>

            <div className="grid md:grid-cols-2 gap-6 mb-10">
              {comments.map((c, i) => (
                <div key={i} className="border border-black rounded-[28px] p-6">
                  <p className="font-semibold mb-2">{c.name}</p>
                  <p className="text-sm text-black/70">{c.message}</p>
                </div>
              ))}
            </div>

            <FadeUp>
              <div className="border border-black rounded-[28px] p-8">

                <label htmlFor="name" className="sr-only">
                  Your name
                </label>

                <input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("blogDetail", "yourName")}
                  className="w-full px-5 py-3 border border-black rounded-full mb-5"
                />

                <label htmlFor="message" className="sr-only">
                  Write your comment
                </label>

                <textarea
                  id="message"
                  aria-label="Write your comment"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t("blogDetail", "writeComment")}
                  className="w-full min-h-[140px] px-6 py-4 border border-black rounded-[20px]"
                />

                <button
                  aria-label="Post comment"
                  type="button"
                  onClick={handlePost}
                  className="mt-4 px-8 py-3 rounded-full border border-black hover:bg-black/10"
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