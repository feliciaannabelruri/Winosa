"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Monitor } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslate } from "@/lib/useTranslate";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translateHybrid } from "@/lib/translateHybrid";

type Item = {
  _id?: string;
  title: string;
  desc?: string;
  description?: string;
  image?: string;
  icon?: string;
  slug?: string;
  isTranslating?: boolean;
};

export default function SectionPreview({ title, items = [] }: any) {
  const { t, tApi } = useTranslate();
  const { language } = useLanguageStore();

  const [data, setData] = useState<Item[]>([]);
  const previewItems = data.slice(0, 3);

  useEffect(() => {
  let cancelled = false;

  const initial = (items || []).map((item: Item) => ({
    ...item,
    isTranslating: true,
  }));

  setData(initial);

  let chain = Promise.resolve();

  initial.forEach((item: Item, index: number) => {
    chain = chain.then(async () => {
      if (cancelled) return;

      try {
        const translatedTitle = await translateHybrid(
          item.title,
          language,
          tApi
        );

        const translatedDesc = await translateHybrid(
          item.desc || item.description || "",
          language,
          tApi
        );

        if (cancelled) return;

        setData((prev) => {
          const updated = [...prev];

          if (!updated[index]) return prev;

          updated[index] = {
            ...updated[index],
            title: translatedTitle,
            desc: translatedDesc,
            description: translatedDesc,
            isTranslating: false,
          };

          return updated;
        });
      } catch (err) {
        console.error(err);

        if (cancelled) return;

        setData((prev) => {
          const updated = [...prev];

          if (!updated[index]) return prev;

          updated[index] = {
            ...updated[index],
            isTranslating: false,
          };

          return updated;
        });
      }
    });
  });

  return () => {
    cancelled = true;
  };
}, [items, language]);


  function getTranslatedTitle() {
    if (title === "Our Services") return t("preview", "services");
    if (title === "Our Portfolio") return t("preview", "portfolio");
    if (title === "Latest Blog") return t("preview", "blog");
    return title;
  }

  return (
    <section className="w-full bg-white py-20">
      <div className="max-w-7xl mx-auto px-8">

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center text-4xl font-bold text-black mb-12"
        >
          {getTranslatedTitle()}
        </motion.h2>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-10">
          {previewItems.map((item: Item, index: number) => {
            const uniqueKey =
              item._id ?? item.slug ?? `${item.title}-${index}`;

            return (
              <motion.div
                key={uniqueKey}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="group relative h-[380px]"
              >
                <div className="relative h-full rounded-[28px] overflow-hidden bg-white border border-black/5 shadow-[0_20px_50px_rgba(0,0,0,0.15),0_10px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_40px_100px_rgba(0,0,0,0.25),0_20px_40px_rgba(0,0,0,0.12)] transition duration-500">

                  {item.image ? (
                    <>
                      {/* IMAGE */}
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover transition duration-700 group-hover:scale-110"
                      />

                      {/* GRADIENT (CUMA BAWAH) */}
                      <div className="absolute bottom-0 left-0 w-full h-[45%] bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                      {/* TEXT */}
                      <div className="absolute bottom-0 p-6 text-white">
                        <h3 className="text-lg font-semibold mb-2 drop-shadow-[0_3px_10px_rgba(0,0,0,0.6)]">
                          {item.title}
                        </h3>

                        <p className="text-white/90 text-sm line-clamp-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
                          {item.desc || item.description}
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col justify-center items-center h-full p-10 text-center">
                      <Monitor
                        size={42}
                        strokeWidth={1.5}
                        className="text-black mb-4"
                      />

                      <h3 className="text-lg font-semibold text-black mb-3">
                        {item.title}
                      </h3>

                      <p className="text-gray-600 text-sm line-clamp-3">
                        {item.desc || item.description}
                      </p>
                    </div>
                  )}

                  {/* Loading */}
                  {item.isTranslating && (
                    <div className="absolute inset-0 border border-yellow-400 rounded-[28px] animate-pulse pointer-events-none" />
                  )}

                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}