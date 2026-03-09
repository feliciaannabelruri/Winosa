"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Monitor } from "lucide-react";
import { useTranslate } from "@/lib/useTranslate";

type Item = {
  _id?: string;
  title: string;
  desc?: string;
  description?: string;
  image?: string;
  icon?: string;
  slug?: string;
};

export default function SectionPreview({ title, items = [] }: any) {
  const { t } = useTranslate();

  const previewItems = items.slice(0, 3);

  function getTranslatedTitle() {
    if (title === "Our Services") return t("preview", "services");
    if (title === "Our Portfolio") return t("preview", "portfolio");
    if (title === "Latest Blog") return t("preview", "blog");
    return title;
  }

  return (
    <section className="w-full bg-white py-32">
      <div className="max-w-7xl mx-auto px-8">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center text-4xl font-bold text-black mb-16"
        >
          {getTranslatedTitle()}
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-16">
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
                whileHover={{ y: -12 }}
                className="group relative h-[420px]"
              >
                <div className="absolute -inset-12 opacity-0 blur-[100px] transition duration-500 group-hover:opacity-100 bg-[radial-gradient(circle,rgba(255,185,0,0.8)_0%,rgba(255,185,0,0.4)_40%,transparent_75%)]" />

                <div className="relative h-full rounded-[32px] overflow-hidden bg-white shadow-[0_25px_60px_rgba(0,0,0,0.08)] transition duration-500 group-hover:shadow-[0_40px_90px_rgba(0,0,0,0.15)]">
                  {item.image ? (
                    <div className="relative h-full overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover transition duration-700 group-hover:scale-110"
                      />

                      <div className="absolute bottom-0 p-8 text-black">
                        <h3 className="text-xl font-semibold mb-2">
                          {item.title}
                        </h3>

                        <p className="text-gray-600 text-sm line-clamp-2">
                          {item.desc || item.description}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col justify-center items-center h-full p-10 text-center">
                      <div className="mb-6 flex justify-center">
                        <Monitor size={48} strokeWidth={1.5} className="text-black" />
                      </div>

                      <h3 className="text-xl font-semibold text-black mb-4">
                        {item.title}
                      </h3>

                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                        {item.desc}
                      </p>
                    </div>
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