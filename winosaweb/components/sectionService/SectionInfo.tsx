"use client";

import {
  ShieldCheckIcon,
  ChartBarIcon,
  CursorArrowRaysIcon,
  HandThumbUpIcon,
} from "@heroicons/react/24/outline";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useTranslate } from "@/lib/useTranslate";

const FadeUp = dynamic(() => import("@/components/animation/FadeUp"));

export default function SectionInfo() {
  const { t } = useTranslate();

  const process = [
    { title: t("info", "discover"), desc: t("info", "discoverDesc") },
    { title: t("info", "design"), desc: t("info", "designDesc") },
    { title: t("info", "build"), desc: t("info", "buildDesc") },
    { title: t("info", "test"), desc: t("info", "testDesc") },
    { title: t("info", "deploy"), desc: t("info", "deployDesc") },
  ];

  const reasons = [
    {
      title: t("info", "trusted"),
      desc: t("info", "trustedDesc"),
      icon: ShieldCheckIcon,
    },
    {
      title: t("info", "scalable"),
      desc: t("info", "scalableDesc"),
      icon: ChartBarIcon,
    },
    {
      title: t("info", "business"),
      desc: t("info", "businessDesc"),
      icon: CursorArrowRaysIcon,
    },
    {
      title: t("info", "partnership"),
      desc: t("info", "partnershipDesc"),
      icon: HandThumbUpIcon,
    },
  ];

  return (
    <section className="w-full bg-white py-16" aria-labelledby="process-title">
      <div className="max-w-7xl mx-auto px-6 text-black">

        {/* process title */}
        <FadeUp>
          <div className="text-center mb-12">
            <h2 id="process-title" className="text-3xl font-bold mb-4">
              {t("info", "processTitle")}
            </h2>

            <p className="text-black/60">
              {t("info", "processSubtitle")}
            </p>
          </div>
        </FadeUp>

        {/* process steps */}
        <FadeUp>
          <div
            className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-16"
            role="list"
          >
            {process.map((item, i) => (
              <motion.div
                key={i}
                role="listitem"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center"
              >

                {/* step badge */}
                <div className="px-6 py-2 border border-black/20 rounded-full font-medium bg-white text-sm">
                  {item.title}
                </div>

                {/* line */}
                <div className="w-px h-10 bg-black/30" aria-hidden="true" />

                {/* dot */}
                <div className="w-3 h-3 bg-black rounded-full mb-4" aria-hidden="true" />

                {/* desc */}
                <p className="text-black/60 text-sm leading-relaxed">
                  {item.desc}
                </p>

              </motion.div>
            ))}
          </div>
        </FadeUp>

        {/* why title */}
        <FadeUp>
          <div className="text-center mb-14">
            <h2 id="why-title" className="text-3xl font-bold mb-4">
              {t("info", "whyTitle")}
            </h2>

            <p className="text-black/60">
              {t("info", "whySubtitle")}
            </p>
          </div>
        </FadeUp>

        {/* reasons */}
        <FadeUp>
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-10"
            role="list"
            aria-labelledby="why-title"
          >
            {reasons.map((item, i) => (
              <motion.div
                key={i}
                role="listitem"
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                viewport={{ once: true }}
              >
                <ReasonCard {...item} />
              </motion.div>
            ))}
          </div>
        </FadeUp>

      </div>
    </section>
  );
}


function ReasonCard({
  title,
  desc,
  icon: Icon,
}: {
  title: string;
  desc: string;
  icon: any;
}) {
  return (
    <div className="flex gap-5 items-start transition-transform duration-300 hover:-translate-y-1">

      {/* icon */}
      <div
        className="w-12 h-12 flex items-center justify-center border border-black/10 rounded-full"
        aria-hidden="true"
      >
        <Icon className="w-6 h-6 text-black" />
      </div>

      {/* content */}
      <div>
        <h3 className="text-lg font-semibold mb-2">
          {title}
        </h3>

        <p className="text-black/60 leading-relaxed text-sm">
          {desc}
        </p>
      </div>

    </div>
  );
}