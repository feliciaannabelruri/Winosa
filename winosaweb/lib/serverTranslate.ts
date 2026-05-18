/**
 * SERVER-SIDE TRANSLATOR
 * ─────────────────────────────────────────────────────────
 * Translates strings / objects at SSR time, BEFORE the page
 * is sent to the browser.  Zero flash, zero flicker, perfect
 * SEO – because the HTML that reaches Google already contains
 * the correct Dutch / Indonesian text.
 *
 * Usage (inside any Server Component or page.tsx):
 *   import { getT, translateObject } from "@/lib/serverTranslate";
 *
 *   // Static dictionary key:
 *   const text = getT("hero", "titleLine1", locale);   // → "Bouw de Toekomst"
 *
 *   // Dynamic API data:
 *   const translated = await translateObject(locale, {
 *     title: "Our Services",
 *     desc:  "We build digital products",
 *   });
 * ─────────────────────────────────────────────────────────
 */

import { translations } from "@/lib/translations";

type Locale = "en" | "nl" | "id";

// ─── 1. IN-MEMORY CACHE (per server instance) ────────────────────────────────
const translationCache = new Map<string, string>();

// ─── 2. STATIC DICTIONARY LOOKUP ─────────────────────────────────────────────

/**
 * Instantly returns a translated string from translations.ts
 * without any network call.
 */
export function getT(section: string, key: string, locale: string): string {
  const sec = translations as any;
  return sec?.[section]?.[key]?.[locale] ?? sec?.[section]?.[key]?.["en"] ?? key;
}

/**
 * Tries to find any English string inside translations.ts and
 * return its translation in `locale`.  Works for API-returned
 * strings that happen to match a dictionary entry.
 */
function lookupDictionary(text: string, locale: string): string | null {
  const normalized = text?.toLowerCase().trim();
  const sec = translations as any;

  for (const sectionKey in sec) {
    const section = sec[sectionKey];
    if (typeof section !== "object" || section === null) continue;

    for (const key in section) {
      const value = section[key];
      if (!value?.en) continue;

      if (value.en.toLowerCase().trim() === normalized) {
        const found = value[locale];
        if (found && found !== text) return found;
      }
    }
  }
  return null;
}

// ─── 3. GOOGLE TRANSLATE (SERVER-SIDE) ───────────────────────────────────────

/**
 * Calls Google's free translate endpoint from the server.
 * Never runs in the browser – this is a pure server utility.
 */
async function googleTranslate(text: string, locale: string): Promise<string> {
  if (!text || locale === "en") return text;

  const cacheKey = `${locale}:${text}`;
  if (translationCache.has(cacheKey)) return translationCache.get(cacheKey)!;

  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${locale}&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      // Cache in Next.js fetch cache for 1 hour
      next: { revalidate: 3600 },
    });

    if (!res.ok) return text;

    const data = await res.json();
    const translated: string = data?.[0]?.map((item: any) => item?.[0]).join("") || text;

    translationCache.set(cacheKey, translated);
    return translated;
  } catch {
    return text;
  }
}

// ─── 4. TRANSLATE A SINGLE STRING ────────────────────────────────────────────

/**
 * Translates a single string using:
 * 1. Memory cache
 * 2. Local dictionary lookup (instant, zero network)
 * 3. Google Translate fallback (server-only, cached 1 hr)
 */
export async function translateText(text: string, locale: string): Promise<string> {
  if (!text) return "";
  if (locale === "en") return text;

  // 1. Dictionary
  const dict = lookupDictionary(text, locale);
  if (dict) return dict;

  // 2. Google Translate (skip very long strings like blog content)
  if (text.length > 1000) return text;
  return googleTranslate(text, locale);
}

// ─── 5. TRANSLATE AN OBJECT ──────────────────────────────────────────────────

type TranslatableObject = Record<string, string | string[] | undefined | null>;

/**
 * Translates all string fields in an object at once (parallel).
 * Arrays of strings are also translated.
 *
 * @example
 * const result = await translateObject("nl", {
 *   title: "Our Services",
 *   desc:  "We build digital products",
 *   tags:  ["Web Design", "Mobile App"],
 * });
 */
export async function translateObject<T extends TranslatableObject>(
  locale: string,
  obj: T
): Promise<T> {
  if (locale === "en") return obj;

  const entries = Object.entries(obj);
  const translated = await Promise.all(
    entries.map(async ([key, value]) => {
      if (typeof value === "string") {
        return [key, await translateText(value, locale)];
      }
      if (Array.isArray(value)) {
        const arr = await Promise.all(
          value.map((v) => (typeof v === "string" ? translateText(v, locale) : v))
        );
        return [key, arr];
      }
      return [key, value];
    })
  );

  return Object.fromEntries(translated) as T;
}

/**
 * Translates an array of objects at once (parallel).
 *
 * @example
 * const services = await translateArray("nl", rawServices, ["title", "desc"]);
 */
export async function translateArray<T extends Record<string, any>>(
  locale: string,
  items: T[],
  fields: (keyof T)[]
): Promise<T[]> {
  if (locale === "en") return items;

  return Promise.all(
    items.map(async (item) => {
      const patch: Partial<T> = {};
      await Promise.all(
        fields.map(async (field) => {
          const val = item[field];
          if (typeof val === "string") {
            (patch as any)[field] = await translateText(val, locale);
          }
        })
      );
      return { ...item, ...patch };
    })
  );
}
