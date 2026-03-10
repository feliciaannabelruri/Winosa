"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useTranslate } from "@/lib/useTranslate";

const FadeUp = dynamic(() => import("@/components/animation/FadeUp"));

type FeatureItem = {
  title: string;
  desc: string;
};

export default function SectionMobileFeatures({ data }: { data?: any }) {
  const { t } = useTranslate();

  const defaultFeatures: FeatureItem[] = [
    { title: t("mobileFeaturesSection", "f1Title"), desc: t("mobileFeaturesSection", "f1Desc") },
    { title: t("mobileFeaturesSection", "f2Title"), desc: t("mobileFeaturesSection", "f2Desc") },
    { title: t("mobileFeaturesSection", "f3Title"), desc: t("mobileFeaturesSection", "f3Desc") },
    { title: t("mobileFeaturesSection", "f4Title"), desc: t("mobileFeaturesSection", "f4Desc") },
    { title: t("mobileFeaturesSection", "f5Title"), desc: t("mobileFeaturesSection", "f5Desc") },
    { title: t("mobileFeaturesSection", "f6Title"), desc: t("mobileFeaturesSection", "f6Desc") },
  ];

  const features: FeatureItem[] =
    Array.isArray(data?.mobileFeatures)
      ? data.mobileFeatures
      : defaultFeatures;

  return (
    <section className="w-full bg-white py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 text-black">

        <FadeUp>
          <div className="mb-20 max-w-2xl">
            <h2 className="text-3xl font-bold mb-4">
              {data?.mobileFeatureTitle || t("mobileFeaturesSection", "title")}
            </h2>

            <p className="text-black/70 text-base leading-relaxed">
              {data?.mobileFeatureSubtitle || t("mobileFeaturesSection", "subtitle")}
            </p>
          </div>
        </FadeUp>

        <FadeUp delay={0.2}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.15 } },
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
          >
            {features.map((item, i) => (
              <motion.div
                key={i}
                role="article"
                tabIndex={0}
                variants={{
                  hidden: { opacity: 0, y: 60 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.6 }}
                className="relative group"
              >

                <div className="absolute -inset-10 rounded-[48px] bg-[radial-gradient(circle,rgba(255,200,80,0.55),transparent_75%)] blur-[90px] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="absolute -inset-4 rounded-[36px] bg-[radial-gradient(circle,rgba(255,200,80,0.7),transparent_65%)] blur-[45px] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative z-10 rounded-[28px] p-8 bg-white shadow-[0_12px_30px_rgba(0,0,0,0.15)] transition-transform duration-300 group-hover:scale-[1.03]">
                  <h3 className="font-bold text-lg mb-3 text-black">
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