import { autoTranslate } from "@/lib/autoTranslate";
import { translations } from "@/lib/translations";

const cache = new Map<string, string>();
let lastRequest = 0;

function normalize(text: string) {
  return text?.toLowerCase().trim();
}

/**
 * Hybrid Translation
 * 1. Checks memory cache
 * 2. Checks local dictionary (automatic, no tApi needed anymore)
 * 3. Fallback to Auto-Translate (AI/Google)
 */
export async function translateHybrid(
  text: string,
  lang: string,
  _tApi?: any // kept for backwards compatibility in components, but not used
) {
  if (!text) return "";

  const cacheKey = `${lang}:${text}`;

  // 1. Memory Cache lookup
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)!;
  }

  // 2. Local Dictionary lookup (Instant)
  const normalizedText = normalize(text);
  const sec: any = translations;
  
  for (const sectionKey in sec) {
    const section = sec[sectionKey];
    if (typeof section !== "object") continue;

    for (const key in section) {
      const value = section[key];
      if (!value?.en) continue;

      if (normalize(value.en) === normalizedText) {
        const manual = value[lang] || value.en;
        if (manual && manual !== text) {
          cache.set(cacheKey, manual);
          return manual;
        }
      }
    }
  }

  // 3. Fallback to Auto-Translate
  if (text.length > 500) {
    return text;
  }

  try {
    const now = Date.now();
    const diff = now - lastRequest;

    // Minimum 500ms between AI requests
    if (diff < 500) {
      await new Promise((resolve) => setTimeout(resolve, 500 - diff));
    }

    lastRequest = Date.now();
    const result = await autoTranslate(text, lang);
    
    if (result && result !== text) {
      cache.set(cacheKey, result);
      return result;
    }
    return text;

  } catch (err) {
    console.error("translate error:", err);
    return text;
  }
}
