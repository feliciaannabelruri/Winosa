import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/layout/Footer";
import SectionCTA from "@/components/layout/SectionCTA";
import { getSiteSettings } from "@/lib/getSiteSettings";
import {
  Check,
  ArrowRight,
  ChevronRight,
  Layers,
  Cpu,
  Palette,
  Globe,
} from "lucide-react";

/* ============================================================
   TYPES
============================================================ */
interface ProcessStep {
  highlight: string;
  title: string;
  desc: string;
}

interface TechGroup {
  category: string;
  tech: string[];
}

interface PricingPlan {
  name: string;
  price: string;
  desc: string;
  features: string[];
  type: "normal" | "custom";
  ctaLink?: string;
}

interface MobileFeature {
  title: string;
  desc: string;
}

interface MobileTechItem {
  title: string;
  desc: string;
  items: string[];
}

interface ServiceData {
  _id: string;
  title: string;
  slug: string;
  description: string;
  subtitle?: string;
  icon?: string;
  features: string[];
  heroImage?: string;
  heroLabel?: string;
  ctaText?: string;
  ctaLink?: string;
  processTitle?: string;
  processSubtitle?: string;
  process: ProcessStep[];
  techTitle?: string;
  techSubtitle?: string;
  techStack: TechGroup[];
  webPricingPlans: PricingPlan[];
  mobilePricingPlans: PricingPlan[];
  uiuxPricingPlans: PricingPlan[];
  mobileFeatureTitle?: string;
  mobileFeatureSubtitle?: string;
  mobileFeatures: MobileFeature[];
  mobileTechTitle?: string;
  mobileTechSubtitle?: string;
  mobileTech: MobileTechItem[];
  techDescription?: string;
  tools: string[];
  whatsappNumber?: string;
  isActive: boolean;
}

/* ============================================================
   SEO METADATA
============================================================ */
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = await getSiteSettings();
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services/${slug}`, {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      const service = data?.data;
      return {
        title: service?.title
          ? `${service.title} | ${s?.siteName || "Winosa"}`
          : `Services | ${s?.siteName || "Winosa"}`,
        description: service?.description || s?.metaDescription || "",
        openGraph: {
          title: service?.title || "Winosa Services",
          description: service?.description || "",
          images: [service?.heroImage || s?.logo || "/og-image.jpg"],
        },
      };
    }
  } catch {}
  return {
    title: `Services | ${s?.siteName || "Winosa Digital Agency"}`,
    description: s?.metaDescription || "",
  };
}

/* ============================================================
   PAGE COMPONENT
============================================================ */
export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  /* Fetch service */
  let service: ServiceData | null = null;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services/${slug}`, {
      cache: "no-store",
    });
    if (!res.ok) notFound();
    const json = await res.json();
    service = json?.data ?? null;
  } catch {
    notFound();
  }

  if (!service || !service.isActive) notFound();

  /* Detect service type by slug for icon */
  const isMobile = slug.includes("mobile");
  const isUiux = slug.includes("ui") || slug.includes("ux") || slug.includes("design");
  const isWeb = !isMobile && !isUiux;

  const ServiceIcon = isMobile ? Cpu : isUiux ? Palette : Globe;

  /* Pick pricing plans */
  const pricingPlans: PricingPlan[] =
    isMobile
      ? service.mobilePricingPlans
      : isUiux
      ? service.uiuxPricingPlans
      : service.webPricingPlans;

  /* Pick tech */
  const techItems: TechGroup[] | MobileTechItem[] = isMobile
    ? service.mobileTech
    : service.techStack;

  return (
    <main
      aria-label={`${service.title} service page`}
      className="w-full bg-white overflow-x-hidden"
    >
      {/* ══════════════════════════════════════════════════════
         HERO
      ══════════════════════════════════════════════════════ */}
      <section
        className="relative w-full min-h-screen flex flex-col items-center justify-center text-center overflow-hidden px-6"
        aria-labelledby="service-detail-title"
      >
        {/* BG Image */}
        {service.heroImage ? (
          <>
            <Image
              src={service.heroImage}
              alt=""
              aria-hidden="true"
              fill
              priority
              quality={80}
              sizes="100vw"
              className="object-cover z-0"
            />
            <div className="absolute inset-0 bg-black/55 z-10" aria-hidden="true" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-black via-black/90 to-black/75 z-0" />
        )}

        {/* Decorative glows */}
        <div className="absolute top-[15%] left-[8%] w-[400px] h-[400px] rounded-full bg-yellow-400/10 blur-[140px] z-10" aria-hidden="true" />
        <div className="absolute bottom-[10%] right-[5%] w-[300px] h-[300px] rounded-full bg-yellow-500/8 blur-[100px] z-10" aria-hidden="true" />

        {/* Content */}
        <div className="relative z-20 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-yellow-400/50 text-yellow-400 text-xs font-semibold tracking-widest uppercase mb-6">
            <ServiceIcon className="w-3.5 h-3.5" aria-hidden="true" />
            {service.heroLabel || (isWeb ? "Web Development" : isMobile ? "Mobile App" : "UI/UX Design")}
          </div>

          <h1
            id="service-detail-title"
            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
            style={{ textShadow: "0 4px 24px rgba(0,0,0,0.5)" }}
          >
            {service.title}
          </h1>

          <p
            className="text-white/70 text-lg max-w-2xl mx-auto leading-relaxed mb-10"
            style={{ textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}
          >
            {service.subtitle || service.description}
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href={service.ctaLink || "/Contact"}
              className="px-8 py-3.5 rounded-full bg-yellow-400 text-black font-semibold text-sm transition-all duration-300 hover:bg-yellow-300 hover:scale-105 active:scale-95"
            >
              {service.ctaText || "Start Your Project"}
            </Link>
            <Link
              href="/portofolio"
              className="px-8 py-3.5 rounded-full border-2 border-white/30 text-white font-semibold text-sm transition-all duration-300 hover:border-white hover:bg-white/10 hover:scale-105 active:scale-95"
            >
              View Portfolio
            </Link>
          </div>
        </div>

        {/* Bottom gradient */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent z-20 pointer-events-none" />
      </section>

      {/* ══════════════════════════════════════════════════════
         FEATURES
      ══════════════════════════════════════════════════════ */}
      {service.features?.length > 0 && (
        <section className="w-full py-20 bg-white" aria-labelledby="features-title">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-14">
              <span className="text-xs font-semibold text-yellow-600 tracking-widest uppercase">
                What You Get
              </span>
              <h2
                id="features-title"
                className="text-4xl font-bold text-black mt-3 mb-4"
              >
                {isMobile
                  ? service.mobileFeatureTitle || "What You'll Get"
                  : "Key Features"}
              </h2>
              {isMobile && service.mobileFeatureSubtitle && (
                <p className="text-black/50 max-w-2xl mx-auto text-sm">
                  {service.mobileFeatureSubtitle}
                </p>
              )}
            </div>

            {/* Mobile features (rich) */}
            {isMobile && service.mobileFeatures?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {service.mobileFeatures.map((f, i) => (
                  <div
                    key={i}
                    className="group p-7 rounded-[24px] border border-black/10 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_50px_rgba(0,0,0,0.07)] hover:border-black/20 relative overflow-hidden"
                  >
                    <div className="pointer-events-none absolute -inset-4 rounded-[36px] bg-[radial-gradient(circle,rgba(255,200,0,0.25)_0%,transparent_70%)] opacity-0 blur-[50px] transition-all duration-500 group-hover:opacity-100" aria-hidden="true" />
                    <div className="relative">
                      <div className="w-10 h-10 rounded-xl bg-yellow-400/10 flex items-center justify-center mb-4">
                        <Layers className="w-5 h-5 text-yellow-500" aria-hidden="true" />
                      </div>
                      <h3 className="font-bold text-black mb-2 text-sm">{f.title}</h3>
                      <p className="text-black/50 text-sm leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Generic features grid */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {service.features.map((f, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4 p-6 rounded-[20px] border border-black/8 hover:border-black/15 transition-all duration-200 hover:bg-black/[0.01]"
                  >
                    <div className="w-6 h-6 rounded-full bg-yellow-400/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 text-yellow-600" aria-hidden="true" />
                    </div>
                    <span className="text-black/80 text-sm leading-relaxed">{f}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════
         PROCESS
      ══════════════════════════════════════════════════════ */}
      {service.process?.length > 0 && (
        <section className="w-full py-20 bg-[#f8f7f5]" aria-labelledby="process-title">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-14">
              <span className="text-xs font-semibold text-yellow-600 tracking-widest uppercase">
                How We Work
              </span>
              <h2 id="process-title" className="text-4xl font-bold text-black mt-3 mb-4">
                {service.processTitle || "Our Process"}
              </h2>
              {service.processSubtitle && (
                <p className="text-black/50 max-w-2xl mx-auto text-sm">
                  {service.processSubtitle}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {service.process.map((step, i) => (
                <div
                  key={i}
                  className="relative p-8 rounded-[24px] bg-white border border-black/8 group hover:-translate-y-1 hover:shadow-[0_16px_50px_rgba(0,0,0,0.07)] transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-5">
                    <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {i + 1}
                    </span>
                    {step.highlight && (
                      <span className="text-xs font-semibold text-yellow-600 uppercase tracking-wide">
                        {step.highlight}
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-black mb-2">{step.title}</h3>
                  <p className="text-black/50 text-sm leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════
         TECH STACK
      ══════════════════════════════════════════════════════ */}
      {techItems?.length > 0 && (
        <section className="w-full py-20 bg-black text-white" aria-labelledby="tech-title">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-14">
              <span className="text-xs font-semibold text-yellow-400 tracking-widest uppercase">
                Technology
              </span>
              <h2 id="tech-title" className="text-4xl font-bold mt-3 mb-4">
                {isMobile
                  ? service.mobileTechTitle || "Technology Stack"
                  : service.techTitle || "Technology Stack"}
              </h2>
              {(isMobile
                ? service.mobileTechSubtitle
                : service.techSubtitle || service.techDescription) && (
                <p className="text-white/50 max-w-2xl mx-auto text-sm">
                  {isMobile ? service.mobileTechSubtitle : service.techSubtitle || service.techDescription}
                </p>
              )}
            </div>

            {isMobile ? (
              /* Mobile tech (rich) */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(service.mobileTech || []).map((item, i) => (
                  <div
                    key={i}
                    className="p-7 rounded-[24px] border border-white/10 bg-white/5 hover:border-yellow-400/30 transition-colors duration-300"
                  >
                    <h3 className="font-bold text-white mb-2 text-sm">{item.title}</h3>
                    <p className="text-white/40 text-xs mb-4 leading-relaxed">{item.desc}</p>
                    <div className="flex flex-wrap gap-2">
                      {(item.items || []).map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/20 text-yellow-300 text-xs"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : isUiux && service.tools?.length > 0 ? (
              /* UI/UX tools */
              <div className="flex flex-wrap gap-3 justify-center max-w-3xl mx-auto">
                {service.tools.map((tool) => (
                  <span
                    key={tool}
                    className="px-5 py-2.5 rounded-full border border-white/15 text-white/70 text-sm hover:border-yellow-400/40 hover:text-yellow-300 transition-all duration-200"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            ) : (
              /* Web tech (grouped) */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {(service.techStack || []).map((group, i) => (
                  <div
                    key={i}
                    className="p-6 rounded-[20px] border border-white/10 bg-white/5 hover:border-yellow-400/20 transition-colors duration-300"
                  >
                    <h3 className="font-semibold text-white/50 text-xs uppercase tracking-wide mb-4">
                      {group.category}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {(group.tech || []).map((t) => (
                        <span
                          key={t}
                          className="px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/20 text-yellow-300 text-xs"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════
         PRICING
      ══════════════════════════════════════════════════════ */}
      {pricingPlans?.length > 0 && (
        <section className="w-full py-20 bg-white" aria-labelledby="pricing-title">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-14">
              <span className="text-xs font-semibold text-yellow-600 tracking-widest uppercase">
                Investment
              </span>
              <h2 id="pricing-title" className="text-4xl font-bold text-black mt-3 mb-4">
                Choose Your Plan
              </h2>
              <p className="text-black/50 max-w-xl mx-auto text-sm">
                Flexible packages designed to fit your budget and project scope.
              </p>
            </div>

            <div className={`grid grid-cols-1 gap-6 ${pricingPlans.length === 2 ? "md:grid-cols-2 max-w-3xl mx-auto" : pricingPlans.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2 lg:grid-cols-4"}`}>
              {pricingPlans.map((plan, i) => {
                const isPopular = i === 1 && pricingPlans.length >= 3;
                const isCustom = plan.type === "custom";

                return (
                  <div
                    key={plan.name}
                    className={`relative rounded-[28px] p-8 flex flex-col border-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                      isPopular
                        ? "bg-black border-black text-white"
                        : isCustom
                        ? "bg-[#1a1a1a] border-[#1a1a1a] text-white"
                        : "bg-white border-black/10 text-black"
                    }`}
                  >
                    {isPopular && (
                      <span className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full bg-yellow-400 text-black text-xs font-bold">
                        Most Popular
                      </span>
                    )}

                    <h3 className="text-lg font-bold mb-2">{plan.name}</h3>
                    <p className={`text-sm mb-6 ${isPopular || isCustom ? "text-white/50" : "text-black/40"}`}>
                      {plan.desc}
                    </p>

                    <div className="mb-6">
                      <p className={`text-xs uppercase tracking-widest mb-1 ${isPopular || isCustom ? "text-white/30" : "text-black/30"}`}>
                        Starting from
                      </p>
                      <p className="text-3xl font-bold">{plan.price || "Custom"}</p>
                    </div>

                    <ul className="space-y-3 mb-8 flex-grow">
                      {(plan.features || []).map((f, fi) => (
                        <li key={fi} className="flex items-start gap-3 text-sm">
                          <Check
                            className={`w-4 h-4 flex-shrink-0 mt-0.5 ${isPopular ? "text-yellow-400" : "text-black"}`}
                            aria-hidden="true"
                          />
                          <span className={isPopular || isCustom ? "text-white/70" : "text-black/70"}>{f}</span>
                        </li>
                      ))}
                    </ul>

                    <Link
                      href={plan.ctaLink || "/Contact"}
                      className={`flex items-center justify-center gap-2 w-full py-3.5 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-95 ${
                        isPopular
                          ? "bg-yellow-400 text-black hover:bg-yellow-300"
                          : isCustom
                          ? "bg-white text-black hover:bg-white/90"
                          : "bg-black text-white hover:bg-black/80"
                      }`}
                    >
                      Get Started <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </Link>
                  </div>
                );
              })}
            </div>

            <div className="text-center mt-10">
              <p className="text-black/40 text-sm mb-4">
                Not sure which plan is right for you?
              </p>
              <Link
                href="/Contact"
                className="inline-flex items-center gap-2 text-sm font-medium text-black hover:underline"
              >
                Talk to our team <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════
         CTA BANNER
      ══════════════════════════════════════════════════════ */}
      <section className="w-full py-20 bg-[#f8f7f5]" aria-label="Start your project">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="text-xs font-semibold text-yellow-600 tracking-widest uppercase">
            Ready to Start?
          </span>
          <h2 className="text-4xl font-bold text-black mt-3 mb-5">
            Let's Build Something Amazing
          </h2>
          <p className="text-black/50 max-w-xl mx-auto mb-10 text-sm leading-relaxed">
            Tell us about your project and we'll get back to you within 24 hours
            with a tailored proposal.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href={service.ctaLink || "/Contact"}
              className="px-10 py-3.5 rounded-full bg-black text-white font-semibold text-sm transition-all duration-300 hover:bg-black/80 hover:scale-105 active:scale-95"
            >
              {service.ctaText || "Start Your Project"}
            </Link>
            <Link
              href="/subscriptions"
              className="px-10 py-3.5 rounded-full border-2 border-black text-black font-semibold text-sm transition-all duration-300 hover:bg-black hover:text-white hover:scale-105 active:scale-95"
            >
              View All Plans
            </Link>
          </div>
        </div>
      </section>

      <SectionCTA />
      <Footer />
    </main>
  );
}
