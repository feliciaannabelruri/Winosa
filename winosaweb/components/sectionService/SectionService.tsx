"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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

/* SERVICE YANG BOLEH PUNYA BUTTON */
const allowedButtons = [
  "ui-ux-design",
  "mobile-app-development",
  "web-development",
];

export default function SectionServices() {
  const { language } = useLanguageStore();
  const { t } = useTranslate();

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(false);
        const data = await getAllServices(language);
        setServices(data || []);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
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

  if (error) {
    return (
      <section className="w-full bg-white py-32 text-center">
        <p className="text-red-500">
          {t("global", "error")}
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

            const showButton = allowedButtons.includes(item.slug);

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

                <Link href={`/Services/${item.slug}`}>

                  <motion.div
                    whileHover={{ y: -8 }}
                    transition={{ duration: 0.3 }}
                    className="group relative h-full"
                  >

                    <div className="absolute -inset-16 rounded-[60px] bg-[radial-gradient(circle,rgba(255,200,0,0.6)_0%,rgba(255,200,0,0.35)_40%,transparent_75%)] opacity-0 blur-[90px] transition-all duration-500 group-hover:opacity-100" />

                    <div className="relative h-full flex flex-col bg-white rounded-[28px] p-10 shadow-[0_12px_30px_rgba(0,0,0,0.15)] transition-all duration-500 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.25)]">

                      <div className="flex items-start gap-6 mb-6">
                        <div className="w-16 h-16 flex items-center justify-center rounded-full border border-black">
                          <IconComponent size={28} strokeWidth={1.5} />
                        </div>

                        <h3 className="text-xl font-semibold leading-tight">
                          {item.title}
                        </h3>
                      </div>

                      <p className="text-gray-600 leading-relaxed flex-1">
                        {item.description}
                      </p>

                      {showButton && (
                        <div className="mt-6">
                          <span className="inline-block px-5 py-2 rounded-full border border-black text-sm font-medium hover:bg-black/10 transition">
                            {t("services", "viewDetails")}
                          </span>
                        </div>
                      )}

                    </div>

                  </motion.div>

                </Link>

              </motion.div>
            );
          })}

        </div>
      </div>
    </section>
  );
}