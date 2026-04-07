"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useTranslate } from "@/lib/useTranslate";
import Button from "@/components/UI/Button";
import Image from "next/image";

const FadeUp = dynamic(() => import("@/components/animation/FadeUp"));

export default function SectionHeroMobileApp({ data }: { data?: any }) {
  const { t } = useTranslate();

  const title = data?.title || t("mobileHero", "defaultTitle");
  const titleParts = title.split(" ");

  return (
    <FadeUp>
      <section
        className="w-full bg-white py-28 overflow-hidden"
        aria-labelledby="mobile-hero-title"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-16 flex flex-col lg:flex-row items-center gap-14">
          
          {/* images */}
          <div
            className="flex-1 relative flex justify-center items-center"
            aria-hidden="true"
          >
            <div className="absolute w-[480px] h-[480px] bg-yellow-400/20 rounded-full blur-[120px]" />

            {/* back phone */}
            <div className="w-64 h-[500px] bg-white rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-black/10 rotate-[-10deg] absolute overflow-hidden">
              {data?.heroImageSecondary ? (
                <Image
                  src={data.heroImageSecondary}
                  alt="Mobile app screen preview"
                  fill
                  className="object-cover rounded-[40px]"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-yellow-50 to-white flex items-center justify-center text-black/40 text-sm">
                  App Screen
                </div>
              )}
            </div>

            {/* front phone */}
            <div className="w-64 h-[500px] bg-white rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-black/10 rotate-[6deg] relative overflow-hidden">
              {data?.heroImagePrimary ? (
                <Image
                  src={data.heroImagePrimary}
                  alt="Mobile application interface"
                  fill
                  className="object-cover rounded-[40px]"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-yellow-50 to-white flex items-center justify-center text-black/40 text-sm">
                  App Screen
                </div>
              )}
            </div>
          </div>

          {/* content */}
          <div className="flex-1 text-center lg:text-left">

            <motion.p
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-yellow-600 font-medium mb-4 uppercase tracking-wide text-sm"
            >
              {data?.heroLabel || t("mobileHero", "label")}
            </motion.p>

            <motion.h1
              id="mobile-hero-title"
              initial={{ x: 120, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-black leading-tight"
            >
              {titleParts[0]}
            </motion.h1>

            <motion.h1
              initial={{ x: 120, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-black leading-tight mb-6"
            >
              {titleParts.slice(1).join(" ")}
            </motion.h1>

            <motion.p
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-black/70 text-base leading-relaxed max-w-xl mb-10"
            >
              {data?.description || t("mobileHero", "description")}
            </motion.p>

            <motion.div
              initial={{ x: 80, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.65 }}
            >
              <Link
                href="/Contact"
                aria-label={`Contact our team about ${title}`}
              >
                <Button
                  text={data?.ctaText || t("mobileHero", "cta")}
                  className="border-black text-black hover:bg-black/10"
                />
              </Link>
            </motion.div>

          </div>
        </div>
      </section>
    </FadeUp>
  );
}