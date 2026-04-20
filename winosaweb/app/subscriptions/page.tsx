"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Footer from "@/components/layout/Footer";
import FadeUp from "@/components/animation/FadeUp";
import { useTranslate } from "@/lib/useTranslate";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translateHybrid } from "@/lib/translateHybrid";
import { Check, X, Zap, Shield, Star, ArrowRight, ChevronDown, HelpCircle } from "lucide-react";

/* ============================================================
   TYPES
============================================================ */
interface Plan {
  _id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  billingCycle?: string;
  features: string[];
  isPopular?: boolean;
  isActive?: boolean;
  buttonLabel?: string;
  cta?: string;
}

/* ============================================================
   FAQ DATA
============================================================ */
const FAQS = [
  {
    q: { en: "Can I upgrade or downgrade my plan?", id: "Bisakah saya upgrade atau downgrade paket?", nl: "Kan ik mijn plan upgraden of downgraden?" },
    a: { en: "Yes, you can change your plan at any time. Changes will be reflected in the next billing cycle. Our team will help you with a smooth transition.", id: "Ya, Anda bisa mengubah paket kapan saja. Perubahan akan berlaku pada siklus penagihan berikutnya. Tim kami akan membantu transisi yang lancar.", nl: "Ja, u kunt uw plan op elk moment wijzigen. Wijzigingen worden doorgevoerd in de volgende factureringscyclus." },
  },
  {
    q: { en: "What happens after I choose a plan?", id: "Apa yang terjadi setelah saya memilih paket?", nl: "Wat gebeurt er nadat ik een plan heb gekozen?" },
    a: { en: "After selecting a plan, our team will contact you within 24 hours to discuss your project needs, timeline, and kickstart the onboarding process.", id: "Setelah memilih paket, tim kami akan menghubungi Anda dalam 24 jam untuk mendiskusikan kebutuhan proyek, timeline, dan memulai proses onboarding.", nl: "Na het selecteren van een plan neemt ons team binnen 24 uur contact met u op om uw projectbehoeften en tijdlijn te bespreken." },
  },
  {
    q: { en: "Do you offer custom solutions?", id: "Apakah Anda menawarkan solusi kustom?", nl: "Biedt u aangepaste oplossingen?" },
    a: { en: "Absolutely. Every business is unique. If none of our standard plans fit your needs perfectly, reach out and we'll craft a custom proposal tailored specifically for you.", id: "Tentu saja. Setiap bisnis itu unik. Jika tidak ada paket standar kami yang sesuai, hubungi kami dan kami akan membuat proposal kustom khusus untuk Anda.", nl: "Absoluut. Elk bedrijf is uniek. Als geen van onze standaardplannen perfect past, neem dan contact op en wij maken een aangepast voorstel." },
  },
  {
    q: { en: "Is there a free consultation?", id: "Apakah ada konsultasi gratis?", nl: "Is er een gratis consultatie?" },
    a: { en: "Yes! We offer a free 30-minute consultation for all new clients. It's a no-commitment conversation where we learn about your goals and suggest the best approach.", id: "Ya! Kami menawarkan konsultasi gratis 30 menit untuk semua klien baru. Ini adalah percakapan tanpa komitmen di mana kami mempelajari tujuan Anda.", nl: "Ja! Wij bieden een gratis 30-minutenconsultatie voor alle nieuwe klanten. Een gesprek zonder verplichtingen." },
  },
  {
    q: { en: "What is included in maintenance support?", id: "Apa yang termasuk dalam dukungan pemeliharaan?", nl: "Wat is inbegrepen bij onderhoudssupport?" },
    a: { en: "Maintenance support includes bug fixes, security patches, content updates, performance monitoring, and technical support via email and chat depending on your plan.", id: "Dukungan pemeliharaan mencakup perbaikan bug, patch keamanan, pembaruan konten, pemantauan performa, dan dukungan teknis via email dan chat sesuai paket Anda.", nl: "Onderhoudssupport omvat bugfixes, beveiligingspatches, content-updates, prestatiebewaking en technische ondersteuning via e-mail en chat." },
  },
];

/* ============================================================
   FEATURE COMPARISON COLUMNS
============================================================ */
const FEATURES_COMPARE = [
  { label: { en: "Custom Design", id: "Desain Kustom", nl: "Aangepast Ontwerp" }, starter: true, business: true, enterprise: true },
  { label: { en: "Responsive (Mobile+Desktop)", id: "Responsif (Mobile+Desktop)", nl: "Responsief" }, starter: true, business: true, enterprise: true },
  { label: { en: "SEO Optimization", id: "Optimasi SEO", nl: "SEO Optimalisatie" }, starter: false, business: true, enterprise: true },
  { label: { en: "Admin Dashboard", id: "Dashboard Admin", nl: "Admin Dashboard" }, starter: false, business: true, enterprise: true },
  { label: { en: "Multi-language Support", id: "Dukungan Multi-bahasa", nl: "Meertalige Ondersteuning" }, starter: false, business: false, enterprise: true },
  { label: { en: "E-commerce / Payment", id: "E-commerce / Pembayaran", nl: "E-commerce / Betaling" }, starter: false, business: true, enterprise: true },
  { label: { en: "Custom API Integration", id: "Integrasi API Kustom", nl: "Aangepaste API-integratie" }, starter: false, business: false, enterprise: true },
  { label: { en: "Priority Support", id: "Dukungan Prioritas", nl: "Prioriteitsondersteuning" }, starter: false, business: false, enterprise: true },
  { label: { en: "Dedicated Project Manager", id: "Manajer Proyek Khusus", nl: "Dedicated Projectmanager" }, starter: false, business: false, enterprise: true },
  { label: { en: "Performance Monitoring", id: "Pemantauan Performa", nl: "Prestatiebewaking" }, starter: false, business: true, enterprise: true },
];

/* ============================================================
   PLAN ICONS
============================================================ */
const PLAN_ICON: Record<string, React.ReactNode> = {
  starter: <Zap className="w-6 h-6" />,
  business: <Star className="w-6 h-6" />,
  enterprise: <Shield className="w-6 h-6" />,
};

/* ============================================================
   FAQ ITEM COMPONENT
============================================================ */
function FaqItem({ q, a, lang }: { q: Record<string, string>; a: Record<string, string>; lang: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-black/10 rounded-[20px] overflow-hidden transition-all duration-300 hover:border-black/20">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-4 px-7 py-5 text-left bg-white hover:bg-black/[0.02] transition-colors duration-200"
      >
        <span className="font-medium text-black text-sm">{q[lang] ?? q.en}</span>
        <ChevronDown
          className={`w-5 h-5 text-black/40 flex-shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>
      {open && (
        <div className="px-7 pb-6 bg-white">
          <p className="text-black/60 text-sm leading-relaxed">{a[lang] ?? a.en}</p>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   PAGE COMPONENT
============================================================ */
export default function SubscriptionsPage() {
  const { t, tApi } = useTranslate();
  const { language } = useLanguageStore();

  const [plans, setPlans] = useState<Plan[]>([]);
  const [translatedPlans, setTranslatedPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showComparison, setShowComparison] = useState(false);

  // Fetch plans
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/subscriptions`)
      .then((r) => r.json())
      .then((data) => {
        const raw: Plan[] = Array.isArray(data?.data) ? data.data : [];
        const active = raw.filter((p) => p.isActive !== false);
        setPlans(active);
        setTranslatedPlans(active);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Translate plans
  useEffect(() => {
    if (!plans.length) return;
    const run = async () => {
      const translated = await Promise.all(
        plans.map(async (p) => ({
          ...p,
          name: await translateHybrid(p.name, language, tApi),
          description: await translateHybrid(p.description, language, tApi),
          features: await Promise.all(
            (p.features || []).map((f) => translateHybrid(f, language, tApi))
          ),
        }))
      );
      setTranslatedPlans(translated);
    };
    run();
  }, [plans, language]);

  /* ── PLAN CARD COLOR SCHEME ── */
  const getScheme = (name: string, isPopular?: boolean) => {
    const n = name.toLowerCase();
    if (isPopular || n.includes("pro") || n.includes("business"))
      return { bg: "bg-black", text: "text-white", border: "border-black", badge: "bg-yellow-400 text-black", btn: "bg-yellow-400 text-black hover:bg-yellow-300", icon: "text-yellow-400" };
    if (n.includes("enterprise"))
      return { bg: "bg-[#1a1a1a]", text: "text-white", border: "border-[#1a1a1a]", badge: "bg-white/20 text-white", btn: "bg-white text-black hover:bg-white/90", icon: "text-white" };
    return { bg: "bg-white", text: "text-black", border: "border-black/10", badge: "bg-black text-white", btn: "bg-black text-white hover:bg-black/80", icon: "text-black" };
  };

  return (
    <main aria-label="Subscription plans page" className="w-full bg-white overflow-x-hidden">

      {/* ── HERO ── */}
      <section
        className="relative w-full min-h-[70vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden"
        aria-labelledby="subscription-hero-title"
      >
        {/* BG */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black/95 to-black/80 z-0" />
        <div className="absolute top-[15%] left-[10%] w-[500px] h-[500px] rounded-full bg-yellow-400/8 blur-[150px] z-0" aria-hidden="true" />
        <div className="absolute bottom-[5%] right-[5%] w-[300px] h-[300px] rounded-full bg-yellow-500/6 blur-[100px] z-0" aria-hidden="true" />

        <div className="relative z-10 max-w-3xl mx-auto">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block px-5 py-1.5 rounded-full border border-yellow-400/50 text-yellow-400 text-xs font-semibold tracking-widest uppercase mb-6"
          >
            {t("pricing", "title")}
          </motion.span>

          <motion.h1
            id="subscription-hero-title"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight"
          >
            Simple, Transparent
            <br />
            <span className="text-yellow-400">Pricing</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-white/60 text-lg max-w-xl mx-auto leading-relaxed"
          >
            {t("pricing", "subtitle")}
          </motion.p>
        </div>

        {/* bottom fade */}
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none" />
      </section>

      {/* ── PRICING CARDS ── */}
      <section className="w-full py-16 bg-white" aria-label="Pricing plans">
        <div className="max-w-7xl mx-auto px-6">

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-[500px] rounded-[32px] bg-gray-100 animate-pulse" />
              ))}
            </div>
          ) : translatedPlans.length === 0 ? (
            /* Fallback hardcoded plans if API empty */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  name: "Starter",
                  description: "Perfect for small businesses and individuals getting started with their digital presence.",
                  price: "Contact us",
                  features: ["Up to 5 pages", "Custom design", "Mobile responsive", "Basic SEO setup", "1 month support"],
                  isPopular: false,
                },
                {
                  name: "Business",
                  description: "Ideal for growing businesses that need a more robust digital solution with advanced features.",
                  price: "Contact us",
                  features: ["Up to 15 pages", "Admin dashboard", "E-commerce ready", "SEO optimization", "Performance monitoring", "3 months support", "Payment integration"],
                  isPopular: true,
                },
                {
                  name: "Enterprise",
                  description: "Built for large-scale operations requiring full customization, integrations, and dedicated support.",
                  price: "Contact us",
                  features: ["Unlimited pages", "Custom API integrations", "Multi-language support", "Dedicated PM", "SLA guarantee", "Priority 24/7 support", "Performance SLA", "UX research included"],
                  isPopular: false,
                },
              ].map((plan, i) => {
                const scheme = getScheme(plan.name, plan.isPopular);
                return (
                  <FadeUp key={plan.name} delay={i * 0.1}>
                    <div className={`relative rounded-[32px] p-8 border-2 ${scheme.border} ${scheme.bg} ${scheme.text} flex flex-col h-full transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl`}>
                      {plan.isPopular && (
                        <span className={`absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full text-xs font-bold ${scheme.badge}`}>
                          Most Popular
                        </span>
                      )}

                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${plan.isPopular ? "bg-yellow-400/10 text-yellow-400" : "bg-black/5 text-black"}`}>
                        {PLAN_ICON[plan.name.toLowerCase()] ?? <Zap className="w-6 h-6" />}
                      </div>

                      <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
                      <p className={`text-sm mb-6 leading-relaxed ${plan.isPopular ? "text-white/60" : "text-black/50"}`}>
                        {plan.description}
                      </p>

                      <div className="mb-8">
                        <p className={`text-xs uppercase tracking-widest mb-1 ${plan.isPopular ? "text-white/40" : "text-black/30"}`}>
                          Starting from
                        </p>
                        <p className="text-3xl font-bold">{plan.price}</p>
                      </div>

                      <ul className="space-y-3 mb-8 flex-grow">
                        {plan.features.map((f) => (
                          <li key={f} className="flex items-start gap-3 text-sm">
                            <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 ${plan.isPopular ? "text-yellow-400" : "text-black"}`} aria-hidden="true" />
                            <span className={plan.isPopular ? "text-white/80" : "text-black/70"}>{f}</span>
                          </li>
                        ))}
                      </ul>

                      <Link
                        href="/Contact"
                        className={`w-full py-3.5 rounded-full text-sm font-semibold text-center flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02] active:scale-95 ${scheme.btn}`}
                        aria-label={`Choose ${plan.name} plan`}
                      >
                        Get Started <ArrowRight className="w-4 h-4" aria-hidden="true" />
                      </Link>
                    </div>
                  </FadeUp>
                );
              })}
            </div>
          ) : (
            /* API plans */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {translatedPlans.map((plan, i) => {
                const scheme = getScheme(plan.name, plan.isPopular);
                return (
                  <FadeUp key={plan._id} delay={i * 0.1}>
                    <div className={`relative rounded-[32px] p-8 border-2 ${scheme.border} ${scheme.bg} ${scheme.text} flex flex-col h-full transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl`}>
                      {plan.isPopular && (
                        <span className={`absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full text-xs font-bold ${scheme.badge}`}>
                          Most Popular
                        </span>
                      )}

                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${plan.isPopular ? "bg-yellow-400/10" : "bg-black/5"} ${scheme.icon}`}>
                        {PLAN_ICON[plan.name.toLowerCase()] ?? <Zap className="w-6 h-6" />}
                      </div>

                      <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
                      <p className={`text-sm mb-6 leading-relaxed ${plan.isPopular ? "text-white/60" : "text-black/50"}`}>
                        {plan.description}
                      </p>

                      <div className="mb-8">
                        <p className={`text-xs uppercase tracking-widest mb-1 ${plan.isPopular ? "text-white/40" : "text-black/30"}`}>
                          {t("pricing", "startFrom")}
                        </p>
                        <p className="text-3xl font-bold">
                          {plan.price
                            ? `${plan.currency || "IDR"} ${Number(plan.price).toLocaleString("id-ID")}`
                            : t("pricing", "custom")}
                        </p>
                        {plan.billingCycle && (
                          <p className={`text-xs mt-1 ${plan.isPopular ? "text-white/40" : "text-black/30"}`}>
                            / {plan.billingCycle}
                          </p>
                        )}
                      </div>

                      <ul className="space-y-3 mb-8 flex-grow">
                        {(plan.features || []).map((f, fi) => (
                          <li key={fi} className="flex items-start gap-3 text-sm">
                            <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 ${plan.isPopular ? "text-yellow-400" : "text-black"}`} aria-hidden="true" />
                            <span className={plan.isPopular ? "text-white/80" : "text-black/70"}>{f}</span>
                          </li>
                        ))}
                      </ul>

                      <Link
                        href="/Contact"
                        className={`w-full py-3.5 rounded-full text-sm font-semibold text-center flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02] active:scale-95 ${scheme.btn}`}
                        aria-label={`Choose ${plan.name} plan`}
                      >
                        {plan.cta || plan.buttonLabel || t("pricing", "getStarted")}
                        <ArrowRight className="w-4 h-4" aria-hidden="true" />
                      </Link>
                    </div>
                  </FadeUp>
                );
              })}
            </div>
          )}

          {/* Custom CTA */}
          <FadeUp delay={0.3}>
            <div className="mt-12 text-center">
              <p className="text-black/50 text-sm mb-4">
                Need something different?
              </p>
              <Link
                href="/Contact"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-full border-2 border-black text-black text-sm font-semibold transition-all duration-300 hover:bg-black hover:text-white hover:scale-105 active:scale-95"
              >
                Request Custom Quote <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── FEATURE COMPARISON ── */}
      <section className="w-full py-20 bg-[#f8f7f5]" aria-labelledby="comparison-title">
        <div className="max-w-5xl mx-auto px-6">
          <FadeUp>
            <div className="text-center mb-12">
              <h2 id="comparison-title" className="text-3xl font-bold text-black mb-4">
                Feature Comparison
              </h2>
              <p className="text-black/50 text-sm">
                See exactly what's included in each plan
              </p>
              <button
                onClick={() => setShowComparison(!showComparison)}
                className="mt-4 inline-flex items-center gap-2 text-sm text-black/60 hover:text-black transition-colors duration-200"
                aria-expanded={showComparison}
              >
                {showComparison ? "Hide comparison" : "Show full comparison"}
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showComparison ? "rotate-180" : ""}`} aria-hidden="true" />
              </button>
            </div>
          </FadeUp>

          {showComparison && (
            <FadeUp>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b-2 border-black/10">
                      <th className="text-left py-4 px-4 text-sm font-semibold text-black/40 uppercase tracking-wide w-1/2">Feature</th>
                      <th className="text-center py-4 px-4 text-sm font-bold text-black">Starter</th>
                      <th className="text-center py-4 px-4 text-sm font-bold text-black">Business</th>
                      <th className="text-center py-4 px-4 text-sm font-bold text-black">Enterprise</th>
                    </tr>
                  </thead>
                  <tbody>
                    {FEATURES_COMPARE.map((row, i) => (
                      <tr
                        key={i}
                        className={`border-b border-black/5 transition-colors duration-150 hover:bg-black/[0.02] ${i % 2 === 0 ? "bg-white" : "bg-transparent"}`}
                      >
                        <td className="py-4 px-4 text-sm text-black/70">
                          {row.label[language as keyof typeof row.label] ?? row.label.en}
                        </td>
                        {(["starter", "business", "enterprise"] as const).map((tier) => (
                          <td key={tier} className="py-4 px-4 text-center">
                            {row[tier] ? (
                              <Check className="w-5 h-5 text-black mx-auto" aria-label="Included" />
                            ) : (
                              <X className="w-5 h-5 text-black/20 mx-auto" aria-label="Not included" />
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </FadeUp>
          )}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="w-full py-20 bg-white" aria-labelledby="faq-title">
        <div className="max-w-3xl mx-auto px-6">
          <FadeUp>
            <div className="text-center mb-12">
              <HelpCircle className="w-10 h-10 text-black/20 mx-auto mb-4" aria-hidden="true" />
              <h2 id="faq-title" className="text-3xl font-bold text-black mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-black/50 text-sm">
                Everything you need to know before getting started
              </p>
            </div>
          </FadeUp>

          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <FadeUp key={i} delay={i * 0.05}>
                <FaqItem q={faq.q} a={faq.a} lang={language} />
              </FadeUp>
            ))}
          </div>

          <FadeUp delay={0.3}>
            <div className="mt-12 text-center p-8 rounded-[24px] bg-[#f8f7f5] border border-black/10">
              <p className="text-black font-semibold mb-2">Still have questions?</p>
              <p className="text-black/50 text-sm mb-6">
                Our team is happy to answer any questions you might have.
              </p>
              <Link
                href="/Contact"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-black text-white text-sm font-semibold transition-all duration-300 hover:bg-black/80 hover:scale-105 active:scale-95"
              >
                Contact Us <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      <Footer />
    </main>
  );
}
