import SectionHero from "@/components/sectionsHomepage/SectionHero";
import SectionMap from "@/components/sectionsHomepage/SectionMap";
import SectionGlass from "@/components/sectionsHomepage/SectionGlass";
import SectionPreview from "@/components/sectionsHomepage/SectionPreview";
import SectionCTA from "@/components/layout/SectionCTA";
import Footer from "@/components/layout/Footer";
import api from "@/lib/axios";

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

  // 🔥 Glass
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
