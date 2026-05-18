"use client";

import { create } from "zustand";

type Language = "en" | "nl" | "id";

const LOCALES: Language[] = ["en", "nl", "id"];

/** Read the current locale directly from the URL pathname (client-side only). */
function getLocaleFromPathname(): Language {
  if (typeof window === "undefined") return "en";
  const segments = window.location.pathname.split("/");
  // segments[1] is the first path segment (the locale prefix)
  const first = segments[1] as Language;
  return LOCALES.includes(first) ? first : "en";
}

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
  syncFromUrl: () => void;
}

export const useLanguageStore = create<LanguageState>()((set) => ({
  language: getLocaleFromPathname(),

  setLanguage: (lang) => set({ language: lang }),

  /** Call this to re-sync state after a client-side navigation */
  syncFromUrl: () => set({ language: getLocaleFromPathname() }),
}));
