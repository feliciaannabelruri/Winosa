"use client";

import { motion } from "framer-motion";
import { useTranslate } from "@/lib/useTranslate";

type TechItem = {
  title: string;
  desc: string;
  items: string[];
};

export default function SectionMobileTech({ data }: { data?: any }) {
  const { t } = useTranslate();

  const defaultTechStack: TechItem[] = [
    {
      title: t("mobileTechSection", "t1Title"),
      desc: t("mobileTechSection", "t1Desc"),
      items: ["Flutter", "React Native"],
    },
    {
      title: t("mobileTechSection", "t2Title"),
      desc: t("mobileTechSection", "t2Desc"),
      items: ["Android", "iOS"],
    },
    {
      title: t("mobileTechSection", "t3Title"),
      desc: t("mobileTechSection", "t3Desc"),
      items: ["REST API", "Firebase", "Custom Backend"],
    },
    {
      title: t("mobileTechSection", "t4Title"),
      desc: t("mobileTechSection", "t4Desc"),
      items: ["JWT", "OAuth", "Secure Login"],
    },
    {
      title: t("mobileTechSection", "t5Title"),
      desc: t("mobileTechSection", "t5Desc"),
      items: ["Caching", "Optimization", "Real-time Sync"],
    },
    {
      title: t("mobileTechSection", "t6Title"),
      desc: t("mobileTechSection", "t6Desc"),
      items: ["App Store", "Play Store", "CI/CD Pipeline"],
    },
  ];

  const techStack: TechItem[] =
    data?.mobileTech && Array.isArray(data.mobileTech)
      ? data.mobileTech
      : defaultTechStack;

  return (
    <section className="w-full bg-white py-32">
      <div className="max-w-7xl mx-auto px-6 text-black">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-2xl mb-24"
        >
          <h2 className="text-3xl font-bold mb-4">
            {data?.mobileTechTitle || t("mobileTechSection", "title")}
          </h2>

          <p className="text-black/70 text-base leading-relaxed">
            {data?.mobileTechSubtitle || t("mobileTechSection", "subtitle")}
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.15 } },
          }}
          className="divide-y divide-black/20"
        >
          {techStack.map((tech, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="py-12 transition hover:bg-yellow-100/30"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                <div>
                  <h3 className="text-xl font-bold mb-2 text-black">
                    {tech.title}
                  </h3>
                  <p className="text-sm text-black/60 leading-relaxed">
                    {tech.desc}
                  </p>
                </div>

                <div className="lg:col-span-2 flex flex-wrap gap-x-10 gap-y-4 text-sm font-medium">
                  {tech.items.map((item, idx) => (
                    <motion.span
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: idx * 0.05 }}
                      viewport={{ once: true }}
                      className="relative cursor-default transition hover:text-black before:absolute before:-bottom-1 before:left-0 before:w-0 before:h-[1px] before:bg-black hover:before:w-full before:transition-all"
                    >
                      {item}
                    </motion.span>
                  ))}
                </div>

              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}