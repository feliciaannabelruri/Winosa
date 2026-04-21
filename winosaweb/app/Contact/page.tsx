import Footer from "@/components/layout/Footer";

import SectionContactForm from "@/components/sectionContact/SectionContactForm";
import SectionCompanyInfo from "@/components/sectionContact/SectionFAQ";
import SectionMap from "@/components/sectionContact/SectionMap";

import { getSiteSettings } from '@/lib/getSiteSettings';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const s = await getSiteSettings();
  return {
    title: 'Winosa',
    description: s?.metaDescription || 'Get in touch with our team.',
    openGraph: {
      title: s?.metaTitle || 'Contact Us',
      description: s?.metaDescription || '',
    },
  };
}

export default function ContactPage() {
  return (
    <main aria-label="Contact page content">

      <SectionContactForm />

      <SectionMap />

      <SectionCompanyInfo />

      <Footer />

    </main>
  );
}