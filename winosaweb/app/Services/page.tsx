import Footer from "@/components/layout/Footer";

import SectionHero from "@/components/sectionService/SectionHero";
import SectionServices from "@/components/sectionService/SectionService";
import SectionInfo from "@/components/sectionService/SectionInfo";
import SectionPricing from "@/components/sectionService/SectionPricing";
import SectionCTA from "@/components/layout/SectionCTA";

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
