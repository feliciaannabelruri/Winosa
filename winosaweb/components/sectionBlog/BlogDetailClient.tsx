"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import FadeUp from "@/components/animation/FadeUp";
import { useTranslate } from "@/lib/useTranslate";
import { useLanguageStore } from "@/store/useLanguageStore";
import { autoTranslate } from "@/lib/autoTranslate";
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

interface BlogDetailClientProps {
  initialBlog: Blog;
  relatedBlogs: Blog[];
}

export default function BlogDetailClient({ initialBlog, relatedBlogs }: BlogDetailClientProps) {
  const { t, tApi } = useTranslate();
  const { language } = useLanguageStore();

  const [translatedBlog, setTranslatedBlog] = useState<Blog>(initialBlog);
  const [translatedRelated, setTranslatedRelated] = useState<Blog[]>(relatedBlogs);

  const [comments, setComments] = useState<{ name: string; message: string }[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const [uiText, setUiText] = useState({
  estimation: "Need a More Accurate Estimation?",
  estimationDesc:
    "Tell us about your project requirements and our team will help provide a more suitable recommendation based on your goals and budget.",
  submitInquiry: "Submit Project Inquiry",

  related: "Related Articles",

  
  comments: "Comments",
  noComments: "No comments yet.",

  leaveComment: "Leave a Comment",
  yourName: "Your Name",
  yourThoughts: "Your Thoughts",
  writeComment: "Write your comment...",
  post: "Post Comment",
  readMore: "Read More",
});

// TRANSLATE RELATED
useEffect(() => {
  if (!language) return;

  const run = async () => {
    const [
      estimation,
      estimationDesc,
      submitInquiry,
      related,
      comments,
      noComments,
      leaveComment,
      yourName,
      yourThoughts,
      writeComment,
      post,
      readMore,
    ] = await Promise.all([
      autoTranslate(
        "Need a More Accurate Estimation?",
        language
      ),

      autoTranslate(
        "Tell us about your project requirements and our team will help provide a more suitable recommendation based on your goals and budget.",
        language
      ),

      autoTranslate(
        "Submit Project Inquiry",
        language
      ),

      autoTranslate(
        "Related Articles",
        language
      ),

      autoTranslate(
        "Comments",
        language
      ),

      autoTranslate(
        "No comments yet.",
        language
      ),

      autoTranslate(
        "Leave a Comment",
        language
      ),

      autoTranslate(
        "Your Name",
        language
      ),

      autoTranslate(
        "Your Thoughts",
        language
      ),

      autoTranslate(
        "Write your comment...",
        language
      ),

      autoTranslate(
        "Post Comment",
        language
      ),
      autoTranslate(
        "Read More",
        language
),

    ]);

    setUiText({
      estimation,
      estimationDesc,
      submitInquiry,
      related,
      comments,
      noComments,
      leaveComment,
      yourName,
      yourThoughts,
      writeComment,
      post,
      readMore,
    });
  };

  run();
}, [language]);

  
  // SAVE COMMENTS
  useEffect(() => {
  const fetchComments = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/comments/${initialBlog._id}`
      );
      const data = await res.json();
      setComments(data.data || []);
    } catch (err) {
      console.error("error load comments");
      setComments([]);
    }
  };

  fetchComments();
}, [initialBlog._id]);

  const handlePost = async () => {
    if (!name.trim() || !message.trim()) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            blogId: initialBlog._id,
            name,
            message,
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        setComments([data.data, ...comments]);
        setName("");
        setMessage("");
      }
    } catch (err) {
      console.error("error post comment");
    }
  };

  // TRANSLATE BLOG
  useEffect(() => {
    const run = async () => {
      const translated: Blog = {
        ...initialBlog,
        title: await autoTranslate(initialBlog.title, language),
        content: await autoTranslate(initialBlog.content, language),
        excerpt: initialBlog.excerpt ? await autoTranslate(initialBlog.excerpt, language) : "",
        tags: initialBlog.tags?.length 
          ? await Promise.all(initialBlog.tags.map(tag => autoTranslate(tag, language))) 
          : [],
      };
      setTranslatedBlog(translated);
    };
    run();
  }, [initialBlog, language]);

  // TRANSLATE RELATED
  useEffect(() => {
    const run = async () => {
      const updated = await Promise.all(relatedBlogs.map(async post => ({
        ...post,
        title: await autoTranslate(post.title, language),
        excerpt: post.excerpt ? await autoTranslate(post.excerpt, language) : "",
      })));
      setTranslatedRelated(updated);
    };
    run();
  }, [relatedBlogs, language]);

  const category = translatedBlog.tags?.[0] || t("blogDetail", "article");

  return (
    <>
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
            <h1 id="blog-title" className="text-3xl md:text-6xl font-display font-bold mb-4 leading-tight">
              {translatedBlog.title}
            </h1>
            <div className="text-sm text-white/80 flex gap-4 font-medium">
              <span>{t("blogDetail", "by")} {translatedBlog.author || t("blogDetail", "defaultAuthor")}</span>
              <span aria-hidden="true">•</span>
              <span>{new Date(translatedBlog.createdAt).toLocaleDateString()}</span>
            </div>
          </FadeUp>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-[30%] bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* ARTICLE */}
      <section className="max-w-4xl mx-auto px-6 py-16 text-black">
        {/* Back button */}
        <FadeUp>
          <Link
            href="/Blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-black/50 hover:text-black mb-10 group transition-colors duration-200"
          >
            <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform duration-200" />
            {t("backButton", "blog")}
          </Link>
        </FadeUp>

        <FadeUp>
          <article
            className="prose prose-xl max-w-none 
              prose-headings:font-display prose-headings:font-bold prose-headings:text-black
              prose-p:text-black/80 prose-p:leading-relaxed prose-p:mb-8
              prose-a:text-blue-600 prose-a:underline
              prose-img:rounded-3xl prose-img:shadow-2xl prose-img:my-12
              prose-ul:list-disc prose-ol:list-decimal
              prose-blockquote:border-l-8 prose-blockquote:border-primary prose-blockquote:bg-gray-50 prose-blockquote:py-4 prose-blockquote:px-8 prose-blockquote:rounded-r-2xl prose-blockquote:italic
              selection:bg-primary/30
            "
            dangerouslySetInnerHTML={{ __html: translatedBlog.content }}
          />
        </FadeUp>
      </section>

      {/* CTA RFP */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <FadeUp>
          <div className="rounded-[36px] border border-black/10 bg-[#f8f7f5] p-10 md:p-14 text-center">
            
            <h2 className="text-3xl md:text-4xl font-display font-bold text-black mb-4">
              {uiText.estimation}
            </h2>

            <p className="text-black/60 leading-relaxed max-w-2xl mx-auto mb-8">
              {uiText.estimationDesc}
            </p>

            <Link href="/rfp">
              <button
                type="button"
                className="px-8 py-3 rounded-full border border-black text-black hover:bg-black hover:text-white transition-all duration-300"
              >
               {uiText.submitInquiry}
              </button>
            </Link>

          </div>
        </FadeUp>
      </section>

      {/* RELATED */}
      <section aria-labelledby="related-title" className="w-full py-14 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-6 text-black">
          <FadeUp>
            <h2 id="related-title" className="text-3xl font-display font-bold mb-8">
              {uiText.related}
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
                  <div className="pointer-events-none absolute -inset-6 rounded-[40px] bg-[radial-gradient(circle,rgba(196,168,50,0.2)_0%,transparent_70%)] opacity-0 blur-[80px] transition-all duration-500 group-hover:opacity-100" />
                  <div className="relative h-full flex flex-col bg-white rounded-[32px] border border-gray-100 p-6 transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
                    <div className="h-52 w-full rounded-[24px] overflow-hidden bg-gray-100 mb-6">
                      {post.image && (
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      )}
                    </div>
                    <div className="flex flex-col flex-grow">
                      <h3 className="font-display font-bold text-xl mb-4 line-clamp-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-sm text-black/60 line-clamp-3 mb-6">
                        {post.excerpt}
                      </p>
                      <div className="mt-auto">
                        <Link
                          href={`/Blog/${post.slug}`}
                          className="inline-flex items-center text-sm font-bold text-black border-b-2 border-primary pb-1 hover:border-black transition-colors"
                        >
                          {uiText.readMore}
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
      <section aria-labelledby="comments-title" className="w-full py-14 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-black">
          <FadeUp>
            <h2 id="comments-title" className="text-3xl font-display font-bold mb-8">
           {uiText.comments} ({comments.length})
            </h2>
          </FadeUp>

          <div className="space-y-8 mb-16">
            {comments.map((c, i) => (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                key={i} 
                className="bg-gray-50 rounded-[28px] p-8 border border-gray-100"
              >
                <p className="font-bold text-lg mb-2">{c.name}</p>
                <p className="text-black/70 leading-relaxed">{c.message}</p>
              </motion.div>
            ))}
            {comments.length === 0 && (
              <p className="text-center text-gray-400 py-8 italic">{uiText.noComments}</p>
            )}
          </div>

          <FadeUp>
            <div className="bg-white rounded-[40px] p-10 text-black shadow-2xl">
              <h3 className="text-2xl font-display font-bold mb-8 text-black">{uiText.leaveComment}</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-black/60">{uiText.yourName}</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t("blogDetail", "yourName")}
                    className="w-full px-6 py-4 bg-white border border-black/20 rounded-2xl text-black focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 opacity-60">{uiText.yourThoughts}</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={uiText.writeComment}
                    rows={4}
                    className="w-full px-6 py-4 bg-white border border-black/20 rounded-[24px] text-black focus:border-primary outline-none resize-none"
                  />
                </div>
                <button
                    type="button"
                    onClick={handlePost}
                    className="w-full py-4 border border-black text-black font-medium rounded-full hover:bg-black/10 transition-all"
                  >
                    {uiText.post}
                </button>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>
    </>
  );
}
