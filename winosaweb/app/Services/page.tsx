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

async function getInfoSection() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/services/info-section`,
      { cache: "no-store" }
    );
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? null;
  } catch {
    return null;
  }
}

async function getHeroSection() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/services/hero-services`,
      { cache: "no-store" }
    );
    if (!res.ok) return null;
    const json = await res.json();
    if (!json.data?.description) return null;
    return JSON.parse(json.data.description);
  } catch {
    return null;
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
  const [services, infoSection, heroData] = await Promise.all([
    getServicesData(),
    getInfoSection(),
    getHeroSection(),
  ]);

  const servicesForInfo = infoSection ? [...services, infoSection] : services;

  return (
    <main aria-label="Winosa services page">

      <SectionHero heroData={heroData} />

      <SectionServices initialServices={services} />

      <SectionInfo services={servicesForInfo} />

      <SectionServiceRecommend />

      <SectionMaintenancePlans />

      <Footer />

    </main>
  );
}