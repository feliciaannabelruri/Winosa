"use client";

import { motion } from "framer-motion";
import FadeUp from "@/components/animation/FadeUp";
import Button from "@/components/UI/Button";
import { useTranslate } from "@/lib/useTranslate";

export default function SectionHero() {
  const { t } = useTranslate();

  const items = [
    "PromptPilot",
    "Screen",
    "EventMix",
    "Scale",
    "Launch",
    "Optimize",
    "Growth",
    "Digital",
  ];

  const handleScrollToPricing = () => {
    const section = document.getElementById("pricing");

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <FadeUp>
      <section className="relative w-full min-h-screen bg-white overflow-hidden flex items-center justify-center">

        {/* Background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.04)_0%,transparent_60%)]" />

        {/* Orange glow */}
        <div className="absolute bottom-[-120px] left-0 right-0 h-[700px] pointer-events-none">
          <div className="w-full h-full bg-[radial-gradient(ellipse_at_bottom,rgba(255,200,0,0.9)_0%,rgba(255,200,0,0.6)_30%,rgba(255,200,0,0.35)_50%,rgba(255,200,0,0.15)_65%,transparent_80%)] blur-[130px]" />
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 w-full h-[260px] bg-gradient-to-t from-white via-white to-transparent pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 text-center max-w-4xl px-6">

          <h1 className="text-6xl md:text-7xl font-bold text-black leading-tight mb-6">
            {t("plansHero", "titleLine1")}
            <br />
            {t("plansHero", "titleLine2")}
          </h1>

          <p className="text-black/60 text-lg max-w-2xl mx-auto mb-12">
            {t("plansHero", "description")}
          </p>

          {/* ✅ BUTTON TETAP PAKAI COMPONENT KAMU */}
          <Button
            text={t("plansHero", "button")}
            variant="dark"
            onClick={handleScrollToPricing}   // 🔥 BUKAN href
          />

        </div>

        {/* Marquee */}
        <div className="absolute bottom-20 w-full overflow-hidden pointer-events-none">

          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              repeat: Infinity,
              duration: 25,
              ease: "linear",
            }}
            className="flex whitespace-nowrap text-black/20 text-xl font-semibold tracking-widest"
          >
            {[...items, ...items].map((item, i) => (
              <div key={`${item}-${i}`} className="mx-16">
                {item}
              </div>
            ))}
          </motion.div>

          {/* Fade edges */}
          <div className="absolute left-0 top-0 w-40 h-full bg-gradient-to-r from-white to-transparent" />
          <div className="absolute right-0 top-0 w-40 h-full bg-gradient-to-l from-white to-transparent" />

        </div>

      </section>
    </FadeUp>
  );
}