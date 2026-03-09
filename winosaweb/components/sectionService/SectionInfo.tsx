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
    <section className="w-full bg-white py-32">
      <div className="max-w-7xl mx-auto px-6 text-black">

        <FadeUp>
          <div className="text-center mb-24">
            <h2 className="text-3xl font-bold mb-4">
              {t("info", "processTitle")}
            </h2>
            <p className="text-gray-600">
              {t("info", "processSubtitle")}
            </p>
          </div>
        </FadeUp>

        <FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-28">

            {process.map((item, i) => (

              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center"
              >

                <div className="px-6 py-2 border border-black rounded-full font-medium bg-white text-sm">
                  {item.title}
                </div>

                <div className="w-px h-12 bg-black" />

                <div className="w-3 h-3 bg-black rounded-full mb-4" />

                <p className="text-gray-600 text-sm">
                  {item.desc}
                </p>

              </motion.div>

            ))}

          </div>
        </FadeUp>

        <FadeUp>

          <div className="text-center mb-16">

            <h2 className="text-3xl font-bold mb-4">
              {t("info", "whyTitle")}
            </h2>

            <p className="text-gray-600">
              {t("info", "whySubtitle")}
            </p>

          </div>

        </FadeUp>

        <FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

            {reasons.map((item, i) => (

              <motion.div
                key={i}
                initial={{ opacity: 0, x: 80 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
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

    <div className="flex gap-6 items-start">

      <div className="w-12 h-12 flex items-center justify-center">
        <Icon className="w-10 h-10 text-black" />
      </div>

      <div>

        <h3 className="text-lg font-semibold mb-2">
          {title}
        </h3>

        <p className="text-gray-600 leading-relaxed">
          {desc}
        </p>

      </div>

    </div>

  );
}