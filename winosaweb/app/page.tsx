import dynamic from "next/dynamic";
import api from "@/lib/axios";

const SectionHero = dynamic(() => import("@/components/sectionsHomepage/SectionHero"));
const SectionMap = dynamic(() => import("@/components/sectionsHomepage/SectionMap"));
const SectionGlass = dynamic(() => import("@/components/sectionsHomepage/SectionGlass"));
const SectionPreview = dynamic(() => import("@/components/sectionsHomepage/SectionPreview"));
const SectionCTA = dynamic(() => import("@/components/layout/SectionCTA"));
const Footer = dynamic(() => import("@/components/layout/Footer"));

export const metadata = {
  title: "Winosa Digital Agency",
  description: "Web development, UI UX design, branding, and digital solutions",
  openGraph: {
    title: "Winosa Digital Agency",
    description: "Web development, UI UX design, branding, and digital solutions",
    images: ["/og-image.jpg"],
  },
};

export default async function HomePage() {

  const [servicesRes, portfolioRes, blogRes] = await Promise.all([
    api.get("/services"),
    api.get("/portfolio"),
    api.get("/blog"),
  ]);

  const services = servicesRes.data.data.map((item: any) => ({
    id: item._id,
    title: item.title,
    desc: item.description,
    icon: item.icon,
    slug: `/services/${item.slug}`,
  }));

  const portfolios = portfolioRes.data.data.slice(0, 3).map((item: any) => ({
    id: item._id,
    title: item.title,
    desc: item.description,
    image: item.thumbnail || item.image,
    slug: `/portfolio/${item.slug}`,
  }));

  const blogs = blogRes.data.data.slice(0, 3).map((item: any) => ({
    id: item._id,
    title: item.title,
    desc: item.excerpt || item.description,
    image: item.image || item.thumbnail,
    slug: `/blog/${item.slug}`,
  }));

  let glassData = null;

  try {
    const glassRes = await api.get("/glass");
    glassData = glassRes.data.data;
  } catch (error) {
    console.log("Glass endpoint tidak ditemukan");
  }

  return (
    <main>
      <SectionHero />
      <SectionMap />
      <SectionGlass data={glassData} />

      <SectionPreview title="Our Services" items={services} />
      <SectionPreview title="Our Portfolio" items={portfolios} />
      <SectionPreview title="Latest Blog" items={blogs} />

      <SectionCTA />
      <Footer />
    </main>
  );
}