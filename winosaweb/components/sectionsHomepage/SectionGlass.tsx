"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { useTranslate } from "@/lib/useTranslate";
import React from "react";

const FadeUp = dynamic(() => import("@/components/animation/FadeUp"));

type GlassData = {
  whoWeAre?: { image1?: string; image2?: string };
  whatWeDo?: { image1?: string; image2?: string };
  vision?: { image?: string };
};

export default function SectionGlass({ data }: { data: GlassData | null }) {
  const { t } = useTranslate();

  return (
    <section className="w-full bg-white py-24 md:py-32">
      <div className="max-w-[1200px] mx-auto px-6 text-black">
        <FadeUp>
          <h2 className="text-center text-3xl md:text-4xl font-bold mb-20 md:mb-24 leading-tight">
            {t("glass", "headingLine1")}
            <br />
            {t("glass", "headingLine2")}
          </h2>
        </FadeUp>

        <FadeUp>
          <TimelineRow
            side="right"
            title={t("glass", "whoTitle")}
            text={t("glass", "whoDesc")}
          >
            <DoubleOvalImage
              image1={data?.whoWeAre?.image1}
              image2={data?.whoWeAre?.image2}
            />
          </TimelineRow>
        </FadeUp>

        <FadeUp>
          <TimelineRow
            side="left"
            title={t("glass", "whatTitle")}
            text={t("glass", "whatDesc")}
          >
            <DoubleOvalImage
              reverse
              image1={data?.whatWeDo?.image1}
              image2={data?.whatWeDo?.image2}
            />
          </TimelineRow>
        </FadeUp>

        <FadeUp>
          <TimelineRow
            side="right"
            title={t("glass", "visionTitle")}
            text={t("glass", "visionDesc")}
            isLast
          >
            <SingleOvalImage image={data?.vision?.image} />
          </TimelineRow>
        </FadeUp>
      </div>
    </section>
  );
}

function TimelineRow({
  side,
  title,
  text,
  children,
  isLast,
}: any) {
  return (
    <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-24 lg:mb-32">
      <div className="hidden lg:flex absolute top-16 left-1/2 -translate-x-1/2 flex-col items-center">
        <div className="w-4 h-4 bg-black rounded-full z-10" />
        {!isLast && <div className="w-px bg-black mt-2 h-[340px]" />}
      </div>

      <div className="flex justify-center lg:justify-end">
        {side === "left"
          ? <TextBlock title={title} text={text} align="right" />
          : children}
      </div>

      <div className="flex justify-center lg:justify-start">
        {side === "right"
          ? <TextBlock title={title} text={text} />
          : children}
      </div>
    </div>
  );
}

function TextBlock({ title, text, align }: any) {
  return (
    <div className={`max-w-md text-center lg:text-left ${align === "right" ? "lg:text-right" : ""}`}>
      <h3 className="text-lg md:text-xl font-semibold mb-4 text-black">
        {title}
      </h3>
      <p className="text-gray-600 leading-relaxed text-sm md:text-base">
        {text}
      </p>
    </div>
  );
}

function DoubleOvalImage({ reverse, image1, image2 }: any) {
  return (
    <div className="relative w-[260px] sm:w-[300px] md:w-[320px] h-[160px] sm:h-[180px]">
      <MagnifyOval
        className={`${reverse ? "right-0" : "left-0"} top-6`}
        size="lg"
        imageUrl={image1}
      />
      <MagnifyOval
        className={`${reverse ? "left-0" : "right-0"} bottom-0`}
        size="sm"
        imageUrl={image2}
      />
    </div>
  );
}

function SingleOvalImage({ image }: any) {
  return (
    <div className="relative w-[200px] sm:w-[220px] h-[120px] sm:h-[140px]">
      <MagnifyOval size="md" imageUrl={image} />
    </div>
  );
}

function MagnifyOval({ size = "md", className = "", imageUrl }: any) {
  const sizeMap: any = {
    sm: "w-[140px] h-[90px] md:w-[160px] md:h-[100px]",
    md: "w-[200px] h-[120px] md:w-[220px] md:h-[140px]",
    lg: "w-[220px] h-[140px] md:w-[240px] md:h-[150px]",
  };

  return (
    <div
      className={`absolute ${sizeMap[size]} rounded-full overflow-hidden ${className}`}
      style={{
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
      }}
    >
      {imageUrl && (
        <Image
          src={imageUrl}
          alt="glass image"
          fill
          className="object-cover"
        />
      )}
    </div>
  );
}