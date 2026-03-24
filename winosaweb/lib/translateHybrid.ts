import { autoTranslate } from "@/lib/autoTranslateHelper";

const cache = new Map<string, string>();

export async function translateHybrid(
  text: string,
  lang: string,
  tApi: (val: string) => string
) {
  if (!text) return "";

  //  jangan translate kalau bahasa default
  if (lang === "en") return text;

  const cacheKey = `${lang}:${text}`;

  //  ambil dari cache
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)!;
  }

  const manual = tApi(text);

  if (manual && manual !== text) {
    cache.set(cacheKey, manual);
    return manual;
  }

  try {
    const result = await autoTranslate(text, lang);

    // simpan ke cache biar gak spam API
    cache.set(cacheKey, result);

    return result;
  } catch (err) {
    console.error("translate error:", err);
    return text; // fallback aman
  }
}