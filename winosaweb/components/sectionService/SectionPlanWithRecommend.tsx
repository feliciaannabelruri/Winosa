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

// ─── Chips ────────────────────────────────────────────────────────────────────

const CHIPS = [
  { label: "New Startup", text: "small startup just starting out limited budget need MVP simple" },
  { label: "Online Store", text: "ecommerce online shop with payment gateway and inventory management" },
  { label: "Business Grows", text: "growing business needs analytics dashboard and team collaboration" },
  { label: "Mobile app", text: "mobile application android ios cross platform push notifications" },
  { label: "Enterprise System", text: "large enterprise system custom integrations thousands of users high volume" },
  { label: "Still Confused", text: "not sure what I need want consultation and guidance first" },
];

// ─── Keyword fallback (jika HF lambat / error) ────────────────────────────────

function keywordFallback(text: string): { tier: TierType; confidence: number } {
  const t = text.toLowerCase();
  const e =
    (t.includes("enterprise") ? 4 : 0) + (t.includes("large") ? 3 : 0) +
    (t.includes("thousands") ? 3 : 0) + (t.includes("skala besar") ? 4 : 0) +
    (t.includes("ribuan") ? 3 : 0) + (t.includes("custom integrations") ? 3 : 0);
  const b =
    (t.includes("growing") ? 3 : 0) + (t.includes("scale") ? 2 : 0) +
    (t.includes("ecommerce") ? 2 : 0) + (t.includes("dashboard") ? 2 : 0) +
    (t.includes("analytics") ? 2 : 0) + (t.includes("mobile") ? 2 : 0) +
    (t.includes("berkembang") ? 3 : 0) + (t.includes("payment") ? 2 : 0);
  const s =
    (t.includes("startup") ? 3 : 0) + (t.includes("starting") ? 3 : 0) +
    (t.includes("limited budget") ? 3 : 0) + (t.includes("mvp") ? 3 : 0) +
    (t.includes("small") ? 2 : 0) + (t.includes("baru") ? 2 : 0) +
    (t.includes("sederhana") ? 2 : 0);
  let tier: TierType = "starter";
  if (e >= b && e >= s && e > 0) tier = "enterprise";
  else if (b >= s && b > 0) tier = "business";
  const total = e + b + s;
  return { tier, confidence: Math.min(85, Math.max(65, 65 + Math.min(total * 2, 20))) };
}

// ─── Hugging Face zero-shot classifier ───────────────────────────────────────
// Model: facebook/bart-large-mnli — gratis, tidak perlu API key

async function classifyWithHF(text: string): Promise<{ tier: TierType; confidence: number }> {
  const candidateLabels = [
    "small business starter plan basic features low cost",
    "medium business professional plan growing team advanced features",
    "large enterprise plan custom integrations high volume dedicated support",
  ];

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000); // 12s timeout

    const res = await fetch(
      "https://api-inference.huggingface.co/models/facebook/bart-large-mnli",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inputs: text.slice(0, 300), // HF has input limit
          parameters: { candidate_labels: candidateLabels },
        }),
        signal: controller.signal,
      }
    );

    clearTimeout(timeout);

    if (!res.ok) throw new Error(`HF ${res.status}`);

    const data = await res.json();

    // data.labels dan data.scores sudah sorted descending by score
    if (!data.labels || !data.scores || !data.labels.length) {
      throw new Error("Invalid HF response shape");
    }

    const topLabel: string = data.labels[0];
    const topScore: number = data.scores[0]; // 0.0 – 1.0

    const idx = candidateLabels.indexOf(topLabel);
    const tierMap: TierType[] = ["starter", "business", "enterprise"];
    const tier: TierType = idx >= 0 ? tierMap[idx] : "business";

    // Map HF score → confidence 70–97%
    const confidence = Math.round(70 + topScore * 27);

    return { tier, confidence };
  } catch (err) {
    console.warn("HF API unavailable, falling back to keyword classifier:", err);
    return keywordFallback(text);
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SectionPlanWithRecommend() {
  const { t, tApi } = useTranslate();
  const { language } = useLanguageStore();

  // ── NEW: state untuk translate UI ──


  const [plans, setPlans] = useState<Subscription[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);

  const [input, setInput] = useState("");
  const [activeChips, setActiveChips] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "thinking" | "done">("idle");
  const [recommendedTier, setRecommendedTier] = useState<TierType>(null);
  const [confidence, setConfidence] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const [stillConfused, setStillConfused] = useState(false);

  const resultRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // ── NEW: translate UI text (AMAN, tidak ganggu logic AI) ──
const [translatedChips, setTranslatedChips] = useState<typeof CHIPS>(CHIPS);
const [uiText, setUiText] = useState<any>({});

useEffect(() => {
  const run = async () => {
    const chips = await Promise.all(
      CHIPS.map(async (c) => ({
        ...c,
        label: await translateHybrid(c.label, language, tApi),
      }))
    );

    setTranslatedChips(chips);

    setUiText({
    helper: await translateHybrid(
      "Describe your business needs — AI will recommend the right plan",
      language,
      tApi
    ),
    placeholder: await translateHybrid(
      "Example: I have a fintech startup, need user management system, analytics dashboard, and payment integration...",
      language,
      tApi
    ),
    analyzing: await translateHybrid(
      "AI is analyzing your needs...",
      language,
      tApi
    ),
    analyze: await translateHybrid(
      "Analyze with AI → find the right plan",
      language,
      tApi
    ),
    retry: await translateHybrid("Try again ↩", language, tApi),
    confused: await translateHybrid("Still confused?", language, tApi),
    show: await translateHybrid("See other plans ↓", language, tApi),
    hide: await translateHybrid("Hide ↑", language, tApi),
    popular: await translateHybrid("Popular", language, tApi),
    wa: await translateHybrid("Consult via WhatsApp", language, tApi),
    atau: await translateHybrid("or", language, tApi),
    tidakMasalah: await translateHybrid(
      "No problem — our team is ready to help",
      language,
      tApi
    ),
    konsultasiGratis: await translateHybrid(
      "Free consultation, we will help you choose the plan that truly fits your business needs.",
      language,
      tApi
    ),
    waSekarang: await translateHybrid(
      "Consult via WhatsApp now",
      language,
      tApi
    ),
  });
  };

  run();
}, [language]);

  // ── Fetch subscription plans from backend ─────────────────────────────────

  useEffect(() => {
    const fetch_ = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/subscriptions`
        );
        const data = await res.json();
        if (data.success && data.data?.length) {
          const tierMap: TierType[] = ["starter", "business", "enterprise"];
          const mapped = await Promise.all(
            data.data.map(async (plan: Subscription, i: number) => ({
              ...plan,
              tier: tierMap[i] ?? "starter",
              name: await translateHybrid(plan.name, language, tApi),
              features: await Promise.all(
                plan.features.map((f: string) => translateHybrid(f, language, tApi))
              ),
            }))
          );
          setPlans(mapped);
        }
      } catch { /* silent */ }
      finally { setLoadingPlans(false); }
    };
    fetch_();
  }, [language]);

  // ── Helpers ───────────────────────────────────────────────────────────────

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
    setStillConfused(false);
  }

  const fullText = [input.trim(), ...activeChips].filter(Boolean).join(". ");
  const canAnalyze = fullText.length >= 6;

  async function handleAnalyze() {
    if (!canAnalyze || status === "thinking") return;
    setStatus("thinking");
    setShowAll(false);
    setStillConfused(false);

    const { tier, confidence: conf } = await classifyWithHF(fullText);
    setRecommendedTier(tier);
    setConfidence(conf);
    setStatus("done");

    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 350);
  }

  // ── Derived ───────────────────────────────────────────────────────────────

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
    <section className="w-full bg-white py-24 md:py-32" aria-labelledby="plan-title">
      <div className="max-w-4xl mx-auto px-6">

        {/* Header */}
        <FadeUp>
          <div className="text-center mb-14">
            <h2 
              id="plan-title"
              className="text-3xl md:text-4xl font-bold text-black mb-3">
              {t("plansPricing", "title")}
            </h2>
            <p className="text-black/50 text-base max-w-xl mx-auto">
              {t("plansPricing", "subtitle")}
            </p>
          </div>
        </FadeUp>

 {/* ── INPUT PHASE ─────────────────────────────────────────────────── */}
<AnimatePresence mode="wait">
  {status !== "done" && (
    <motion.div
      key="input-phase"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.28 }}
    >
      <p className="text-center text-xs text-black/40 mb-4 tracking-wide uppercase">
        {uiText.helper}
      </p>

      <label htmlFor="ai-input" className="sr-only">
        Describe your business needs
      </label>

      {/* Textarea */}
      <div className="relative mb-4">
        <textarea
          id="ai-input"
          ref={textareaRef}
          value={input}
          onChange={(e) => { setInput(e.target.value); if (status !== "idle") reset(); }}
          placeholder={uiText.placeholder}
          rows={3}
          maxLength={400}
          className="w-full resize-none text-black text-sm leading-relaxed border border-black/12 rounded-2xl bg-gray-50/80 p-5 outline-none focus:border-black/35 focus:bg-white transition-all"
          style={{ fontFamily: "inherit" }}
        />
        <span className="absolute bottom-3 right-4 text-[11px] text-black/20 pointer-events-none">
          {input.length}/400
        </span>
      </div>

      {/* Quick-pick chips */}
      <div className="flex flex-wrap gap-2 mb-5">
        {(translatedChips || CHIPS).map((chip) => {
          const active = activeChips.includes(chip.text);
          return (
            <button
              key={chip.label}
              type="button"
              onClick={() => toggleChip(chip.text)}
              aria-pressed={active}
              className={`text-xs px-4 py-2 rounded-full border transition-all ${
                active
                  ? "bg-black text-white border-black"
                  : "bg-white text-black/55 border-black/18 hover:border-black/40 hover:text-black"
              }`}
              style={{ fontFamily: "inherit" }}
            >
              {chip.label}
            </button>
          );
        })}
      </div>

      {/* Analyze CTA */}
      <button
        type="button"
        onClick={handleAnalyze}
        disabled={!canAnalyze || status === "thinking"}
        aria-busy={status === "thinking"}
        className={`w-full py-4 rounded-full font-semibold text-sm transition-all ${
          canAnalyze && status !== "thinking"
            ? "bg-black text-white hover:bg-black/82 active:scale-[0.99]"
            : "bg-black/8 text-black/28 cursor-not-allowed"
        }`}
        style={{ fontFamily: "inherit" }}
      >
        {status === "thinking" ? (
          <span
           role="status" 
           aria-live="polite"
           className="flex items-center justify-center gap-2">
            <span
              className="inline-block w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white"
              style={{ animation: "hf-spin .7s linear infinite" }}
            />
            {uiText.analyzing}
          </span>
        ) : (
          uiText.analyze
        )}
      </button>

      <style>{`@keyframes hf-spin{to{transform:rotate(360deg)}}`}</style>

      {/* WA shortcut */}
      <div className="mt-5 flex flex-col items-center gap-3">
        <div className="flex items-center gap-3 w-full max-w-xs">
          <div className="flex-1 h-px bg-black/8" />
          <span className="text-xs text-black/28">{uiText.atau}</span>
          <div className="flex-1 h-px bg-black/8" />
        </div>
        <a
          href="https://wa.me/6281234567890?text=Halo%20Winosa%2C%20saya%20ingin%20konsultasi%20memilih%20paket%20yang%20sesuai%20untuk%20bisnis%20saya"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-black/45 hover:text-black transition-colors"
        >
          {uiText.wa}
        </a>
      </div>
    </motion.div>
  )}
</AnimatePresence>

        {/* ── RESULT PHASE ────────────────────────────────────────────────── */}
        <AnimatePresence>
          {status === "done" && (
            <motion.div
              key="result-phase"
              ref={resultRef}
              role="region" 
              aria-live="polite"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.38 }}
              className="space-y-5"
            >

              {/* AI result banner */}
              <div className="rounded-2xl overflow-hidden border-2 border-black">
                <div className="flex items-center justify-between gap-3 px-5 py-4 bg-black flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className="text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap"
                      style={{ background: "linear-gradient(135deg,#c4a832,#f4c430)", color: "#1a1a1a" }}
                    >
                      ✦ AI Rekomendasi
                    </span>
                    <span className="text-white font-semibold text-sm">
                      Paket {recommendedTier ? tierLabel[recommendedTier] : ""}
                    </span>
                    <span className="text-[11px] text-white/40 bg-white/10 px-2 py-0.5 rounded-full">
                      {confidence}% cocok
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => { reset(); setInput(""); setActiveChips([]); setTimeout(() => textareaRef.current?.focus(), 120); }}
                    className="text-xs text-white/38 hover:text-white/65 transition flex-shrink-0"
                    style={{ fontFamily: "inherit" }}
                  >
                    {uiText.retry}
                  </button>
                </div>
                <div className="px-5 py-2 bg-gray-50 border-t border-black/8 text-[11px] text-black/35">
                  Berdasarkan: &ldquo;{fullText.slice(0, 90)}{fullText.length > 90 ? "…" : ""}&rdquo;
                </div>
              </div>

              {/* Recommended plan card */}
              {loadingPlans ? (
                <div className="rounded-[28px] h-64 bg-gray-100 animate-pulse" />
              ) : recommendedPlan ? (
                <motion.div
                  role="region" 
                  aria-live="polite"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.32, delay: 0.08 }}
                  className="relative rounded-[28px] p-10 bg-white border-2 border-black"
                  style={{ boxShadow: "0 0 55px rgba(196,168,50,0.22)" }}
                >
                  {recommendedPlan.isPopular && (
                    <div
                      
                      className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-bold px-4 py-1.5 rounded-full"
                      style={{ background: "linear-gradient(135deg,#c4a832,#f4c430)", color: "#1a1a1a" }}
                    >
                      ✦ Paling Populer
                    </div>
                  )}
                  <h3 className="text-2xl font-bold text-black mb-1">{recommendedPlan.name}</h3>
                  <div className="text-xs text-black/40 mb-1">{t("pricing", "startFrom")}</div>
                  <div className="text-3xl font-bold text-black mb-6">
                    {formatPrice(recommendedPlan.price, recommendedPlan.duration)}
                  </div>
                  <ul className="space-y-2.5 text-sm text-black mb-8">
                    {recommendedPlan.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    aria-label={`Choose plan ${recommendedPlan.name}`}
                    href={`https://wa.me/6281234567890?text=${encodeURIComponent(
                      `${t("plansPricing", "whatsappText")} ${recommendedPlan.name}`
                    )}`}
                    target="_blank"
                    className="block text-center w-full py-3.5 rounded-full bg-black text-white font-semibold text-sm hover:bg-black/80 transition"
                  >
                    {t("plansPricing", "chooseButton")}
                  </Link>
                </motion.div>
              ) : null}

              {/* Controls: masih bingung + lihat lainnya */}
              {!loadingPlans && (
                <div className="flex items-center justify-center gap-5">
                  <button
                    type="button"
                    onClick={() => setStillConfused((v) => !v)}
                    className="text-sm text-black/38 hover:text-black transition underline underline-offset-2"
                    style={{ fontFamily: "inherit" }}
                  >
                    {stillConfused ? uiText.confused : uiText.hide }
                  </button>
                  {otherPlans.length > 0 && (
                    <>
                      <span className="text-black/15 select-none">•</span>
                      <button
                        type="button"
                        onClick={() => setShowAll((v) => !v)}
                        className="text-sm text-black/38 hover:text-black transition underline underline-offset-2"
                        style={{ fontFamily: "inherit" }}
                      >
                        {showAll ? uiText.hide : uiText.show}
                      </button>
                    </>
                  )}
                </div>
              )}

              {/* Masih bingung → WA consultation */}
              <AnimatePresence>
                {stillConfused && (
                  <motion.div
                    key="confused-box"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.28 }}
                    className="overflow-hidden"
                  >
                    <div className="rounded-2xl border border-black/10 bg-gray-50 p-6 text-center">
                      <p className="text-sm font-semibold text-black mb-1">
                          {uiText.tidakMasalah}                      </p>
                      <p className="text-xs text-black/45 mb-5">
                            {uiText.konsultasiGratis}                      </p>
                      <a
                        href="https://wa.me/6281234567890?text=Halo%20Winosa%2C%20saya%20sudah%20coba%20AI%20recommend%20tapi%20masih%20bingung%2C%20bisa%20bantu%20pilihkan%20paket%20yang%20sesuai%3F"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2.5 px-7 py-3 rounded-full bg-[#25D366] text-white font-semibold text-sm hover:bg-[#1ebe5d] transition active:scale-[0.98]"
                      >
                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white flex-shrink-0">
                          <path d="M20.52 3.48A11.91 11.91 0 0012.01 0C5.38 0 .02 5.36.02 12c0 2.11.55 4.18 1.6 6.02L0 24l6.15-1.6a11.94 11.94 0 005.86 1.49h.01c6.63 0 11.99-5.36 11.99-12 0-3.19-1.24-6.19-3.49-8.41zM12 21.5a9.45 9.45 0 01-4.82-1.32l-.35-.21-3.65.95.97-3.56-.23-.36a9.48 9.48 0 0114.67-11.63A9.45 9.45 0 0112 21.5zm5.18-7.1c-.28-.14-1.66-.82-1.92-.91-.26-.1-.45-.14-.63.14-.19.28-.73.91-.9 1.1-.16.19-.33.21-.61.07-.28-.14-1.17-.43-2.23-1.37-.82-.73-1.37-1.63-1.53-1.91-.16-.28-.02-.43.12-.57.12-.12.28-.33.42-.49.14-.16.19-.28.28-.47.09-.19.05-.35-.02-.49-.07-.14-.63-1.52-.87-2.08-.23-.55-.47-.47-.63-.47h-.54c-.19 0-.49.07-.75.35-.26.28-.98.96-.98 2.34s1 2.72 1.14 2.91c.14.19 1.96 3 4.75 4.2.66.28 1.18.45 1.58.58.66.21 1.27.18 1.75.11.53-.08 1.66-.68 1.89-1.34.23-.66.23-1.23.16-1.34-.07-.12-.26-.19-.54-.33z"/>
                        </svg>
                        {uiText.waSekarang}                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Other plans */}
              <AnimatePresence>
  {showAll && !loadingPlans && otherPlans.length > 0 && (
    <motion.div
      key="other-plans"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.32 }}
      className="overflow-hidden"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1 items-stretch">
        {otherPlans.map((plan) => (
          <div
            key={plan._id}
            className="rounded-[22px] p-7 bg-white border border-black/10 hover:border-black/28 transition flex flex-col h-full"
          >
            {plan.isPopular && (
              <span
                className="inline-block text-[11px] font-semibold px-3 py-1 rounded-full mb-3"
                style={{ background: "rgba(196,168,50,0.12)", color: "#8a6e00" }}
              >
                {uiText.popular}
              </span>
            )}

            <h3 className="text-lg font-bold text-black mb-0.5">
              {plan.name}
            </h3>

            <div className="text-[11px] text-black/38 mb-0.5">
              {t("pricing", "startFrom")}
            </div>

            <div className="text-2xl font-bold text-black mb-4">
              {formatPrice(plan.price, plan.duration)}
            </div>

            <ul className="space-y-2 text-sm text-black/55 mb-5 flex-1">
              {plan.features.map((f, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-black/18 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            <Link
              href={`https://wa.me/6281234567890?text=${encodeURIComponent(
                `${t("plansPricing", "whatsappText")} ${plan.name}`
              )}`}
              target="_blank"
              className="block text-center w-full py-2.5 rounded-full border border-black/12 text-black text-sm font-medium hover:border-black/35 hover:bg-black/4 transition"
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