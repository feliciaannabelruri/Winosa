"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useTranslate } from "@/lib/useTranslate";
import { useEffect, useState } from "react";

export default function SectionBlogHero() {
  const { t } = useTranslate();

  const [hero, setHero] = useState<any>(null);
  const [loaded, setLoaded] = useState(false); // penting

  useEffect(() => {
    const api = process.env.NEXT_PUBLIC_API_URL;

    if (!api) {
      setLoaded(true);
      return;
    }

    const fetchData = async () => {
      try {
        const res = await fetch(`${api}/settings`);
        const json = await res.json();
        setHero(json?.data?.blogHero || null);
      } catch (err) {
        console.log("Hero fetch error:", err);
      } finally {
        setLoaded(true); // biar gak loop / stuck
      }
    };

    fetchData();
  }, []);

  // fallback langsung kalau belum load
  if (!loaded) {
    return null;
  }

  const badge = hero?.badge || t("blogHero", "badge");
  const title = hero?.title || t("blogHero", "title");
  const description = hero?.description || t("blogHero", "description");
  const cta = hero?.cta || t("blogHero", "cta");
  const bg = hero?.background || "/bg/bg9.jpg";

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">

      <Image
        src={bg}
        alt=""
        fill
        priority
        className="object-cover z-0"
      />

      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />

      <motion.div className="relative z-20 max-w-6xl mx-auto px-6 text-center text-white">

        <div className="flex items-center justify-center gap-4 mb-8">
          <span className="w-10 h-px bg-white/50" />
          <span className="px-6 py-2 rounded-full border border-white/70 text-xs font-semibold backdrop-blur-sm">
            {badge}
          </span>
          <span className="w-10 h-px bg-white/50" />
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
          {title}
        </h1>

        <p className="text-white/90 text-lg max-w-2xl mx-auto mb-12">
          {description}
        </p>

        <Link
          href="/Contact"
          className="inline-block px-8 py-3 rounded-full border border-white text-white font-semibold hover:bg-white/20"
        >
          {cta}
        </Link>

      </motion.div>

      <div className="absolute bottom-0 left-0 w-full h-[35%] z-10 bg-gradient-to-t from-white via-white/70 to-transparent" />
    </section>
  );
}