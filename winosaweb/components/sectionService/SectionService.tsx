"use client";

import { useEffect, useState } from "react";
import {
  Monitor,
  Briefcase,
  Smartphone,
  CloudCog,
  Palette,
  Shield,
  Code,
  TrendingUp,
} from "lucide-react";
import { motion } from "framer-motion";
import { useLanguageStore } from "@/store/useLanguageStore";
import { useTranslate } from "@/lib/useTranslate";
import { translateHybrid } from "@/lib/translateHybrid";

type Service = {
  _id: string;
  title: string;
  description: string;
  icon?: string;
  slug: string;
};

const iconMap: Record<string, any> = {
  monitor: Monitor,
  briefcase: Briefcase,
  smartphone: Smartphone,
  cloud: CloudCog,
  palette: Palette,
  shield: Shield,
  mobile: Smartphone,
  code: Code,
  "trending-up": TrendingUp,
};

type Props = {
  initialServices?: Service[];
};

export default function SectionServices({ initialServices }: Props) {
  const { language } = useLanguageStore();
  const { tApi } = useTranslate();

  const [services, setServices] = useState<Service[]>(
    Array.isArray(initialServices) ? initialServices : []
  );

  useEffect(() => {
    if (!initialServices || initialServices.length === 0) return;

    if (language === "en") {
      setServices(initialServices);
      return;
    }

    const translateAll = async () => {
      try {
        const updated = await Promise.all(
          initialServices.map(async (item) => {
            const translatedTitle = await translateHybrid(
              item.title,
              language,
              tApi
            );
            const translatedDesc = await translateHybrid(
              item.description,
              language,
              tApi
            );

            return {
              ...item,
              title: translatedTitle,
              description: translatedDesc,
            };
          })
        );

        setServices(updated);
      } catch (err) {
        console.error("Translate error:", err);
        setServices(initialServices); // fallback
      }
    };

    translateAll();
  }, [language, initialServices]);

  return (
    <section className="w-full bg-white py-32">
      <div className="max-w-7xl mx-auto px-6 text-black">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">

          {services.length === 0 ? (
            <p className="text-center col-span-2">
              No services available
            </p>
          ) : (
            services.map((item, index) => {
              const IconComponent =
                iconMap[item.icon?.toLowerCase() || ""] || Monitor;

              return (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 80 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.15,
                  }}
                  viewport={{ once: true }}
                >
                  <motion.div
                    whileHover={{ y: -8 }}
                    className="group relative h-full"
                  >
                    <div className="relative h-full flex flex-col bg-white rounded-[28px] p-10 shadow-[0_12px_30px_rgba(0,0,0,0.15)]">

                      <div className="flex items-start gap-6 mb-6">
                        <div className="w-16 h-16 flex items-center justify-center rounded-full border border-black flex-shrink-0">
                          <IconComponent size={28} strokeWidth={1.5} />
                        </div>

                        <h3 className="text-xl font-semibold leading-tight pt-3">
                          {item.title}
                        </h3>
                      </div>

                      <p className="text-gray-600 leading-relaxed">
                        {item.description}
                      </p>

                    </div>
                  </motion.div>
                </motion.div>
              );
            })
          )}

        </div>
      </div>
    </section>
  );
}