
export async function autoTranslate(
  text: string,
  lang: string
) {
  if (!text) return "";

  const key = `${lang}-${text}`;

  try {
    const targetLang =
      lang === "nl-NL"
        ? "nl"
        : lang === "id-ID"
        ? "id"
        : lang;

    // Use internal Next.js API route
    const res = await fetch(`/api/translate`, {
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

    // The internal API returns `translated`, while some backends return `translatedText`
    const translated =
      data.translated || data.translatedText || text;

    return translated;

  } catch (err) {
    console.error("Translate failed:", err);
    return text;
  }
}