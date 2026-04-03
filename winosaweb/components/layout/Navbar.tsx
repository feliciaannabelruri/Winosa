"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguageStore } from "@/store/useLanguageStore";
import { useTranslate } from "@/lib/useTranslate";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { language, setLanguage } = useLanguageStore();
  const { t } = useTranslate();

  const [logo, setLogo] = useState("/logo.png");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings`)
      .then(r => r.json())
      .then(json => { if (json?.data?.logo) setLogo(json.data.logo); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // FIX: lock scroll saat menu kebuka
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  const cycleLanguage = () => {
    if (language === "en") setLanguage("nl");
    else if (language === "nl") setLanguage("id");
    else setLanguage("en");
  };

  const displayLang = language.toUpperCase();

  const menus = [
    { name: t("navbar", "company"), href: "/" },
    { name: t("navbar", "services"), href: "/Services" },
    { name: t("navbar", "portfolio"), href: "/portofolio" },
    { name: t("navbar", "blog"), href: "/Blog" },
    { name: t("navbar", "contact"), href: "/Contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-4 flex items-center justify-between">

        <Link href="/" aria-label="Go to homepage">
          <Image
            src={logo}
            alt="Winosa company logo"
            width={44}
            height={44}
            className="cursor-pointer"
          />
        </Link>

        <ul 
          role="menubar"
          className="hidden lg:flex gap-8 text-sm font-medium text-black"
        >
          {menus.map((m) => (
            <li key={m.name}>
              <Link
                href={m.href}
                className="px-4 py-1.5 rounded-full border border-transparent transition hover:bg-black/20 hover:border-black focus:outline-none focus:underline"
              >
                {m.name}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4">

          <button
            onClick={cycleLanguage}
            aria-label="Change language"
            className="hidden lg:flex px-5 py-2 rounded-full border-2 border-black text-black text-sm font-medium hover:bg-black/20 transition focus:outline-none focus:underline"
          >
            {displayLang}
          </button>

          <button
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open} // FIX
            aria-controls="mobile-menu" // FIX
            className="lg:hidden text-black text-2xl focus:outline-none"
          >
            ☰
          </button>

        </div>
      </div>

      {open && (
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          className={`fixed top-0 left-0 w-screen h-screen z-[999] bg-white/90 backdrop-blur-xl px-6 py-8 overflow-y-auto transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full pointer-events-none"
        }`}
        >
          <div className="flex items-center justify-between">

            <Link
              href="/"
              onClick={() => setOpen(false)}
              aria-label="Go to homepage"
            >
              <Image
                src={logo}
                alt="Winosa company logo"
                width={44}
                height={44}
                className="cursor-pointer"
              />
            </Link>

            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="text-black text-2xl focus:outline-none"
            >
              ✕
            </button>

          </div>

          <div className="w-full h-px bg-black/20 my-6" />

          <div className="flex flex-col gap-4 text-sm font-medium">
            {menus.map((m) => (
              <Link
                key={m.name}
                href={m.href}
                onClick={() => setOpen(false)}
                className="px-5 py-3 rounded-full border border-transparent text-black transition hover:bg-black/20 hover:border-black focus:outline-none focus:underline"
              >
                {m.name}
              </Link>
            ))}

            <button
              onClick={cycleLanguage}
              aria-label="Change language"
              className="mt-6 w-full px-6 py-4 rounded-full border-2 border-black text-black text-sm font-medium hover:bg-black/20 transition focus:outline-none focus:underline"
            >
              {displayLang}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}