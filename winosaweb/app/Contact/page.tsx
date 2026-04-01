import Footer from "@/components/layout/Footer";

import SectionContactForm from "@/components/sectionContact/SectionContactForm";
import SectionCompanyInfo from "@/components/sectionContact/SectionFAQ";
import SectionMap from "@/components/sectionContact/SectionMap";

import { getSiteSettings } from '@/lib/getSiteSettings';

export async function generateMetadata() {
  const s = await getSiteSettings();
  return {
    title: s?.metaTitle ? `Contact | ${s.metaTitle}` : 'Contact Us | Winosa Digital Agency',
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

      {/* MAP DI TENGAH */}
      <SectionMap />

      {/* COMPANY INFO DI BAWAH */}
      <SectionCompanyInfo />

      <Footer />

    </main>
  );
}