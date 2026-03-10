"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useTranslate } from "@/lib/useTranslate";
import Button from "@/components/UI/Button";

const FadeUp = dynamic(() => import("@/components/animation/FadeUp"));

type PlanType = "normal" | "custom";

type Plan = {
  name: string;
  price: string;
  desc: string;
  features: string[];
  type: PlanType;
};

const defaultPlans: Plan[] = [
  {
    name: "Starter App",
    price: "$499",
    desc: "Best for MVP, startup ideas, and simple mobile apps.",
    features: [
      "Single platform (Android or iOS)",
      "Modern UI design",
      "Basic navigation flow",
      "API integration",
      "Basic testing & deployment",
    ],
    type: "normal",
  },
  {
    name: "Business App",
    price: "$1299",
    desc: "Perfect for growing businesses and production-ready apps.",
    features: [
      "Android & iOS app",
      "Custom UI/UX design",
      "User authentication system",
      "Backend & database integration",
      "Performance optimization",
    ],
    type: "normal",
  },
  {
    name: "Enterprise App",
    price: "Custom",
    desc: "For complex systems, high traffic, and scalable platforms.",
    features: [
      "Advanced app architecture",
      "Custom backend & API",
      "Payment / booking system",
      "Security & scalability setup",
      "Dedicated development team",
    ],
    type: "custom",
  },
];

export default function SectionPricingMobile({ data }: { data?: any }) {
  const { t } = useTranslate();
  const [active, setActive] = useState<number>(1);

  const cleanPrice = data?.price
    ? data.price.replace(/Starting from\s*/i, "")
    : null;

  let plans: Plan[];

  if (data?.price) {
    const dynamicPlan: Plan = {
      name: data.title || "Starter App",
      price: cleanPrice || "$999",
      desc: data.description || "Professional mobile app solution.",
      features: data.features || [],
      type: "normal",
    };

    const businessPlan: Plan = {
      name: "Business App",
      price: "$1499",
      desc: "Advanced features for scalable mobile apps.",
      features: [
        ...(data.features || []),
        "User Authentication",
        "Cloud Deployment",
      ],
      type: "normal",
    };

    const customPlan: Plan = {
      name: "Enterprise App",
      price: "Custom",
      desc: "Full custom architecture & scalable mobile platform.",
      features: [
        "Custom Backend",
        "High Scalability",
        "Payment Integration",
        "Dedicated Team",
      ],
      type: "custom",
    };

    plans = [dynamicPlan, businessPlan, customPlan];
  } else {
    plans = defaultPlans;
  }

  return (
    <section className="w-full bg-white py-32">
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

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {plans.map((plan, i) => (
          <FadeUp key={i} delay={i * 0.2}>
            <div
              tabIndex={0}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(1)}
              className={`relative cursor-pointer rounded-[28px] p-10 bg-white transition-all duration-300 flex flex-col h-full ${
                active === i
                  ? "shadow-[0_0_90px_rgba(255,200,80,0.8)] scale-[1.05]"
                  : "hover:shadow-[0_0_40px_rgba(255,200,80,0.4)]"
              }`}
            >
              <div>
                <h3 className="text-xl font-bold text-black mb-3">
                  {plan.name}
                </h3>

                <p className="text-black mb-6 leading-relaxed">
                  {plan.desc}
                </p>

                {plan.type === "normal" && (
                  <span className="text-sm text-black block mb-2">
                    {t("pricing", "startFrom")}
                  </span>
                )}

                <div className="text-4xl font-bold text-black mb-8">
                  {plan.price}
                </div>
              </div>

              <ul className="space-y-3 text-sm text-black mb-10 flex-1">
                {plan.features.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-yellow-400" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="w-full">
                {plan.type === "custom" ? (
                  <Link
                    href="/Services/customMobile"
                    aria-label="View custom mobile app development service"
                    className="block w-full"
                  >
                    <Button
                      text={t("pricing", "custom")}
                      className="w-full border-black text-black hover:bg-black/10"
                    />
                  </Link>
                ) : (
                  <a
                    href={`https://wa.me/6281234567890?text=Hello%20I%20am%20interested%20in%20${encodeURIComponent(
                      plan.name
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Contact via WhatsApp about ${plan.name}`}
                    className="block w-full"
                  >
                    <Button
                      text={t("pricing", "getStarted")}
                      className="w-full border-black text-black hover:bg-black/10"
                    />
                  </a>
                )}
              </div>

            </div>
          </FadeUp>
        ))}
      </div>
    </section>
  );
}