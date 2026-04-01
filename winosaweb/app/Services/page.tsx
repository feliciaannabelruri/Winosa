import dynamic from "next/dynamic";
import { getAllServices } from "@/services/service.service";

/* ===============================
   Code Splitting (Dynamic Import)
================================ */

const SectionHero = dynamic(() =>
  import("@/components/sectionService/SectionHero")
);

const SectionServices = dynamic(() =>
  import("@/components/sectionService/SectionService")
);

const SectionInfo = dynamic(() =>
  import("@/components/sectionService/SectionInfo")
);

// SECTION PLAN + SMART RECOMMEND (gabungan)
const SectionPlanWithRecommend = dynamic(() =>
  import("@/components/sectionService/SectionPlanWithRecommend")
);

const SectionCTA = dynamic(() =>
  import("@/components/layout/SectionCTA")
);

const Footer = dynamic(() =>
  import("@/components/layout/Footer")
);

/* FETCH DI SERVER */
async function getServicesData() {
  try {
    const data = await getAllServices("en"); // default dulu
    return data || [];
  } catch (err) {
    console.error(err);
    return [];
  }
}

/* ===============================
   SEO META TAGS
================================ */

import { getSiteSettings } from '@/lib/getSiteSettings';

export async function generateMetadata() {
  const s = await getSiteSettings();
  return {
    title: s?.metaTitle ? `Services | ${s.metaTitle}` : 'Services | Winosa Digital Agency',
    description: s?.metaDescription || 'Explore our web development and digital services.',
    openGraph: {
      title: s?.metaTitle || 'Services | Winosa Digital Agency',
      description: s?.metaDescription || '',
      images: [s?.logo || '/og-image.jpg'],
    },
  };
}


/* ===============================
   PAGE
================================ */

export default async function ServicesPage() {
  const services = await getServicesData();

  console.log("SERVICES:", services); // optional debug

  return (
    <main aria-label="Winosa services page">

      <SectionHero />

      <SectionServices initialServices={services} />

      <SectionInfo />

      <SectionPlanWithRecommend />

      <SectionCTA />

      <Footer />

    </main>
  );
}