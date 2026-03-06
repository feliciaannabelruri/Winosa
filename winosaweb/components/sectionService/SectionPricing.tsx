"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import FadeUp from "@/components/animation/FadeUp";
import api from "@/lib/axios";
import { useTranslate } from "@/lib/useTranslate";

const whatsappNumber = "6281234567890";

type Service = {
  _id: string;
  title: string;
  price?: string;
  features?: string[];
};

export default function SectionPricingService() {

  const { t } = useTranslate();

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchPricing = async () => {
      try {

        setLoading(true);

        const res = await api.get("/services");

        setServices(res.data?.data || []);

      } catch (err) {
        console.error(err);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPricing();

  }, []);

  const cleanPrice = (price?: string) =>
    price?.replace(/starting\s*from\s*/i, "").trim() || "";

  return (
    <section className="w-full bg-white py-32">

      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">

          <h2 className="text-3xl font-bold text-black mb-3">
            {t("pricing", "title")}
          </h2>

          <p className="text-black text-base">
            {t("pricing", "subtitle")}
          </p>

        </div>

        {loading ? (

          <div className="text-center text-black">
            {t("global", "loading")}
          </div>

        ) : (

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 items-stretch">

            {services.map((service, i) => (

              <FadeUp key={service._id} delay={i * 0.15}>

                <div className="group relative h-full">

                  <div className="absolute -inset-16 rounded-[60px] bg-[radial-gradient(circle,rgba(255,200,0,0.6)_0%,rgba(255,200,0,0.35)_40%,transparent_75%)] opacity-0 blur-[90px] transition-all duration-500 group-hover:opacity-100" />

                  <div className="relative flex flex-col h-full rounded-[28px] p-10 bg-white shadow-[0_12px_30px_rgba(0,0,0,0.15)] transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.25)]">

                    <div>

                      <h3 className="text-xl font-bold text-black mb-3">
                        {service.title}
                      </h3>

                      <span className="block text-sm text-black mb-2">
                        {t("pricing", "startFrom")}
                      </span>

                      <p className="text-4xl font-bold text-black mb-8">
                        {cleanPrice(service.price)}
                      </p>

                    </div>

                    <ul className="space-y-3 text-sm text-black mb-10 flex-1">

                      {(service.features || []).map((feature, idx) => (

                        <li
                          key={idx}
                          className="flex items-center gap-2"
                        >

                          <span className="w-2 h-2 rounded-full bg-yellow-400" />

                          {feature}

                        </li>

                      ))}

                    </ul>

                    <Link
                      href={`https://wa.me/${whatsappNumber}?text=Hello%20I%20am%20interested%20in%20${encodeURIComponent(service.title)}`}
                      target="_blank"
                      className="block text-center w-full py-3 rounded-full border border-black font-semibold text-black hover:bg-black/10 transition"
                    >
                      {t("pricing", "choose")}
                    </Link>

                  </div>

                </div>

              </FadeUp>

            ))}

          </div>

        )}

      </div>

    </section>
  );
}