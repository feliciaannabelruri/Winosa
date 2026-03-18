"use client";

import {
  Layout,
  Layers,
  MousePointerClick,
  Smartphone,
} from "lucide-react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useTranslate } from "@/lib/useTranslate";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translateHybrid } from "@/lib/translateHybrid";
import { useEffect, useState } from "react";

const FadeUp = dynamic(() => import("@/components/animation/FadeUp"));

export default function SectionFeaturesUIUX({ data }: { data?: any }) {
  const { t, tApi } = useTranslate();
  const { language } = useLanguageStore();

  const iconPool = [Layout, Layers, MousePointerClick, Smartphone];

  const fallbackFeatures = [
    t("uiuxFeatures", "fallbackFeature1"),
    t("uiuxFeatures", "fallbackFeature2"),
    t("uiuxFeatures", "fallbackFeature3"),
    t("uiuxFeatures", "fallbackFeature4"),
  ];

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState<string[]>([]);

  useEffect(() => {
    const run = async () => {
      const rawTitle = data?.title || t("uiuxFeatures", "defaultTitle");
      const rawDesc = data?.description || t("uiuxFeatures", "defaultDesc");

      const rawFeatures =
        data?.features && data.features.length > 0
          ? data.features
          : fallbackFeatures;

      const translatedFeatures = await Promise.all(
        rawFeatures.map((f: string) =>
          translateHybrid(f, language, tApi)
        )
      );

      setTitle(await translateHybrid(rawTitle, language, tApi));
      setDescription(await translateHybrid(rawDesc, language, tApi));
      setFeatures(translatedFeatures);
    };

    run();
  }, [data, language]);

  return (
    <FadeUp>
      <section className="w-full bg-white py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-16 grid lg:grid-cols-2 gap-20 items-center">

          <div>
            <p className="text-sm uppercase tracking-widest text-yellow-500 mb-4">
              {t("uiuxFeatures", "label")}
            </p>

            <h2 className="text-4xl md:text-5xl font-bold text-black leading-tight mb-6">
              {title}
            </h2>

            <p className="text-black/60 text-lg leading-relaxed max-w-md">
              {description}
            </p>
          </div>

          <div className="relative flex flex-col gap-10">
            {features.map((feature: string, i: number) => {

              const Icon = iconPool[i % iconPool.length];

              return (
                <motion.div
                  key={i}
                  tabIndex={0}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="group relative pl-12"
                >

                  <div className="absolute left-5 top-0 bottom-0 w-px bg-black/10" />

                  <div className="absolute left-0 top-1 w-10 h-10 rounded-full border border-black flex items-center justify-center bg-white group-hover:bg-yellow-50 transition">
                    <Icon className="w-5 h-5 text-black" />
                  </div>

                  <div className="pb-8 border-b border-black/10">
                    <h3 className="text-lg font-semibold text-black mb-2">
                      {feature}
                    </h3>

                    <p className="text-sm text-black/60 leading-relaxed max-w-md">
                      {t("uiuxFeatures", "fallbackDesc")}
                    </p>
                  </div>

                </motion.div>
              );

            })}
          </div>
        </div>
      </section>
    </FadeUp>
  );
}