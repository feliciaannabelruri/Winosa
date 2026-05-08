import { autoTranslate }
from "@/lib/autoTranslate";

const cache =
  new Map<string, string>();

let lastRequest = 0;

export async function translateHybrid(
  text: string,
  lang: string,
  tApi?: (val: string) => string
) {

  if (!text) return "";

  // skip default language
  if (
    lang === "id" ||
    lang === "id-ID"
  ) {
    return text;
  }

  // skip long text
  if (text.length > 500) {
    return text;
  }

  const cacheKey =
    `${lang}:${text}`;

  // cache
  if (cache.has(cacheKey)) {

    return cache.get(
      cacheKey
    )!;

  }

  // manual
  if (tApi) {

    const manual =
      tApi(text);

    if (
      manual &&
      manual !== text
    ) {

      cache.set(
        cacheKey,
        manual
      );

      return manual;

    }

  }

  try {

    // HARD RATE LIMIT
    const now = Date.now();

    const diff =
      now - lastRequest;

    if (diff < 1000) {

      await new Promise(
        (resolve) =>
          setTimeout(
            resolve,
            1000 - diff
          )
      );

    }

    lastRequest = Date.now();

    const result =
      await autoTranslate(
        text,
        lang
      );

    cache.set(
      cacheKey,
      result
    );

    return result;

  } catch (err) {

    console.error(
      "translate error:",
      err
    );

    return text;

  }

}
