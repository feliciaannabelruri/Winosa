"use client";

import { useLanguageStore } from "@/store/useLanguageStore";
import { translations } from "./translations";

export function useTranslate() {
  const { language } = useLanguageStore();

  function t(section: string, key: string): string {
    const sec: any = translations;

    return (
      sec?.[section]?.[key]?.[language] ||
      sec?.[section]?.[key]?.["en"] ||
      key
    );
  }

  function normalize(text: string) {
    return text?.toLowerCase().trim();
  }

  function tApi(apiValue: string): string {
    if (!apiValue) return "";

    const sec: any = translations;
    const normalized = normalize(apiValue);

    for (const sectionKey in sec) {
      const section = sec[sectionKey];

      if (typeof section !== "object") continue;

      for (const key in section) {
        const value = section[key];

        if (!value?.en) continue;

        if (normalize(value.en) === normalized) {
          return value?.[language] || value?.en || apiValue;
        }
      }
    }

    return apiValue;
  }

  return { t, tApi };
}