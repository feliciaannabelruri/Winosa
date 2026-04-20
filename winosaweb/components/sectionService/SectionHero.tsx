"use client";

import Link from "next/link";
import Image from "next/image";
import Button from "@/components/UI/Button";
import { motion } from "framer-motion";
import { useTranslate } from "@/lib/useTranslate";

export default function SectionHero() {
  const { t } = useTranslate();

  return (
    <section
      className="relative w-full h-screen overflow-hidden"
      aria-labelledby="services-hero-title"
    >

      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: 1.05 }}
        transition={{ duration: 12, ease: "easeOut" }}
        className="absolute inset-0 z-0"
      >
        <Image
          src="/bg/bg7.jpg"
          alt=""
          aria-hidden="true"
          fill
          priority
          quality={75}
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>

      {/* overlay */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.05) 100%)",
        }}
        aria-hidden="true"
      />

      {/* grain texture */}
      <div className="absolute inset-0 z-10 pointer-events-none opacity-[0.04] mix-blend-overlay bg-[url('/noise.png')]" />

      {/* subtle light */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="absolute left-[15%] top-[10%] w-[280px] h-[280px] bg-white/10 blur-[120px] rounded-full" />
      </div>

      {/* content */}
      <div
        className="relative z-20 w-full h-full flex flex-col items-center justify-center text-center px-6"
        style={{ transform: "translateZ(0)" }}
      >

        {/* title */}
        <motion.h1
          id="services-hero-title"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-white text-5xl md:text-6xl font-bold mb-6 tracking-tight"
          style={{ textShadow: "0 6px 24px rgba(0,0,0,0.6)" }}
        >
          {t("servicesHero", "title")}
        </motion.h1>

        {/* subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-white/90 text-lg mb-10 max-w-xl leading-relaxed"
          style={{ textShadow: "0 4px 16px rgba(0,0,0,0.6)" }}
        >
          {t("servicesHero", "subtitle")}
        </motion.p>

        {/* button */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <Link href="/Contact" aria-label="Go to contact page">
            <Button
              text={t("servicesHero", "button")}
              className="border-white text-white hover:bg-white/20"
            />
          </Link>
        </motion.div>

      </div>

      {/* bottom gradient*/}
      <div
        className="absolute bottom-0 left-0 w-full h-[40%] z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0.9) 25%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0.2) 75%, rgba(255,255,255,0) 100%)",
        }}
        aria-hidden="true"
      />

    </section>
  );
}