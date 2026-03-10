"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useTranslate } from "@/lib/useTranslate";

const FadeUp = dynamic(() => import("@/components/animation/FadeUp"));

type PlanType = "normal" | "custom";

type Plan = {
  name: string;
  price: string;
  desc: string;
  features: string[];
  type: PlanType;
};

type Props = {
  data?: any;
};

const whatsappNumber = "6281234567890";

const defaultPlans: Plan[] = [
  {
    name: "UI Basic",
    price: "$199",
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

export default function SectionPricingUIUX({}: Props) {

  const { t } = useTranslate();
  const [active, setActive] = useState<number>(1);

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

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 xl:grid-cols-3 gap-10">

        {defaultPlans.map((plan, i) => {

          const whatsappLink =
            `https://wa.me/${whatsappNumber}?text=Hello%20I%20am%20interested%20in%20${encodeURIComponent(plan.name)}`;

          return (
            <FadeUp key={i} delay={i * 0.2}>

              <div
                tabIndex={0}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(1)}
                className={`relative rounded-[28px] p-10 bg-white transition-all duration-300 flex flex-col h-full ${
                  active === i
                    ? "shadow-[0_0_60px_rgba(255,200,80,0.5)] scale-[1.03]"
                    : ""
                }`}
              >

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
                    aria-label="Custom UI UX service"
                    className="block text-center w-full py-3 rounded-full border border-black font-semibold text-black hover:bg-black/10 transition"
                  >
                    {t("pricing", "custom")}
                  </Link>
                ) : (
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Contact via WhatsApp about ${plan.name}`}
                    className="block text-center w-full py-3 rounded-full border border-black font-semibold text-black hover:bg-black/10 transition"
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
  );
}