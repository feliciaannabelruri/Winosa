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
import { getAllServices } from "@/services/service.service";
import { translateHybrid } from "@/lib/translateHybrid";

type Service = {
  _id: string;
  title: string;
  description: string;
  icon?: string;
  slug: string;
  isTranslating?: boolean;
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

export default function SectionServices() {
  const { language } = useLanguageStore();
  const { t, tApi } = useTranslate();

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const data = await getAllServices(language);

      const initial = (data || []).map((item: Service) => ({
        ...item,
        isTranslating: true,
      }));

      setServices(initial);
      setLoading(false);

      initial.forEach(async (item: Service) => {
        const translatedTitle = await translateHybrid(item.title, language, tApi);
        const translatedDesc = await translateHybrid(item.description, language, tApi);

        setServices((prev) =>
          prev.map((s: Service) =>
            s._id === item._id
              ? {
                  ...s,
                  title: translatedTitle,
                  description: translatedDesc,
                  isTranslating: false,
                }
              : s
          )
        );
      });
    };

    fetchData();
  }, [language]);

  if (loading) {
    return (
      <section className="w-full bg-white py-32 text-center">
        <p className="animate-pulse text-gray-600">
          {t("global", "loading")}
        </p>
      </section>
    );
  }

  return (
    <section className="w-full bg-white py-32">
      <div className="max-w-7xl mx-auto px-6 text-black">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">

          {services.map((item, index) => {

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

                  {item.isTranslating && (
                    <div className="absolute inset-0 rounded-[28px] border-2 border-yellow-400 animate-pulse pointer-events-none" />
                  )}

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
          })}

        </div>
      </div>
    </section>
  );
}