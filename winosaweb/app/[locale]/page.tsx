import dynamic from "next/dynamic";

export const revalidate = 60;
import { getSiteSettings } from '@/lib/getSiteSettings';

export async function generateMetadata() {
  const s = await getSiteSettings();
  return {
    title: s?.metaTitle || s?.siteName || 'Winosa Digital Agency',
    description: s?.metaDescription || s?.siteTagline || '',
    openGraph: {
      title: s?.metaTitle || 'Winosa Digital Agency',
      description: s?.metaDescription || '',
      images: [s?.logo || '/og-image.jpg'],
    },
  };
}

/* ===============================
   Dynamic Imports (Code Splitting)
================================ */

const SectionHero = dynamic(() => import("@/components/sectionsHomepage/SectionHero"));
const SectionMap = dynamic(() => import("@/components/sectionsHomepage/SectionMap"));
const SectionGlass = dynamic(() => import("@/components/sectionsHomepage/SectionGlass"));
const SectionPreview = dynamic(() => import("@/components/sectionsHomepage/SectionPreview"));
const SectionMissionVision = dynamic(() => import("@/components/sectionsHomepage/SectionMissionVision"));
const SectionTeam = dynamic(() => import("@/components/sectionsHomepage/SectionTeam"));

const SectionCTA = dynamic(() => import("@/components/layout/SectionCTA"));
const Footer = dynamic(() => import("@/components/layout/Footer"));


// HOMEPAGE //

export default async function HomePage() {

  let services: any[] = [];
  let portfolios: any[] = [];
  let blogs: any[] = [];
  let glassData: any = null;

  // SERVICE //

  try {
    const servicesRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services`, { cache: "no-store" });
    const sData = await servicesRes.json();

    services = (sData?.data || []).map((item: any) => ({
      id: item._id,
      title: item.title,
      desc: item.description,
      icon: item.icon,
      slug: `/services/${item.slug}`,
    }));
  } catch (error) {
  }

  // PORTO //

  try {
    const portfolioRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/portfolio`, { cache: "no-store" });
    const pData = await portfolioRes.json();

    portfolios = (pData?.data || []).slice(0, 3).map((item: any) => ({
      id: item._id,
      title: item.title,
      desc: item.description,
      image: item.thumbnail || item.image,
      slug: `/portofolio/${item.slug}`,
    }));
  } catch (error) {
    console.error("Portfolio API error:", error);
  }

  // BLOG //

  try {
    const blogRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog`, { cache: "no-store" });
    const bData = await blogRes.json();

    blogs = (bData?.data || []).slice(0, 3).map((item: any) => ({
      id: item._id,
      title: item.title,
      desc: item.excerpt || item.description,
      image: item.image || item.thumbnail,
      slug: `/Blog/${item.slug}`,
    }));
  } catch (error) {
    console.error("Blog API error:", error);
  }

  // GLASS //

  try {
    const glassRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/content/glass`, { cache: "no-store" });
    const gData = await glassRes.json();
    glassData = gData?.data || null;
  } catch (error) {
    console.log("Glass endpoint tidak ditemukan");
  }

  // PAGE //

  return (
    <main aria-label="Winosa Digital Agency homepage">

      <SectionHero />

      <SectionMap />

      <SectionGlass data={glassData} />

      <SectionPreview
        title="Our Services"
        items={services}
      />

      <SectionPreview
        title="Our Portfolio"
        items={portfolios}
      />

      <SectionPreview
        title="Latest Blog"
        items={blogs}
      />

      <SectionMissionVision />

      <SectionTeam />

      <SectionCTA />

      <Footer />

    </main>
  );
}