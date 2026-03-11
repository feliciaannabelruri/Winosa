"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { Plus, Minus } from "lucide-react";
import { useTranslate } from "@/lib/useTranslate";

const FadeUp = dynamic(() => import("@/components/animation/FadeUp"));

export default function SectionCompanyInfo() {

  const { t } = useTranslate();

  const [active, setActive] = useState<number | null>(0);

  const faqs = [
    { question: t("faq", "q1"), answer: t("faq", "a1") },
    { question: t("faq", "q2"), answer: t("faq", "a2") },
    { question: t("faq", "q3"), answer: t("faq", "a3") },
    { question: t("faq", "q4"), answer: t("faq", "a4") },
  ];

  return (
    <FadeUp>
      <section
        className="w-full py-28 bg-white"
        aria-labelledby="faq-title"
      >

        <div className="max-w-7xl mx-auto px-6 lg:px-16 grid lg:grid-cols-2 gap-20">

          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >

            <p className="text-black/60 font-medium mb-4">
              {t("faq", "label")}
            </p>

            <h2
              id="faq-title"
              className="text-5xl font-bold text-black leading-tight"
            >
              {t("faq", "titleLine1")} <br />
              {t("faq", "titleLine2")} <br />
              {t("faq", "titleLine3")}
            </h2>

          </motion.div>

          {/* RIGHT */}
          <motion.div
            className="space-y-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.15 },
              },
            }}
          >

            {faqs.map((faq, index) => {

              const isOpen = active === index;

              return (
                <motion.div
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: 60 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.6 }}
                  className="border-b border-black/20 pb-6"
                >

                  <button
                    onClick={() => setActive(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-content-${index}`}
                    className="w-full flex justify-between items-center text-left"
                  >

                    <h4
                      id={`faq-question-${index}`}
                      className="text-lg font-semibold text-black"
                    >
                      {faq.question}
                    </h4>

                    {isOpen ? (
                      <Minus size={18} className="text-black" aria-hidden="true" />
                    ) : (
                      <Plus size={18} className="text-black/50" aria-hidden="true" />
                    )}

                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.p
                        id={`faq-content-${index}`}
                        role="region"
                        aria-labelledby={`faq-question-${index}`}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4 }}
                        className="mt-4 text-black/70 leading-relaxed overflow-hidden"
                      >
                        {faq.answer}
                      </motion.p>
                    )}
                  </AnimatePresence>

                </motion.div>
              );
            })}

          </motion.div>

        </div>

      </section>
    </FadeUp>
  );
}