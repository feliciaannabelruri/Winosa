import dynamic from "next/dynamic";

const SectionHero = dynamic(() => import("@/components/sectionService/SectionHero"));
const SectionServices = dynamic(() => import("@/components/sectionService/SectionService"));
const SectionInfo = dynamic(() => import("@/components/sectionService/SectionInfo"));
const SectionPricing = dynamic(() => import("@/components/sectionService/SectionPricing"));
const SectionCTA = dynamic(() => import("@/components/layout/SectionCTA"));
const Footer = dynamic(() => import("@/components/layout/Footer"));

export const metadata = {
  title: "Services | Winosa Digital Agency",
  description:
    "Explore Winosa services including web development, mobile app development, UI UX design, and digital solutions for modern businesses.",
  openGraph: {
    title: "Services | Winosa Digital Agency",
    description:
      "Explore Winosa services including web development, mobile app development, UI UX design, and digital solutions for modern businesses.",
    images: ["/og-image.jpg"],
  },
};

export default function ServicesPage() {
  return (
    <main>
      <SectionHero />
      <SectionServices />
      <SectionInfo />
      <SectionPricing />
      <SectionCTA />
      <Footer />
    </main>
  );
}