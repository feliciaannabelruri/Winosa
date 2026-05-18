"use client";

let cachedSettings: any = null;

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLocaleRouter } from "@/lib/useLocaleRouter";
import { useTranslate } from "@/lib/useTranslate";
import { translateHybrid } from "@/lib/translateHybrid";


export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { locale: language } = useLocaleRouter();
  const { t, tApi } = useTranslate();
  const { locale, localePath } = useLocaleRouter();

  const [logo, setLogo] = useState(
    "https://ik.imagekit.io/feliciaaaa/winosa/settings/1775642460741_logo_lymnvf9lA4.png"
  );
  const [menusData, setMenusData] = useState<any[]>([]);
  const [translatedMenus, setTranslatedMenus] = useState<any[]>([]);

  useEffect(() => {
    const api = process.env.NEXT_PUBLIC_API_URL;
    if (!api) return;

    if (cachedSettings) {
      if (cachedSettings.logo) setLogo(cachedSettings.logo);
      if (cachedSettings.navbarMenu) setMenusData(cachedSettings.navbarMenu);
      return;
    }

    fetch(`${api}/settings`)
      .then((r) => r.json())
      .then((json) => {
        const data = json?.data || {};
        cachedSettings = data;
        if (data.logo) setLogo(data.logo);
        if (data.navbarMenu) setMenusData(data.navbarMenu);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!menusData.length) return;
    const run = async () => {
      const translated = [];
      for (const menu of menusData) {
        translated.push({
          ...menu,
          name: await translateHybrid(menu.name, language, tApi),
        });
      }
      setTranslatedMenus(translated);
    };
    run();
  }, [menusData, language]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);



  // Fallback menus — hrefs are prefixed with the current locale
  const fallbackMenus = [
    { name: t("navbar", "about"),     href: localePath("/about") },
    { name: t("navbar", "services"),  href: localePath("/Services") },
    { name: t("navbar", "portfolio"), href: localePath("/portofolio") },
    { name: t("navbar", "blog"),      href: localePath("/Blog") },
    { name: t("navbar", "contact"),   href: localePath("/Contact") },
  ];

  // For API-driven menus, prefix each href with locale
  const prefixedApiMenus = (translatedMenus.length ? translatedMenus : menusData).map(
    (m) => ({ ...m, href: localePath(m.href) })
  );

  const menus = prefixedApiMenus.length ? prefixedApiMenus : fallbackMenus;

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-4 flex items-center justify-between">

        <Link href={localePath("/about")} aria-label="Go to About page">
          <Image
            src={logo}
            alt="Winosa company logo"
            width={44}
            height={44}
            className="cursor-pointer transition-transform duration-300 hover:scale-110"
          />
        </Link>

        <ul role="menubar" className="hidden lg:flex gap-8 text-sm font-medium text-black">
          {menus.map((m) => (
            <li key={m.name}>
              <Link
                href={m.href}
                className="px-4 py-1.5 rounded-full border border-transparent transition-all duration-300 hover:bg-black/10 hover:border-black/40 hover:scale-[1.05] active:scale-[0.97] focus:outline-none focus:underline"
              >
                {m.name}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4">


          {/* ── Hamburger (mobile) ── */}
          <button
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
            className={`lg:hidden text-black text-2xl transition-all duration-300 hover:scale-110 active:scale-90 focus:outline-none ${
              open ? "rotate-90" : ""
            }`}
          >
            ☰
          </button>

        </div>
      </div>

      {/* ── Mobile Drawer ── */}
      {open && (
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          className="fixed top-0 left-0 w-screen h-screen z-[999] bg-white/90 backdrop-blur-xl px-6 py-8 overflow-y-auto transition-all duration-300 ease-in-out"
        >
          <div className="flex items-center justify-between">
            <Link
              href={localePath("/about")}
              onClick={() => setOpen(false)}
              aria-label="Go to About page"
            >
              <Image
                src={logo}
                alt="Winosa company logo"
                width={44}
                height={44}
                className="cursor-pointer transition-transform duration-300 hover:scale-110"
              />
            </Link>

            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="text-black text-2xl transition-transform duration-300 hover:scale-110 active:scale-90 focus:outline-none"
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
                className="px-5 py-3 rounded-full border border-transparent text-black transition-all duration-300 hover:bg-black/10 hover:border-black/40 active:scale-95 focus:outline-none focus:underline"
              >
                {m.name}
              </Link>
            ))}

          </div>
        </div>
      )}
    </nav>
  );
}