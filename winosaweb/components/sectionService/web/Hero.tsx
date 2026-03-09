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
  const { t } = useTranslate();

  const link = data?.ctaLink || "/Contact";
  const title = data?.title || t("serviceHero", "defaultTitle");
  const subtitle = data?.subtitle || t("serviceHero", "defaultSubtitle");
  const ctaText = data?.ctaText || t("serviceHero", "defaultCTA");

  return (
    <FadeUp>
      <section
        className="relative w-full h-screen overflow-hidden"
        style={{
          backgroundImage: `url(${data?.heroImage || "/bg/bg10.jpg"})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/20" />

        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-center px-6">
          <motion.h1
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white text-5xl md:text-6xl font-bold mb-6 leading-tight"
          >
            {title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-white/90 text-lg leading-relaxed mb-10 max-w-xl"
          >
            {subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link href={link} aria-label="Go to contact page">
              <Button
                text={ctaText}
                className="border-white text-white hover:bg-white/20"
              />
            </Link>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-[35%] bg-gradient-to-t from-white to-transparent" />
      </section>
    </FadeUp>
  );
}