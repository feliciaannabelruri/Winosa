"use client";

import Link from "next/link";
import Image from "next/image";
import Button from "@/components/UI/Button";
import { motion } from "framer-motion";
import { useTranslate } from "@/lib/useTranslate";

export default function SectionHero() {
  const { t } = useTranslate();

  return (
    <section className="relative w-full h-screen overflow-hidden" aria-labelledby="services-hero-title">

      {/* Background Image (OPTIMIZED) */}
      <Image
        src="/bg/bg7.jpg"
        alt=""
        aria-hidden="true"
        fill
        priority //  
        quality={75} //  compress
        sizes="100vw"
        className="object-cover z-0"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/10 z-10" aria-hidden="true"/>

      {/* Content */}
      <div
        className="relative z-20 w-full h-full flex flex-col items-center justify-center text-center px-6"
        style={{
          transform: "translateZ(0)", //  Safari fix
        }}
      >

        {/* Title */}
        <motion.h1
          id="services-hero-title"
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }} // 
          transition={{ duration: 0.8 }}
          className="text-white text-5xl md:text-6xl font-bold mb-6"
          style={{ textShadow: "0 6px 24px rgba(0,0,0,0.6)" }}
        >
          {t("servicesHero", "title")}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-white/90 text-lg mb-10"
          style={{ textShadow: "0 4px 16px rgba(0,0,0,0.6)" }}
        >
          {t("servicesHero", "subtitle")}
        </motion.p>

        {/* Button */}
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Link href="/Contact" aria-label="Go to contact page">
            <Button
              text={t("servicesHero", "button")}
              className="border-white text-white hover:bg-white/20"
            />
          </Link>
        </motion.div>

      </div>

      {/* Gradient*/}
      <div
        className="absolute bottom-0 left-0 w-full h-[35%] z-10 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to top, rgba(255,255,255,1) 10%, rgba(255,255,255,0) 100%)",
        }}
        aria-label="Go to contact page"
      />

    </section>
  );
}
