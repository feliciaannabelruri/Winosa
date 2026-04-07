"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useTranslate } from "@/lib/useTranslate";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translateHybrid } from "@/lib/translateHybrid";
import { useEffect, useState } from "react";

const FadeUp = dynamic(() => import("@/components/animation/FadeUp"));

type FeatureItem = {
  title: string;
  desc: string;
};

export default function SectionMobileFeatures({ data }: { data?: any }) {
  const { t, tApi } = useTranslate();
  const { language } = useLanguageStore();

  const defaultFeatures: FeatureItem[] = [
    { title: t("mobileFeaturesSection", "f1Title"), desc: t("mobileFeaturesSection", "f1Desc") },
    { title: t("mobileFeaturesSection", "f2Title"), desc: t("mobileFeaturesSection", "f2Desc") },
    { title: t("mobileFeaturesSection", "f3Title"), desc: t("mobileFeaturesSection", "f3Desc") },
    { title: t("mobileFeaturesSection", "f4Title"), desc: t("mobileFeaturesSection", "f4Desc") },
    { title: t("mobileFeaturesSection", "f5Title"), desc: t("mobileFeaturesSection", "f5Desc") },
    { title: t("mobileFeaturesSection", "f6Title"), desc: t("mobileFeaturesSection", "f6Desc") },
  ];

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [features, setFeatures] = useState<FeatureItem[]>([]);

  useEffect(() => {
    const run = async () => {
      const rawTitle =
        data?.mobileFeatureTitle || t("mobileFeaturesSection", "title");

      const rawSubtitle =
        data?.mobileFeatureSubtitle || t("mobileFeaturesSection", "subtitle");

      const rawFeatures: FeatureItem[] =
        Array.isArray(data?.mobileFeatures)
          ? data.mobileFeatures
          : defaultFeatures;

      const translatedFeatures = await Promise.all(
        rawFeatures.map(async (item) => ({
          title: await translateHybrid(item.title, language, tApi),
          desc: await translateHybrid(item.desc, language, tApi),
        }))
      );

      setTitle(await translateHybrid(rawTitle, language, tApi));
      setSubtitle(await translateHybrid(rawSubtitle, language, tApi));
      setFeatures(translatedFeatures);
    };

    run();
  }, [data, language]);

  return (
    <section
      className="w-full bg-white py-28 overflow-hidden"
      aria-labelledby="mobile-features-title"
    >
      <div className="max-w-7xl mx-auto px-6 text-black">

        {/* heading */}
        <FadeUp>
          <div className="mb-16 max-w-2xl">
            <h2
              id="mobile-features-title"
              className="text-3xl font-bold mb-4"
            >
              {title}
            </h2>

            <p className="text-black/70 text-base leading-relaxed">
              {subtitle}
            </p>
          </div>
        </FadeUp>

        {/* grid */}
        <FadeUp delay={0.2}>
          <motion.div
            role="list"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.12 } },
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
          >
            {features.map((item, i) => (
              <motion.div
                key={i}
                role="listitem"
                tabIndex={0}
                variants={{
                  hidden: { opacity: 0, y: 50 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.5 }}
                className="relative group focus:outline-none"
              >

                {/* glow */}
                <div
                  className="absolute -inset-8 rounded-[40px] bg-[radial-gradient(circle,rgba(255,200,80,0.4),transparent_75%)] blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  aria-hidden="true"
                />

                <div
                  className="absolute -inset-3 rounded-[28px] bg-[radial-gradient(circle,rgba(255,200,80,0.55),transparent_65%)] blur-[35px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  aria-hidden="true"
                />

                {/* card */}
                <div className="relative z-10 rounded-[28px] p-8 bg-white shadow-[0_10px_25px_rgba(0,0,0,0.12)] transition-transform duration-300 group-hover:scale-[1.02]">

                  <h3 className="font-semibold text-lg mb-3 text-black">
                    {item.title}
                  </h3>

                  <p className="text-sm text-black/70 leading-relaxed">
                    {item.desc}
                  </p>

                </div>

              </motion.div>
            ))}
          </motion.div>
        </FadeUp>

      </div>
    </section>
  );
}