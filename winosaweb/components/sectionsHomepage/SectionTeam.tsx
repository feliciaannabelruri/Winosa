"use client";

import { useEffect, useState } from "react";
import { useTranslate } from "@/lib/useTranslate";

interface TeamMember {
  _id: string;
  name: string;
  role: string;
  image: string;
  order: number;
}

export default function SectionTeam() {
  const { t } = useTranslate();
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [active, setActive] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/content/team`)
      .then(r => r.json())
      .then(data => {
        const members: TeamMember[] = data?.data ?? [];
        members.sort((a, b) => a.order - b.order);
        setTeam(members);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

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
      <section
        aria-label="Team loading"
        className="relative w-full bg-white py-24 md:py-40 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-6 text-black">
          <div className="text-center mb-14 md:mb-16">
            <div className="h-9 w-64 bg-gray-100 rounded-full mx-auto mb-4 animate-pulse" />
            <div className="h-4 w-96 bg-gray-100 rounded-full mx-auto animate-pulse" />
          </div>
        </div>
      </section>
    );
  }

  if (loaded && team.length === 0) return null;

  return (
    <section
      aria-label="Our team members"
      role="region"
      className="relative w-full bg-white py-24 md:py-40 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 text-black">

        <div className="text-center mb-14 md:mb-16">
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            tabIndex={0}
          >
            {t("team", "title")}
          </h2>

          <p
            className="text-black/60 max-w-2xl mx-auto"
            tabIndex={0}
          >
            {t("team", "subtitle")}
          </p>
        </div>

        <div className="relative h-[420px] md:h-[520px] flex items-center justify-center">

          <div className="absolute w-[700px] md:w-[1000px] h-[700px] md:h-[900px] bg-[radial-gradient(circle,rgba(255,200,0,0.5)_0%,rgba(255,200,0,0.3)_40%,transparent_70%)] blur-[160px] md:blur-[200px] rounded-full" />

          {team.map((member, i) => {

            const position = getPosition(i);

            let styles = "";
            if (position === "center") {
              styles = "translate-x-0 scale-100 z-30 opacity-100 blur-0";
            } else if (position === "left") {
              styles = "-translate-x-[45vw] md:-translate-x-[320px] scale-90 z-20 opacity-60 blur-sm";
            } else if (position === "right") {
              styles = "translate-x-[45vw] md:translate-x-[320px] scale-90 z-20 opacity-60 blur-sm";
            } else {
              styles = "opacity-0 scale-75";
            }

            return (
              <div
                key={member._id}
                tabIndex={0}
                aria-label={`Team member ${member.name}`}
                className={`absolute transition-all duration-700 ease-in-out ${styles}`}
              >

                <div className="w-[260px] sm:w-[300px] md:w-[340px] h-[360px] sm:h-[390px] md:h-[420px] bg-white border border-black rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden">

                  {member.image ? (

                    <img
                      src={member.image}
                      loading="lazy"
                      alt={member.name}
                      className="w-full h-56 sm:h-64 md:h-72 object-cover"
                    />

                  ) : (

                    <div className="w-full h-56 sm:h-64 md:h-72 bg-gray-100 flex items-center justify-center">
                      <span className="text-gray-300 text-5xl font-bold">
                        {member.name.charAt(0)}
                      </span>
                    </div>

                  )}

                  <div className="p-5 md:p-6 text-center">
                    <h3 className="text-lg md:text-xl font-bold">
                      {member.name}
                    </h3>

                    <p className="text-black/60 font-medium text-sm mt-1">
                      {member.role}
                    </p>
                  </div>

                </div>

              </div>
            );
          })}

        </div>

      </div>

      <div className="absolute bottom-0 left-0 w-full h-[200px] md:h-[300px] bg-gradient-to-t from-white via-white to-transparent pointer-events-none" />

    </section>
  );
}