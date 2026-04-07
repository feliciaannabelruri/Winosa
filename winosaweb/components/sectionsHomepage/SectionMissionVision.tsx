"use client";

import { motion } from "framer-motion";
import FadeUp from "@/components/animation/FadeUp";
import { Target, Rocket, ShieldCheck, Users } from "lucide-react";
import { useTranslate } from "@/lib/useTranslate";

export default function SectionMissionVision() {
  const { t } = useTranslate();

  return (
    <FadeUp>
      <section
        aria-labelledby="mission-title"
        role="region"
        className="w-full py-24 bg-white"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-16 flex flex-col lg:flex-row items-center gap-16">

          {/* left visual */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex-1 flex justify-center"
          >
            <div
              className="relative w-64 h-64 flex items-center justify-center"
              aria-hidden="true"
            >

              {/* rings (lebih halus) */}
              <div className="absolute w-64 h-64 rounded-full bg-yellow-400/15" />
              <div className="absolute w-48 h-48 rounded-full bg-yellow-500/25" />
              <div className="absolute w-32 h-32 rounded-full bg-yellow-600/35" />

              {/* center */}
              <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg relative z-10">
                <Target className="text-white w-8 h-8" aria-hidden="true" />
              </div>

              {/* arrow */}
              <svg
                className="absolute w-64 h-64 z-20"
                viewBox="0 0 256 256"
                aria-hidden="true"
              >
                <g transform="rotate(45 128 128) translate(0 70)">
                  <rect
                    x="124"
                    y="90"
                    width="8"
                    height="110"
                    fill="#eab308"
                    rx="3"
                  />
                  <polygon
                    points="128,55 145,80 111,80"
                    fill="#eab308"
                  />
                  <polygon
                    points="124,180 105,200 124,192"
                    fill="#eab308"
                  />
                  <polygon
                    points="132,180 151,200 132,192"
                    fill="#eab308"
                  />
                </g>
              </svg>

            </div>
          </motion.div>

          {/* right content */}
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2
              id="mission-title"
              className="text-4xl font-bold text-black mb-6"
            >
              {t("missionVision", "title")}
            </h2>

            <p className="text-black/70 mb-10 leading-relaxed max-w-xl">
              {t("missionVision", "description")}
            </p>

            <div className="grid sm:grid-cols-2 gap-10">

              {/* item */}
              <div className="flex gap-4 transition-transform duration-300 hover:-translate-y-1" tabIndex={0}>
                <Rocket className="text-yellow-500 w-6 h-6 mt-1" aria-hidden="true" />
                <div>
                  <h4 className="font-semibold text-black">
                    {t("missionVision", "innovationTitle")}
                  </h4>
                  <p className="text-black/70 text-sm">
                    {t("missionVision", "innovationDesc")}
                  </p>
                </div>
              </div>

              <div className="flex gap-4 transition-transform duration-300 hover:-translate-y-1" tabIndex={0}>
                <ShieldCheck className="text-yellow-500 w-6 h-6 mt-1" aria-hidden="true" />
                <div>
                  <h4 className="font-semibold text-black">
                    {t("missionVision", "integrityTitle")}
                  </h4>
                  <p className="text-black/70 text-sm">
                    {t("missionVision", "integrityDesc")}
                  </p>
                </div>
              </div>

              <div className="flex gap-4 transition-transform duration-300 hover:-translate-y-1" tabIndex={0}>
                <Users className="text-yellow-500 w-6 h-6 mt-1" aria-hidden="true" />
                <div>
                  <h4 className="font-semibold text-black">
                    {t("missionVision", "partnershipTitle")}
                  </h4>
                  <p className="text-black/70 text-sm">
                    {t("missionVision", "partnershipDesc")}
                  </p>
                </div>
              </div>

              <div className="flex gap-4 transition-transform duration-300 hover:-translate-y-1" tabIndex={0}>
                <Target className="text-yellow-500 w-6 h-6 mt-1" aria-hidden="true" />
                <div>
                  <h4 className="font-semibold text-black">
                    {t("missionVision", "impactTitle")}
                  </h4>
                  <p className="text-black/70 text-sm">
                    {t("missionVision", "impactDesc")}
                  </p>
                </div>
              </div>

            </div>
          </motion.div>

        </div>
      </section>
    </FadeUp>
  );
}