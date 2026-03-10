"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import FadeUp from "@/components/animation/FadeUp";
import Link from "next/link";
import { useTranslate } from "@/lib/useTranslate";

interface Subscription {
  _id: string;
  name: string;
  price: number;
  duration: string;
  features: string[];
  isPopular: boolean;
  isActive: boolean;
}

export default function SectionPricing() {
  const { t } = useTranslate();
  const [plans, setPlans] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/subscriptions`
        );
        const data = await res.json();
        if (data.success) {
          setPlans(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch subscriptions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const formatPrice = (price: number, duration: string) => {
    return `$${price.toLocaleString("en-US")} USD / ${duration === "monthly" ? "mo" : "yr"}`;
  };

  if (loading) {
    return (
      <section id="pricing" className="relative w-full bg-white py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-gray-100 rounded-[28px] h-80 animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (plans.length === 0) {
    return null;
  }

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
            <div key={plan._id} className="group relative">
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10 bg-yellow-400 text-black text-xs font-bold px-4 py-1 rounded-full">
                  Popular
                </div>
              )}

              <div
                className={`bg-white rounded-[28px] p-8 md:p-10 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 flex flex-col h-full border-2 ${
                  plan.isPopular ? "border-yellow-400" : "border-transparent"
                }`}
              >
                <h3 className="text-xl md:text-2xl font-semibold text-black mb-2">
                  {plan.name}
                </h3>

                <div className="text-sm text-black/60 mb-1">
                  {t("pricing", "startFrom")}
                </div>

                <div className="text-2xl md:text-3xl font-bold text-black mb-6">
                  {formatPrice(plan.price, plan.duration)}
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