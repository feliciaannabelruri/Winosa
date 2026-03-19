import dynamic from "next/dynamic";

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


/* ===============================
   SEO META TAGS
================================ */

export const metadata = {
  title: "Services | Winosa Digital Agency",

  description:
    "Explore Winosa services including web development, mobile app development, UI UX design, and digital solutions for modern businesses.",

  keywords: [
    "web development service",
    "mobile app development",
    "UI UX design agency",
    "digital agency services",
    "custom software development",
  ],

  openGraph: {
    title: "Services | Winosa Digital Agency",
    description:
      "Explore Winosa services including web development, mobile app development, UI UX design, and digital solutions for modern businesses.",
    images: ["/og-image.jpg"],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Services | Winosa Digital Agency",
    description:
      "Explore Winosa services including web development, mobile app development, UI UX design, and digital solutions for modern businesses.",
    images: ["/og-image.jpg"],
  },
};


/* ===============================
   PAGE
================================ */

export default function ServicesPage() {
  return (

    <main aria-label="Winosa services page">

      <SectionHero />

      <SectionServices />

      <SectionInfo />

      {/* SMART RECOMMEND + PLAN */}
      <SectionPlanWithRecommend />

      <SectionCTA />

      <Footer />

    </main>

  );
}