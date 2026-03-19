"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useTranslate } from "@/lib/useTranslate";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translateHybrid } from "@/lib/translateHybrid";
import type { TierType } from "@/components/sectionService/SmartRecommend";

const FadeUp         = dynamic(() => import("@/components/animation/FadeUp"));
const SmartRecommend = dynamic(
  () => import("@/components/sectionService/SmartRecommend"),
  { ssr: false }
);

type PlanType = "normal" | "custom";

type Plan = {
  name: string;
  price: string;
  desc: string;
  features: string[];
  type: PlanType;
  tier: TierType;
};

const whatsappNumber = "6281234567890";

const defaultPlans: Plan[] = [
  {
    name: "UI Basic",
    price: "$199",
    tier: "starter",
    desc: "Perfect for landing page or small project.",
    features: [
      "1-3 Pages Design",
      "Wireframe + High Fidelity",
      "Responsive Layout",
      "Design System Basic",
      "3 Days Delivery",
    ],
    type: "normal",
  },
  {
    name: "UI/UX Pro",
    price: "$599",
    tier: "business",
    desc: "Best for startup and growing business.",
    features: [
      "Up to 10 Pages",
      "User Flow & Wireframe",
      "Full Design System",
      "Interactive Prototype",
      "Free Revision 2x",
    ],
    type: "normal",
  },
  {
    name: "Enterprise UX",
    price: "Custom",
    tier: "enterprise",
    desc: "For complex system & mobile apps.",
    features: [
      "App / Dashboard Design",
      "User Research",
      "UX Strategy",
      "Full Prototype",
      "Developer Handoff",
    ],
    type: "custom",
  },
];

export default function SectionPricingUIUX({}: { data?: any }) {
  const { t, tApi }      = useTranslate();
  const { language }     = useLanguageStore();
  const [active, setActive]                   = useState<number>(1);
  const [plans, setPlans]                     = useState<Plan[]>(defaultPlans);
  const [recommendedTier, setRecommendedTier] = useState<TierType>(null);
  const [confidence, setConfidence]           = useState<number>(0);
  const pricingRef                            = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const run = async () => {
      const mapped = await Promise.all(
        defaultPlans.map(async (plan) => ({
          ...plan,
          name:     await translateHybrid(plan.name,     language, tApi),
          desc:     await translateHybrid(plan.desc,     language, tApi),
          features: await Promise.all(plan.features.map((f) => translateHybrid(f, language, tApi))),
        }))
      );
      setPlans(mapped);
    };
    run();
  }, [language]);

  function handleRecommend(tier: TierType, conf: number) {
    setRecommendedTier(tier);
    setConfidence(conf);
    if (tier) {
      const idx = defaultPlans.findIndex((p) => p.tier === tier);
      if (idx !== -1) {
        setActive(idx);
        setTimeout(() => {
          pricingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 400);
      }
    } else {
      setActive(1);
    }
  }

  return (
    <>
      {/* ── Smart Recommend ── */}
      <SmartRecommend serviceType="uiux" onRecommend={handleRecommend} />

      {/* ── Pricing cards ── */}
      <section className="w-full bg-white pb-32" ref={pricingRef}>
        <FadeUp>
          <div className="max-w-7xl mx-auto px-6 text-center mb-16">
            <h2 className="text-3xl font-bold text-black mb-3">
              {t("pricing", "title")}
            </h2>
            <p className="text-black text-base">
              {t("pricing", "subtitle")}
            </p>
          </div>
        </FadeUp>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 xl:grid-cols-3 gap-10">
          {plans.map((plan, i) => {
            const isRecommended = recommendedTier !== null && plan.tier === recommendedTier;
            const whatsappLink  = `https://wa.me/${whatsappNumber}?text=Hello%20I%20am%20interested%20in%20${encodeURIComponent(plan.name)}`;

            return (
              <FadeUp key={i} delay={i * 0.2}>
                <div
                  tabIndex={0}
                  onMouseEnter={() => setActive(i)}
                  onMouseLeave={() =>
                    recommendedTier
                      ? setActive(defaultPlans.findIndex((p) => p.tier === recommendedTier))
                      : setActive(1)
                  }
                  className="relative rounded-[28px] p-10 bg-white transition-all duration-500 flex flex-col h-full"
                  style={{
                    boxShadow: isRecommended
                      ? "0 0 0 2.5px black, 0 0 80px rgba(196,168,50,0.55)"
                      : active === i
                      ? "0 0 60px rgba(255,200,80,0.5)"
                      : "none",
                    transform: isRecommended ? "scale(1.04)" : active === i ? "scale(1.02)" : "scale(1)",
                    zIndex: isRecommended ? 2 : 1,
                  }}
                >
                  {isRecommended && (
                    <div
                      className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-semibold px-4 py-1.5 rounded-full"
                      style={{
                        background: "linear-gradient(135deg,#c4a832,#f4c430)",
                        color: "black",
                        boxShadow: "0 4px 14px rgba(196,168,50,0.4)",
                      }}
                    >
                      ✦ Direkomendasikan untuk kamu · {confidence}%
                    </div>
                  )}

                  <h3 className="text-xl font-bold text-black mb-3">{plan.name}</h3>
                  <p className="text-black mb-6 leading-relaxed">{plan.desc}</p>

                  {plan.type === "normal" && (
                    <span className="text-sm text-black block mb-2">
                      {t("pricing", "startFrom")}
                    </span>
                  )}

                  <div className="text-4xl font-bold text-black mb-8">{plan.price}</div>

                  <ul className="space-y-3 text-sm text-black mb-10 flex-1">
                    {plan.features.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-yellow-400" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  {plan.type === "custom" ? (
                    <Link
                      href="/Services/customUi"
                      className="block text-center w-full py-3 rounded-full font-semibold transition"
                      style={{
                        border: isRecommended ? "2px solid black" : "1.5px solid black",
                        background: isRecommended ? "black" : "transparent",
                        color: isRecommended ? "white" : "black",
                      }}
                    >
                      {t("pricing", "custom")}
                    </Link>
                  ) : (
                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-center w-full py-3 rounded-full font-semibold transition"
                      style={{
                        border: isRecommended ? "2px solid black" : "1.5px solid black",
                        background: isRecommended ? "black" : "transparent",
                        color: isRecommended ? "white" : "black",
                      }}
                    >
                      {t("pricing", "getStarted")}
                    </a>
                  )}
                </div>
              </FadeUp>
            );
          })}
        </div>
      </section>
    </>
  );
}