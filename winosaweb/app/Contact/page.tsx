import Footer from "@/components/layout/Footer";

import SectionContactForm from "@/components/sectionContact/SectionContactForm";
import SectionCompanyInfo from "@/components/sectionContact/SectionFAQ";
import SectionMap from "@/components/sectionContact/SectionMap";

export default function ContactPage() {
  return (
    <main>

      <SectionContactForm />

      {/* MAP DI TENGAH */}
      <SectionMap />

      {/* COMPANY INFO DI BAWAH */}
      <SectionCompanyInfo />

      <Footer />
    </main>
  );
}
