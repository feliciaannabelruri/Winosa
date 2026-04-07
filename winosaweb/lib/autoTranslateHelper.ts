export async function autoTranslate(text: string, lang: string) {
  console.log("🚀 autoTranslate CALL:", text, "->", lang);

  if (!text) return "";

  if (lang === "en") {
    
    return text;
  }

  try {
    const res = await fetch("/api/translate", {
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

    

    return data.translated || text;

  } catch (err) {
    
    return text;
  }
}