import Footer from "@/components/layout/Footer";

import SectionContactForm from "@/components/sectionContact/SectionContactForm";
import SectionCompanyInfo from "@/components/sectionContact/SectionFAQ";
import SectionMap from "@/components/sectionContact/SectionMap";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with our team for inquiries, collaborations, or support.",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Contact Us",
    description:
      "Reach out to our team for any questions, support, or partnerships.",
    url: "/contact",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us",
    description:
      "Reach out to our team for any questions, support, or partnerships.",
  },
};

export default function ContactPage() {
  return (
    <main aria-label="Contact page content">

      <SectionContactForm />

      {/* MAP DI TENGAH */}
      <SectionMap />

      {/* COMPANY INFO DI BAWAH */}
      <SectionCompanyInfo />

      <Footer />

    </main>
  );
}