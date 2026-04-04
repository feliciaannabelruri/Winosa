"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── ML Service URL ──────────────────────────────────────────────────────────
// Menggantikan HF API (facebook/bart-large-mnli) yang cold start 10-30 detik
// ML service Flask kita response <5ms dan tidak butuh internet
const ML_SERVICE_URL = process.env.NEXT_PUBLIC_ML_URL || "http://localhost:5001";

export type TierType = "starter" | "business" | "enterprise" | null;

export interface SmartRecommendProps {
  serviceType: "web" | "mobile" | "uiux";
  onRecommend: (tier: TierType, confidence: number) => void;
}

// ─── Chip suggestions per service ────────────────────────────────────────────

const CHIPS: Record<string, { label: string; text: string }[]> = {
  web: [
    { label: "Baru mulai",      text: "baru mulai bisnis startup budget terbatas" },
    { label: "Toko online",     text: "toko online ecommerce pembayaran online" },
    { label: "Company profile", text: "website company profile profesional" },
    { label: "Bisnis berkembang",text: "bisnis sudah berjalan mau scale up" },
    { label: "Dashboard sistem",text: "dashboard admin sistem manajemen" },
    { label: "Enterprise",      text: "enterprise skala besar custom integrasi" },
  ],
  mobile: [
    { label: "App pertama",     text: "aplikasi mobile pertama startup baru" },
    { label: "Android + iOS",   text: "android ios cross platform user auth" },
    { label: "Delivery/booking",text: "delivery booking realtime tracking" },
    { label: "Fintech",         text: "fintech payment dompet digital" },
    { label: "Enterprise app",  text: "enterprise mobile custom backend ribuan user" },
    { label: "Sederhana / MVP", text: "mvp sederhana budget terbatas cepat" },
  ],
  uiux: [
    { label: "1–3 halaman",     text: "desain 1 sampai 3 halaman sederhana cepat" },
    { label: "Redesign",        text: "redesign tampilan website yang sudah ada" },
    { label: "Design system",   text: "design system komponen library lengkap" },
    { label: "Prototype",       text: "prototype interaktif figma presentasi investor" },
    { label: "UX research",     text: "ux research user journey mendalam" },
    { label: "Enterprise UX",   text: "ux strategy enterprise skala besar" },
  ],
};

const PLACEHOLDER: Record<string, string> = {
  web:    "Contoh: Saya punya usaha skincare, butuh toko online dengan pembayaran, bisa dikelola sendiri, budget 10–15 juta...",
  mobile: "Contoh: Butuh aplikasi Android dan iOS untuk bisnis delivery, dengan tracking realtime dan notifikasi...",
  uiux:   "Contoh: Perlu desain ulang tampilan aplikasi yang sudah ada, fokus ke UX yang lebih intuitif dan design system...",
};

// ─── Keyword fallback (jika ML service tidak bisa dijangkau) ─────────────────

function keywordFallback(text: string, serviceType: string): { tier: TierType; confidence: number } {
  const t = text.toLowerCase();

  const enterprise =
    (t.includes("enterprise") ? 4 : 0) + (t.includes("skala besar") ? 4 : 0) +
    (t.includes("ribuan") ? 3 : 0) + (t.includes("custom integrasi") ? 3 : 0) +
    (t.includes("multinasional") ? 4 : 0) + (t.includes("ux research") ? 2 : 0);

  const business =
    (t.includes("berkembang") ? 3 : 0) + (t.includes("sudah berjalan") ? 3 : 0) +
    (t.includes("scale") ? 2 : 0) + (t.includes("payment gateway") ? 2 : 0) +
    (t.includes("cms") ? 2 : 0) + (t.includes("analytics") ? 2 : 0) +
    (t.includes("android") && t.includes("ios") ? 3 : 0) +
    (t.includes("design system") ? 3 : 0);

  const starter =
    (t.includes("baru mulai") ? 3 : 0) + (t.includes("startup") ? 3 : 0) +
    (t.includes("budget terbatas") ? 3 : 0) + (t.includes("mvp") ? 3 : 0) +
    (t.includes("sederhana") ? 2 : 0) + (t.includes("pertama") ? 2 : 0) +
    (t.includes("1 sampai 3") ? 3 : 0);

  let tier: TierType = "starter";
  if (enterprise >= business && enterprise >= starter && enterprise > 0) tier = "enterprise";
  else if (business >= starter && business > 0) tier = "business";

  const total      = enterprise + business + starter;
  const confidence = Math.min(97, Math.max(73, 73 + Math.min(total * 2, 24)));
  return { tier, confidence };
}

// ─── Classifier — panggil ML service, fallback ke keyword ────────────────────

async function classifyTier(text: string, serviceType: string): Promise<{ tier: TierType; confidence: number }> {
  try {
    const controller = new AbortController();
    const timeout    = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(`${ML_SERVICE_URL}/classify/plan`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ text, service_type: serviceType }),
      signal:  controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) throw new Error(`ML service ${res.status}`);
    const data = await res.json();
    if (!data.success) throw new Error(data.error);

    return { tier: data.tier as TierType, confidence: data.confidence };
  } catch (err) {
    console.warn("ML service unavailable, using keyword fallback:", err);
    return keywordFallback(text, serviceType);
  }
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function SmartRecommend({ serviceType, onRecommend }: SmartRecommendProps) {
  const [input, setInput]           = useState("");
  const [activeChips, setActiveChips] = useState<string[]>([]);
  const [status, setStatus]         = useState<"idle" | "thinking" | "done">("idle");
  const [result, setResult]         = useState<{ tier: TierType; confidence: number } | null>(null);
  const textareaRef                 = useRef<HTMLTextAreaElement>(null);

  const fullText  = [input.trim(), ...activeChips].filter(Boolean).join(" ");
  const canAnalyze = fullText.length >= 8;

  function toggleChip(chip: { label: string; text: string }) {
    const already = activeChips.includes(chip.text);
    setActiveChips(already ? activeChips.filter((c) => c !== chip.text) : [...activeChips, chip.text]);
    if (status === "done") { setStatus("idle"); setResult(null); onRecommend(null, 0); }
  }

  async function handleAnalyze() {
    if (!canAnalyze) return;
    setStatus("thinking");
    setResult(null);
    onRecommend(null, 0);

    const { tier, confidence } = await classifyTier(fullText, serviceType);
    setResult({ tier, confidence });
    setStatus("done");
    onRecommend(tier, confidence);
  }

  function handleReset() {
    setInput(""); setActiveChips([]); setStatus("idle"); setResult(null);
    onRecommend(null, 0);
    textareaRef.current?.focus();
  }

  const tierLabel: Record<string, string> = {
    starter:    "Paket Starter",
    business:   "Paket Business",
    enterprise: "Paket Enterprise",
  };

  const tierDesc: Record<string, Record<string, string>> = {
    web:    { starter: "Cocok untuk usaha yang baru mulai membangun digital presence.", business: "Ideal untuk bisnis yang berkembang dan butuh fitur lebih lengkap.", enterprise: "Untuk skala besar dengan kebutuhan custom dan integrasi kompleks." },
    mobile: { starter: "Cocok untuk MVP dan app pertama dengan fitur esensial.", business: "Untuk bisnis yang butuh Android + iOS dengan fitur lengkap.", enterprise: "Untuk platform mobile skala besar dengan arsitektur kustom." },
    uiux:   { starter: "Cocok untuk 1–3 halaman atau redesign cepat.", business: "Untuk design system lengkap dan prototype interaktif.", enterprise: "Untuk UX strategy mendalam dan design system skala besar." },
  };

  return (
    <section className="w-full bg-white py-16">
      <div className="max-w-4xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-10">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5 text-xs font-medium tracking-wide"
            style={{ background: "rgba(196,168,50,0.1)", border: "1px solid rgba(196,168,50,0.3)", color: "#8a6e00" }}
          >
            <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: "#c4a832" }} />
            Rekomendasi Pintar
          </div>
          <h2 className="text-3xl font-bold text-black mb-3">Tidak yakin paket mana yang cocok?</h2>
          <p className="text-black/50 text-base max-w-xl mx-auto leading-relaxed">
            Ceritakan kebutuhan bisnis kamu — sistem kami akan analisis dan rekomendasikan paket yang paling sesuai.
          </p>
        </div>

        {/* Input + chips */}
        <AnimatePresence mode="wait">
          {status !== "done" && (
            <motion.div key="input-phase" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }}>

              <div className="relative mb-5">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => {
  setInput(e.target.value);
  if ((status as string) === "done") {
    setStatus("idle");
    setResult(null);
    onRecommend(null, 0);
  }
}}
                  placeholder={PLACEHOLDER[serviceType]}
                  rows={4}
                  maxLength={500}
                  className="w-full resize-none text-black text-sm leading-relaxed outline-none"
                  style={{ padding: "20px", borderRadius: "16px", border: "1.5px solid rgba(0,0,0,0.12)", background: "#fafafa", fontFamily: "inherit", transition: "border-color .2s, box-shadow .2s" }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.35)"; e.currentTarget.style.boxShadow = "0 0 0 4px rgba(196,168,50,0.1)"; }}
                  onBlur={(e)  => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.12)"; e.currentTarget.style.boxShadow = "none"; }}
                />
                <span className="absolute bottom-3 right-4 text-xs pointer-events-none" style={{ color: "rgba(0,0,0,0.25)" }}>
                  {input.length}/500
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {CHIPS[serviceType].map((chip) => {
                  const active = activeChips.includes(chip.text);
                  return (
                    <button
                      key={chip.label}
                      onClick={() => toggleChip(chip)}
                      className="text-xs transition-all"
                      style={{ padding: "6px 14px", borderRadius: "999px", border: active ? "1.5px solid black" : "1.5px solid rgba(0,0,0,0.15)", background: active ? "black" : "white", color: active ? "white" : "rgba(0,0,0,0.6)", fontFamily: "inherit", cursor: "pointer", fontWeight: active ? 500 : 400 }}
                    >
                      {chip.label}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={handleAnalyze}
                disabled={!canAnalyze || status === "thinking"}
                className="w-full font-medium text-sm transition-all"
                style={{ padding: "14px", borderRadius: "999px", border: "none", background: canAnalyze && status !== "thinking" ? "black" : "rgba(0,0,0,0.12)", color: canAnalyze && status !== "thinking" ? "white" : "rgba(0,0,0,0.3)", cursor: canAnalyze && status !== "thinking" ? "pointer" : "not-allowed", fontFamily: "inherit" }}
              >
                {status === "thinking" ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="inline-block w-3 h-3 rounded-full border-2 border-white/30 border-t-white" style={{ animation: "sm-spin .7s linear infinite" }} />
                    Menganalisis kebutuhan kamu...
                  </span>
                ) : "Analisis kebutuhan saya →"}
              </button>
              <style>{`@keyframes sm-spin{to{transform:rotate(360deg)}}`}</style>
            </motion.div>
          )}

          {/* Result banner */}
          {status === "done" && result && (
            <motion.div
              key="result-phase"
              initial={{ opacity: 0, scale: 0.97, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="rounded-2xl overflow-hidden"
              style={{ border: "2px solid black" }}
            >
              <div className="flex items-center justify-between px-6 py-4" style={{ background: "black" }}>
                <div className="flex items-center gap-3">
                  <div className="text-xs font-medium px-3 py-1 rounded-full" style={{ background: "linear-gradient(135deg,#c4a832,#f4c430)", color: "black" }}>
                    ✦ Best match
                  </div>
                  <span className="text-white font-semibold text-sm">{tierLabel[result.tier!]}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs px-3 py-1 rounded-full font-medium" style={{ background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.8)" }}>
                    Cocok {result.confidence}%
                  </span>
                  <button onClick={handleReset} className="text-xs transition-opacity" style={{ color: "rgba(255,255,255,0.5)", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
                    Coba lagi ↩
                  </button>
                </div>
              </div>

              <div className="px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4" style={{ background: "#fafafa" }}>
                <div>
                  <p className="text-black text-sm leading-relaxed">{tierDesc[serviceType][result.tier!]}</p>
                  <p className="text-black/40 text-xs mt-1.5">Berdasarkan: "{fullText.slice(0, 80)}{fullText.length > 80 ? "…" : ""}"</p>
                </div>
                <div className="flex-shrink-0 text-center">
                  <p className="text-xs text-black/40 mb-1">Lihat paket di bawah</p>
                  <div className="text-lg" style={{ animation: "sm-bounce 1s ease infinite" }}>↓</div>
                  <style>{`@keyframes sm-bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(4px)}}`}</style>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Divider */}
        <div className="mt-12 flex items-center gap-4" style={{ color: "rgba(0,0,0,0.2)" }}>
          <div className="flex-1 h-px bg-black/10" />
          <span className="text-xs tracking-widest uppercase">Pilih paket</span>
          <div className="flex-1 h-px bg-black/10" />
        </div>
      </div>
    </section>
  );
}