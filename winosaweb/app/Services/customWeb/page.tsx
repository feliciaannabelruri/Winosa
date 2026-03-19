"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { useTranslate } from "@/lib/useTranslate";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translateHybrid } from "@/lib/translateHybrid";

const FadeUp = dynamic(() => import("@/components/animation/FadeUp"));

const PACKAGES = {
  Starter: 500,
  Business: 1200,
  Enterprise: 2000,
};

const FEATURES = [
  { key: "admin", label: "Admin Dashboard", price: 300, keywords: ["admin","dashboard"] },
  { key: "account", label: "User Account System", price: 400, keywords: ["login","user"] },
  { key: "payment", label: "Online Payment", price: 500, keywords: ["payment"] },
  { key: "content", label: "Content Management", price: 300, keywords: ["content","blog"] },
  { key: "multilang", label: "Multi Language Website", price: 300, keywords: ["language"] },
  { key: "booking", label: "Booking & Appointment", price: 400, keywords: ["booking"] },
  { key: "analytics", label: "Analytics & Reporting", price: 250, keywords: ["analytics"] },
  { key: "design", label: "Custom UI Design", price: 400, keywords: ["design"] },
  { key: "seo", label: "SEO Optimization", price: 300, keywords: ["seo"] },
  { key: "performance", label: "Performance Optimization", price: 250, keywords: ["fast"] },
  { key: "security", label: "Security Protection", price: 300, keywords: ["secure"] },
  { key: "integration", label: "Third-party Integration", price: 350, keywords: ["integration"] },
];

const whatsappNumber = "6281234567890";

export default function CustomQuotePage() {

  const { t, tApi } = useTranslate();
  const { language } = useLanguageStore();

  const [description,setDescription] = useState("");
  const [selected,setSelected] = useState<string[]>([]);
  const [result,setResult] = useState<any>(null);
  const [error,setError] = useState("");
  const [translatedFeatures,setTranslatedFeatures] = useState(FEATURES);

  useEffect(() => {
    const run = async () => {
      const mapped = await Promise.all(
        FEATURES.map(async (f) => ({
          ...f,
          label: await translateHybrid(f.label, language, tApi),
        }))
      );
      setTranslatedFeatures(mapped);
    };
    run();
  }, [language]);

  const toggle = (key:string)=>{
    setSelected(prev =>
      prev.includes(key)
        ? prev.filter(f=>f!==key)
        : [...prev,key]
    );
  };

  const isValid = description.trim().length>0 || selected.length>0;

  const generate = async () => {

    if(!isValid){
      setError(t("customWebsite","error"));
      return;
    }

    setError("");

    const text = description.toLowerCase();

    let websiteType="Company Website";

    if(text.includes("shop") || text.includes("store"))
      websiteType="E-Commerce Website";

    if(text.includes("dashboard") || text.includes("system"))
      websiteType="Web Application";

    const activeFeatures = FEATURES.filter(
      f => selected.includes(f.key) ||
      f.keywords.some(k=>text.includes(k))
    );

    const featureCost = activeFeatures.reduce((s,f)=>s+f.price,0);

    const estimates = await Promise.all(
      Object.entries(PACKAGES).map(async ([name,base])=>({
        name: await translateHybrid(name, language, tApi),
        price: base + featureCost
      }))
    );

    const translatedType = await translateHybrid(websiteType, language, tApi);

    setResult({websiteType: translatedType, estimates});
  };

  return (
    <main>

      <section className="w-full bg-white py-32">

        <FadeUp>
        <div className="max-w-6xl mx-auto px-6 text-black">

          <h1 className="text-3xl font-bold text-center mb-12">
            {t("customWebsite","title")}
          </h1>

          <textarea
            value={description}
            onChange={(e)=>setDescription(e.target.value)}
            placeholder={t("customWebsite","placeholder")}
            className="w-full h-40 p-6 border border-black rounded-2xl mb-12"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-14">

            {translatedFeatures.map(f=>(

              <button
                key={f.key}
                onClick={()=>toggle(f.key)}
                className={`px-5 py-3 rounded-full border text-sm ${
                  selected.includes(f.key)
                  ? "bg-black text-white"
                  : "border-black text-black hover:bg-black/10"
                }`}
              >
                {f.label}
              </button>

            ))}

          </div>

          <button
            onClick={generate}
            disabled={!isValid}
            className={`w-full py-4 rounded-full font-semibold ${
              isValid
              ? "bg-yellow-400 text-black"
              : "bg-gray-300 text-gray-500"
            }`}
          >
            {t("customWebsite","generate")}
          </button>

          {error && (
            <p className="text-red-500 text-sm mt-4 text-center">
              {error}
            </p>
          )}

          {result && (

            <FadeUp delay={0.2}>
            <div className="mt-20 border border-black rounded-[28px] p-10">

              <h2 className="text-2xl font-bold mb-6">
                {t("customWebsite","recommended")}
              </h2>

              <p className="mb-10">
                {t("customWebsite","websiteType")}:
                <strong> {result.websiteType}</strong>
              </p>

              <div className="grid md:grid-cols-3 gap-8 mb-12">

                {result.estimates.map((p:any)=>(

                  <div key={p.name} className="border border-black rounded-[28px] p-8">

                    <h3 className="font-bold text-lg mb-3">
                      {p.name}
                    </h3>

                    <div className="text-3xl font-bold">
                      ${p.price}
                    </div>

                  </div>

                ))}

              </div>

              <Link
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Continue consultation via WhatsApp"
              className="
                w-full
                inline-flex items-center justify-center gap-3
                px-10 py-4 rounded-full
                bg-[#25D366] text-white font-semibold
                hover:bg-[#1ebe5d]
                transition
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#25D366]
              "
            >
              <svg
                viewBox="0 0 24 24"
                className="w-6 h-6"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M20.52 3.48A11.91 11.91 0 0012.01 0C5.38 0 .02 5.36.02 12c0 2.11.55 4.18 1.6 6.02L0 24l6.15-1.6a11.94 11.94 0 005.86 1.49h.01c6.63 0 11.99-5.36 11.99-12 0-3.19-1.24-6.19-3.49-8.41zM12 21.5a9.45 9.45 0 01-4.82-1.32l-.35-.21-3.65.95.97-3.56-.23-.36a9.48 9.48 0 0114.67-11.63A9.45 9.45 0 0112 21.5zm5.18-7.1c-.28-.14-1.66-.82-1.92-.91-.26-.1-.45-.14-.63.14-.19.28-.73.91-.9 1.1-.16.19-.33.21-.61.07-.28-.14-1.17-.43-2.23-1.37-.82-.73-1.37-1.63-1.53-1.91-.16-.28-.02-.43.12-.57.12-.12.28-.33.42-.49.14-.16.19-.28.28-.47.09-.19.05-.35-.02-.49-.07-.14-.63-1.52-.87-2.08-.23-.55-.47-.47-.63-.47h-.54c-.19 0-.49.07-.75.35-.26.28-.98.96-.98 2.34s1 2.72 1.14 2.91c.14.19 1.96 3 4.75 4.2.66.28 1.18.45 1.58.58.66.21 1.27.18 1.75.11.53-.08 1.66-.68 1.89-1.34.23-.66.23-1.23.16-1.34-.07-.12-.26-.19-.54-.33z" />
              </svg>

              Continue Consultation
            </Link>

            </div>
            </FadeUp>

          )}

        </div>
        </FadeUp>

      </section>

      <Footer />

    </main>
  );
}