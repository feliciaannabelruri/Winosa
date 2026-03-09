"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import FadeUp from "@/components/animation/FadeUp";
import Link from "next/link";
import { useTranslate } from "@/lib/useTranslate";
import { Star } from "lucide-react";

interface Plan {
  _id: string;
  name: string;
  price: number;
  duration: "monthly" | "yearly";
  features: string[];
  isActive: boolean;
  isPopular: boolean;
  description?: string;
}

const formatUSD = (price: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(price);

export default function SectionPricing() {
  const { t } = useTranslate();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/subscriptions?isActive=true`
        );
        const json = await res.json();
        if (json.success) setPlans(json.data);
      } catch (err) {
        console.error("Failed to fetch plans:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "6281234567890";

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

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-100 rounded-[28px] h-96" />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && plans.length === 0 && (
          <div className="text-center py-20 text-black/40">No plans available</div>
        )}

        {/* Plans grid */}
        {!loading && plans.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {plans.map((plan, index) => (
              <motion.div
                key={plan._id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div
                  className={`relative bg-white rounded-[28px] p-8 md:p-10 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 flex flex-col h-full border-2 ${
                    plan.isPopular ? "border-yellow-400" : "border-transparent"
                  }`}
                >
                  {/* Popular badge */}
                  {plan.isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-yellow-400 text-black text-xs font-bold px-4 py-1 rounded-full shadow-sm">
                      <Star size={10} fill="currentColor" />
                      Popular
                    </div>
                  )}

                  <h3 className="text-xl md:text-2xl font-semibold text-black mb-2">
                    {plan.name}
                  </h3>

                  {plan.description && (
                    <p className="text-sm text-black/50 mb-3">{plan.description}</p>
                  )}

                  <div className="text-sm text-black/60 mb-1">
                    {t("pricing", "startFrom")}
                  </div>

                  <div className="text-2xl md:text-3xl font-bold text-black mb-1">
                    {formatUSD(plan.price)}
                  </div>
                  <p className="text-xs text-black/40 mb-6">per {plan.duration}</p>

                  <ul className="space-y-3 text-black mb-10 text-sm md:text-base flex-grow">
                    {plan.features.map((feature, i) => (
                      <li key={i}>• {feature}</li>
                    ))}
                  </ul>

                  <Link
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                      `${t("plansPricing", "whatsappText")} ${plan.name}`
                    )}`}
                    target="_blank"
                    className={`block text-center px-6 py-3 rounded-full border transition ${
                      plan.isPopular
                        ? "bg-yellow-400 border-yellow-400 text-black hover:bg-yellow-300"
                        : "border-black text-black hover:bg-black/10"
                    }`}
                  >
                    {t("plansPricing", "chooseButton")}
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}