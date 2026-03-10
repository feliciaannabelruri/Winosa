"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useTranslate } from "@/lib/useTranslate";

const FadeUp = dynamic(() => import("@/components/animation/FadeUp"));

export default function SectionTechUIUX({ data }: { data?: any }) {

  const { t } = useTranslate();

  const defaultTools = [
    "Figma",
    "Adobe XD",
    "Framer",
    "Miro",
    "Notion",
    "Maze Testing",
  ];

  const tools =
    Array.isArray(data?.tools) && data.tools.length > 0
      ? data.tools
      : defaultTools;

  const title =
    data?.techTitle || t("uiuxTech", "title");

  const subtitle =
    data?.techDescription || t("uiuxTech", "subtitle");

  return (
    <section className="relative w-full bg-white py-32 overflow-hidden">

      <FadeUp>
        <div className="max-w-7xl mx-auto px-6 lg:px-16 text-center mb-24">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
            {title}
          </h2>
          <p className="text-black/60 text-lg leading-relaxed max-w-xl mx-auto">
            {subtitle}
          </p>
        </div>
      </FadeUp>

      <FadeUp delay={0.2}>
        <div className="relative w-full overflow-hidden">
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
                className="mx-20 text-3xl md:text-4xl font-semibold text-black"
              >
                {tool}
              </div>
            ))}

          </motion.div>
        </div>
      </FadeUp>

      <div className="absolute inset-0 pointer-events-none">
        <div
          className="w-full h-full blur-[140px]"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(255,200,0,0.55) 0%, rgba(255,200,0,0.4) 30%, rgba(255,200,0,0.2) 55%, rgba(255,200,0,0.08) 70%, transparent 85%)",
          }}
        />
      </div>

      <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-white to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-white to-transparent pointer-events-none" />

    </section>
  );
}