"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Button from "@/components/UI/Button";
import { motion } from "framer-motion";
import { useTranslate } from "@/lib/useTranslate";

// FIX gtag
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

        window.gtag?.("event", "newsletter_submit", {
          status: "duplicate",
          variant,
        });

        return;
      }

      if (res.status === 429) {
        setError(t("newsletter", "errorTooMany"));

        window.gtag?.("event", "newsletter_submit", {
          status: "too_many_requests",
          variant,
        });

        return;
      }

      if (!res.ok) throw new Error();

      setSuccess(t("newsletter", "success"));
      setEmail("");

      window.gtag?.("event", "newsletter_submit", {
        status: "success",
        variant,
      });

    } catch {
      setError(t("newsletter", "errorGeneral"));

      window.gtag?.("event", "newsletter_submit", {
        status: "error",
        variant,
      });

    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full bg-white py-16">
      <div className="max-w-5xl mx-auto px-6 text-center text-black">

        {/* Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <p className="text-sm text-gray-600 mb-6">
            {t("newsletter", "title")}
          </p>

          <form
            onSubmit={handleSubscribe}
            className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-lg mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("newsletter", "placeholder")}
              className="flex-1 border-b border-black/30 focus:border-black outline-none py-2 bg-transparent text-black text-sm"
            />

            <Button
              text={
                loading
                  ? t("newsletter", "subscribing")
                  : t("newsletter", "subscribe")
              }
              className="text-sm px-6 py-2"
            />
          </form>

          {/* ✅ A/B TEST (TRANSLATED) */}
          {variant === "B" && (
            <p className="text-xs text-gray-500 mt-2">
              {t("newsletter", "trustMessage")}
            </p>
          )}

          {success && (
            <p className="text-green-600 text-xs mt-4">{success}</p>
          )}

          {error && (
            <p className="text-red-600 text-xs mt-4">{error}</p>
          )}
        </motion.div>

        {/* Divider */}
        <div className="w-24 h-px bg-black/20 mx-auto mb-12" />

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
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
                className={
                  variant === "A"
                    ? ""
                    : "shadow-lg hover:scale-105 transition duration-300"
                }
                onClick={() => {
                  window.gtag?.("event", "cta_click", {
                    variant,
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