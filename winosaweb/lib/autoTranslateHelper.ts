export async function autoTranslate(text: string, lang: string) {
  console.log("autoTranslate CALL:", text, "->", lang);

  if (!text) return "";

  try {
    const api = process.env.NEXT_PUBLIC_API_URL;

    const res = await fetch(`${api}/translate`,  {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        target: lang,
      }),
    });

    const data = await res.json();

    return data.translatedText || text;

  } catch (err) {
    console.error("Translate failed:", err);
    return text;
  }
}