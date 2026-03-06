"use client";

import { useLanguageStore } from "@/store/useLanguageStore";
import { translations } from "./translations";

export function useTranslate() {
  const { language } = useLanguageStore();

  function t(section: string, key: string): string {
    const sec = translations as any;

    return (
      sec?.[section]?.[key]?.[language] ||
      sec?.[section]?.[key]?.["en"] ||
      key
    );
  }

  return { t };
}
