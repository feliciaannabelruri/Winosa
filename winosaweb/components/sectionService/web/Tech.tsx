"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useTranslate } from "@/lib/useTranslate";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translateHybrid } from "@/lib/translateHybrid";

const FadeUp = dynamic(() => import("@/components/animation/FadeUp"));

type TechGroup = {
  category: string;
  tech: string[];
};

type TechData = {
  techTitle?: string;
  techSubtitle?: string;
  techStack?: TechGroup[];
  features?: string[];
  title?: string;
};

const defaultTechStack: TechGroup[] = [
  { category: "Frontend", tech: ["Next.js", "React", "TypeScript", "Tailwind CSS"] },
  { category: "Backend", tech: ["Node.js", "Express", "REST API"] },
  { category: "Database", tech: ["MongoDB", "PostgreSQL"] },
];

export default function SectionTechWeb({ data }: { data?: TechData }) {
  const { t, tApi } = useTranslate();
  const { language } = useLanguageStore();

  const [active, setActive] = useState<number | null>(null);

  const baseStack: TechGroup[] =
    data?.techStack?.length
      ? data.techStack
      : data?.features?.length
      ? [{ category: data.title || t("techSection", "fallbackCategory"), tech: data.features }]
      : defaultTechStack;

  const [techStack, setTechStack] = useState<TechGroup[]>(baseStack);
  const [title, setTitle] = useState(data?.techTitle || t("techSection", "title"));
  const [subtitle, setSubtitle] = useState(
    data?.techSubtitle || t("techSection", "subtitle")
  );

  useEffect(() => {
    const run = async () => {
      const mapped = await Promise.all(
        baseStack.map(async (group) => ({
          category: await translateHybrid(group.category, language, tApi),
          tech: await Promise.all(
            group.tech.map((tech) =>
              translateHybrid(tech, language, tApi)
            )
          ),
        }))
      );

      const translatedTitle = data?.techTitle
        ? await translateHybrid(data.techTitle, language, tApi)
        : t("techSection", "title");

      const translatedSubtitle = data?.techSubtitle
        ? await translateHybrid(data.techSubtitle, language, tApi)
        : t("techSection", "subtitle");

      setTechStack(mapped);
      setTitle(translatedTitle);
      setSubtitle(translatedSubtitle);
    };

    run();
  }, [language, data]);

  return (
    <section className="w-full bg-white py-32">

      <FadeUp>
        <div className="max-w-7xl mx-auto px-6 text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
            {title}
          </h2>
          <p className="text-black/60 text-lg leading-relaxed max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>
      </FadeUp>

      <div className="max-w-7xl mx-auto px-6">

        <FadeUp delay={0.2}>
          <div className="group relative rounded-[40px] p-6 bg-white border border-black shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-300 hover:shadow-[0_30px_80px_rgba(0,0,0,0.18)]">

            {/* FULL HOVER GLOW */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none">
              <div className="w-full h-full bg-[radial-gradient(circle,rgba(255,200,0,0.45)_0%,rgba(255,200,0,0.25)_40%,transparent_70%)] blur-[120px]" />
            </div>

            <div className="relative flex h-[500px] overflow-hidden rounded-[28px]">

              {techStack.map((group, i) => (
                <motion.div
                  key={i}
                  onMouseEnter={() => setActive(i)}
                  onMouseLeave={() => setActive(null)}
                  animate={{ flex: active === i ? 3 : 1 }}
                  transition={{ duration: 0.4 }}
                  className="flex items-center justify-center cursor-pointer"
                >

                  <div className="text-center px-8">

                    <h3 className="text-2xl font-semibold text-black mb-6">
                      {group.category}
                    </h3>

                    {active === i && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-wrap justify-center gap-4 text-black/70 text-lg"
                      >
                        {group.tech.map((tech, idx) => (
                          <span key={idx}>{tech}</span>
                        ))}
                      </motion.div>
                    )}

                  </div>

                </motion.div>
              ))}

            </div>

          </div>
        </FadeUp>

      </div>

    </section>
  );
}