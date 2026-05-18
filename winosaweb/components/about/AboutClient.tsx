"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/layout/Footer";
import SectionCTA from "@/components/layout/SectionCTA";
import FadeUp from "@/components/animation/FadeUp";
import { useLocaleRouter } from "@/lib/useLocaleRouter";
import {
  Target, Rocket, ShieldCheck, Users, Globe,
  Award, TrendingUp, Code2,
} from "lucide-react";

/* ─── Types ─────────────────────────────────────────────────────────── */
export interface AboutData {
  heroLabel?: string;
  heroTitle?: string;
  heroDesc?: string;
  scenario1Title?: string;
  scenario1Desc?: string;
  scenario2Title?: string;
  scenario2Desc?: string;
  workWithUs?: string;
  viewPortfolio?: string;
  clientFocus?: string;
  ourStoryLabel?: string;
  storyTitle?: string;
  storyP1?: string;
  storyP2?: string;
  storyP3?: string;
  serviceTags?: string[];
  whatDrivesUs?: string;
  ourCoreValues?: string;
  coreValuesDesc?: string;
  directionLabel?: string;
  missionTitle?: string;
  missionDesc?: string;
  visionTitle?: string;
  visionDesc?: string;
  peopleLabel?: string;
  meetTheTeam?: string;
  meetTheTeamDesc?: string;
  getInTouch?: string;
  stats?: { label?: string; value?: string; [key: string]: any }[];
  values?: { key?: string; title?: string; desc?: string; [key: string]: any }[];
  whyUs?: { label?: string; desc?: string; [key: string]: any }[];
}

export interface TeamMember {
  _id?: string;
  name?: string;
  role?: string;
  image?: string;
  order?: number;
  [key: string]: any;
}

export interface Settings {
  siteName?: string;
  companyEmail?: string;
  companyPhone?: string;
  companyAddress?: string;
}

interface Props {
  about: AboutData;
  team: TeamMember[];
  settings: Settings | null;
  glassImages: any;
  locale: string;
}

/* ─── Static icon maps ──────────────────────────────────────────────── */
const VALUE_ICONS: Record<string, any> = {
  innovation: Rocket,
  integrity: ShieldCheck,
  partnership: Users,
  impact: Target,
};
const WHY_US_ICONS = [Code2, ShieldCheck, Globe];

/* ─── Component ─────────────────────────────────────────────────────── */
export default function AboutClient({ about, team, settings, glassImages, locale }: Props) {
  const { localePath } = useLocaleRouter();
  const [activeTeam, setActiveTeam] = useState(0);

  // Auto-cycle team carousel
  useEffect(() => {
    if (team.length < 2) return;
    const interval = setInterval(() => {
      setActiveTeam((prev) => (prev + 1) % team.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [team.length]);

  const getPos = (i: number) => {
    if (!team.length) return "hidden";
    if (i === activeTeam) return "center";
    if (i === (activeTeam - 1 + team.length) % team.length) return "left";
    if (i === (activeTeam + 1) % team.length) return "right";
    return "hidden";
  };

  return (
    <main aria-label="About Us page" className="w-full bg-white overflow-x-hidden">

      {/* ── HERO ── */}
      <section
        className="relative w-full min-h-[85vh] flex flex-col items-center justify-center text-center overflow-hidden px-6 pt-32 pb-20"
        aria-labelledby="about-hero-title"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#f8f7f5] via-[#fbfaf8] to-white z-0" />
        <div className="absolute top-[10%] right-[15%] w-[500px] h-[500px] rounded-full bg-yellow-400/10 blur-[120px] z-0 pointer-events-none" aria-hidden="true" />
        <div className="absolute bottom-[20%] left-[10%] w-[400px] h-[400px] rounded-full bg-orange-400/5 blur-[100px] z-0 pointer-events-none" aria-hidden="true" />
        <div
          className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block px-5 py-1.5 rounded-full border border-black/10 bg-white/50 backdrop-blur-sm text-black/70 text-xs font-bold tracking-widest uppercase mb-6 shadow-sm"
          >
            {about.heroLabel}
          </motion.span>

          <motion.h1
            id="about-hero-title"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold text-black mb-6 leading-tight tracking-tight"
          >
            {about.heroTitle}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="text-black/60 text-lg max-w-2xl mx-auto leading-relaxed mb-8"
          >
            {about.heroDesc}
          </motion.p>

          {/* Scenario Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto mb-8 text-left"
          >
            <div className="p-5 rounded-2xl border border-black/10 bg-white/60 backdrop-blur-sm shadow-sm">
              <p className="font-bold text-sm text-black mb-1">{about.scenario1Title}</p>
              <p className="text-sm text-black/60 leading-relaxed">{about.scenario1Desc}</p>
            </div>
            <div className="p-5 rounded-2xl border border-black/10 bg-white/60 backdrop-blur-sm shadow-sm">
              <p className="font-bold text-sm text-black mb-1">{about.scenario2Title}</p>
              <p className="text-sm text-black/60 leading-relaxed">{about.scenario2Desc}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <Link
              href={localePath("/Contact")}
              className="px-8 py-3.5 rounded-full bg-black text-white font-semibold text-sm transition-all duration-300 hover:bg-black/80 hover:shadow-lg hover:shadow-black/20 hover:-translate-y-0.5 active:scale-95"
            >
              {about.workWithUs}
            </Link>
            <Link
              href={localePath("/portofolio")}
              className="px-8 py-3.5 rounded-full border-2 border-black/10 bg-white text-black font-semibold text-sm transition-all duration-300 hover:border-black/30 hover:bg-black/5 hover:-translate-y-0.5 active:scale-95 shadow-sm"
            >
              {about.viewPortfolio}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="w-full py-12 bg-white" aria-label="Company statistics">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {(about.stats || []).map((s, i) => (
              <FadeUp key={i} delay={i * 0.1}>
                <div className="text-center group cursor-default">
                  <p className="text-5xl font-bold text-black mb-2 transition-transform duration-300 group-hover:-translate-y-1">
                    {s.value}
                  </p>
                  <p className="text-black/50 text-sm">{s.label}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── STORY ── */}
      <section className="w-full py-16 bg-[#f8f7f5]" aria-labelledby="story-title">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <FadeUp>
            <div className="relative w-full aspect-[4/5] max-w-md mx-auto lg:mx-0 group mt-8 lg:mt-0">
              <div className="absolute inset-0 rounded-[32px] overflow-hidden border border-black/10 bg-gray-200 shadow-xl">
                <Image
                  src={glassImages?.whoWeAre?.image1 || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop"}
                  alt="Winosa Team Collaboration"
                  fill unoptimized
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="absolute -bottom-10 -right-8 w-2/3 aspect-[4/3] rounded-[24px] overflow-hidden border-8 border-[#f8f7f5] shadow-2xl bg-gray-200 hidden md:block">
                <Image
                  src={glassImages?.whoWeAre?.image2 || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=600&auto=format&fit=crop"}
                  alt="Winosa Tech Setup"
                  fill unoptimized
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="absolute top-10 -left-6 md:-left-12 bg-white p-4 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] border border-black/5 flex items-center gap-4 animate-[bounce_4s_infinite]">
                <div className="w-12 h-12 bg-yellow-400/10 rounded-full flex items-center justify-center text-yellow-600">
                  <Target className="w-6 h-6" />
                </div>
                <div className="pr-2">
                  <p className="text-2xl font-black text-black">100%</p>
                  <p className="text-xs text-black/50 font-bold tracking-wide uppercase mt-0.5">{about.clientFocus}</p>
                </div>
              </div>
            </div>
          </FadeUp>

          <FadeUp delay={0.15}>
            <span className="inline-block text-xs font-semibold text-yellow-600 tracking-widest uppercase mb-4">
              {about.ourStoryLabel}
            </span>
            <h2 id="story-title" className="text-4xl font-bold text-black mb-6 leading-snug">
              {about.storyTitle}
            </h2>
            <div className="space-y-4 text-black/70 leading-relaxed">
              <p>{about.storyP1}</p>
              <p>{about.storyP2}</p>
              <p>{about.storyP3}</p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              {(about.serviceTags || []).map((tag) => (
                <span key={tag} className="px-4 py-1.5 rounded-full bg-black/5 border border-black/10 text-black text-sm font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="w-full py-16 bg-white" aria-labelledby="values-title">
        <div className="max-w-7xl mx-auto px-6">
          <FadeUp>
            <div className="text-center mb-16">
              <span className="text-xs font-semibold text-yellow-600 tracking-widest uppercase">
                {about.whatDrivesUs}
              </span>
              <h2 id="values-title" className="text-4xl font-bold text-black mt-3 mb-4">
                {about.ourCoreValues}
              </h2>
              <p className="text-black/50 max-w-xl mx-auto">{about.coreValuesDesc}</p>
            </div>
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(about.values || []).map((v, i) => {
              const Icon = (v.key ? VALUE_ICONS[v.key] : null) ?? Target;
              return (
                <FadeUp key={v.key || i} delay={i * 0.1}>
                  <div className="group relative p-8 rounded-[28px] border border-black/10 bg-white transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] hover:border-black/20 overflow-hidden">
                    <div className="pointer-events-none absolute -inset-6 rounded-[40px] bg-[radial-gradient(circle,rgba(255,200,0,0.3)_0%,transparent_70%)] opacity-0 blur-[60px] transition-all duration-500 group-hover:opacity-100" aria-hidden="true" />
                    <div className="relative">
                      <div className="w-12 h-12 rounded-2xl bg-yellow-400/10 flex items-center justify-center mb-5 group-hover:bg-yellow-400/20 transition-colors duration-300">
                        <Icon className="w-6 h-6 text-yellow-500" aria-hidden="true" />
                      </div>
                      <h3 className="text-xl font-bold text-black mb-3">{v.title}</h3>
                      <p className="text-black/60 text-sm leading-relaxed">{v.desc}</p>
                    </div>
                  </div>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── MISSION & VISION ── */}
      <section className="w-full py-16 bg-black text-white overflow-hidden" aria-labelledby="mission-vision-title">
        <div className="max-w-7xl mx-auto px-6">
          <FadeUp>
            <div className="text-center mb-16">
              <span className="text-xs font-semibold text-yellow-400 tracking-widest uppercase">
                {about.directionLabel}
              </span>
              <h2 id="mission-vision-title" className="text-4xl font-bold mt-3">
                {about.missionTitle} & {about.visionTitle}
              </h2>
            </div>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FadeUp delay={0.1}>
              <div className="relative p-10 rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden group hover:border-yellow-400/30 transition-colors duration-500">
                <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-yellow-400/5 blur-[60px] group-hover:bg-yellow-400/10 transition-all duration-500" aria-hidden="true" />
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center mb-6">
                    <TrendingUp className="w-7 h-7 text-yellow-400" aria-hidden="true" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{about.missionTitle}</h3>
                  <p className="text-white/60 leading-relaxed">{about.missionDesc}</p>
                </div>
              </div>
            </FadeUp>

            <FadeUp delay={0.2}>
              <div className="relative p-10 rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden group hover:border-yellow-400/30 transition-colors duration-500">
                <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-yellow-400/5 blur-[60px] group-hover:bg-yellow-400/10 transition-all duration-500" aria-hidden="true" />
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center mb-6">
                    <Award className="w-7 h-7 text-yellow-400" aria-hidden="true" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{about.visionTitle}</h3>
                  <p className="text-white/60 leading-relaxed">{about.visionDesc}</p>
                </div>
              </div>
            </FadeUp>
          </div>

          {/* Why Us */}
          <FadeUp delay={0.3}>
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
              {(about.whyUs || []).map((item, i) => {
                const Icon = WHY_US_ICONS[i] ?? Code2;
                return (
                  <div key={item.label} className="flex gap-4 p-6 rounded-2xl border border-white/10 hover:border-yellow-400/20 transition-colors duration-300">
                    <Icon className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <p className="font-semibold text-white text-sm">{item.label}</p>
                      <p className="text-white/40 text-xs mt-1">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── TEAM ── */}
      {team.length > 0 && (
        <section className="w-full py-16 bg-white" aria-labelledby="about-team-title">
          <div className="max-w-7xl mx-auto px-6">
            <FadeUp>
              <div className="text-center mb-16">
                <span className="text-xs font-semibold text-yellow-600 tracking-widest uppercase">
                  {about.peopleLabel}
                </span>
                <h2 id="about-team-title" className="text-4xl font-bold text-black mt-3 mb-4">
                  {about.meetTheTeam}
                </h2>
                <p className="text-black/50 max-w-xl mx-auto">{about.meetTheTeamDesc}</p>
              </div>
            </FadeUp>

            <div className="relative h-[460px] flex items-center justify-center" aria-label="Team members carousel" aria-live="polite" role="region">
              {team.map((member, i) => {
                const pos = getPos(i);
                let cls = "";
                if (pos === "center") cls = "translate-x-0 scale-100 z-30 opacity-100";
                else if (pos === "left") cls = "-translate-x-[45vw] md:-translate-x-[330px] scale-90 z-20 opacity-50";
                else if (pos === "right") cls = "translate-x-[45vw] md:translate-x-[330px] scale-90 z-20 opacity-50";
                else cls = "opacity-0 scale-75";

                return (
                  <div key={member._id} className={`absolute transition-all duration-700 ease-in-out ${cls}`}>
                    <article className="w-[300px] bg-white border border-black rounded-[28px] overflow-hidden shadow-sm" aria-label={`Team member ${member.name || ""}`}>
                      <div className="h-64 w-full bg-gray-100 relative">
                        {member.image && (
                          <Image src={member.image || ""} alt={member.name || ""} fill className="object-cover" sizes="300px" />
                        )}
                      </div>
                      <div className="p-5 text-center">
                        <h3 className="font-bold text-black">{member.name}</h3>
                        <p className="text-black/50 text-sm mt-1">{member.role}</p>
                      </div>
                    </article>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-center gap-2 mt-8">
              {team.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTeam(i)}
                  aria-label={`Go to team member ${i + 1}`}
                  className={`rounded-full transition-all duration-300 ${i === activeTeam ? "w-6 h-2 bg-black" : "w-2 h-2 bg-black/20 hover:bg-black/40"}`}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CONTACT INFO ── */}
      {settings && (settings.companyEmail || settings.companyAddress || settings.companyPhone) && (
        <section className="w-full py-16 bg-[#f8f7f5]" aria-labelledby="contact-info-title">
          <div className="max-w-7xl mx-auto px-6">
            <FadeUp>
              <h2 id="contact-info-title" className="text-2xl font-bold text-black mb-8 text-center">
                {about.getInTouch}
              </h2>
            </FadeUp>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {settings.companyEmail && (
                <FadeUp delay={0.1}>
                  <div className="p-6 bg-white rounded-[20px] border border-black/10 text-center">
                    <p className="text-xs text-black/40 uppercase tracking-wide mb-2">Email</p>
                    <a href={`mailto:${settings.companyEmail}`} className="text-black font-medium hover:underline text-sm">
                      {settings.companyEmail}
                    </a>
                  </div>
                </FadeUp>
              )}
              {settings.companyPhone && (
                <FadeUp delay={0.15}>
                  <div className="p-6 bg-white rounded-[20px] border border-black/10 text-center">
                    <p className="text-xs text-black/40 uppercase tracking-wide mb-2">Phone</p>
                    <a href={`tel:${settings.companyPhone}`} className="text-black font-medium hover:underline text-sm">
                      {settings.companyPhone}
                    </a>
                  </div>
                </FadeUp>
              )}
              {settings.companyAddress && (
                <FadeUp delay={0.2}>
                  <div className="p-6 bg-white rounded-[20px] border border-black/10 text-center">
                    <p className="text-xs text-black/40 uppercase tracking-wide mb-2">Address</p>
                    <p className="text-black font-medium text-sm">{settings.companyAddress}</p>
                  </div>
                </FadeUp>
              )}
            </div>
          </div>
        </section>
      )}

      <SectionCTA />
      <Footer />
    </main>
  );
}
