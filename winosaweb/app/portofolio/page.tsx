import SectionPortoHero from "@/components/sectionsPorto/SectionPortoHero";
import SectionPortoCards from "@/components/sectionsPorto/SectionPortoCards";
import SectionBridge from "@/components/sectionsPorto/SectionBrige";
import SectionExplanation from "@/components/sectionsPorto/SectionExplanation";
import Footer from "@/components/layout/Footer";

import api from "@/lib/axios";

/* ================= SEO META TAGS ================= */

import { getSiteSettings } from '@/lib/getSiteSettings';

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

  try {
    const res = await api.get("/portfolio");
    portfolios = res.data.data;
  } catch (error) {
    console.log("Gagal fetch portfolio");
  }

  return (
    <main>
      <SectionPortoHero />
      <SectionPortoCards data={portfolios} />
      <SectionBridge />
      <SectionExplanation />
      <Footer />
    </main>
  );
}