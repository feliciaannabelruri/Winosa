"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import Button from "@/components/UI/Button";
import { useTranslate } from "@/lib/useTranslate";

const FadeUp = dynamic(() => import("@/components/animation/FadeUp"), {
  ssr: false,
});

export default function SectionHero() {
  const { t } = useTranslate();

  return (
    <section
      aria-label="Hero section with company introduction"
      className="relative w-full min-h-screen flex items-center overflow-hidden"
      style={{
        backgroundImage: "url('/bg/bg2.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        transform: "translateZ(0)",
      }}
    >
      {/* overlay (dibikin lebih smooth, gak ngeblok) */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/30 z-0" />

      {/* content */}
      <div className="relative z-20 w-full">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
          <div className="max-w-[620px] ml-auto text-white text-right">

            {/* heading */}
            <FadeUp>
              <h1
                className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight"
                style={{ textShadow: "0 6px 20px rgba(0,0,0,0.6)" }}
              >
                <span className="block">{t("hero", "titleLine1")}</span>
                <span className="block">{t("hero", "titleLine2")}</span>
              </h1>
            </FadeUp>

            {/* description */}
            <FadeUp delay={0.2}>
              <p
                className="mt-6 text-sm sm:text-base md:text-lg text-white/90 leading-relaxed font-body"
                style={{ textShadow: "0 4px 12px rgba(0,0,0,0.6)" }}
              >
                {t("hero", "description")}
              </p>
            </FadeUp>

            {/* CTA (TIDAK DIUBAH) */}
            <FadeUp delay={0.4}>
              <div className="mt-10 flex justify-end">
                <Link href="/Contact" aria-label="Go to contact page">
                  <Button text={t("hero", "button")} variant="light" />
                </Link>
              </div>
            </FadeUp>

          </div>
        </div>
      </div>

      {/* gradient bawah (FIX HALUS, NO BLOK) */}
      <div className="absolute bottom-0 left-0 w-full h-[35%] z-10 pointer-events-none bg-gradient-to-t from-white via-white/70 to-transparent" />
    </section>
  );
}