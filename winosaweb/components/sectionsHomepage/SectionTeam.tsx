"use client";

import { useEffect, useState } from "react";
import { useTranslate } from "@/lib/useTranslate";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translateHybrid } from "@/lib/translateHybrid";
import Image from "next/image";

interface TeamMember {
  _id: string;
  name: string;
  role: string;
  image: string;
  order: number;
}

export default function SectionTeam() {
  const { t, tApi } = useTranslate();
  const { language } = useLanguageStore();

  const [team, setTeam] = useState<TeamMember[]>([]);
  const [active, setActive] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/content/team`)
      .then(r => r.json())
      .then(async data => {
        let members: TeamMember[] = data?.data ?? [];

        members = members.sort((a: TeamMember, b: TeamMember) => a.order - b.order);

        const translated = await Promise.all(
          members.map(async (m: TeamMember) => ({
            ...m,
            role: await translateHybrid(m.role, language, tApi),
          }))
        );

        setTeam(translated);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, [language]);

  useEffect(() => {
    if (team.length < 2) return;
    const interval = setInterval(() => {
      setActive(prev => (prev + 1) % team.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [team.length]);

  const getPosition = (index: number) => {
    if (team.length === 0) return "hidden";
    if (index === active) return "center";
    if (index === (active - 1 + team.length) % team.length) return "left";
    if (index === (active + 1) % team.length) return "right";
    return "hidden";
  };

  if (!loaded) {
    return (
      <section className="w-full bg-white py-24 md:py-40">
        <div role="status" aria-live="polite" className="text-center">Loading...</div>
      </section>
    );
  }

  if (team.length === 0) return null;

  return (
    <section className="w-full bg-white py-24 md:py-40" aria-labelledby="team-title">
      <div className="max-w-7xl mx-auto px-6 text-black">

        <div className="text-center mb-14 md:mb-16">
          <h2 
            id="team-title"
            className="text-3xl md:text-4xl font-bold mb-4">
            {t("team", "title")}
          </h2>

          <p className="text-black/60 max-w-2xl mx-auto">
            {t("team", "subtitle")}
          </p>
        </div>

        <div className="relative h-[420px] md:h-[520px] flex items-center justify-center"
        role="region"
          aria-label="Team members carousel"
          aria-live="polite"
        >

          {team.map((member, i) => {

            const position = getPosition(i);

            let styles = "";
            if (position === "center") {
              styles = "translate-x-0 scale-100 z-30 opacity-100";
            } else if (position === "left") {
              styles = "-translate-x-[45vw] md:-translate-x-[320px] scale-90 z-20 opacity-60";
            } else if (position === "right") {
              styles = "translate-x-[45vw] md:translate-x-[320px] scale-90 z-20 opacity-60";
            } else {
              styles = "opacity-0 scale-75";
            }

            return (
              <div
                key={member._id}
                className={`absolute transition-all duration-700 ease-in-out ${styles}`}
              >
                <div className="w-[300px] h-[400px] bg-white border border-black rounded-[28px] overflow-hidden" role="article"
                  aria-label={`Team member ${member.name}`}>

                  <img
                    src={member.image}
                    alt={member.name}
                    width={300}
                    height={256}
                    className="w-full h-64 object-cover"
                  />

                  <div className="p-5 text-center">
                    <h3 className="font-bold">{member.name}</h3>
                    <p className="text-black/60">{member.role}</p>
                  </div>

                </div>
              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}