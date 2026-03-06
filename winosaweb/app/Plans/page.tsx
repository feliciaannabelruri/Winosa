import Footer from "@/components/layout/Footer";
import SectionCTA from "@/components/layout/SectionCTA";

import SectionHero from "@/components/sectionPlans/SectionHero";
import SectionPricing from "@/components/sectionPlans/SectionPricing";
import SectionFeature from "@/components/sectionPlans/SectionFeature";
import SectionFAQ from "@/components/sectionPlans/SectionFAQ";

export default function SubscriptionPage() {
  return (
    <main className="bg-white">

      <SectionHero />
      <SectionPricing />
      <SectionFeature />
      <SectionFAQ />
      <SectionCTA />

      <Footer />
    </main>
  );
}
