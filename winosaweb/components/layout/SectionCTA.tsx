"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Button from "@/components/UI/Button";
import { motion } from "framer-motion";
import { useTranslate } from "@/lib/useTranslate";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export default function SectionCTA() {
  const { t } = useTranslate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [variant, setVariant] = useState<"A" | "B">("A");

  const EXPERIMENT_NAME = "cta_experiment_v1";

  useEffect(() => {
    const saved = localStorage.getItem("cta_variant");

    if (saved === "A" || saved === "B") {
      setVariant(saved);
    } else {
      const random: "A" | "B" = Math.random() > 0.5 ? "A" : "B";
      localStorage.setItem("cta_variant", random);
      setVariant(random);
    }
  }, []);

  useEffect(() => {
    window.gtag?.("event", "experiment_view", {
      experiment_name: EXPERIMENT_NAME,
      variant: variant,
    });
  }, [variant]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          window.gtag?.("event", "cta_visible", {
            experiment_name: EXPERIMENT_NAME,
            variant,
          });
        }
      },
      { threshold: 0.5 }
    );

    const el = document.getElementById("cta-section");
    if (el) observer.observe(el);

    return () => observer.disconnect();
  }, [variant]);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    if (!email.trim()) {
      setError(t("newsletter", "errorRequired"));
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError(t("newsletter", "errorInvalid"));
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/newsletter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.status === 400) {
        setError(t("newsletter", "errorDuplicate"));
        return;
      }

      if (res.status === 429) {
        setError(t("newsletter", "errorTooMany"));
        return;
      }

      if (!res.ok) throw new Error();

      setSuccess(t("newsletter", "success"));
      setEmail("");

    } catch {
      setError(t("newsletter", "errorGeneral"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="cta-section" className="w-full bg-white py-16">
      <div className="max-w-5xl mx-auto px-6 text-center text-black">

        {/* Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <p className="text-sm text-gray-600 mb-6">
            {t("newsletter", "title")}
          </p>

          <form
            onSubmit={handleSubscribe}
            aria-label="Newsletter subscription form"
            className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-lg mx-auto"
          >
            <label htmlFor="email-input" className="sr-only">
              Email address
            </label>

            <input
              id="email-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("newsletter", "placeholder")}
              className="flex-1 border-b border-black/30 focus:border-black outline-none py-2 bg-transparent text-black text-sm transition-all duration-300 focus:scale-[1.02]"
            />

            <Button
              text={
                loading
                  ? t("newsletter", "subscribing")
                  : t("newsletter", "subscribe")
              }
              className="text-sm px-6 py-2 transition-all duration-300 hover:scale-105 active:scale-95"
            />
          </form>

          {variant === "B" && (
            <p className="text-xs text-gray-500 mt-2">
              {t("newsletter", "trustMessage")}
            </p>
          )}

          {success && (
            <p className="text-green-600 text-xs mt-4" aria-live="polite">
              {success}
            </p>
          )}

          {error && (
            <p className="text-red-600 text-xs mt-4" aria-live="assertive">
              {error}
            </p>
          )}
        </motion.div>

        {/* Divider */}
        <div className="w-24 h-px bg-black/20 mx-auto mb-12" />

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-6">
            {t("cta", "title")}
          </h2>

          <p className="text-gray-600 mb-10">
            {t("cta", "description")}
          </p>

          <div className="flex justify-center">
            <Link href="/Contact">
              <Button
                text={t("cta", "button")}
                className={`transition-all duration-300 ${
                  variant === "B"
                    ? "shadow-lg hover:scale-105 active:scale-95"
                    : "hover:scale-105 active:scale-95"
                }`}
                onClick={() => {
                  window.gtag?.("event", "cta_click", {
                    event_category: "engagement",
                    event_label: "contact_button",
                    experiment_name: EXPERIMENT_NAME,
                    variant: variant,
                  });
                }}
              />
            </Link>
          </div>
        </motion.div>

      </div>
    </section>
  );
}