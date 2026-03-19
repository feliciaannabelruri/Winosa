"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import FadeUp from "@/components/animation/FadeUp";
import { useTranslate } from "@/lib/useTranslate";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translateHybrid } from "@/lib/translateHybrid";

// ─── Types ────────────────────────────────────────────────────────────────────

type TierType = "starter" | "business" | "enterprise" | null;

interface Subscription {
  _id: string;
  name: string;
  price: number;
  duration: string;
  features: string[];
  isPopular: boolean;
  isActive: boolean;
  tier?: TierType;
}

// ─── Chip suggestions ────────────────────────────────────────────────────────

const CHIPS = [
  { label: "Startup baru", text: "startup baru budget terbatas mvp sederhana" },
  { label: "Toko online", text: "toko online ecommerce pembayaran online" },
  { label: "Bisnis berkembang", text: "bisnis sudah berjalan scale up analytics dashboard" },
  { label: "Mobile app", text: "aplikasi mobile android ios cross platform" },
  { label: "Dashboard sistem", text: "dashboard admin sistem manajemen enterprise" },
  { label: "Perusahaan besar", text: "enterprise skala besar custom integrasi ribuan user" },
];

// ─── Keyword classifier ───────────────────────────────────────────────────────

function classifyTier(text: string): { tier: TierType; confidence: number } {
  const t = text.toLowerCase();

  const enterprise =
    (t.includes("enterprise") ? 4 : 0) +
    (t.includes("skala besar") ? 4 : 0) +
    (t.includes("ribuan") ? 3 : 0) +
    (t.includes("multinasional") ? 4 : 0) +
    (t.includes("custom integrasi") ? 3 : 0) +
    (t.includes("ratusan") ? 3 : 0) +
    (t.includes("corporation") ? 3 : 0) +
    (t.includes("ux research") ? 2 : 0);

  const business =
    (t.includes("berkembang") ? 3 : 0) +
    (t.includes("sudah berjalan") ? 3 : 0) +
    (t.includes("scale") ? 2 : 0) +
    (t.includes("payment") ? 2 : 0) +
    (t.includes("dashboard") ? 2 : 0) +
    (t.includes("analytics") ? 2 : 0) +
    (t.includes("ecommerce") ? 2 : 0) +
    (t.includes("android") && t.includes("ios") ? 3 : 0) +
    (t.includes("mobile") ? 2 : 0) +
    (t.includes("cms") ? 2 : 0);

  const starter =
    (t.includes("baru") ? 3 : 0) +
    (t.includes("startup") ? 3 : 0) +
    (t.includes("budget terbatas") ? 3 : 0) +
    (t.includes("umkm") ? 3 : 0) +
    (t.includes("sederhana") ? 2 : 0) +
    (t.includes("mvp") ? 3 : 0) +
    (t.includes("pertama") ? 2 : 0) +
    (t.includes("landing page") ? 2 : 0);

  let tier: TierType = "starter";
  if (enterprise >= business && enterprise >= starter && enterprise > 0) {
    tier = "enterprise";
  } else if (business >= starter && business > 0) {
    tier = "business";
  }

  const totalSignals = enterprise + business + starter;
  const confidence = Math.min(97, Math.max(73, 73 + Math.min(totalSignals * 2, 24)));

  return { tier, confidence };
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function SectionPlanWithRecommend() {
  const { t, tApi } = useTranslate();
  const { language } = useLanguageStore();

  // Plans from API
  const [plans, setPlans] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  // Smart Recommend state
  const [input, setInput] = useState("");
  const [activeChips, setActiveChips] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "thinking" | "done">("idle");
  const [recommendedTier, setRecommendedTier] = useState<TierType>(null);
  const [confidence, setConfidence] = useState(0);
  const [showAll, setShowAll] = useState(false);

  const resultRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // ── Fetch plans ──────────────────────────────────────────────────────────

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/subscriptions`
        );
        const data = await res.json();

        if (data.success && data.data?.length) {
          // Assign tier by order: first=starter, second=business, third=enterprise
          const tierMap: TierType[] = ["starter", "business", "enterprise"];
          const mapped = await Promise.all(
            data.data.map(async (plan: Subscription, i: number) => ({
              ...plan,
              tier: tierMap[i] ?? "starter",
              name: await translateHybrid(plan.name, language, tApi),
              features: await Promise.all(
                plan.features.map((f) => translateHybrid(f, language, tApi))
              ),
            }))
          );
          setPlans(mapped);
        }
      } catch {
        // fallback — no plans shown
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, [language]);

  // ── Chip toggle ──────────────────────────────────────────────────────────

  function toggleChip(text: string) {
    setActiveChips((prev) =>
      prev.includes(text) ? prev.filter((c) => c !== text) : [...prev, text]
    );
    if (status === "done") reset();
  }

  function reset() {
    setStatus("idle");
    setRecommendedTier(null);
    setConfidence(0);
    setShowAll(false);
  }

  // ── Analyze ──────────────────────────────────────────────────────────────

  const fullText = [input.trim(), ...activeChips].filter(Boolean).join(" ");
  const canAnalyze = fullText.length >= 6;

  async function handleAnalyze() {
    if (!canAnalyze) return;
    setStatus("thinking");
    setShowAll(false);

    await new Promise((r) => setTimeout(r, 1200));

    const { tier, confidence: conf } = classifyTier(fullText);
    setRecommendedTier(tier);
    setConfidence(conf);
    setStatus("done");

    // Scroll to result
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 300);
  }

  // ── Derived ──────────────────────────────────────────────────────────────

  const recommendedPlan = plans.find((p) => p.tier === recommendedTier);
  const otherPlans = plans.filter((p) => p.tier !== recommendedTier);

  const formatPrice = (price: number, duration: string) =>
    `$${price.toLocaleString("en-US")} USD / ${duration === "monthly" ? "mo" : "yr"}`;

  const tierLabel: Record<string, string> = {
    starter: "Starter",
    business: "Business",
    enterprise: "Enterprise",
  };

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <section className="w-full bg-white py-24 md:py-32">
      <div className="max-w-4xl mx-auto px-6">

        {/* ── Section header ── */}
        <FadeUp>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-3">
              {t("plansPricing", "title")}
            </h2>
            <p className="text-black/60 text-base max-w-xl mx-auto">
              {t("plansPricing", "subtitle")}
            </p>
          </div>
        </FadeUp>

        {/* ── Smart Recommend input ── */}
        <AnimatePresence mode="wait">
          {status !== "done" && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="mb-10"
            >
              {/* Textarea */}
              <div className="relative mb-4">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    const currentStatus: string = status;
                    if (currentStatus === "done") reset();
                  }}
                  placeholder="Ceritakan kebutuhan bisnis Anda — jenis usaha, fitur yang dibutuhkan, skala, dll..."
                  rows={3}
                  maxLength={400}
                  className="w-full resize-none text-black text-sm leading-relaxed outline-none border border-black/15 rounded-2xl bg-gray-50 p-5 focus:border-black/40 focus:bg-white transition-all"
                  style={{ fontFamily: "inherit" }}
                />
                <span className="absolute bottom-3 right-4 text-xs text-black/25 pointer-events-none">
                  {input.length}/400
                </span>
              </div>

              {/* Chips */}
              <div className="flex flex-wrap gap-2 mb-5">
                {CHIPS.map((chip) => {
                  const active = activeChips.includes(chip.text);
                  return (
                    <button
                      key={chip.label}
                      onClick={() => toggleChip(chip.text)}
                      className={`text-xs px-4 py-2 rounded-full border transition-all ${
                        active
                          ? "bg-black text-white border-black"
                          : "bg-white text-black/60 border-black/20 hover:border-black/40"
                      }`}
                      style={{ fontFamily: "inherit" }}
                    >
                      {chip.label}
                    </button>
                  );
                })}
              </div>

              {/* Analyze button */}
              <button
                onClick={handleAnalyze}
                disabled={!canAnalyze || status === "thinking"}
                className={`w-full py-4 rounded-full font-semibold text-sm transition-all ${
                  canAnalyze && status !== "thinking"
                    ? "bg-black text-white hover:bg-black/85"
                    : "bg-black/10 text-black/30 cursor-not-allowed"
                }`}
                style={{ fontFamily: "inherit" }}
              >
                {status === "thinking" ? (
                  <span className="flex items-center justify-center gap-2">
                    <span
                      className="inline-block w-3 h-3 rounded-full border-2 border-white/30 border-t-white"
                      style={{ animation: "spin .7s linear infinite" }}
                    />
                    Menganalisis kebutuhan Anda...
                  </span>
                ) : (
                  "Temukan paket yang tepat untuk saya →"
                )}
              </button>
              <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Result ── */}
        <AnimatePresence>
          {status === "done" && (
            <motion.div
              key="result"
              ref={resultRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >

              {/* Result banner */}
              <div className="rounded-2xl overflow-hidden border-2 border-black">
                <div className="flex items-center justify-between px-6 py-4 bg-black">
                  <div className="flex items-center gap-3">
                    <span
                      className="text-xs font-semibold px-3 py-1 rounded-full"
                      style={{
                        background: "linear-gradient(135deg,#c4a832,#f4c430)",
                        color: "black",
                      }}
                    >
                      ✦ Rekomendasi
                    </span>
                    <span className="text-white font-semibold text-sm">
                      Paket {recommendedTier ? tierLabel[recommendedTier] : ""}
                    </span>
                    <span className="text-xs text-white/50 px-2 py-0.5 rounded-full bg-white/10">
                      Cocok {confidence}%
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      reset();
                      setInput("");
                      setActiveChips([]);
                      setTimeout(() => textareaRef.current?.focus(), 100);
                    }}
                    className="text-xs text-white/40 hover:text-white/70 transition"
                    style={{ fontFamily: "inherit" }}
                  >
                    Coba lagi ↩
                  </button>
                </div>
                <div className="px-6 py-3 bg-gray-50 text-xs text-black/40 border-t border-black/10">
                  Berdasarkan: &quot;{fullText.slice(0, 80)}{fullText.length > 80 ? "…" : ""}&quot;
                </div>
              </div>

              {/* Recommended plan card */}
              {!loading && recommendedPlan && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.35, delay: 0.1 }}
                  className="relative rounded-[28px] p-10 bg-white border-2 border-black shadow-[0_0_60px_rgba(196,168,50,0.3)]"
                >
                  {recommendedPlan.isPopular && (
                    <div
                      className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-bold px-4 py-1.5 rounded-full"
                      style={{
                        background: "linear-gradient(135deg,#c4a832,#f4c430)",
                        color: "black",
                      }}
                    >
                      ✦ Paling Populer
                    </div>
                  )}

                  <h3 className="text-2xl font-bold text-black mb-2">
                    {recommendedPlan.name}
                  </h3>

                  <div className="text-sm text-black/50 mb-1">
                    {t("pricing", "startFrom")}
                  </div>

                  <div className="text-3xl font-bold text-black mb-6">
                    {formatPrice(recommendedPlan.price, recommendedPlan.duration)}
                  </div>

                  <ul className="space-y-2.5 text-sm text-black mb-8">
                    {recommendedPlan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={`https://wa.me/6281234567890?text=${encodeURIComponent(
                      `${t("plansPricing", "whatsappText")} ${recommendedPlan.name}`
                    )}`}
                    target="_blank"
                    className="block text-center w-full py-3.5 rounded-full bg-black text-white font-semibold text-sm hover:bg-black/80 transition"
                  >
                    {t("plansPricing", "chooseButton")}
                  </Link>
                </motion.div>
              )}

              {/* Loading fallback */}
              {loading && (
                <div className="rounded-[28px] h-64 bg-gray-100 animate-pulse" />
              )}

              {/* Show other plans toggle */}
              {!loading && otherPlans.length > 0 && (
                <div className="text-center">
                  <button
                    onClick={() => setShowAll((v) => !v)}
                    className="text-sm text-black/50 hover:text-black underline underline-offset-2 transition"
                    style={{ fontFamily: "inherit" }}
                  >
                    {showAll ? "Sembunyikan paket lainnya ↑" : "Lihat paket lainnya ↓"}
                  </button>
                </div>
              )}

              {/* Other plans */}
              <AnimatePresence>
                {showAll && !loading && (
                  <motion.div
                    key="other-plans"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.35 }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                      {otherPlans.map((plan) => (
                        <div
                          key={plan._id}
                          className="rounded-[24px] p-8 bg-white border border-black/15 hover:border-black/40 transition"
                        >
                          {plan.isPopular && (
                            <span
                              className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-3"
                              style={{
                                background: "rgba(196,168,50,0.15)",
                                color: "#8a6e00",
                              }}
                            >
                              Populer
                            </span>
                          )}

                          <h3 className="text-lg font-bold text-black mb-1">
                            {plan.name}
                          </h3>

                          <div className="text-xs text-black/40 mb-0.5">
                            {t("pricing", "startFrom")}
                          </div>

                          <div className="text-2xl font-bold text-black mb-5">
                            {formatPrice(plan.price, plan.duration)}
                          </div>

                          <ul className="space-y-2 text-sm text-black/70 mb-6">
                            {plan.features.map((f, i) => (
                              <li key={i} className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-black/20 flex-shrink-0" />
                                {f}
                              </li>
                            ))}
                          </ul>

                          <Link
                            href={`https://wa.me/6281234567890?text=${encodeURIComponent(
                              `${t("plansPricing", "whatsappText")} ${plan.name}`
                            )}`}
                            target="_blank"
                            className="block text-center w-full py-3 rounded-full border border-black/20 text-black text-sm font-medium hover:border-black hover:bg-black/5 transition"
                          >
                            {t("plansPricing", "chooseButton")}
                          </Link>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}