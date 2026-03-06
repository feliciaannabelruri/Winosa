"use client";

import Link from "next/link";
import { useTranslate } from "@/lib/useTranslate";

export default function Footer() {
  const { t } = useTranslate();

  return (
    <footer className="bg-[#efede9] text-black px-12 py-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">

        <div className="space-y-6">
          <h4 className="text-sm font-semibold tracking-wide">
            {t("footer", "aboutTitle")}
          </h4>

          <div className="space-y-3 text-gray-700 text-sm">
            <Link href="/" className="block hover:text-black transition">
              {t("footer", "company")}
            </Link>
            <Link href="/About" className="block hover:text-black transition">
              {t("footer", "aboutUs")}
            </Link>
          </div>
        </div>

        <div className="space-y-6">
          <h4 className="text-sm font-semibold tracking-wide">
            {t("footer", "servicesTitle")}
          </h4>

          <div className="space-y-3 text-gray-700 text-sm">
            <Link href="/Services" className="block hover:text-black transition">
              {t("footer", "services")}
            </Link>
            <Link href="/Plans" className="block hover:text-black transition">
              {t("footer", "plans")}
            </Link>
            <Link href="/Contact" className="block hover:text-black transition">
              {t("footer", "contact")}
            </Link>
          </div>
        </div>

        <div className="space-y-6">
          <h4 className="text-sm font-semibold tracking-wide">
            {t("footer", "insightTitle")}
          </h4>

          <div className="space-y-3 text-gray-700 text-sm">
            <Link href="/portofolio" className="block hover:text-black transition">
              {t("footer", "portfolio")}
            </Link>
            <Link href="/Blog" className="block hover:text-black transition">
              {t("footer", "blog")}
            </Link>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Link href="/">
              <img
                src="/logo.png"
                alt="Winosa"
                className="h-14 cursor-pointer"
              />
            </Link>
            <span className="text-2xl font-bold">
              <span className="text-3xl">W</span>inosa.
            </span>
          </div>

          <p className="text-sm text-gray-700">
            {t("footer", "tagline")}
          </p>

          <div className="flex gap-6 mt-4 items-center">

            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-14 h-14 rounded-full bg-black flex items-center justify-center hover:bg-black/80 transition"
            >
              <svg viewBox="0 0 24 24" className="w-7 h-7" fill="white">
                <path d="M9 8h2V6c0-1.7 1-3 3.3-3h2.2v2.7h-1.6c-.9 0-1.1.4-1.1 1.1V8h2.6l-.4 2.8H13v7h-3v-7H8V8h1z" />
              </svg>
            </a>

            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-14 h-14 rounded-full bg-black flex items-center justify-center hover:bg-black/80 transition"
            >
              <svg viewBox="0 0 24 24" className="w-7 h-7" fill="white">
                <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.22 8h4.56v14H.22zM8.48 8h4.37v1.91h.06c.61-1.16 2.1-2.38 4.32-2.38 4.62 0 5.47 3.04 5.47 6.99V22h-4.56v-6.26c0-1.49-.03-3.41-2.08-3.41-2.08 0-2.4 1.62-2.4 3.3V22H8.48z"/>
              </svg>
            </a>

            <a
              href="https://wa.me/628000000000"
              target="_blank"
              rel="noopener noreferrer"
              className="w-14 h-14 rounded-full bg-black flex items-center justify-center hover:bg-black/80 transition"
            >
              <svg viewBox="0 0 24 24" className="w-7 h-7" fill="white">
                <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.36 11.36 0 003.56.57 1 1 0 011 1v3.49a1 1 0 01-1 1C10.07 21 3 13.93 3 5.5a1 1 0 011-1H7.5a1 1 0 011 1c0 1.25.2 2.47.57 3.56a1 1 0 01-.24 1.01l-2.21 2.22z"/>
              </svg>
            </a>

          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16">
        <div className="h-px bg-black/20 mb-6" />
        <div className="flex flex-col md:flex-row justify-between text-sm text-gray-700">
          <span>{t("footer", "location")}</span>
          <span>{t("footer", "copyright")}</span>
        </div>
      </div>
    </footer>
  );
}