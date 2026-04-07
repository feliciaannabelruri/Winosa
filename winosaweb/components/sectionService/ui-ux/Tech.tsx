"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useTranslate } from "@/lib/useTranslate";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translateHybrid } from "@/lib/translateHybrid";
import { useEffect, useState } from "react";

const FadeUp = dynamic(() => import("@/components/animation/FadeUp"));

export default function SectionTechUIUX({ data }: { data?: any }) {
  const { t, tApi } = useTranslate();
  const { language } = useLanguageStore();

  const defaultTools = [
    "Figma",
    "Adobe XD",
    "Framer",
    "Miro",
    "Notion",
    "Maze Testing",
  ];

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [tools, setTools] = useState<string[]>([]);

  useEffect(() => {
    const run = async () => {
      const rawTitle = data?.techTitle || t("uiuxTech", "title");
      const rawSubtitle = data?.techDescription || t("uiuxTech", "subtitle");

      const rawTools =
        Array.isArray(data?.tools) && data.tools.length > 0
          ? data.tools
          : defaultTools;

      const translatedTools = await Promise.all(
        rawTools.map((tool: string) =>
          translateHybrid(tool, language, tApi)
        )
      );

      setTitle(await translateHybrid(rawTitle, language, tApi));
      setSubtitle(await translateHybrid(rawSubtitle, language, tApi));
      setTools(translatedTools);
    };

    run();
  }, [data, language]);

  return (
    <section
      className="relative w-full bg-white py-28 overflow-hidden"
      aria-labelledby="tech-uiux-title"
    >

      {/* heading */}
      <FadeUp>
        <div className="max-w-7xl mx-auto px-6 lg:px-16 text-center mb-20">
          <h2
            id="tech-uiux-title"
            className="text-4xl md:text-5xl font-bold text-black mb-6"
          >
            {title}
          </h2>

          <p className="text-black/60 text-lg leading-relaxed max-w-xl mx-auto">
            {subtitle}
          </p>
        </div>
      </FadeUp>

      {/* marquee */}
      <FadeUp delay={0.2}>
        <div
          className="relative w-full overflow-hidden"
          role="region"
          aria-label="Tools and technologies used"
        >
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: "-50%" }}
            transition={{
              repeat: Infinity,
              duration: 22,
              ease: "linear",
            }}
            className="flex whitespace-nowrap"
          >
            {[...tools, ...tools].map((tool, i) => (
              <div
                key={i}
                className="mx-16 text-3xl md:text-4xl font-semibold text-black"
                aria-hidden="true"
              >
                {tool}
              </div>
            ))}
          </motion.div>
        </div>
      </FadeUp>

      {/* glow background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="w-full h-full blur-[120px]"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(255,200,0,0.45) 0%, rgba(255,200,0,0.3) 30%, rgba(255,200,0,0.15) 55%, rgba(255,200,0,0.05) 70%, transparent 85%)",
          }}
        />
      </div>

      {/* fade edges */}
      <div
        className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white to-transparent pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent pointer-events-none"
        aria-hidden="true"
      />

    </section>
  );
}