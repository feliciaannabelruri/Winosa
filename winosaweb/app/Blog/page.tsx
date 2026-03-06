import Footer from "@/components/layout/Footer";
import SectionBlogHero from "@/components/sectionBlog/SectionHero";
import SectionBlog from "@/components/sectionBlog/SectionBlog";

export default function BlogPage() {
  return (
    <main>
      <SectionBlogHero />
      <SectionBlog />
      <Footer />
    </main>
  );
}
