"use client";

import { useState } from "react";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { useTranslate } from "@/lib/useTranslate";

const APP_PACKAGES = {
  Starter: 700,
  Business: 1500,
  Enterprise: 2800,
};

const APP_FEATURES = [
  { key: "auth", label: "User Login & Account System", price: 400, keywords: ["login", "account", "user"] },
  { key: "ui", label: "Custom Mobile UI Design", price: 450, keywords: ["design", "ui"] },
  { key: "api", label: "Backend & API Integration", price: 500, keywords: ["api", "backend"] },
  { key: "payment", label: "In-App Payment", price: 550, keywords: ["payment"] },
  { key: "push", label: "Push Notifications", price: 300, keywords: ["notification"] },
  { key: "map", label: "Maps & Location Service", price: 350, keywords: ["map", "location"] },
  { key: "chat", label: "Chat / Messaging Feature", price: 500, keywords: ["chat"] },
  { key: "admin", label: "Admin Dashboard", price: 400, keywords: ["admin"] },
  { key: "performance", label: "Performance Optimization", price: 300, keywords: ["performance"] },
  { key: "security", label: "Security & Data Protection", price: 350, keywords: ["security"] },
  { key: "analytics", label: "Analytics & User Tracking", price: 250, keywords: ["analytics"] },
  { key: "maintenance", label: "Maintenance & Scalability", price: 300, keywords: ["maintenance"] },
];

export default function CustomQuoteMobilePage() {
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
      setError(t("customMobile", "error"));
      return;
    }

    setError("");

    const text = description.toLowerCase();

    let appType = "Mobile Application";
    if (text.includes("booking")) appType = "Booking & Appointment App";
    if (text.includes("delivery")) appType = "Delivery App";
    if (text.includes("chat")) appType = "Messaging App";
    if (text.includes("shop")) appType = "Mobile Commerce App";

    const activeFeatures = APP_FEATURES.filter(
      (f) =>
        selected.includes(f.key) ||
        f.keywords.some((k) => text.includes(k))
    );

    const featureCost = activeFeatures.reduce((sum, f) => sum + f.price, 0);

    const estimates = Object.entries(APP_PACKAGES).map(
      ([name, base]) => ({
        name,
        price: base + featureCost,
      })
    );

    setResult({ appType, estimates });
  };

  return (
    <main>
      <section className="w-full bg-white py-32">
        <div className="max-w-6xl mx-auto px-6 text-black">

          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold mb-4">
              {t("customMobile", "title")}
            </h1>
            <p className="text-black">
              {t("customMobile", "subtitle")}
            </p>
          </div>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t("customMobile", "placeholder")}
            className="w-full h-40 p-6 border border-black rounded-2xl mb-12"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-14">
            {APP_FEATURES.map((f) => (
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
            {t("customMobile", "generate")}
          </button>

          {error && (
            <p className="text-red-500 text-sm mt-4 text-center">
              {error}
            </p>
          )}

          {result && (
            <div className="mt-20 border border-black rounded-[28px] p-10">

              <h2 className="text-2xl font-bold mb-6">
                {t("customMobile", "recommended")}
              </h2>

              <p className="mb-10">
                <strong>{result.appType}</strong>
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