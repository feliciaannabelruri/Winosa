"use client";

import { motion } from "framer-motion";
import FadeUp from "@/components/animation/FadeUp";
import Link from "next/link";
import { useTranslate } from "@/lib/useTranslate";

export default function SectionPricing() {

  const { t } = useTranslate();

  const plans = [
    {
      name: t("plansPricing", "starterName"),
      price: "$1080 USD",
      features: [
        t("plansPricing", "starterFeature1"),
        t("plansPricing", "starterFeature2"),
        t("plansPricing", "starterFeature3"),
        t("plansPricing", "starterFeature4"),
        t("plansPricing", "starterFeature5"),
      ],
    },
    {
      name: t("plansPricing", "proName"),
      price: "$2800 USD",
      features: [
        t("plansPricing", "proFeature1"),
        t("plansPricing", "proFeature2"),
        t("plansPricing", "proFeature3"),
        t("plansPricing", "proFeature4"),
        t("plansPricing", "proFeature5"),
      ],
    },
    {
      name: t("plansPricing", "enterpriseName"),
      price: "$4020 USD",
      features: [
        t("plansPricing", "enterpriseFeature1"),
        t("plansPricing", "enterpriseFeature2"),
        t("plansPricing", "enterpriseFeature3"),
        t("plansPricing", "enterpriseFeature4"),
        t("plansPricing", "enterpriseFeature5"),
      ],
    },
  ];

  return (
    <section id="pricing" className="relative w-full bg-white py-24 md:py-32">

      <div className="max-w-7xl mx-auto px-6 md:px-8">

        <FadeUp>
          <div className="text-center mb-16 md:mb-24">
            <h2 className="text-3xl md:text-5xl font-bold text-black mb-4 md:mb-6">
              {t("plansPricing", "title")}
            </h2>

            <p className="text-black/70 text-base md:text-lg max-w-2xl mx-auto">
              {t("plansPricing", "subtitle")}
            </p>
          </div>
        </FadeUp>

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {plans.map((plan, index) => (
            <div key={index} className="group">

              <div className="bg-white rounded-[28px] p-8 md:p-10 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 flex flex-col h-full">

                <h3 className="text-xl md:text-2xl font-semibold text-black mb-2">
                  {plan.name}
                </h3>

                <div className="text-sm text-black/60 mb-1">
                  {t("pricing", "startFrom")}
                </div>

                <div className="text-2xl md:text-3xl font-bold text-black mb-6">
                  {plan.price}
                </div>

                <ul className="space-y-3 text-black mb-10 text-sm md:text-base flex-grow">
                  {plan.features.map((feature, i) => (
                    <li key={i}>• {feature}</li>
                  ))}
                </ul>

                <Link
                  href={`https://wa.me/6281234567890?text=${encodeURIComponent(
                    `${t("plansPricing", "whatsappText")} ${plan.name}`
                  )}`}
                  target="_blank"
                  className="block text-center px-6 py-3 rounded-full border border-black text-black transition hover:bg-black/10"
                >
                  {t("plansPricing", "chooseButton")}
                </Link>

              </div>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}