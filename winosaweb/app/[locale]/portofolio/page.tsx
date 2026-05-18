import SectionPortoHero from "@/components/sectionsPorto/SectionPortoHero";
import SectionPortoCards from "@/components/sectionsPorto/SectionPortoCards";
import SectionBridge from "@/components/sectionsPorto/SectionBrige";
import SectionExplanation from "@/components/sectionsPorto/SectionExplanation";
import Footer from "@/components/layout/Footer";
import { getSiteSettings } from "@/lib/getSiteSettings";
import { translateArray, translateObject } from "@/lib/serverTranslate";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ locale: string }> };

const PORTFOLIO_SYSTEM_SLUGS = ["hero-portfolio", "explanation-portfolio", "bridge-portfolio"];

async function getHeroData() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/portfolio/hero-portfolio`, { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    if (!json.data?.description) return null;
    return JSON.parse(json.data.description);
  } catch { return null; }
}

async function getBridgeData() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/portfolio/bridge-portfolio`, { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    if (!json.data?.description) return null;
    return JSON.parse(json.data.description);
  } catch { return null; }
}

async function getExplanationData() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/portfolio/explanation-portfolio`, { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    if (!json.data?.description) return null;
    return JSON.parse(json.data.description);
  } catch { return null; }
}

export async function generateMetadata({ params }: Params) {
  const { locale } = await params;
  const s = await getSiteSettings();
  const titles: Record<string, string> = {
    en: `Portfolio | ${s?.metaTitle || "Winosa Digital Agency"}`,
    nl: `Portfolio | ${s?.metaTitle || "Winosa Digital Agency"}`,
    id: `Portofolio | ${s?.metaTitle || "Winosa Digital Agency"}`,
  };
  const descs: Record<string, string> = {
    en: "Explore our portfolio of web and mobile projects.",
    nl: "Bekijk ons portfolio van web- en mobiele projecten.",
    id: "Jelajahi portofolio proyek web dan mobile kami.",
  };
  return {
    title: titles[locale] ?? titles.en,
    description: s?.metaDescription || descs[locale] || descs.en,
    alternates: {
      canonical: `/${locale}/portofolio`,
      languages: { en: "/en/portofolio", nl: "/nl/portofolio", id: "/id/portofolio" },
    },
    openGraph: {
      title: titles[locale] ?? titles.en,
      description: s?.metaDescription || "",
      images: [s?.logo || "/og-image.jpg"],
    },
  };
}

export default async function PortfolioPage({ params }: Params) {
  const { locale } = await params;

  const [heroData, bridgeData, explanationData] = await Promise.all([
    getHeroData(),
    getBridgeData(),
    getExplanationData(),
  ]);

  let portfolios: any[] = [];
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/portfolio?limit=100`, { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      portfolios = (json?.data ?? []).filter(
        (p: any) => !PORTFOLIO_SYSTEM_SLUGS.includes(p.slug)
      );
    }
  } catch {}

  // ✅ Translate all portfolio cards + section content server-side
  const [translatedPortfolios, translatedHero, translatedBridge, translatedExplanation] = await Promise.all([
    translateArray<any>(locale, portfolios, ["title", "description"]),
    heroData        && locale !== "en" ? translateObject(locale, heroData)        : heroData,
    bridgeData      && locale !== "en" ? translateObject(locale, bridgeData)      : bridgeData,
    explanationData && locale !== "en" ? translateObject(locale, explanationData) : explanationData,
  ]);

  return (
    <main>
      <SectionPortoHero heroData={translatedHero} />
      <SectionPortoCards data={translatedPortfolios} />
      <SectionBridge bridgeData={translatedBridge} />
      <SectionExplanation explanationData={translatedExplanation} />
      <Footer />
    </main>
  );
}