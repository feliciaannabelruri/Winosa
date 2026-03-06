"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FadeUp from "@/components/animation/FadeUp";
import { useTranslate } from "@/lib/useTranslate";

export default function SectionFAQ() {

  const { t } = useTranslate();
  const [open, setOpen] = useState<number | null>(null);

  const faqs = [
    { question: t("plansFAQ", "q1"), answer: t("plansFAQ", "a1") },
    { question: t("plansFAQ", "q2"), answer: t("plansFAQ", "a2") },
    { question: t("plansFAQ", "q3"), answer: t("plansFAQ", "a3") },
    { question: t("plansFAQ", "q4"), answer: t("plansFAQ", "a4") },
    { question: t("plansFAQ", "q5"), answer: t("plansFAQ", "a5") },
    { question: t("plansFAQ", "q6"), answer: t("plansFAQ", "a6") },
  ];

  return (
    <FadeUp>
      <section className="w-full bg-white py-40">

        <div className="max-w-4xl mx-auto px-6">

          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl font-bold text-black">
              {t("plansFAQ", "title")}
            </h2>
          </motion.div>

          <div className="space-y-6">

            {faqs.map((faq, i) => {

              const isOpen = open === i;

              return (
                <div key={i} className="group relative">

                  {isOpen && (
                    <div className="absolute -inset-6 rounded-[40px] bg-[radial-gradient(circle,rgba(255,200,0,0.5)_0%,rgba(255,200,0,0.3)_40%,transparent_75%)] blur-[80px]" />
                  )}

                  <div
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="relative rounded-[28px] border border-black bg-white p-6 cursor-pointer transition-all shadow-[0_15px_40px_rgba(0,0,0,0.08)] hover:shadow-[0_25px_60px_rgba(0,0,0,0.12)]"
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-black">
                        {faq.question}
                      </h3>

                      <motion.span
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-black text-xl"
                      >
                        +
                      </motion.span>
                    </div>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4 }}
                          className="overflow-hidden"
                        >
                          <p className="mt-4 text-black/70 leading-relaxed">
                            {faq.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                  </div>
                </div>
              );
            })}

          </div>

        </div>
      </section>
    </FadeUp>
  );
}