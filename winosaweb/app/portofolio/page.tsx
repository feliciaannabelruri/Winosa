import SectionPortoHero from "@/components/sectionsPorto/SectionPortoHero";
import SectionPortoCards from "@/components/sectionsPorto/SectionPortoCards";
import SectionBridge from "@/components/sectionsPorto/SectionBrige";
import SectionExplanation from "@/components/sectionsPorto/SectionExplanation";
import Footer from "@/components/layout/Footer";

import api from "@/lib/axios";

/* ================= SEO META TAGS ================= */

export const metadata = {
  title: "Portfolio | Winosa Digital Agency",
  description:
    "Explore Winosa portfolio showcasing web development, mobile app development, and UI UX design projects for modern businesses.",

  keywords: [
    "portfolio web development",
    "ui ux portfolio",
    "mobile app portfolio",
    "digital agency projects",
    "winosa portfolio",
  ],

  openGraph: {
    title: "Portfolio | Winosa Digital Agency",
    description:
      "Explore Winosa portfolio showcasing web development, mobile app development, and UI UX design projects.",
    url: "https://winosa.com/portofolio",
    siteName: "Winosa Digital Agency",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Winosa Portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Portfolio | Winosa Digital Agency",
    description:
      "Explore Winosa portfolio showcasing web development, mobile app development, and UI UX design projects.",
    images: ["/og-image.jpg"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

/* ================= PAGE ================= */

export default async function PortfolioPage() {
  let portfolios = [];

  try {
    const res = await api.get("/portfolio");
    portfolios = res.data.data;
  } catch (error) {
    console.log("Gagal fetch portfolio");
  }

  return (
    <main>
      <SectionPortoHero />
      <SectionPortoCards data={portfolios} />
      <SectionBridge />
      <SectionExplanation />
      <Footer />
    </main>
  );
}