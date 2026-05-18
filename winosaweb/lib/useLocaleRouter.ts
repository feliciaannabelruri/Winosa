"use client";

import { useRouter, usePathname } from "next/navigation";
import { useLanguageStore } from "@/store/useLanguageStore";

const LOCALES = ["en", "nl", "id"] as const;
type Locale = (typeof LOCALES)[number];

/**
 * Returns the current locale extracted from the URL pathname,
 * plus helpers for locale-aware navigation.
 */
export function useLocaleRouter() {
  const router = useRouter();
  const pathname = usePathname();
  const { setLanguage } = useLanguageStore();

  // Extract locale from pathname — middleware always ensures it's there
  const segments = pathname.split("/");
  const localeFromUrl = LOCALES.includes(segments[1] as Locale)
    ? (segments[1] as Locale)
    : "en";

  // The "real" path without the locale prefix
  const pathWithoutLocale =
    segments.slice(2).join("/") || "";

  /**
   * Prefix any path with the current locale.
   * e.g. localePath("/about") → "/nl/about"
   */
  function localePath(path: string): string {
    const clean = path.startsWith("/") ? path : `/${path}`;
    return `/${localeFromUrl}${clean}`;
  }

  /**
   * Switch to a different locale while staying on the same page.
   * e.g. switchLocale("nl") from "/en/about" → navigates to "/nl/about"
   */
  function switchLocale(newLocale: Locale) {
    setLanguage(newLocale);
    const newPath = `/${newLocale}/${pathWithoutLocale}`;
    router.push(newPath);
  }

  return {
    locale: localeFromUrl,
    localePath,
    switchLocale,
    pathWithoutLocale,
  };
}
