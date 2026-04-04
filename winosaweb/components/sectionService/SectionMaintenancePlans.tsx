"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import FadeUp from "@/components/animation/FadeUp";
import { useTranslate } from "@/lib/useTranslate";

// ─── Data paket ──────────────────────────────────────────────────────────────

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    monthlyPrice: 750000,
    yearlyPrice: 600000,
    desc: "Untuk website atau landing page sederhana yang butuh perawatan rutin.",
    featured: false,
    features: [
      "Update konten & teks (2x/bulan)",
      "Backup database mingguan",
      "Monitoring uptime 24/7",
      "Laporan performa bulanan",
      "Pengecekan keamanan dasar",
      "Respons support 1–2 hari kerja",
    ],
    notIncluded: [
      "Pengembangan fitur baru",
      "Bug fix kompleks",
      "Support < 8 jam",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    monthlyPrice: 1800000,
    yearlyPrice: 1440000,
    desc: "Untuk bisnis aktif dengan traffic tumbuh dan konten yang sering berubah.",
    featured: true,
    features: [
      "Update konten & fitur (8x/bulan)",
      "Backup otomatis harian",
      "Monitoring uptime + alerting real-time",
      "Optimasi kecepatan & SEO teknis",
      "Respons support < 8 jam",
      "Bug fix minor included",
      "SSL & keamanan server",
      "Laporan analitik + rekomendasi",
    ],
    notIncluded: ["Fitur custom besar", "Dedicated manager"],
  },
  {
    id: "scale",
    name: "Scale",
    monthlyPrice: 3500000,
    yearlyPrice: 2800000,
    desc: "Untuk platform kompleks, e-commerce, atau aplikasi dengan pengguna aktif.",
    featured: false,
    features: [
      "Update & pengembangan fitur aktif",
      "Backup real-time",
      "SLA uptime 99.5%",
      "Dedicated support manager",
      "Respons prioritas < 2 jam",
      "Load testing berkala",
      "Integrasi & API maintenance",
      "Review kode & refactor ringan",
      "Konsultasi strategi teknis bulanan",
    ],
    notIncluded: [],
  },
];

// ─── Format harga ────────────────────────────────────────────────────────────

function fmtPrice(n: number): string {
  return "Rp " + n.toLocaleString("id-ID");
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SectionMaintenancePlans() {
  const { t } = useTranslate();
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [expanded, setExpanded] = useState<string | null>(null);

  function waContact(planName: string, price: number) {
    const msg = `Halo Winosa! Saya tertarik dengan paket maintenance ${planName} (${fmtPrice(price)}/bulan). Bisa ceritakan lebih detail?`;
    window.open(`https://wa.me/6281234567890?text=${encodeURIComponent(msg)}`, "_blank");
  }

  return (
    <section className="w-full bg-white py-20 md:py-28 border-t border-black/6" aria-labelledby="maintenance-title">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <FadeUp>
          <div className="text-center mb-10">
            <h2
              id="maintenance-title"
              className="text-3xl md:text-4xl font-bold text-black mb-3 leading-tight"
            >
              Paket Pemeliharaan Bulanan
            </h2>
            <p className="text-black/50 text-base max-w-lg mx-auto leading-relaxed">
              Tenang fokus bisnis, urusan teknis biar kami yang tangani. Semua harga dalam IDR, sudah termasuk PPN.
            </p>
          </div>
        </FadeUp>

        {/* Billing toggle */}
        <FadeUp delay={0.1}>
          <div className="flex justify-center mb-10">
            <div
              className="flex items-center border border-black/15 rounded-full overflow-hidden"
              role="group"
              aria-label="Pilih periode billing"
            >
              <button
                type="button"
                onClick={() => setBilling("monthly")}
                aria-pressed={billing === "monthly"}
                className="px-6 py-2.5 text-sm font-medium transition-all"
                style={{
                  background: billing === "monthly" ? "black" : "transparent",
                  color: billing === "monthly" ? "white" : "rgba(0,0,0,0.55)",
                  fontFamily: "inherit",
                }}
              >
                Bulanan
              </button>
              <button
                type="button"
                onClick={() => setBilling("yearly")}
                aria-pressed={billing === "yearly"}
                className="px-6 py-2.5 text-sm font-medium transition-all flex items-center gap-1.5"
                style={{
                  background: billing === "yearly" ? "black" : "transparent",
                  color: billing === "yearly" ? "white" : "rgba(0,0,0,0.55)",
                  fontFamily: "inherit",
                }}
              >
                Tahunan
                <span
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{
                    background: billing === "yearly" ? "rgba(34,197,94,0.2)" : "rgba(34,197,94,0.15)",
                    color: "#16a34a",
                  }}
                >
                  hemat 20%
                </span>
              </button>
            </div>
          </div>
        </FadeUp>

        {/* Plans grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {PLANS.map((plan, i) => {
            const price = billing === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
            const isExpanded = expanded === plan.id;

            return (
              <FadeUp key={plan.id} delay={i * 0.12}>
                <div
                  className="group relative rounded-[24px] bg-white transition-all duration-300"
                  style={{
                    border: plan.featured ? "2px solid black" : "1.5px solid rgba(0,0,0,0.12)",
                    boxShadow: plan.featured
                      ? "0 0 0 0 transparent"
                      : "none",
                  }}
                >
                  {/* Featured badge */}
                  {plan.featured && (
                    <div
                      className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-bold px-4 py-1.5 rounded-full"
                      style={{
                        background: "linear-gradient(135deg,#c4a832,#f4c430)",
                        color: "#1a1a1a",
                      }}
                    >
                      ✦ Paling Populer
                    </div>
                  )}

                  <div className="p-7">
                    {/* Plan name */}
                    <p
                      className="text-[11px] font-bold tracking-[1.5px] uppercase mb-3"
                      style={{ color: "rgba(0,0,0,0.4)" }}
                    >
                      {plan.name}
                    </p>

                    {/* Price */}
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={billing + plan.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="flex items-baseline gap-1.5 mb-1">
                          <span className="text-3xl font-bold text-black leading-none">
                            {fmtPrice(price)}
                          </span>
                        </div>
                        <p className="text-xs text-black/35 mb-4">
                          {billing === "monthly" ? "per bulan" : "per bulan (tagihan tahunan)"}
                          {billing === "yearly" && (
                            <span className="ml-1.5 line-through text-black/25">
                              {fmtPrice(plan.monthlyPrice)}
                            </span>
                          )}
                        </p>
                      </motion.div>
                    </AnimatePresence>

                    {/* Desc */}
                    <p className="text-sm text-black/55 leading-relaxed mb-5">
                      {plan.desc}
                    </p>

                    {/* Divider */}
                    <div className="h-px bg-black/6 mb-5" />

                    {/* Features */}
                    <ul className="space-y-2.5 mb-4">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-2.5 text-sm text-black/65">
                          <span
                            className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px] font-bold"
                            style={{ background: "rgba(34,197,94,0.12)", color: "#16a34a" }}
                            aria-hidden="true"
                          >
                            ✓
                          </span>
                          {f}
                        </li>
                      ))}
                    </ul>

                    {/* Not included (expandable) */}
                    {plan.notIncluded.length > 0 && (
                      <div>
                        <button
                          type="button"
                          onClick={() => setExpanded(isExpanded ? null : plan.id)}
                          className="text-xs text-black/35 hover:text-black/55 transition-colors flex items-center gap-1 mb-3"
                          style={{ fontFamily: "inherit" }}
                        >
                          <span
                            className="inline-block transition-transform duration-200"
                            style={{ transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)" }}
                          >
                            ›
                          </span>
                          {isExpanded ? "Sembunyikan" : "Tidak termasuk"}
                        </button>

                        <AnimatePresence>
                          {isExpanded && (
                            <motion.ul
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25 }}
                              className="overflow-hidden space-y-2 mb-3"
                            >
                              {plan.notIncluded.map((f) => (
                                <li key={f} className="flex items-start gap-2.5 text-sm text-black/35">
                                  <span
                                    className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px]"
                                    style={{ background: "rgba(0,0,0,0.05)", color: "rgba(0,0,0,0.3)" }}
                                    aria-hidden="true"
                                  >
                                    ×
                                  </span>
                                  {f}
                                </li>
                              ))}
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      </div>
                    )}

                    {/* CTA */}
                    <button
                      type="button"
                      onClick={() => waContact(plan.name, price)}
                      className="w-full py-3 rounded-full text-sm font-medium transition-all mt-2"
                      style={{
                        fontFamily: "inherit",
                        background: plan.featured ? "black" : "transparent",
                        color: plan.featured ? "white" : "black",
                        border: plan.featured ? "2px solid black" : "1.5px solid rgba(0,0,0,0.2)",
                      }}
                      onMouseEnter={(e) => {
                        if (!plan.featured) {
                          e.currentTarget.style.background = "black";
                          e.currentTarget.style.color = "white";
                          e.currentTarget.style.borderColor = "black";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!plan.featured) {
                          e.currentTarget.style.background = "transparent";
                          e.currentTarget.style.color = "black";
                          e.currentTarget.style.borderColor = "rgba(0,0,0,0.2)";
                        }
                      }}
                    >
                      Mulai dengan {plan.name}
                    </button>
                  </div>
                </div>
              </FadeUp>
            );
          })}
        </div>

        {/* Footer note */}
        <FadeUp delay={0.3}>
          <div className="mt-10 text-center space-y-2">
            <p className="text-xs text-black/35">
              Semua paket dapat dikustomisasi sesuai kebutuhan. Konsultasi gratis sebelum memilih.
            </p>
            <p className="text-xs text-black/25">
              Pembayaran fleksibel: transfer bank atau kartu kredit. Invoice tersedia.
            </p>
          </div>
        </FadeUp>

        {/* Perbandingan detail */}
        <FadeUp delay={0.4}>
          <div className="mt-16 rounded-2xl border border-black/8 overflow-hidden">
            <div className="px-6 py-4 border-b border-black/8 bg-black/2">
              <h3 className="text-sm font-semibold text-black">Perbandingan lengkap</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-black/6">
                    <th className="text-left px-6 py-3 text-black/40 font-medium w-1/2">Fitur</th>
                    {PLANS.map((p) => (
                      <th
                        key={p.id}
                        className="px-4 py-3 font-semibold text-center"
                        style={{ color: p.featured ? "black" : "rgba(0,0,0,0.5)" }}
                      >
                        {p.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: "Update konten", values: ["2x/bulan", "8x/bulan", "Unlimited"] },
                    { label: "Backup", values: ["Mingguan", "Harian", "Real-time"] },
                    { label: "Monitoring uptime", values: ["✓", "✓ + alerting", "✓ SLA 99.5%"] },
                    { label: "Respons support", values: ["1–2 hari", "< 8 jam", "< 2 jam"] },
                    { label: "SSL & keamanan", values: ["Dasar", "✓", "✓"] },
                    { label: "SEO teknis", values: ["—", "✓", "✓"] },
                    { label: "Laporan bulanan", values: ["✓", "✓ + analitik", "✓ + strategi"] },
                    { label: "Dedicated manager", values: ["—", "—", "✓"] },
                    { label: "Bug fix", values: ["—", "Minor", "Included"] },
                    { label: "Konsultasi teknis", values: ["—", "—", "Bulanan"] },
                  ].map((row, i) => (
                    <tr
                      key={row.label}
                      className="border-b border-black/4 last:border-none"
                      style={{ background: i % 2 === 0 ? "transparent" : "rgba(0,0,0,0.015)" }}
                    >
                      <td className="px-6 py-3 text-black/65">{row.label}</td>
                      {row.values.map((v, vi) => (
                        <td
                          key={vi}
                          className="px-4 py-3 text-center"
                          style={{
                            color:
                              v === "—"
                                ? "rgba(0,0,0,0.2)"
                                : PLANS[vi].featured
                                ? "black"
                                : "rgba(0,0,0,0.6)",
                            fontWeight: PLANS[vi].featured ? 500 : 400,
                          }}
                        >
                          {v}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </FadeUp>

      </div>
    </section>
  );
}