import dynamic from "next/dynamic";
import { getSiteSettings } from '@/lib/getSiteSettings';
import { getT, translateArray } from "@/lib/serverTranslate";

export const revalidate = 60;

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params) {
  const { locale } = await params;
  const s = await getSiteSettings();
  return {
    title: s?.metaTitle || s?.siteName || 'Winosa Digital Agency',
    description: s?.metaDescription || s?.siteTagline || '',
    openGraph: {
      title: s?.metaTitle || 'Winosa Digital Agency',
      description: s?.metaDescription || '',
      images: [s?.logo || '/og-image.jpg'],
    },
    alternates: {
      canonical: `/${locale}`,
      languages: { en: '/en', nl: '/nl', id: '/id' },
    },
  };
}

/* ─── Dynamic Imports ──────────────────────────────────────────────── */
const SectionHero          = dynamic(() => import("@/components/sectionsHomepage/SectionHero"));
const SectionMap           = dynamic(() => import("@/components/sectionsHomepage/SectionMap"));
const SectionGlass         = dynamic(() => import("@/components/sectionsHomepage/SectionGlass"));
const SectionPreview       = dynamic(() => import("@/components/sectionsHomepage/SectionPreview"));
const SectionMissionVision = dynamic(() => import("@/components/sectionsHomepage/SectionMissionVision"));
const SectionTeam          = dynamic(() => import("@/components/sectionsHomepage/SectionTeam"));
const SectionCTA           = dynamic(() => import("@/components/layout/SectionCTA"));
const Footer               = dynamic(() => import("@/components/layout/Footer"));

/* ─── Page ─────────────────────────────────────────────────────────── */
export default async function HomePage({ params }: Params) {
  const { locale } = await params;

  let services:   any[] = [];
  let portfolios: any[] = [];
  let blogs:      any[] = [];
  let glassData:  any   = null;

  const api = process.env.NEXT_PUBLIC_API_URL;

  // SERVICES
  try {
    const res  = await fetch(`${api}/services`, { cache: "no-store" });
    const data = await res.json();
    const raw  = (data?.data || []).map((item: any) => ({
      id:    item._id,
      title: item.title,
      desc:  item.description,
      icon:  item.icon,
      slug:  `/Services/${item.slug}`,
    }));
    // ✅ Server-side translate – no flicker on client
    services = await translateArray<any>(locale, raw, ["title", "desc"]);
  } catch {}

  // PORTFOLIO
  try {
    const res  = await fetch(`${api}/portfolio`, { cache: "no-store" });
    const data = await res.json();
    const raw  = (data?.data || []).slice(0, 3).map((item: any) => ({
      id:    item._id,
      title: item.title,
      desc:  item.description,
      image: item.thumbnail || item.image,
      slug:  `/portofolio/${item.slug}`,
    }));
    portfolios = await translateArray<any>(locale, raw, ["title", "desc"]);
  } catch {}

  // BLOG
  try {
    const res  = await fetch(`${api}/blog`, { cache: "no-store" });
    const data = await res.json();
    const raw  = (data?.data || []).slice(0, 3).map((item: any) => ({
      id:    item._id,
      title: item.title,
      desc:  item.excerpt || item.description,
      image: item.image || item.thumbnail,
      slug:  `/Blog/${item.slug}`,
    }));
    blogs = await translateArray<any>(locale, raw, ["title", "desc"]);
  } catch {}

  // GLASS
  try {
    const res  = await fetch(`${api}/content/glass`, { cache: "no-store" });
    const data = await res.json();
    glassData  = data?.data || null;
  } catch {}

  // Pre-translated section titles from dictionary (instant, zero network)
  const servicesTitle  = getT("preview", "services",  locale);
  const portfolioTitle = getT("preview", "portfolio", locale);
  const blogTitle      = getT("preview", "blog",      locale);

  return (
    <main aria-label="Winosa Digital Agency homepage">

      <SectionHero />

      <SectionMap />

      <SectionGlass data={glassData} />

      <SectionPreview
        title={servicesTitle}
        items={services}
      />

      <SectionPreview
        title={portfolioTitle}
        items={portfolios}
      />

      <SectionPreview
        title={blogTitle}
        items={blogs}
      />

      <SectionMissionVision />

      <SectionTeam />

      <SectionCTA />

      <Footer />

    </main>
  );
}