import { getSiteSettings } from "@/lib/getSiteSettings";
import { ReactNode } from "react";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const s = await getSiteSettings();
  const { locale } = await params;
  const currentLocale = locale || "en";

  const titles: Record<string, string> = {
    en: "About Us",
    nl: "Over Ons",
    id: "Tentang Kami",
  };

  const currentTitle = titles[currentLocale] || titles.en;

  return {
    title: s?.metaTitle ? `${currentTitle} | ${s.metaTitle}` : `${currentTitle} | Winosa Digital Agency`,
    description:
      s?.metaDescription ||
      "Learn about Winosa Mitra Bharatajaya — our story, team, mission, and vision.",
    openGraph: {
      title: s?.metaTitle ? `${currentTitle} | ${s.metaTitle}` : `${currentTitle} | Winosa`,
      description: s?.metaDescription || "Developers, designers, strategists from Bandar Lampung.",
      images: [s?.logo || "/og-image.jpg"],
    },
  };
}

export default function AboutLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
