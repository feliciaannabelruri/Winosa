import { NextResponse } from "next/server"; // ✅ WAJIB

export async function POST(req: Request) {
  try {
    // ✅ AMBIL DATA DARI FRONTEND
    const { text, target } = await req.json();

    const res = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${target}&dt=t&q=${encodeURIComponent(text)}`
    );

    const data = await res.json();

    const translated =
      data[0]?.map((item: any) => item[0]).join("") || text;

    return NextResponse.json({
      translated,
    });

  } catch (error) {
    console.error("❌ API ERROR:", error);

    // ✅ FIX DI SINI JUGA
    return NextResponse.json({
      translated: "", // atau bisa text kalau mau fallback
    });
  }
}