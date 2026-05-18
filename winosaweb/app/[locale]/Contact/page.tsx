import Footer from "@/components/layout/Footer";
import SectionContactForm from "@/components/sectionContact/SectionContactForm";
import SectionCompanyInfo from "@/components/sectionContact/SectionFAQ";
import SectionMap from "@/components/sectionContact/SectionMap";
import { getSiteSettings } from '@/lib/getSiteSettings';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const s = await getSiteSettings();
  const { locale } = await params;
  const currentLocale = locale || "en";

  const titles: Record<string, string> = {
    en: "Contact Us",
    nl: "Neem Contact Op",
    id: "Hubungi Kami",
  };

  const currentTitle = titles[currentLocale] || titles.en;

  return {
    title: s?.metaTitle ? `${currentTitle} | ${s.metaTitle}` : `${currentTitle} | Winosa Digital Agency`,
    description: s?.metaDescription || 'Get in touch with our team.',
    openGraph: {
      title: s?.metaTitle ? `${currentTitle} | ${s.metaTitle}` : `${currentTitle} | Winosa`,
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