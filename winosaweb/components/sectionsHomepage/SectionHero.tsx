"use client";

import Link from "next/link";
import Button from "@/components/UI/Button";
import FadeUp from "@/components/animation/FadeUp";
import { useTranslate } from "@/lib/useTranslate";

export default function SectionHero() {

  const { t } = useTranslate();

  return (
    <section
      className="relative w-full min-h-screen overflow-hidden flex items-center"
      style={{
        backgroundImage: "url('/bg/bg2.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >

      {/* overlay */}
      <div className="absolute inset-0 bg-black/20" />

      <div className="relative z-10 w-full">

        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">

          <div
            className="
            max-w-[620px]
            ml-auto
            text-white
            text-right
            "
          >

            {/* TITLE */}
            <FadeUp>

              <h1
                className="
                text-3xl
                sm:text-4xl
                md:text-5xl
                lg:text-6xl
                font-bold
                leading-tight
                "
                style={{ textShadow: "0 6px 20px rgba(0,0,0,0.6)" }}
              >

                <span className="block">
                  {t("hero", "titleLine1")}
                </span>

                <span className="block">
                  {t("hero", "titleLine2")}
                </span>

              </h1>

            </FadeUp>

            {/* DESCRIPTION */}
            <FadeUp delay={0.2}>

              <p
                className="
                mt-6
                text-sm
                sm:text-base
                md:text-lg
                text-white/90
                leading-relaxed
                "
                style={{ textShadow: "0 4px 12px rgba(0,0,0,0.6)" }}
              >
                {t("hero", "description")}
              </p>

            </FadeUp>

            {/* BUTTON */}
            <FadeUp delay={0.4}>

              <div
                className="
                mt-10
                flex
                justify-end
                "
              >

                <Link href="/Contact">
                  <Button
                    text={t("hero", "button")}
                    variant="light"
                  />
                </Link>

              </div>

            </FadeUp>

          </div>

        </div>

      </div>

      {/* bottom fade */}
      <div className="absolute bottom-0 left-0 w-full h-[35%] bg-gradient-to-t from-white to-transparent" />

    </section>
  );
}