"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useTranslate } from "@/lib/useTranslate";
import { useState, useEffect } from "react";

const FadeUp = dynamic(() => import("@/components/animation/FadeUp"));

export default function SectionMap() {
  const [loadMap, setLoadMap] = useState(false);
  const { t } = useTranslate();

  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    const api = process.env.NEXT_PUBLIC_API_URL;
    if (!api) return;

    fetch(`${api}/settings`)
      .then((res) => res.json())
      .then((json) => setSettings(json?.data || null))
      .catch(() => {});
  }, []);

  // ambil address dari admin (fallback aman)
  const address =
    settings?.siteAddress || "Bandar Lampung, Indonesia";

  return (
    <FadeUp>
      <section className="w-full bg-white py-14">
        <div className="max-w-7xl mx-auto px-6 text-black">

          {/* header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="text-4xl font-bold mb-4">
              {t("map", "title")}
            </h2>

            <p className="text-black/70">
              {t("map", "subtitle")}
            </p>
          </motion.div>

          {/* map */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="rounded-[28px] overflow-hidden border border-black shadow-[0_16px_40px_rgba(0,0,0,0.08)]"
          >
            {!loadMap ? (
              <div className="flex flex-col items-center justify-center h-[450px] bg-gray-100 gap-4">

                <p className="text-black/60">
                  Click to load map
                </p>

                <button
                  onClick={() => setLoadMap(true)}
                  className="px-6 py-3 bg-black text-white rounded-full"
                >
                  Load Map
                </button>

              </div>
            ) : (
              <iframe
                title="Company location on Google Maps"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(
                  address
                )}&output=embed`}
                width="100%"
                height="450"
                loading="lazy"
                className="w-full"
              />
            )}
          </motion.div>

        </div>
      </section>
    </FadeUp>
  );
}