"use client";

import { useState } from "react";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { useTranslate } from "@/lib/useTranslate";

const UIUX_PACKAGES = {
  Starter: 600,
  Business: 1300,
  Enterprise: 2400,
};

const UIUX_FEATURES = [
  { key: "research", label: "User Research & Analysis", price: 400, keywords: ["research", "survey", "analysis"] },
  { key: "persona", label: "User Persona & Journey Mapping", price: 350, keywords: ["persona", "journey"] },
  { key: "wireframe", label: "Wireframing (Low Fidelity)", price: 500, keywords: ["wireframe", "low fidelity"] },
  { key: "prototype", label: "Interactive Prototype", price: 600, keywords: ["prototype", "figma"] },
  { key: "designsystem", label: "Design System & Components", price: 700, keywords: ["design system", "component"] },
  { key: "ui", label: "High Fidelity UI Design", price: 800, keywords: ["ui", "interface"] },
  { key: "usability", label: "Usability Testing", price: 450, keywords: ["testing", "usability"] },
  { key: "mobile", label: "Mobile App Design", price: 900, keywords: ["mobile", "app"] },
  { key: "webapp", label: "Web App / Dashboard Design", price: 850, keywords: ["dashboard", "web app"] },
  { key: "redesign", label: "Website Redesign", price: 600, keywords: ["redesign", "revamp"] },
  { key: "branding", label: "Visual Branding & Identity", price: 700, keywords: ["branding", "visual"] },
  { key: "micro", label: "Micro Interaction & Animation", price: 350, keywords: ["animation", "micro"] },
];

export default function CustomQuoteUIUXPage() {
  const { t } = useTranslate();
  const [description, setDescription] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const toggle = (key: string) => {
    setSelected((prev) =>
      prev.includes(key) ? prev.filter((f) => f !== key) : [...prev, key]
    );
  };

  const isValid = description.trim().length > 0 || selected.length > 0;

  const generate = () => {
    if (!isValid) {
      setError(t("uiuxEstimator", "error"));
      return;
    }

    setError("");

    const text = description.toLowerCase();

    let projectType = "UI/UX Design Project";
    if (text.includes("mobile")) projectType = "Mobile App UI/UX Design";
    if (text.includes("dashboard")) projectType = "Web Dashboard Design";
    if (text.includes("website")) projectType = "Website UI/UX Design";

    const activeFeatures = UIUX_FEATURES.filter(
      (f) =>
        selected.includes(f.key) ||
        f.keywords.some((k) => text.includes(k))
    );

    const featureCost = activeFeatures.reduce((sum, f) => sum + f.price, 0);

    const estimates = Object.entries(UIUX_PACKAGES).map(
      ([name, base]) => ({
        name,
        price: base + featureCost,
      })
    );

    setResult({ projectType, estimates });
  };

  return (
    <main>
      <section className="w-full bg-white py-32">
        <div className="max-w-6xl mx-auto px-6 text-black">

          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold mb-4">
              {t("uiuxEstimator", "title")}
            </h1>
            <p className="text-black">
              {t("uiuxEstimator", "subtitle")}
            </p>
          </div>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t("uiuxEstimator", "placeholder")}
            className="w-full h-40 p-6 border border-black rounded-2xl mb-12"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-14">
            {UIUX_FEATURES.map((f) => (
              <button
                key={f.key}
                onClick={() => toggle(f.key)}
                className={`px-5 py-3 rounded-full border text-sm ${
                  selected.includes(f.key)
                    ? "bg-black text-white"
                    : "border-black text-black hover:bg-black/10"
                } transition`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <button
            onClick={generate}
            disabled={!isValid}
            className={`w-full py-4 rounded-full font-semibold transition ${
              isValid
                ? "bg-yellow-400 text-black hover:bg-yellow-300"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {t("uiuxEstimator", "generate")}
          </button>

          {error && (
            <p className="text-red-500 text-sm mt-4 text-center">
              {error}
            </p>
          )}

          {result && (
            <div className="mt-20 border border-black rounded-[28px] p-10">

              <h2 className="text-2xl font-bold mb-6">
                {t("uiuxEstimator", "recommended")}
              </h2>

              <p className="mb-10">
                <strong>{result.projectType}</strong>
              </p>

              <div className="grid md:grid-cols-3 gap-8 mb-12">
                {result.estimates.map((p: any) => (
                  <div key={p.name} className="border border-black rounded-[28px] p-8">
                    <h3 className="font-bold text-lg mb-3">
                      {p.name}
                    </h3>
                    <div className="text-3xl font-bold">
                      ${p.price}
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="https://wa.me/6281234567890"
              target="_blank"
              className="
                w-full
                inline-flex items-center justify-center gap-3
                px-10 py-4 rounded-full
                bg-[#25D366] text-white font-semibold
                hover:bg-[#1ebe5d]
                transition
              "
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-6 h-6"
                  fill="currentColor"
                >
                  <path d="M20.52 3.48A11.91 11.91 0 0012.01 0C5.38 0 .02 5.36.02 12c0 2.11.55 4.18 1.6 6.02L0 24l6.15-1.6a11.94 11.94 0 005.86 1.49h.01c6.63 0 11.99-5.36 11.99-12 0-3.19-1.24-6.19-3.49-8.41zM12 21.5a9.45 9.45 0 01-4.82-1.32l-.35-.21-3.65.95.97-3.56-.23-.36a9.48 9.48 0 0114.67-11.63A9.45 9.45 0 0112 21.5zm5.18-7.1c-.28-.14-1.66-.82-1.92-.91-.26-.1-.45-.14-.63.14-.19.28-.73.91-.9 1.1-.16.19-.33.21-.61.07-.28-.14-1.17-.43-2.23-1.37-.82-.73-1.37-1.63-1.53-1.91-.16-.28-.02-.43.12-.57.12-.12.28-.33.42-.49.14-.16.19-.28.28-.47.09-.19.05-.35-.02-.49-.07-.14-.63-1.52-.87-2.08-.23-.55-.47-.47-.63-.47h-.54c-.19 0-.49.07-.75.35-.26.28-.98.96-.98 2.34s1 2.72 1.14 2.91c.14.19 1.96 3 4.75 4.2.66.28 1.18.45 1.58.58.66.21 1.27.18 1.75.11.53-.08 1.66-.68 1.89-1.34.23-.66.23-1.23.16-1.34-.07-.12-.26-.19-.54-.33z" />
                </svg>

                Continue Consultation
              </Link>

            </div>
          )}

        </div>
      </section>

      <Footer />
    </main>
  );
}