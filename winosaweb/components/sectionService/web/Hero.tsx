"use client";

import Button from "@/components/UI/Button";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useTranslate } from "@/lib/useTranslate";

const FadeUp = dynamic(() => import("@/components/animation/FadeUp"));

type HeroData = {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  heroImage?: string;
};

export default function Hero({ data }: { data?: HeroData }) {
  const { t, tApi } = useTranslate();

  const link = data?.ctaLink || "/Contact";

  const title = data?.title
    ? tApi(data.title)
    : t("serviceHero", "defaultTitle");

  const subtitle = data?.subtitle
    ? tApi(data.subtitle)
    : t("serviceHero", "defaultSubtitle");

  const ctaText = data?.ctaText
    ? tApi(data.ctaText)
    : t("serviceHero", "defaultCTA");

  return (
    <FadeUp>
      <section
        aria-labelledby="hero-title"
        className="relative w-full h-screen overflow-hidden"
      >

        {/* background zoom halus */}
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: 1.05 }}
          transition={{ duration: 12, ease: "easeOut" }}
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${data?.heroImage || "/bg/bg10.jpg"})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* overlay (tetap) */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.05) 100%)",
          }}
          aria-hidden="true"
        />

        {/* grain texture */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.04] mix-blend-overlay bg-[url('/noise.png')]" />

        {/* subtle light */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute right-[12%] top-[18%] w-[280px] h-[280px] bg-white/10 blur-[120px] rounded-full" />
        </div>

        {/* content */}
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-center px-6">

          {/* title */}
          <motion.h1
            id="hero-title"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-white text-5xl md:text-6xl font-bold mb-6 leading-tight tracking-tight"
            style={{ textShadow: "0 6px 24px rgba(0,0,0,0.6)" }}
          >
            {title}
          </motion.h1>

          {/* subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-white/90 text-lg leading-relaxed mb-10 max-w-xl"
            style={{ textShadow: "0 4px 16px rgba(0,0,0,0.6)" }}
          >
            {subtitle}
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <Link href={link} aria-label={`Go to ${ctaText}`}>
              <Button
                text={ctaText}
                className="border-white text-white hover:bg-white/20"
              />
            </Link>
          </motion.div>

        </div>

        {/* bottom gradient tetap */}
        <div
          className="absolute bottom-0 left-0 w-full h-[40%] pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0.85) 25%, rgba(255,255,255,0.5) 60%, rgba(255,255,255,0) 100%)",
          }}
          aria-hidden="true"
        />

      </section>
    </FadeUp>
  );
}