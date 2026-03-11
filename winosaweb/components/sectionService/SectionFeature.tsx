"use client";

import { motion } from "framer-motion";
import FadeUp from "@/components/animation/FadeUp";
import { Check } from "lucide-react";
import { useTranslate } from "@/lib/useTranslate";

export default function SectionFeature() {

  const { t } = useTranslate();

  const features = [
    {
      name: t("plansFeature", "feature1"),
      basic: true,
      pro: true,
      enterprise: true,
    },
    {
      name: t("plansFeature", "feature2"),
      basic: false,
      pro: true,
      enterprise: true,
    },
    {
      name: t("plansFeature", "feature3"),
      basic: false,
      pro: true,
      enterprise: true,
    },
    {
      name: t("plansFeature", "feature4"),
      basic: false,
      pro: false,
      enterprise: true,
    },
  ];

  return (
    <FadeUp>

      <section
        role="region"
        aria-label="Plan feature comparison table"
        className="w-full bg-white py-40"
      >

        <div className="max-w-6xl mx-auto px-6">

          {/* TITLE */}

          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >

            <h2
              tabIndex={0}
              className="text-4xl font-bold text-black mb-4"
            >
              {t("plansFeature", "title")}
            </h2>

            <p
              tabIndex={0}
              className="text-black/70"
            >
              {t("plansFeature", "subtitle")}
            </p>

          </motion.div>


          <div className="relative">

            <div
              aria-hidden="true"
              className="absolute -inset-16 bg-[radial-gradient(circle,rgba(255,200,0,0.4)_0%,transparent_70%)] blur-[120px]"
            />

            <motion.div
              role="table"
              aria-label="Subscription plan feature comparison"
              className="relative border border-black rounded-[28px] overflow-hidden bg-white shadow-[0_20px_50px_rgba(0,0,0,0.08)]"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >

              {/* HEADER */}

              <div
                role="row"
                className="grid grid-cols-4 text-center bg-black text-white"
              >

                <div
                  role="columnheader"
                  tabIndex={0}
                  className="p-6 font-semibold text-left"
                >
                  {t("plansFeature", "features")}
                </div>

                <div
                  role="columnheader"
                  tabIndex={0}
                  className="p-6"
                >
                  {t("plansFeature", "basic")}
                </div>

                <div
                  role="columnheader"
                  tabIndex={0}
                  className="p-6 relative"
                >

                  <span className="font-semibold">
                    {t("plansFeature", "pro")}
                  </span>

                  <div
                    aria-label="Most popular plan"
                    className="absolute top-2 right-4 text-xs bg-yellow-400 text-black px-2 py-0.5 rounded-full"
                  >
                    {t("plansFeature", "popular")}
                  </div>

                </div>

                <div
                  role="columnheader"
                  tabIndex={0}
                  className="p-6"
                >
                  {t("plansFeature", "enterprise")}
                </div>

              </div>


              {/* FEATURES */}

              {features.map((feature, i) => (

                <div
                  key={i}
                  role="row"
                  className="grid grid-cols-4 text-center border-b border-black/10 hover:bg-black/5 transition"
                >

                  <div
                    role="cell"
                    tabIndex={0}
                    className="p-6 text-left font-medium text-black"
                  >
                    {feature.name}
                  </div>

                  <div
                    role="cell"
                    tabIndex={0}
                    className="p-6 flex justify-center"
                  >

                    {feature.basic ? (

                      <Check
                        aria-hidden="true"
                        className="text-black"
                        size={20}
                      />

                    ) : "-"}

                  </div>

                  <div
                    role="cell"
                    tabIndex={0}
                    className="p-6 flex justify-center bg-yellow-50/30"
                  >

                    {feature.pro ? (

                      <Check
                        aria-hidden="true"
                        className="text-black"
                        size={20}
                      />

                    ) : "-"}

                  </div>

                  <div
                    role="cell"
                    tabIndex={0}
                    className="p-6 flex justify-center"
                  >

                    {feature.enterprise ? (

                      <Check
                        aria-hidden="true"
                        className="text-black"
                        size={20}
                      />

                    ) : "-"}

                  </div>

                </div>

              ))}

            </motion.div>

          </div>

        </div>

      </section>

    </FadeUp>
  );
}