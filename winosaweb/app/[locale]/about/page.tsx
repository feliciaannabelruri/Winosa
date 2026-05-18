/**
 * About Page — SERVER COMPONENT
 * All data is fetched + translated at build/request time.
 * The browser receives fully-translated HTML → zero flicker, perfect SEO.
 */

import { getT, translateObject, translateArray } from "@/lib/serverTranslate";
import AboutClient from "@/components/about/AboutClient";
import type { AboutData } from "@/components/about/AboutClient";

export const revalidate = 60;

type Params = { params: Promise<{ locale: string }> };

/* ─── SEO Metadata ──────────────────────────────────────────────────── */
export async function generateMetadata({ params }: Params) {
  const { locale } = await params;

  const titles: Record<string, string> = {
    en: "About Us | Winosa Digital Agency",
    nl: "Over Ons | Winosa Digital Agency",
    id: "Tentang Kami | Winosa Digital Agency",
  };
  const descs: Record<string, string> = {
    en: "Learn about Winosa – an innovative digital agency from Bandar Lampung focused on technology, design, and business growth.",
    nl: "Leer meer over Winosa – een innovatief digitaal bureau uit Bandar Lampung gericht op technologie, ontwerp en bedrijfsgroei.",
    id: "Pelajari tentang Winosa – agensi digital inovatif dari Bandar Lampung yang berfokus pada teknologi, desain, dan pertumbuhan bisnis.",
  };

  return {
    title: titles[locale] ?? titles.en,
    description: descs[locale] ?? descs.en,
    alternates: {
      canonical: `/${locale}/about`,
      languages: { en: "/en/about", nl: "/nl/about", id: "/id/about" },
    },
    openGraph: {
      title: titles[locale] ?? titles.en,
      description: descs[locale] ?? descs.en,
    },
  };
}

/* ─── Fallback data (if API is offline) ─────────────────────────────── */
const FALLBACK_ABOUT: AboutData = {
  heroLabel:      "About Us",
  heroTitle:      "We Help You Build Your Digital Future",
  heroDesc:       "A team of developers, designers, and strategists from Bandar Lampung dedicated to world-class digital solutions.",
  scenario1Title: "No IT knowledge?",
  scenario1Desc:  "We handle everything from planning to deployment.",
  scenario2Title: "Already have a system?",
  scenario2Desc:  "We upgrade, scale, and secure your existing infrastructure.",
  workWithUs:     "Work With Us",
  viewPortfolio:  "View Portfolio",
  clientFocus:    "Client Focus",
  ourStoryLabel:  "Our Story",
  storyTitle:     "How we started",
  storyP1:        "Winosa began with a simple idea: make quality digital solutions accessible to local businesses.",
  storyP2:        "We believe in the power of digital transformation.",
  storyP3:        "Today, we help clients around the globe.",
  serviceTags:    ["Web Development", "Mobile App", "UI/UX Design", "IT Consulting"],
  whatDrivesUs:   "What Drives Us",
  ourCoreValues:  "Our Core Values",
  coreValuesDesc: "The principles that guide our work and our team.",
  directionLabel: "Direction",
  missionTitle:   "Our Mission",
  missionDesc:    "To empower businesses with innovative technology solutions.",
  visionTitle:    "Our Vision",
  visionDesc:     "To be the leading digital agency in Southeast Asia.",
  peopleLabel:    "Our People",
  meetTheTeam:    "Meet the Team",
  meetTheTeamDesc:"The talented individuals behind our success.",
  getInTouch:     "Get In Touch",
  stats: [
    { label: "Projects Done",    value: "50+" },
    { label: "Happy Clients",    value: "30+" },
    { label: "Team Members",     value: "10+" },
    { label: "Years Experience", value: "3+"  },
  ],
  values: [
    { key: "innovation",  title: "Innovation",  desc: "We constantly push boundaries to deliver cutting-edge digital solutions." },
    { key: "integrity",   title: "Integrity",   desc: "Every commitment we make is backed by transparency, honesty, and accountability." },
    { key: "partnership", title: "Partnership", desc: "We believe in building long-term relationships with our clients." },
    { key: "impact",      title: "Impact",      desc: "Every solution we create is measured by real business value." },
  ],
  whyUs: [
    { label: "Custom Built",         desc: "Tailored to your exact needs." },
    { label: "Security First",       desc: "Your data is always protected." },
    { label: "Multilingual Support", desc: "ID · EN · NL" },
  ],
};

/* ─── Page ──────────────────────────────────────────────────────────── */
export default async function AboutPage({ params }: Params) {
  const { locale } = await params;
  const api = process.env.NEXT_PUBLIC_API_URL;

  /* Fetch all data in parallel */
  const [aboutRes, teamRes, settingsRes, glassRes] = await Promise.allSettled([
    fetch(`${api}/content/about`,  { cache: "no-store" }).then(r => r.json()),
    fetch(`${api}/content/team`,   { cache: "no-store" }).then(r => r.json()),
    fetch(`${api}/settings`,       { cache: "no-store" }).then(r => r.json()),
    fetch(`${api}/content/glass`,  { cache: "no-store" }).then(r => r.json()),
  ]);

  const rawAbout    = aboutRes.status    === "fulfilled" ? aboutRes.value?.data    : null;
  const rawTeam     = teamRes.status     === "fulfilled" ? teamRes.value?.data     : [];
  const rawSettings = settingsRes.status === "fulfilled" ? settingsRes.value?.data : null;
  const glassData   = glassRes.status    === "fulfilled" ? glassRes.value?.data    : null;

  /* ── Translate About Content ───────────────────────────────────────── */
  let about: AboutData = FALLBACK_ABOUT;

  if (rawAbout) {
    // Translate all scalar fields at once (parallel Google calls)
    const translatedScalars = await translateObject(locale, {
      heroLabel:      rawAbout.heroLabel      ?? FALLBACK_ABOUT.heroLabel!,
      heroTitle:      rawAbout.heroTitle      ?? FALLBACK_ABOUT.heroTitle!,
      heroDesc:       rawAbout.heroDesc       ?? FALLBACK_ABOUT.heroDesc!,
      scenario1Title: rawAbout.scenario1Title ?? FALLBACK_ABOUT.scenario1Title!,
      scenario1Desc:  rawAbout.scenario1Desc  ?? FALLBACK_ABOUT.scenario1Desc!,
      scenario2Title: rawAbout.scenario2Title ?? FALLBACK_ABOUT.scenario2Title!,
      scenario2Desc:  rawAbout.scenario2Desc  ?? FALLBACK_ABOUT.scenario2Desc!,
      workWithUs:     rawAbout.workWithUs     ?? FALLBACK_ABOUT.workWithUs!,
      viewPortfolio:  rawAbout.viewPortfolio  ?? FALLBACK_ABOUT.viewPortfolio!,
      clientFocus:    rawAbout.clientFocus    ?? FALLBACK_ABOUT.clientFocus!,
      ourStoryLabel:  rawAbout.ourStoryLabel  ?? FALLBACK_ABOUT.ourStoryLabel!,
      storyTitle:     rawAbout.storyTitle     ?? FALLBACK_ABOUT.storyTitle!,
      storyP1:        rawAbout.storyP1        ?? FALLBACK_ABOUT.storyP1!,
      storyP2:        rawAbout.storyP2        ?? FALLBACK_ABOUT.storyP2!,
      storyP3:        rawAbout.storyP3        ?? FALLBACK_ABOUT.storyP3!,
      whatDrivesUs:   rawAbout.whatDrivesUs   ?? FALLBACK_ABOUT.whatDrivesUs!,
      ourCoreValues:  rawAbout.ourCoreValues  ?? FALLBACK_ABOUT.ourCoreValues!,
      coreValuesDesc: rawAbout.coreValuesDesc ?? FALLBACK_ABOUT.coreValuesDesc!,
      directionLabel: rawAbout.directionLabel ?? FALLBACK_ABOUT.directionLabel!,
      missionTitle:   rawAbout.missionTitle   ?? FALLBACK_ABOUT.missionTitle!,
      missionDesc:    rawAbout.missionDesc    ?? FALLBACK_ABOUT.missionDesc!,
      visionTitle:    rawAbout.visionTitle    ?? FALLBACK_ABOUT.visionTitle!,
      visionDesc:     rawAbout.visionDesc     ?? FALLBACK_ABOUT.visionDesc!,
      peopleLabel:    rawAbout.peopleLabel    ?? FALLBACK_ABOUT.peopleLabel!,
      meetTheTeam:    rawAbout.meetTheTeam    ?? FALLBACK_ABOUT.meetTheTeam!,
      meetTheTeamDesc:rawAbout.meetTheTeamDesc ?? FALLBACK_ABOUT.meetTheTeamDesc!,
      getInTouch:     rawAbout.getInTouch     ?? FALLBACK_ABOUT.getInTouch!,
    });

    // Translate arrays in parallel
    const [translatedStats, translatedValues, translatedWhyUs, translatedTags] = await Promise.all([
      translateArray(locale, rawAbout.stats   ?? FALLBACK_ABOUT.stats!,   ["label"]),
      translateArray(locale, rawAbout.values  ?? FALLBACK_ABOUT.values!,  ["title", "desc"]),
      translateArray(locale, rawAbout.whyUs   ?? FALLBACK_ABOUT.whyUs!,   ["label", "desc"]),
      Promise.all((rawAbout.serviceTags ?? FALLBACK_ABOUT.serviceTags ?? []).map(
        (tag: string) => import("@/lib/serverTranslate").then(m => m.translateText(tag, locale))
      )),
    ]);

    about = {
      ...translatedScalars,
      stats:       translatedStats,
      values:      translatedValues,
      whyUs:       translatedWhyUs,
      serviceTags: translatedTags,
    };
  } else {
    // Use fallback but still translate it
    if (locale !== "en") {
      const [scalars, stats, values, whyUs] = await Promise.all([
        translateObject(locale, {
          heroLabel: FALLBACK_ABOUT.heroLabel!, heroTitle: FALLBACK_ABOUT.heroTitle!,
          heroDesc: FALLBACK_ABOUT.heroDesc!, scenario1Title: FALLBACK_ABOUT.scenario1Title!,
          scenario1Desc: FALLBACK_ABOUT.scenario1Desc!, scenario2Title: FALLBACK_ABOUT.scenario2Title!,
          scenario2Desc: FALLBACK_ABOUT.scenario2Desc!, workWithUs: FALLBACK_ABOUT.workWithUs!,
          viewPortfolio: FALLBACK_ABOUT.viewPortfolio!, clientFocus: FALLBACK_ABOUT.clientFocus!,
          ourStoryLabel: FALLBACK_ABOUT.ourStoryLabel!, storyTitle: FALLBACK_ABOUT.storyTitle!,
          storyP1: FALLBACK_ABOUT.storyP1!, storyP2: FALLBACK_ABOUT.storyP2!,
          storyP3: FALLBACK_ABOUT.storyP3!, whatDrivesUs: FALLBACK_ABOUT.whatDrivesUs!,
          ourCoreValues: FALLBACK_ABOUT.ourCoreValues!, coreValuesDesc: FALLBACK_ABOUT.coreValuesDesc!,
          directionLabel: FALLBACK_ABOUT.directionLabel!, missionTitle: FALLBACK_ABOUT.missionTitle!,
          missionDesc: FALLBACK_ABOUT.missionDesc!, visionTitle: FALLBACK_ABOUT.visionTitle!,
          visionDesc: FALLBACK_ABOUT.visionDesc!, peopleLabel: FALLBACK_ABOUT.peopleLabel!,
          meetTheTeam: FALLBACK_ABOUT.meetTheTeam!, meetTheTeamDesc: FALLBACK_ABOUT.meetTheTeamDesc!,
          getInTouch: FALLBACK_ABOUT.getInTouch!,
        }),
        translateArray(locale, FALLBACK_ABOUT.stats!,  ["label"]),
        translateArray(locale, FALLBACK_ABOUT.values!, ["title", "desc"]),
        translateArray(locale, FALLBACK_ABOUT.whyUs!,  ["label", "desc"]),
      ]);
      about = { ...scalars, stats, values, whyUs, serviceTags: FALLBACK_ABOUT.serviceTags };
    }
  }

  /* ── Translate Team ────────────────────────────────────────────────── */
  const team = rawTeam?.length
    ? await translateArray(locale, rawTeam.sort((a: any, b: any) => a.order - b.order), ["role"])
    : [];

  return (
    <AboutClient
      about={about}
      team={team}
      settings={rawSettings}
      glassImages={glassData}
      locale={locale}
    />
  );
}