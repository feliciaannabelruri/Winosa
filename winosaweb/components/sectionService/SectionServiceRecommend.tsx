"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useTranslate } from "@/lib/useTranslate";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translateHybrid } from "@/lib/translateHybrid";

// ─── ML Service URL ──────────────────────────────────────────────────────────
// Ganti HF API (facebook/bart-large-mnli) yang lambat & sering timeout
// dengan ML service Flask kita sendiri yang response <5ms
const ML_SERVICE_URL = process.env.NEXT_PUBLIC_ML_URL || "http://localhost:5001";

// ─── Types ───────────────────────────────────────────────────────────────────

type ServiceResult = {
  primary:     string;
  primarySlug: string;
  others:      string[];
  reasoning:   string;
  confidence:  number;
  algorithm:   string;
};

// ─── Chips ───────────────────────────────────────────────────────────────────

const CHIPS_EN = [
  { label: "New Startup",      text: "new startup beginning limited budget mvp simple product" },
  { label: "Online Store",     text: "online store ecommerce shop payment gateway inventory" },
  { label: "Growing Business", text: "growing business scale analytics dashboard team collaboration" },
  { label: "Mobile App",       text: "mobile application android ios push notification user account" },
  { label: "Enterprise System",text: "enterprise system large scale custom integration thousands users" },
  { label: "Still Confused",   text: "not sure what I need want guidance consultation first" },
];

// ─── Keyword fallback (jika ML service tidak bisa dijangkau) ─────────────────

function keywordFallback(text: string): ServiceResult {
  const t = text.toLowerCase();

  const scores = {
    web:        (t.includes("website") ? 3 : 0) + (t.includes("web") ? 2 : 0) + (t.includes("ecommerce") ? 3 : 0) + (t.includes("landing page") ? 3 : 0) + (t.includes("toko") ? 2 : 0),
    mobile:     (t.includes("mobile") ? 3 : 0) + (t.includes("aplikasi") ? 3 : 0) + (t.includes("android") ? 3 : 0) + (t.includes("ios") ? 3 : 0) + (t.includes("app") ? 2 : 0),
    uiux:       (t.includes("desain") ? 3 : 0) + (t.includes("design") ? 3 : 0) + (t.includes("ui") ? 3 : 0) + (t.includes("figma") ? 3 : 0) + (t.includes("prototype") ? 3 : 0),
    consulting: (t.includes("konsultan") ? 3 : 0) + (t.includes("bingung") ? 3 : 0) + (t.includes("confused") ? 3 : 0) + (t.includes("strategi") ? 2 : 0),
  };

  const topKey = (Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0]) as keyof typeof scores;
  const total  = Object.values(scores).reduce((a, b) => a + b, 0);
  const conf   = Math.min(85, Math.max(65, 65 + Math.min(total * 2, 20)));

  const map: Record<string, ServiceResult> = {
    web:  { primary: "Web Development",      primarySlug: "/Services/web-development",       others: ["UI/UX Design"],              reasoning: "Based on your needs, building a professional website is the most strategic step.", confidence: conf, algorithm: "keyword_fallback" },
    mobile:{ primary: "Mobile App Development",primarySlug: "/Services/mobile-app-development",others: ["UI/UX Design"],             reasoning: "Your needs indicate a focus on mobile application development.",                                    confidence: conf, algorithm: "keyword_fallback" },
    uiux: { primary: "UI/UX Design",           primarySlug: "/Services/ui-ux-design",           others: ["Web Development"],           reasoning: "A well-crafted design is the key to a successful digital product.",                                  confidence: conf, algorithm: "keyword_fallback" },
    consulting:{ primary: "IT Consulting",      primarySlug: "/Contact",                         others: ["Web Development", "Mobile App Development"], reasoning: "Starting with a consultation is the best step to move forward.", confidence: conf, algorithm: "keyword_fallback" },
  };

  return map[topKey] || map.web;
}

// ─── Classifier — panggil ML service dulu, fallback ke keyword ───────────────

async function classifyService(text: string): Promise<ServiceResult> {
  try {
    const controller = new AbortController();
    const timeout    = setTimeout(() => controller.abort(), 5000); // 5s timeout

    const res = await fetch(`${ML_SERVICE_URL}/classify/service`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ text }),
      signal:  controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) throw new Error(`ML service ${res.status}`);

    const data = await res.json();
    if (!data.success) throw new Error(data.error || "Classification failed");

    return {
      primary:     data.primary,
      primarySlug: data.primarySlug,
      others:      data.others || [],
      reasoning:   data.reasoning,
      confidence:  data.confidence,
      algorithm:   data.algorithm,
    };
  } catch (err) {
    console.warn("ML service unavailable, using keyword fallback:", err);
    return keywordFallback(text);
  }
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function SectionServiceRecommend() {
  const { t, tApi }    = useTranslate();
  const { language }   = useLanguageStore();

  const [input, setInput]               = useState("");
  const [activeChips, setActiveChips]   = useState<string[]>([]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [status, setStatus]             = useState<"idle" | "thinking" | "done">("idle");
  const [result, setResult]             = useState<ServiceResult | null>(null);
  const [translatedChips, setTranslatedChips] = useState(CHIPS_EN);
  const [translatedResult, setTranslatedResult] = useState(result);

  const resultRef  = useRef<HTMLDivElement>(null);
  const textareaRef= useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Translate chip labels sesuai bahasa aktif

    const [translated, setTranslated] = useState<Record<string, string>>({});

    const isMounted = useRef(false);

    useEffect(() => {
      isMounted.current = true;

      return () => {
        isMounted.current = false;
      };
    }, []);

    const th = (text: string) => {
      if (language === "en") return text;

      if (translated[text]) return translated[text];

      translateHybrid(text, language, tApi).then((res) => {
        if (!isMounted.current) return; 

        setTranslated((prev) => {
          if (prev[text]) return prev;
          return { ...prev, [text]: res };
        });
      });

    return text;
  };

  useEffect(() => {
  if (!result) return;

  const run = async () => {
    const primary = await translateHybrid(result.primary, language, tApi);

    const others = await Promise.all(
      result.others.map((s) => translateHybrid(s, language, tApi))
    );

    const reasoning = await translateHybrid(result.reasoning, language, tApi);

    setTranslatedResult({
      ...result,
      primary,
      others,
      reasoning,
    });
  };

  run();
}, [result, language]);

  // Translate chip labels sesuai bahasa aktif
  useEffect(() => {
    const run = async () => {
      const chips = await Promise.all(
        CHIPS_EN.map(async (c) => ({
          ...c,
          label: await translateHybrid(c.label, language, tApi),
        }))
      );
      setTranslatedChips(chips);
    };
    run();
  }, [language]);

  const fullText  = [input.trim(), ...activeChips].filter(Boolean).join(". ");
  const canAnalyze = fullText.length >= 8;

  function toggleChip(text: string) {
    setActiveChips((prev) =>
      prev.includes(text) ? prev.filter((c) => c !== text) : [...prev, text]
    );
    if (status === "done") reset();
  }

  function reset() {
    setStatus("idle");
    setResult(null);
  }

  function removeFile() {
    setUploadedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleAnalyze() {
    if (!canAnalyze || status === "thinking") return;
    setStatus("thinking");

    const res = await classifyService(fullText);
    setResult(res);
    setStatus("done");

    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 300);
  }

  function goToWa() {
    if (!result) return;
    const msg =
      `Halo Winosa! Saya ingin konsultasi soal kebutuhan digital saya.\n\n` +
      (input ? `Kebutuhan: ${input}\n` : "") +
      `Layanan yang direkomendasikan: ${result.primary}` +
      (result.others.length ? `, ${result.others.join(", ")}` : "") +
      `\n\nBisa bantu jelasin lebih lanjut?`;
    window.open(`https://wa.me/6281234567890?text=${encodeURIComponent(msg)}`, "_blank");
  }

  return (
    <section className="w-full bg-white py-24 md:py-32" aria-labelledby="recommend-title">
      <div className="max-w-[680px] mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-12">
          <h2 id="recommend-title" className="text-3xl md:text-4xl font-bold text-black mb-3 leading-tight">
            {t("plansPricing", "title")}
          </h2>
          <p className="text-black/50 text-base">
            {t("plansPricing", "subtitle")}
          </p>
        </div>

        {/* Label */}
        <p className="text-[11px] tracking-[1.8px] uppercase text-black/35 mb-3 font-medium">
          {t("serviceRecommend", "label")}
        </p>

        {/* Textarea */}
        <div className="relative mb-3">
          <textarea
            ref={textareaRef}
            id="service-input"
            value={input}
            onChange={(e) => { setInput(e.target.value); if (status === "done") reset(); }}
            placeholder={t("serviceRecommend", "placeholder")}
            rows={4}
            maxLength={400}
            className="w-full resize-none text-black text-sm leading-relaxed border border-black/12 rounded-2xl bg-[#fafafa] p-5 outline-none focus:border-black/30 focus:bg-white transition-all"
            style={{ fontFamily: "inherit" }}
          />
          <span className="absolute bottom-3 right-4 text-[11px] text-black/20 pointer-events-none select-none">
            {input.length}/400
          </span>
        </div>

        {/* Upload referensi */}
        <div className="flex items-center gap-3 mb-4">
          <label
            htmlFor="ref-upload"
            className="flex items-center gap-2 px-4 py-2 border border-black/15 rounded-xl text-black/45 text-xs cursor-pointer hover:border-black/30 hover:text-black/65 transition-all"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="10" width="12" height="1.5" rx="0.75" fill="currentColor" />
              <path d="M8 2v8M5 5l3-3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
            {t("serviceRecommend", "upload")}
          </label>
          <input
            ref={fileInputRef}
            id="ref-upload"
            type="file"
            accept="image/*,.png,.jpg,.jpeg,.webp"
            className="hidden"
            onChange={(e) => { if (e.target.files?.[0]) setUploadedFile(e.target.files[0]); }}
          />
          <span className="text-xs text-black/30">{t("serviceRecommend", "uploadHint")}</span>
        </div>

        {/* Uploaded file badge */}
        {uploadedFile && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-black/4 rounded-lg text-xs text-black/55 mb-4 w-fit">
            <span className="max-w-[180px] truncate">{uploadedFile.name}</span>
            <button onClick={removeFile} className="text-black/35 hover:text-black ml-1 transition-colors" aria-label="Hapus file">✕</button>
          </div>
        )}

        {/* Chip tags */}
        <div className="flex flex-wrap gap-2 mb-5">
          {translatedChips.map((chip) => {
            const active = activeChips.includes(chip.text);
            return (
              <button
                key={chip.text}
                type="button"
                onClick={() => toggleChip(chip.text)}
                aria-pressed={active}
                className="text-xs px-4 py-2 rounded-full border transition-all"
                style={{
                  fontFamily: "inherit",
                  border:  active ? "1.5px solid black" : "1.5px solid rgba(0,0,0,0.15)",
                  background: active ? "black" : "white",
                  color:   active ? "white" : "rgba(0,0,0,0.55)",
                }}
              >
                {chip.label}
              </button>
            );
          })}
        </div>

        {/* Analyze button */}
        <button
          type="button"
          onClick={handleAnalyze}
          disabled={!canAnalyze || status === "thinking"}
          aria-busy={status === "thinking"}
          className="w-full py-4 rounded-full font-medium text-sm transition-all mb-4"
          style={{
            fontFamily: "inherit",
            background: canAnalyze && status !== "thinking" ? "black" : "rgba(0,0,0,0.08)",
            color:      canAnalyze && status !== "thinking" ? "white" : "rgba(0,0,0,0.28)",
            cursor:     canAnalyze && status !== "thinking" ? "pointer" : "not-allowed",
          }}
        >
          {status === "thinking" ? (
            <span className="flex items-center justify-center gap-2" role="status" aria-live="polite">
              <span className="inline-block w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white" style={{ animation: "sr-spin .7s linear infinite" }} />
              {t("serviceRecommend", "analyzing")}
            </span>
          ) : (
            t("serviceRecommend", "analyzeBtn")
          )}
        </button>

        <style>{`@keyframes sr-spin{to{transform:rotate(360deg)}}`}</style>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-black/8" />
          <span className="text-xs text-black/25">{t("serviceRecommend", "or")}</span>
          <div className="flex-1 h-px bg-black/8" />
        </div>
        <p className="text-center text-xs text-black/30 mb-8">
          {t("serviceRecommend", "consultFree")}
        </p>

        {/* RESULT */}
        <AnimatePresence>
          {status === "done" && result && (
            <motion.div
              ref={resultRef}
              key="result"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="rounded-2xl overflow-hidden border-2 border-black"
              role="region"
              aria-live="polite"
              aria-label="Hasil rekomendasi layanan"
            >
              {/* Result header */}
              <div className="px-5 py-4 bg-black flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className="text-xs font-bold px-3 py-1 rounded-full"
                    style={{ background: "linear-gradient(135deg,#c4a832,#f4c430)", color: "#1a1a1a" }}
                  >
                    ✦ {t("serviceRecommend", "resultLabel")}
                  </span>
                  <span className="text-white font-semibold text-sm">{th(result.primary)}</span>
                  {result.others.length > 0 && (
                    <span className="text-white/40 text-xs">+ {result.others.join(", ")}</span>
                  )}
                </div>
                <span
                  className="text-[11px] px-2.5 py-1 rounded-full font-medium"
                  style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}
                >
                  {result.confidence}% {t("serviceRecommend", "relevance")}
                </span>
              </div>

              {/* Service tags */}
              <div className="px-5 py-4 flex flex-wrap gap-2 border-b border-black/8 bg-white">
                <span className="px-4 py-1.5 rounded-full text-sm font-medium" style={{ background: "black", color: "white" }}>
                  {th(result.primary)}
                </span>
                {result.others.map((s) => (
                  <span
                    key={s}
                    className="px-4 py-1.5 rounded-full text-sm border border-black/15 text-black"
                  >
                    {th(s)}
                  </span>
                ))}
              </div>

              {/* Reasoning */}
              <div className="px-5 py-4 bg-white border-b border-black/8">
                <p className="text-sm text-black/65 leading-relaxed">
                {result.others.map((s) => th(s)).join(", ")}
              </p>
              </div>

              {/* CTA */}
              <div className="px-5 py-4 bg-white flex gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={goToWa}
                  className="flex-1 min-w-[160px] flex items-center justify-center gap-2 py-3 rounded-full font-medium text-sm transition-all"
                  style={{ background: "#25D366", color: "white", fontFamily: "inherit" }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.136.562 4.14 1.535 5.874L0 24l6.273-1.512A11.946 11.946 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.017-1.378l-.36-.214-3.727.978.994-3.632-.235-.373A9.774 9.774 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
                  </svg>
                  {t("serviceRecommend", "waBtn")}
                </button>

                {result.primarySlug && result.primarySlug !== "/Contact" && (
                  <Link
                    href={result.primarySlug}
                    className="px-5 py-3 rounded-full border border-black/15 text-black text-sm font-medium hover:border-black/35 hover:bg-black/4 transition-all"
                  >
                    {t("serviceRecommend", "viewService")}
                  </Link>
                )}

                <button
                  type="button"
                  onClick={() => { reset(); setInput(""); setActiveChips([]); removeFile(); setTimeout(() => textareaRef.current?.focus(), 100); }}
                  className="px-5 py-3 rounded-full border border-black/12 text-black/45 text-sm transition-all hover:text-black hover:border-black/30"
                  style={{ fontFamily: "inherit" }}
                >
                  {t("serviceRecommend", "retry")}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}