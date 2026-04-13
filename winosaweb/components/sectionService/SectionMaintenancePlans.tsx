"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import FadeUp from "@/components/animation/FadeUp";
import { useTranslate } from "@/lib/useTranslate";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translateHybrid } from "@/lib/translateHybrid";



// ─── Data paket ──────────────────────────────────────────────────────────────

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    monthlyPrice: 750000,
    yearlyPrice: 600000,
    desc: "For simple websites or landing pages that require regular maintenance.",
    featured: false,
    features: [
      "Content & text updates (2x/month)",
      "Weekly database backup",
      "24/7 uptime monitoring",
      "Monthly performance reports",
      "Basic security checks",
      "Support response within 1–2 business days",
    ],
    notIncluded: [
      "New feature development",
      "Complex bug fixes",
      "Support < 8 hours",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    monthlyPrice: 1800000,
    yearlyPrice: 1440000,
    desc: "For active businesses with growing traffic and frequently updated content.",
    featured: true,
    features: [
      "Content & feature updates (8x/month)",
      "Daily automated backups",
      "Uptime monitoring + real-time alerting",
      "Performance optimization & technical SEO",
      "Support response < 8 hours",
      "Minor bug fixes included",
      "SSL & server security",
      "Analytics reports + recommendations",
    ],
    notIncluded: [
      "Large custom features",
      "Dedicated manager",
    ],
  },
  {
    id: "scale",
    name: "Scale",
    monthlyPrice: 3500000,
    yearlyPrice: 2800000,
    desc: "For complex platforms, e-commerce, or applications with active users.",
    featured: false,
    features: [
      "Active feature updates & development",
      "Real-time backup",
      "SLA uptime 99.5%",
      "Dedicated support manager",
      "Priority support < 2 hours",
      "Regular load testing",
      "Integration & API maintenance",
      "Code review & light refactoring",
      "Monthly technical strategy consultation",
    ],
    notIncluded: [],
  },
];

// ─── Format harga ────────────────────────────────────────────────────────────

function fmtPrice(n: number): string {
  return "Rp " + n.toLocaleString("id-ID");
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SectionMaintenancePlans() {
  const { t, tApi } = useTranslate();
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [expanded, setExpanded] = useState<string | null>(null);

  // ─── translate ──────────────────────────────────────────────────────────────


    const [plans, setPlans] = useState(PLANS);

    const { language } = useLanguageStore();

    const isMounted = useRef(false);

    useEffect(() => {
      isMounted.current = true;
      return () => {
        isMounted.current = false;
      };
    }, []);

    useEffect(() => {
      if (language === "en") {
        setPlans(PLANS);
        return;
      }

      const translateAll = async () => {
        try {
          const updated = await Promise.all(
            PLANS.map(async (plan) => ({
              ...plan,
              desc: await translateHybrid(plan.desc, language, tApi),
              features: await Promise.all(
                plan.features.map((f) =>
                  translateHybrid(f, language, tApi)
                )
              ),
              notIncluded: await Promise.all(
                plan.notIncluded.map((f) =>
                  translateHybrid(f, language, tApi)
                )
              ),
            }))
          );

          setPlans(updated);
        } catch (err) {
          console.error("Translate error:", err);
          setPlans(PLANS);
        }
      };

      translateAll();
    }, [language]);

    const [translated, setTranslated] = useState<Record<string, string>>({});

    const th = (text: string) => {
  if (!text) return "";

  if (language === "en") return text;

  if (translated[text]) return translated[text];

  // prevent double call
  setTranslated((prev) => {
    if (prev[text]) return prev;

    translateHybrid(text, language, tApi).then((res) => {
      if (!isMounted.current) return;

      setTranslated((p) => ({ ...p, [text]: res }));
    });

    return { ...prev, [text]: text }; // placeholder biar gak spam
  });

  return text;
};

useEffect(() => {
  setTranslated({});
}, [language]);

  function waContact(planName: string, price: number) {
    const msg = `Halo Winosa! Saya tertarik dengan paket maintenance ${planName} (${fmtPrice(price)}/bulan). Bisa ceritakan lebih detail?`;
    window.open(`https://wa.me/6281234567890?text=${encodeURIComponent(msg)}`, "_blank");
  }

  return (
    <section className="w-full bg-white py-20 md:py-28 border-t border-black/6" aria-labelledby="maintenance-title">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <FadeUp>
          <div className="text-center mb-10">
            <h2
              id="maintenance-title"
              className="text-3xl md:text-4xl font-bold text-black mb-3 leading-tight"
            >
             {tApi("Monthly Maintenance Plans")} 
            </h2>
            <p className="text-black/50 text-base max-w-lg mx-auto leading-relaxed">
             {th("Focus on your business while we handle the technical side. All prices are in IDR, including tax.")} 
            </p>
          </div>
        </FadeUp>

        {/* Billing toggle */}
        <FadeUp delay={0.1}>
          <div className="flex justify-center mb-10">
            <div
              className="flex items-center border border-black/15 rounded-full overflow-hidden"
              role="group"
              aria-label="Pilih periode billing"
            >
              <button
                type="button"
                onClick={() => setBilling("monthly")}
                aria-pressed={billing === "monthly"}
                className="px-6 py-2.5 text-sm font-medium transition-all"
                style={{
                  background: billing === "monthly" ? "black" : "transparent",
                  color: billing === "monthly" ? "white" : "rgba(0,0,0,0.55)",
                  fontFamily: "inherit",
                }}
              >
                {tApi("Monthly")}
              </button>
              <button
                type="button"
                onClick={() => setBilling("yearly")}
                aria-pressed={billing === "yearly"}
                className="px-6 py-2.5 text-sm font-medium transition-all flex items-center gap-1.5"
                style={{
                  background: billing === "yearly" ? "black" : "transparent",
                  color: billing === "yearly" ? "white" : "rgba(0,0,0,0.55)",
                  fontFamily: "inherit",
                }}
              >
                {tApi("Yearly")}
                <span
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{
                    background: billing === "yearly" ? "rgba(34,197,94,0.2)" : "rgba(34,197,94,0.15)",
                    color: "#16a34a",
                  }}
                >
                  {tApi("save 20%")}
                </span>
              </button>
            </div>
          </div>
        </FadeUp>

        {/* Plans grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan, i) => {
            const price = billing === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
            const isExpanded = expanded === plan.id;

            return (
              <FadeUp key={plan.id} delay={i * 0.12}>
                <div
                  className="group relative rounded-[24px] bg-white transition-all duration-300 h-full flex flex-col"
                  style={{
                    border: plan.featured ? "2px solid black" : "1.5px solid rgba(0,0,0,0.12)",
                    boxShadow: plan.featured
                      ? "0 0 0 0 transparent"
                      : "none",
                  }}
                >
                  {/* Featured badge */}
                  {plan.featured && (
                    <div
                      className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-bold px-4 py-1.5 rounded-full"
                      style={{
                        background: "linear-gradient(135deg,#c4a832,#f4c430)",
                        color: "#1a1a1a",
                      }}
                    >
                      ✦ {th("most popular")}
                    </div>
                  )}

                  <div className="p-7 flex flex-col h-full">
                    {/* Plan name */}
                    <p
                      className="text-[11px] font-bold tracking-[1.5px] uppercase mb-3"
                      style={{ color: "rgba(0,0,0,0.4)" }}
                    >
                      {th(plan.name)}
                    </p>

                    {/* Price */}
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={billing + plan.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="flex items-baseline gap-1.5 mb-1">
                          <span className="text-3xl font-bold text-black leading-none">
                            {fmtPrice(price)}
                          </span>
                        </div>
                        <p className="text-xs text-black/35 mb-4">
                          {billing === "monthly" ? th("per month") : th("per month (billed yearly)")}
                          {billing === "yearly" && (
                            <span className="ml-1.5 line-through text-black/25">
                              {fmtPrice(plan.monthlyPrice)}
                            </span>
                          )}
                        </p>
                      </motion.div>
                    </AnimatePresence>

                    {/* Desc */}
                    <p className="text-sm text-black/55 leading-relaxed mb-5 line-clamp-3">
                      {th(plan.desc)}
                    </p>

                    {/* Divider */}
                    <div className="h-px bg-black/6 mb-5" />

                    {/* Features */}
                    <ul className="space-y-2.5 mb-4 flex-1">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-2.5 text-sm text-black/65">
                          <span
                            className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px] font-bold"
                            style={{ background: "rgba(34,197,94,0.12)", color: "#16a34a" }}
                            aria-hidden="true"
                          >
                            ✓
                          </span>
                           {th(f)}
                        </li>
                      ))}
                    </ul>

                    {/* Not included (expandable) */}
                    {plan.notIncluded.length > 0 && (
                      <div>
                        <button
                          type="button"
                          onClick={() => setExpanded(isExpanded ? null : plan.id)}
                          className="text-xs text-black/35 hover:text-black/55 transition-colors flex items-center gap-1 mb-3"
                          style={{ fontFamily: "inherit" }}
                        >
                          <span
                            className="inline-block transition-transform duration-200"
                            style={{ transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)" }}
                          >
                            ›
                          </span>
                          {isExpanded ? th("Hide") : th("Not included")}
                        </button>

                        <AnimatePresence>
                          {isExpanded && (
                            <motion.ul
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25 }}
                              className="overflow-hidden space-y-2 mb-3"
                            >
                              {plan.notIncluded.map((f) => (
                                <li key={f} className="flex items-start gap-2.5 text-sm text-black/35">
                                  <span
                                    className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px]"
                                    style={{ background: "rgba(0,0,0,0.05)", color: "rgba(0,0,0,0.3)" }}
                                    aria-hidden="true"
                                  >
                                    ×
                                  </span>
                                  {th(f)}
                                </li>
                              ))}
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      </div>
                    )}

                    {/* CTA */}
                    <button
                      type="button"
                      onClick={() => waContact(plan.name, price)}
                     className="w-full py-3 rounded-full text-sm font-medium transition-all mt-auto"
                      style={{
                        fontFamily: "inherit",
                        background: plan.featured ? "black" : "transparent",
                        color: plan.featured ? "white" : "black",
                        border: plan.featured ? "2px solid black" : "1.5px solid rgba(0,0,0,0.2)",
                      }}
                      onMouseEnter={(e) => {
                        if (!plan.featured) {
                          e.currentTarget.style.background = "black";
                          e.currentTarget.style.color = "white";
                          e.currentTarget.style.borderColor = "black";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!plan.featured) {
                          e.currentTarget.style.background = "transparent";
                          e.currentTarget.style.color = "black";
                          e.currentTarget.style.borderColor = "rgba(0,0,0,0.2)";
                        }
                      }}
                    >
                      {th("Get started with")} {plan.name}
                    </button>
                  </div>
                </div>
              </FadeUp>
            );
          })}
        </div>

        {/* Footer note */}
        <FadeUp delay={0.3}>
          <div className="mt-10 text-center space-y-2">
            <p className="text-xs text-black/35">
              {th("All plans can be customized to your needs. Free consultation available before choosing.")}
              
            </p>
            <p className="text-xs text-black/25">
              {th("Flexible payment: bank transfer or credit card. Invoice available.")}
            </p>
          </div>
        </FadeUp>

        {/* Perbandingan detail */}
        <FadeUp delay={0.4}>
          <div className="mt-16 rounded-2xl border border-black/8 overflow-hidden">
            <div className="px-6 py-4 border-b border-black/8 bg-black/2">
              <h3 className="text-sm font-semibold text-black">{th("Full comparison")}</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-black/6">
                    <th className="text-left px-6 py-3 text-black/40 font-medium w-1/2">{th("Feature")}</th>
                    {plans.map((p) => (
                      <th
                        key={p.id}
                        className="px-4 py-3 font-semibold text-center"
                        style={{ color: p.featured ? "black" : "rgba(0,0,0,0.5)" }}
                      >
                        {th(p.name)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: "Content updates", values: ["2x/month", "8x/month", "Unlimited"] },
                    { label: "Backup", values: ["Weekly", "Daily", "Real-time"] },
                    { label: "Uptime monitoring", values: ["✓", "✓ + alerting", "✓ SLA 99.5%"] },
                    { label: "Support response", values: ["1–2 days", "< 8 hours", "< 2 hours"] },
                    { label: "SSL & security", values: ["Basic", "✓", "✓"] },
                    { label: "SEO teknis", values: ["—", "✓", "✓"] },
                    { label: "Monthly report", values: ["✓", "✓ + analytics", "✓ + strategy"] },
                    { label: "Dedicated manager", values: ["—", "—", "✓"] },
                    { label: "Bug fix", values: ["—", "Minor", "Included"] },
                    { label: "Technical consultation", values: ["—", "—", "Monthly"] },
                  ].map((row, i) => (
                    <tr
                      key={row.label}
                      className="border-b border-black/4 last:border-none"
                      style={{ background: i % 2 === 0 ? "transparent" : "rgba(0,0,0,0.015)" }}
                    >
                      <td className="px-6 py-3 text-black/65">{th(row.label)}</td>
                      {row.values.map((v, vi) => (
                      <td
                        key={vi}
                        className="px-4 py-3 text-center"
                        style={{
                          color:
                            v === "—"
                              ? "rgba(0,0,0,0.2)"
                              : PLANS[vi].featured
                              ? "black"
                              : "rgba(0,0,0,0.6)",
                          fontWeight: PLANS[vi].featured ? 500 : 400,
                        }}
                      >
                        {th(v)}
                      </td>
                    ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </FadeUp>

      </div>
    </section>
  );
}