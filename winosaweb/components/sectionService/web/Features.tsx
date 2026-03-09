"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useTranslate } from "@/lib/useTranslate";
import { useLanguageStore } from "@/store/useLanguageStore";

const FadeUp = dynamic(() => import("@/components/animation/FadeUp"));

type Step = {
  title: string;
  highlight: string;
  desc: string;
};

type ProcessData = {
  processTitle?: string;
  processSubtitle?: string;
  process?: Step[];
};

export default function SectionProcess({ data }: { data?: ProcessData }) {
  const { t } = useTranslate();
  const { language } = useLanguageStore();
  const [loading, setLoading] = useState(!data);

  useEffect(() => {
    if (data) setLoading(false);
  }, [data, language]);

  const fallbackSteps: Step[] = [
    {
      highlight: t("processSection", "step1Highlight"),
      title: t("processSection", "step1Title"),
      desc: t("processSection", "step1Desc"),
    },
  ];

  const steps = data?.process?.length ? data.process : fallbackSteps;

  return (
    <section className="relative w-full bg-white py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <FadeUp>
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
              {data?.processTitle || t("processSection", "title")}
            </h2>
            <p className="text-black/60 text-lg leading-relaxed">
              {data?.processSubtitle || t("processSection", "subtitle")}
            </p>
          </div>
        </FadeUp>

        {loading ? (
          <div className="text-center text-black/60">
            Loading process...
          </div>
        ) : (
          <div className="relative">
            {steps.map((step, i) => (
              <div key={i} className="min-h-[80vh] flex items-center">
                <div className="grid md:grid-cols-2 gap-20 w-full">
                  <div className="relative">
                    <div className="sticky top-32">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="relative select-none"
                      >
                        <div className="absolute inset-0 text-[120px] md:text-[160px] font-bold text-yellow-400/20 blur-3xl">
                          0{i + 1}
                        </div>
                        <div className="text-[120px] md:text-[160px] font-bold text-black">
                          0{i + 1}
                        </div>
                      </motion.div>
                    </div>
                  </div>

                  <FadeUp>
                    <div className="max-w-xl">
                      <span className="text-yellow-500 font-semibold tracking-wide">
                        {step.highlight}
                      </span>

                      <h3 className="text-3xl font-bold text-black mt-4 mb-6">
                        {step.title}
                      </h3>

                      <p className="text-black/70 text-lg leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </FadeUp>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}