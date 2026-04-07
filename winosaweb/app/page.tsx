import dynamic from "next/dynamic";
import api from "@/lib/axios";

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


/* ===============================
   HOMEPAGE
================================ */

export default async function HomePage() {

  let services: any[] = [];
  let portfolios: any[] = [];
  let blogs: any[] = [];
  let glassData: any = null;

  /* ===============================
     SERVICES
  ================================ */

  try {
    const servicesRes = await api.get("/services");

    services = servicesRes.data.data.map((item: any) => ({
      id: item._id,
      title: item.title,
      desc: item.description,
      icon: item.icon,
      slug: `/services/${item.slug}`,
    }));
  } catch (error) {
  }

  /* ===============================
     PORTFOLIO
  ================================ */

  try {
    const portfolioRes = await api.get("/portfolio");

    portfolios = portfolioRes.data.data.slice(0, 3).map((item: any) => ({
      id: item._id,
      title: item.title,
      desc: item.description,
      image: item.thumbnail || item.image,
      slug: `/portfolio/${item.slug}`,
    }));
  } catch (error) {
    console.error("Portfolio API error:", error);
  }

  /* ===============================
     BLOG
  ================================ */

  try {
    const blogRes = await api.get("/blog");

    blogs = blogRes.data.data.slice(0, 3).map((item: any) => ({
      id: item._id,
      title: item.title,
      desc: item.excerpt || item.description,
      image: item.image || item.thumbnail,
      slug: `/blog/${item.slug}`,
    }));
  } catch (error) {
    console.error("Blog API error:", error);
  }

  /* ===============================
     GLASS CONTENT
  ================================ */

  try {
    const glassRes = await api.get("/content/glass");
    glassData = glassRes.data.data;
  } catch (error) {
    console.log("Glass endpoint tidak ditemukan");
  }

  /* ===============================
     PAGE
  ================================ */

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

      {/* Mission Vision */}
      <SectionMissionVision />

      {/* Team */}
      <SectionTeam />

      <SectionCTA />

      <Footer />

    </main>
  );
}