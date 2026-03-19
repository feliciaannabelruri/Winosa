import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const text: string = body.text?.trim();
    const target: string = body.target || "id";
    const source: string = body.source || "auto";

    // VALIDATION
    if (!text) {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }

    if (text.length > 5000) {
      return NextResponse.json(
        { error: "Text too long (max 5000 chars)" },
        { status: 400 }
      );
    }

    // API CALL
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${source}&tl=${target}&dt=t&q=${encodeURIComponent(
      text
    )}`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
      cache: "no-store", 
    });

    if (!res.ok) {
      throw new Error(`Google API error: ${res.status}`);
    }

    const data = await res.json();

    const translated =
      data?.[0]?.map((item: any) => item?.[0]).join("") || text;

    return NextResponse.json({
      success: true,
      translated,
      source,
      target,
    });

  } catch (error: any) {
    console.error("❌ TRANSLATE API ERROR:", error.message);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to translate text",
        translated: "",
      },
      { status: 500 }
    );
  }
}