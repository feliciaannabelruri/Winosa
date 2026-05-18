import dynamic from "next/dynamic";
import { getSiteSettings } from "@/lib/getSiteSettings";
import { translateArray, translateObject } from "@/lib/serverTranslate";

export const revalidate = 60;

type Params = { params: Promise<{ locale: string }> };

const SectionHero             = dynamic(() => import("@/components/sectionService/SectionHero"));
const SectionServices         = dynamic(() => import("@/components/sectionService/SectionService"));
const SectionInfo             = dynamic(() => import("@/components/sectionService/SectionInfo"));
const SectionServiceRecommend = dynamic(() => import("@/components/sectionService/SectionServiceRecommend"));
const SectionMaintenancePlans = dynamic(() => import("@/components/sectionService/SectionMaintenancePlans"));
const Footer                  = dynamic(() => import("@/components/layout/Footer"));

async function getServicesRaw() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services`, { cache: "no-store" });
    if (!res.ok) return [];
    const json = await res.json();
    return json?.data ?? [];
  } catch { return []; }
}

async function getInfoSection() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services/info-section`, { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? null;
  } catch { return null; }
}

async function getHeroSection() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services/hero-services`, { cache: "no-store" });
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
    en: `Services | ${s?.metaTitle || "Winosa Digital Agency"}`,
    nl: `Diensten | ${s?.metaTitle || "Winosa Digital Agency"}`,
    id: `Layanan | ${s?.metaTitle || "Winosa Digital Agency"}`,
  };
  return {
    title: titles[locale] ?? titles.en,
    description: s?.metaDescription || "Professional web, mobile, and UI/UX development from Winosa.",
    alternates: {
      canonical: `/${locale}/Services`,
      languages: { en: "/en/Services", nl: "/nl/Services", id: "/id/Services" },
    },
    openGraph: {
      title: titles[locale] ?? titles.en,
      description: s?.metaDescription || "",
      images: [s?.logo || "/og-image.jpg"],
    },
  };
}

export default async function ServicesPage({ params }: Params) {
  const { locale } = await params;

  const [rawServices, infoSection, heroData] = await Promise.all([
    getServicesRaw(),
    getInfoSection(),
    getHeroSection(),
  ]);

  // ✅ Translate service titles + descriptions at server
  const services = await translateArray<any>(locale, rawServices, ["title", "description", "desc"]);

  // Translate hero data if exists
  let translatedHero = heroData;
  if (heroData && locale !== "en") {
    translatedHero = await translateObject(locale, heroData);
  }

  const servicesForInfo = infoSection ? [...services, infoSection] : services;

  return (
    <main aria-label="Winosa services page">
      <SectionHero heroData={translatedHero} />
      <SectionServices initialServices={services} />
      <SectionInfo services={servicesForInfo} />
      <SectionServiceRecommend />
      <SectionMaintenancePlans />
      <Footer />
    </main>
  );
}