import SectionPortoHero from "@/components/sectionsPorto/SectionPortoHero";
import SectionPortoCards from "@/components/sectionsPorto/SectionPortoCards";
import SectionBridge from "@/components/sectionsPorto/SectionBrige";
import SectionExplanation from "@/components/sectionsPorto/SectionExplanation";
import Footer from "@/components/layout/Footer";

/* ================= SEO META TAGS ================= */

import { getSiteSettings } from '@/lib/getSiteSettings';

export const dynamic = 'force-dynamic';

const PORTFOLIO_SYSTEM_SLUGS = ['hero-portfolio', 'explanation-portfolio', 'bridge-portfolio'];

async function getHeroData() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/portfolio/hero-portfolio`,
      { cache: 'no-store' }
    );
    if (!res.ok) return null;
    const json = await res.json();
    if (!json.data?.description) return null;
    return JSON.parse(json.data.description);
  } catch { return null; }
}

async function getBridgeData() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/portfolio/bridge-portfolio`,
      { cache: 'no-store' }
    );
    if (!res.ok) return null;
    const json = await res.json();
    if (!json.data?.description) return null;
    return JSON.parse(json.data.description);
  } catch { return null; }
}

async function getExplanationData() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/portfolio/explanation-portfolio`,
      { cache: 'no-store' }
    );
    if (!res.ok) return null;
    const json = await res.json();
    if (!json.data?.description) return null;
    return JSON.parse(json.data.description);
  } catch { return null; }
}

export async function generateMetadata() {
  const s = await getSiteSettings();
  return {
    title: s?.metaTitle ? `Portfolio | ${s.metaTitle}` : 'Portfolio | Winosa Digital Agency',
    description: s?.metaDescription || 'Explore our portfolio of web and mobile projects.',
    openGraph: {
      title: s?.metaTitle || 'Portfolio | Winosa Digital Agency',
      description: s?.metaDescription || '',
      images: [s?.logo || '/og-image.jpg'],
    },
  };
}

/* ================= PAGE ================= */

export default async function PortfolioPage() {
  let portfolios = [];

  const [heroData, bridgeData, explanationData] = await Promise.all([
    getHeroData(),
    getBridgeData(),
    getExplanationData(),
  ]);

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/portfolio?limit=100`,
      { cache: "no-store" }
    );
    if (res.ok) {
      const json = await res.json();
      const allPortfolios = json?.data ?? [];
      portfolios = allPortfolios.filter(
        (p: any) => !PORTFOLIO_SYSTEM_SLUGS.includes(p.slug)
      );
    }
  } catch (error) {
    console.error("Portfolio fetch error:", error);
  }

  return (
    <main>
      <SectionPortoHero heroData={heroData} />
      <SectionPortoCards data={portfolios} />
      <SectionBridge bridgeData={bridgeData} />
      <SectionExplanation explanationData={explanationData} />
      <Footer />
    </main>
  );
}