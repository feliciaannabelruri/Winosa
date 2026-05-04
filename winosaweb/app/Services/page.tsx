import dynamic from "next/dynamic";
import { getAllServices } from "@/services/service.service";

const SectionHero = dynamic(() =>
  import("@/components/sectionService/SectionHero")
);

const SectionServices = dynamic(() =>
  import("@/components/sectionService/SectionService")
);

const SectionInfo = dynamic(() =>
  import("@/components/sectionService/SectionInfo")
);

const SectionServiceRecommend = dynamic(() =>
  import("@/components/sectionService/SectionServiceRecommend")
);

const SectionMaintenancePlans = dynamic(() =>
  import("@/components/sectionService/SectionMaintenancePlans")
);

const Footer = dynamic(() =>
  import("@/components/layout/Footer")
);

async function getServicesData() {
  try {
    const data = await getAllServices("en");
    return data || [];
  } catch (err) {
    console.error(err);
    return [];
  }
}

// SEO //

import { getSiteSettings } from "@/lib/getSiteSettings";

export async function generateMetadata() {
  const s = await getSiteSettings();
  return {
    title: s?.metaTitle
      ? `Services | ${s.metaTitle}`
      : "Services | Winosa Digital Agency",
    description:
      s?.metaDescription ||
      "Layanan pengembangan web, mobile, dan desain UI/UX profesional dari Winosa.",
    keywords:
      "web development, mobile app, ui ux design, it consulting, winosa, lampung",
    openGraph: {
      title: s?.metaTitle || "Services | Winosa Digital Agency",
      description: s?.metaDescription || "",
      images: [s?.logo || "/og-image.jpg"],
    },
  };
}

// PAGE //

export default async function ServicesPage() {
  const services = await getServicesData();

  return (
    <main aria-label="Winosa services page">

      <SectionHero />

      <SectionServices initialServices={services} />

      <SectionInfo services={services} />

      <SectionServiceRecommend />

      <SectionMaintenancePlans />

      <Footer />

    </main>
  );
}