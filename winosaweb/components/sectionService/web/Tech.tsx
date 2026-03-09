"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useTranslate } from "@/lib/useTranslate";

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
  const { t } = useTranslate();
  const [active, setActive] = useState<number | null>(null);

  let techStack: TechGroup[] = [];

  if (data?.techStack?.length) techStack = data.techStack;
  else if (data?.features?.length)
    techStack = [{ category: data.title || t("techSection", "fallbackCategory"), tech: data.features }];
  else techStack = defaultTechStack;

  const title = data?.techTitle || t("techSection", "title");
  const subtitle = data?.techSubtitle || t("techSection", "subtitle");

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
          <div className="relative flex h-[500px] rounded-[40px] border border-black overflow-hidden">

            {techStack.map((group, i) => (
              <motion.div
                key={i}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                animate={{ flex: active === i ? 3 : 1 }}
                transition={{ duration: 0.5 }}
                className="relative cursor-pointer flex items-center justify-center bg-white border-r border-black last:border-r-0"
              >

                {active === i && (
                  <motion.div
                    layoutId="techGlow"
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  >
                    <div
                      className="
                        w-[120%] h-[120%]
                        bg-[radial-gradient(circle,rgba(255,200,0,0.55)_0%,rgba(255,200,0,0.3)_40%,transparent_70%)]
                        blur-[100px]
                      "
                    />
                  </motion.div>
                )}

                <div className="relative z-10 text-center px-8">

                  <h3 className="text-2xl font-semibold text-black mb-6">
                    {group.category}
                  </h3>

                  {active === i && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
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
        </FadeUp>

      </div>

    </section>
  );
}