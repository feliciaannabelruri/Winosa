import { autoTranslate } from "@/lib/autoTranslateHelper";

export async function translateHybrid(
  text: string,
  lang: string,
  tApi: (val: string) => string
) {
  console.log("🔍 translateHybrid:", text, "->", lang);

  if (!text) return "";

  const manual = tApi(text);

  console.log("📘 manual result:", manual);

  if (manual !== text) {
    console.log("✅ pakai dictionary");
    return manual;
  }

  console.log("🌐 pakai auto translate");

  return await autoTranslate(text, lang);
}