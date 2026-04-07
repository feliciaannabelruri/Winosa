"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import Button from "@/components/UI/Button";
import { useTranslate } from "@/lib/useTranslate";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translateHybrid } from "@/lib/translateHybrid";
import { useEffect, useState } from "react";

const FadeUp = dynamic(() => import("@/components/animation/FadeUp"));

export default function SectionHeroUIUX({ data }: { data?: any }) {
  const { t, tApi } = useTranslate();
  const { language } = useLanguageStore();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ctaText, setCtaText] = useState("");

  useEffect(() => {
    const run = async () => {
      const rawTitle = data?.title || t("uiuxHero", "title");
      const rawDesc = data?.description || t("uiuxHero", "subtitle");
      const rawCta = data?.ctaText || t("uiuxHero", "cta");

      setTitle(await translateHybrid(rawTitle, language, tApi));
      setDescription(await translateHybrid(rawDesc, language, tApi));
      setCtaText(await translateHybrid(rawCta, language, tApi));
    };

    run();
  }, [data, language]);

  return (
    <FadeUp>
      <section
        className="relative w-full min-h-screen bg-white overflow-hidden flex items-center justify-center"
        aria-labelledby="uiux-hero-title"
      >

        {/* LEFT IMAGE */}
        <motion.div
          initial={{ x: -200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="absolute left-0 top-1/2 -translate-y-1/2 w-[35%] hidden lg:block"
          aria-hidden="true"
        >
          <div className="h-[500px] rounded-r-[80px] shadow-xl overflow-hidden bg-gradient-to-br from-gray-100 to-white flex items-center justify-center">
            {data?.heroLeftImage ? (
              <img
                src={data.heroLeftImage}
                alt="UI UX design preview"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-black/40 text-sm">UIUX Preview</span>
            )}
          </div>
        </motion.div>

        {/* RIGHT IMAGE */}
        <motion.div
          initial={{ x: 200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="absolute right-0 top-1/2 -translate-y-1/2 w-[35%] hidden lg:block"
          aria-hidden="true"
        >
          <div className="h-[500px] rounded-l-[80px] shadow-xl overflow-hidden bg-gradient-to-bl from-gray-100 to-white flex items-center justify-center">
            {data?.heroRightImage ? (
              <img
                src={data.heroRightImage}
                alt="UI UX interface example"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-black/40 text-sm">UIUX Preview</span>
            )}
          </div>
        </motion.div>

        {/* CONTENT */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="relative z-10 text-center max-w-3xl px-6"
        >
          <h1
            id="uiux-hero-title"
            className="text-5xl md:text-6xl font-bold text-black mb-6 leading-tight"
          >
            {title}
          </h1>

          <p className="text-black/60 text-lg leading-relaxed mb-10 max-w-xl mx-auto">
            {description}
          </p>

          <Link
            href="/Contact"
            aria-label={`Go to ${ctaText}`}
          >
            <Button text={ctaText} />
          </Link>
        </motion.div>

        {/* BOTTOM GRADIENT (lebih smooth) */}
        <div
          className="absolute bottom-0 left-0 w-full h-[35%] pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0.85) 30%, rgba(255,255,255,0.4) 65%, rgba(255,255,255,0) 100%)",
          }}
          aria-hidden="true"
        />

      </section>
    </FadeUp>
  );
}