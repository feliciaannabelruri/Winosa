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
        aria-label="Company mission and vision"
        role="region"
        className="w-full py-24 bg-white"
      >

        <div className="max-w-7xl mx-auto px-6 lg:px-16 flex flex-col lg:flex-row items-center gap-16">

          <motion.div
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex-1 flex justify-center"
          >
            <div
              className="relative w-64 h-64 flex items-center justify-center"
              aria-hidden="true"
            >
              <div className="absolute w-64 h-64 rounded-full bg-yellow-400/20"></div>
              <div className="absolute w-48 h-48 rounded-full bg-yellow-500/30"></div>
              <div className="absolute w-32 h-32 rounded-full bg-yellow-600/40"></div>

              <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center shadow-xl">
                <Target className="text-white w-8 h-8" />
              </div>
            </div>
          </motion.div>

          <motion.div className="flex-1">

            <h2
              className="text-4xl font-bold text-black mb-6"
              tabIndex={0}
            >
              {t("missionVision", "title")}
            </h2>

            <p
              className="text-black/70 mb-10 leading-relaxed max-w-xl"
              tabIndex={0}
            >
              {t("missionVision", "description")}
            </p>

            <div className="grid sm:grid-cols-2 gap-10">

              <div
                className="flex gap-4"
                tabIndex={0}
                aria-label="Innovation value"
              >
                <Rocket className="text-yellow-500 w-6 h-6 mt-1" />
                <div>
                  <h4 className="font-semibold text-black">
                    {t("missionVision", "innovationTitle")}
                  </h4>
                  <p className="text-black/70 text-sm">
                    {t("missionVision", "innovationDesc")}
                  </p>
                </div>
              </div>

              <div
                className="flex gap-4"
                tabIndex={0}
                aria-label="Integrity value"
              >
                <ShieldCheck className="text-yellow-500 w-6 h-6 mt-1" />
                <div>
                  <h4 className="font-semibold text-black">
                    {t("missionVision", "integrityTitle")}
                  </h4>
                  <p className="text-black/70 text-sm">
                    {t("missionVision", "integrityDesc")}
                  </p>
                </div>
              </div>

              <div
                className="flex gap-4"
                tabIndex={0}
                aria-label="Partnership value"
              >
                <Users className="text-yellow-500 w-6 h-6 mt-1" />
                <div>
                  <h4 className="font-semibold text-black">
                    {t("missionVision", "partnershipTitle")}
                  </h4>
                  <p className="text-black/70 text-sm">
                    {t("missionVision", "partnershipDesc")}
                  </p>
                </div>
              </div>

              <div
                className="flex gap-4"
                tabIndex={0}
                aria-label="Impact value"
              >
                <Target className="text-yellow-500 w-6 h-6 mt-1" />
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