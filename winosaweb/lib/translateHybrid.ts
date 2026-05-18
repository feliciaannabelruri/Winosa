import { autoTranslate } from "@/lib/autoTranslate";

const cache = new Map<string, string>();
let lastRequest = 0;

/**
 * Hybrid Translation
 * 1. Checks memory cache
 * 2. Checks local dictionary (via tApi)
 * 3. Fallback to Auto-Translate (AI/Google)
 */
export async function translateHybrid(
  text: string,
  lang: string,
  tApi?: (val: string) => string
) {
  if (!text) return "";

  const cacheKey = `${lang}:${text}`;

  // 1. Memory Cache lookup
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)!;
  }

  // 2. Local Dictionary lookup (Instant)
  if (tApi) {
    const manual = tApi(text);
    // If tApi found a match in the local dictionary, it returns a different string
    if (manual && manual !== text) {
      cache.set(cacheKey, manual);
      return manual;
    }
  }

  // 3. Skip auto-translate for Indonesian if we assume source is ID 
  // (Or if text is too short/long)
  if (lang === "id" || lang === "id-ID") {
    return text;
  }

  if (text.length > 500) {
    return text;
  }

  // 4. Auto-Translate (with Rate Limiting)
  try {
    const now = Date.now();
    const diff = now - lastRequest;

    // Minimum 500ms between AI requests to avoid burning credits/hitting limits
    if (diff < 500) {
      await new Promise((resolve) => setTimeout(resolve, 500 - diff));
    }

    lastRequest = Date.now();
    const result = await autoTranslate(text, lang);
    
    if (result) {
      cache.set(cacheKey, result);
      return result;
    }
    return text;

  } catch (err) {
    console.error("translate error:", err);
    return text;
  }
}
