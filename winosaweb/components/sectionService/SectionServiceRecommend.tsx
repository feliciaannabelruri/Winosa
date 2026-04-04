"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useTranslate } from "@/lib/useTranslate";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translateHybrid } from "@/lib/translateHybrid";

// ─── Tipe layanan Winosa ────────────────────────────────────────────────────

type ServiceResult = {
  primary: string;
  others: string[];
  slug: string;
  reasoning: string;
  confidence: number;
};

// ─── Kandidat label untuk HF zero-shot ──────────────────────────────────────

const CANDIDATE_LABELS = [
  "web development website company profile landing page ecommerce",
  "mobile app development android ios cross platform",
  "ui ux design interface prototype wireframe figma",
  "full stack web and mobile application system",
  "it consulting digital strategy technology roadmap",
];

const LABEL_TO_SERVICE: Record<string, { name: string; slug: string }> = {
  "web development website company profile landing page ecommerce": {
    name: "Web Development",
    slug: "/Services/web-development",
  },
  "mobile app development android ios cross platform": {
    name: "Mobile App Development",
    slug: "/Services/mobile-app-development",
  },
  "ui ux design interface prototype wireframe figma": {
    name: "UI/UX Design",
    slug: "/Services/ui-ux-design",
  },
  "full stack web and mobile application system": {
    name: "Full Stack Development",
    slug: "/Services/web-development",
  },
  "it consulting digital strategy technology roadmap": {
    name: "IT Consulting",
    slug: "/Contact",
  },
};

// ─── Chips kategori bisnis ───────────────────────────────────────────────────

const CHIPS_EN = [
  { label: "New Startup", text: "new startup beginning limited budget mvp simple product" },
  { label: "Online Store", text: "online store ecommerce shop payment gateway inventory" },
  { label: "Growing Business", text: "growing business scale analytics dashboard team collaboration" },
  { label: "Mobile App", text: "mobile application android ios push notification user account" },
  { label: "Enterprise System", text: "enterprise system large scale custom integration thousands users" },
  { label: "Still Confused", text: "not sure what I need want guidance consultation first" },
];

// ─── Keyword fallback ────────────────────────────────────────────────────────

function keywordFallback(text: string): ServiceResult {
  const t = text.toLowerCase();

  const scores = {
    web:
      (t.includes("website") ? 3 : 0) +
      (t.includes("web") ? 2 : 0) +
      (t.includes("company profile") ? 3 : 0) +
      (t.includes("landing page") ? 3 : 0) +
      (t.includes("toko") ? 2 : 0) +
      (t.includes("ecommerce") ? 3 : 0) +
      (t.includes("dashboard") ? 2 : 0),
    mobile:
      (t.includes("mobile") ? 3 : 0) +
      (t.includes("aplikasi") ? 3 : 0) +
      (t.includes("android") ? 3 : 0) +
      (t.includes("ios") ? 3 : 0) +
      (t.includes("app") ? 2 : 0) +
      (t.includes("notifikasi") ? 2 : 0),
    uiux:
      (t.includes("desain") ? 3 : 0) +
      (t.includes("design") ? 3 : 0) +
      (t.includes("ui") ? 3 : 0) +
      (t.includes("ux") ? 3 : 0) +
      (t.includes("figma") ? 3 : 0) +
      (t.includes("prototype") ? 3 : 0) +
      (t.includes("tampilan") ? 2 : 0),
    consulting:
      (t.includes("konsultan") ? 3 : 0) +
      (t.includes("konsultasi") ? 3 : 0) +
      (t.includes("strategi") ? 2 : 0) +
      (t.includes("bingung") ? 3 : 0) +
      (t.includes("confused") ? 3 : 0),
  };

  const topEntry = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  const topKey = topEntry[0];
  const total = Object.values(scores).reduce((a, b) => a + b, 0);
  const confidence = Math.min(88, Math.max(65, 65 + Math.min(total * 2, 23)));

  const map: Record<string, ServiceResult> = {
    web: {
      primary: "Web Development",
      others: ["UI/UX Design"],
      slug: "/Services/web-development",
      reasoning:
        "Berdasarkan deskripsi kamu, membangun website profesional adalah fondasi yang paling tepat. Bisa berkembang ke fitur lain sesuai kebutuhan bisnis.",
      confidence,
    },
    mobile: {
      primary: "Mobile App Development",
      others: ["UI/UX Design"],
      slug: "/Services/mobile-app-development",
      reasoning:
        "Kebutuhan kamu mengarah ke pengembangan aplikasi mobile. Kami rekomendasikan mulai dari UI/UX dulu agar pengalaman pengguna solid sebelum masuk development.",
      confidence,
    },
    uiux: {
      primary: "UI/UX Design",
      others: ["Web Development"],
      slug: "/Services/ui-ux-design",
      reasoning:
        "Desain yang kuat adalah fondasi produk digital yang baik. Kami rekomendasikan mulai dari riset dan wireframing dulu, lalu masuk ke development.",
      confidence,
    },
    consulting: {
      primary: "IT Consulting",
      others: ["Web Development", "Mobile App Development"],
      slug: "/Contact",
      reasoning:
        "Kalau masih bingung mulai dari mana, konsultasi dulu adalah langkah terbaik. Tim kami siap bantu petakan kebutuhan teknismu bersama.",
      confidence,
    },
  };

  return map[topKey] || map.web;
}

// ─── HF Classifier ──────────────────────────────────────────────────────────

async function classifyService(text: string): Promise<ServiceResult> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 14000);

    const res = await fetch(
      "https://api-inference.huggingface.co/models/facebook/bart-large-mnli",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inputs: text.slice(0, 400),
          parameters: { candidate_labels: CANDIDATE_LABELS },
        }),
        signal: controller.signal,
      }
    );

    clearTimeout(timeout);

    if (!res.ok) throw new Error(`HF ${res.status}`);

    const data = await res.json();

    if (!data.labels || !data.scores || !data.labels.length) {
      throw new Error("Invalid HF response");
    }

    const topLabel: string = data.labels[0];
    const topScore: number = data.scores[0];
    const secondLabel: string = data.labels[1];

    const topService = LABEL_TO_SERVICE[topLabel];
    const secondService = LABEL_TO_SERVICE[secondLabel];

    if (!topService) throw new Error("Label not mapped");

    const confidence = Math.round(70 + topScore * 27);

    const reasoningMap: Record<string, string> = {
      "Web Development":
        "Berdasarkan kebutuhan bisnis kamu, website profesional adalah langkah yang paling strategis dan efektif untuk dimulai.",
      "Mobile App Development":
        "Kebutuhan kamu mengarah ke pengembangan aplikasi mobile. Kami rekomendasikan mulai dari desain UI dulu agar pengalaman pengguna solid.",
      "UI/UX Design":
        "Desain yang matang adalah kunci produk digital yang sukses. Mulai dari riset dan wireframing untuk membangun fondasi yang kuat.",
      "Full Stack Development":
        "Proyekmu butuh pendekatan full stack — baik web maupun mobile backend. Kami bisa bantu dari arsitektur hingga deployment.",
      "IT Consulting":
        "Untuk memulai perjalanan digital yang tepat, konsultasi dulu adalah langkah paling bijak. Tim kami siap membantu kamu.",
    };

    return {
      primary: topService.name,
      others: secondService && secondService.name !== topService.name ? [secondService.name] : [],
      slug: topService.slug,
      reasoning: reasoningMap[topService.name] || reasoningMap["Web Development"],
      confidence,
    };
  } catch (err) {
    console.warn("HF unavailable, using keyword fallback:", err);
    return keywordFallback(text);
  }
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function SectionServiceRecommend() {
  const { t, tApi } = useTranslate();
  const { language } = useLanguageStore();

  const [input, setInput] = useState("");
  const [activeChips, setActiveChips] = useState<string[]>([]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "thinking" | "done">("idle");
  const [result, setResult] = useState<ServiceResult | null>(null);
  const [translatedChips, setTranslatedChips] = useState(CHIPS_EN);
  const resultRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Translate chips
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

  const fullText = [input.trim(), ...activeChips].filter(Boolean).join(". ");
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

  const serviceSlugMap: Record<string, string> = {
    "Web Development": "/Services/web-development",
    "Mobile App Development": "/Services/mobile-app-development",
    "UI/UX Design": "/Services/ui-ux-design",
    "Full Stack Development": "/Services/web-development",
    "IT Consulting": "/Contact",
  };

  return (
    <section className="w-full bg-white py-24 md:py-32" aria-labelledby="recommend-title">
      <div className="max-w-[680px] mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-12">
          <h2
            id="recommend-title"
            className="text-3xl md:text-4xl font-bold text-black mb-3 leading-tight"
          >
            {t("plansPricing", "title")}
          </h2>
          <p className="text-black/50 text-base">
            {t("plansPricing", "subtitle")}
          </p>
        </div>

        {/* Label */}
        <p className="text-[11px] tracking-[1.8px] uppercase text-black/35 mb-3 font-medium">
          Jelaskan kebutuhan bisnis kamu — AI akan merekomendasikan layanan yang tepat
        </p>

        {/* Textarea */}
        <div className="relative mb-3">
          <textarea
            ref={textareaRef}
            id="service-input"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              if (status === "done") reset();
            }}
            placeholder="Contoh: Saya punya startup fintech, memerlukan sistem manajemen pengguna, dasbor analitik, dan integrasi pembayaran..."
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
            Lampirkan referensi
          </label>
          <input
            ref={fileInputRef}
            id="ref-upload"
            type="file"
            accept="image/*,.png,.jpg,.jpeg,.webp"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) setUploadedFile(e.target.files[0]);
            }}
          />
          <span className="text-xs text-black/30">
            Opsional — screenshot desain, referensi web, atau logo
          </span>
        </div>

        {/* Uploaded file badge */}
        {uploadedFile && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-black/4 rounded-lg text-xs text-black/55 mb-4 w-fit">
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
              <rect x="1" y="1" width="14" height="14" rx="3" stroke="currentColor" strokeWidth="1" />
              <path d="M1 10l4-4 3 3 3-4 4 5" stroke="currentColor" strokeWidth="1" fill="none" strokeLinejoin="round" />
            </svg>
            <span className="max-w-[180px] truncate">{uploadedFile.name}</span>
            <button
              onClick={removeFile}
              className="text-black/35 hover:text-black ml-1 transition-colors"
              aria-label="Hapus file"
            >
              ✕
            </button>
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
                  border: active ? "1.5px solid black" : "1.5px solid rgba(0,0,0,0.15)",
                  background: active ? "black" : "white",
                  color: active ? "white" : "rgba(0,0,0,0.55)",
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
            background:
              canAnalyze && status !== "thinking" ? "black" : "rgba(0,0,0,0.08)",
            color:
              canAnalyze && status !== "thinking" ? "white" : "rgba(0,0,0,0.28)",
            cursor: canAnalyze && status !== "thinking" ? "pointer" : "not-allowed",
          }}
        >
          {status === "thinking" ? (
            <span className="flex items-center justify-center gap-2" role="status" aria-live="polite">
              <span
                className="inline-block w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white"
                style={{ animation: "sr-spin .7s linear infinite" }}
              />
              Menganalisis kebutuhan bisnis kamu...
            </span>
          ) : (
            "Analisis dengan AI → temukan layanan yang tepat"
          )}
        </button>

        <style>{`@keyframes sr-spin{to{transform:rotate(360deg)}}`}</style>

        {/* Or divider */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-black/8" />
          <span className="text-xs text-black/25">atau</span>
          <div className="flex-1 h-px bg-black/8" />
        </div>
        <p className="text-center text-xs text-black/30 mb-8">
          Langsung hubungi kami untuk konsultasi gratis
        </p>

        {/* ── RESULT ── */}
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
                    ✦ Rekomendasi Layanan
                  </span>
                  <span className="text-white font-semibold text-sm">{result.primary}</span>
                  {result.others.length > 0 && (
                    <span className="text-white/40 text-xs">+ {result.others.join(", ")}</span>
                  )}
                </div>
                <span
                  className="text-[11px] px-2.5 py-1 rounded-full font-medium"
                  style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}
                >
                  {result.confidence}% relevan
                </span>
              </div>

              {/* Service tags */}
              <div className="px-5 py-4 flex flex-wrap gap-2 border-b border-black/8 bg-white">
                <span
                  className="px-4 py-1.5 rounded-full text-sm font-medium"
                  style={{ background: "black", color: "white" }}
                >
                  {result.primary}
                </span>
                {result.others.map((s) => (
                  <span
                    key={s}
                    className="px-4 py-1.5 rounded-full text-sm border border-black/15 text-black"
                  >
                    {s}
                  </span>
                ))}
              </div>

              {/* Reasoning */}
              <div className="px-5 py-4 bg-white border-b border-black/8">
                <p className="text-sm text-black/65 leading-relaxed">{result.reasoning}</p>
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
                  Lanjut konsultasi via WhatsApp
                </button>

                {result.slug && result.slug !== "/Contact" && (
                  <Link
                    href={result.slug}
                    className="px-5 py-3 rounded-full border border-black/15 text-black text-sm font-medium hover:border-black/35 hover:bg-black/4 transition-all"
                  >
                    Lihat detail layanan
                  </Link>
                )}

                <button
                  type="button"
                  onClick={() => {
                    reset();
                    setInput("");
                    setActiveChips([]);
                    removeFile();
                    setTimeout(() => textareaRef.current?.focus(), 100);
                  }}
                  className="px-5 py-3 rounded-full border border-black/12 text-black/45 text-sm transition-all hover:text-black hover:border-black/30"
                  style={{ fontFamily: "inherit" }}
                >
                  Ulangi
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}