const cache = new Map<string, string>();

export async function autoTranslate(
  text: string,
  lang: string
) {
  if (!text) return "";

  const key = `${lang}-${text}`;

  if (cache.has(key)) {
    return cache.get(key)!;
  }

  try {
    const api = process.env.NEXT_PUBLIC_API_URL;

    const targetLang =
      lang === "nl-NL"
        ? "nl"
        : lang === "id-ID"
        ? "id"
        : lang;

    const res = await fetch(`${api}/translate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        text,
        target: targetLang,
      }),
    });

    const data = await res.json();

    const translated =
      data.translatedText || text;

    cache.set(key, translated);

    return translated;

  } catch (err) {
    console.error("Translate failed:", err);
    return text;
  }
}