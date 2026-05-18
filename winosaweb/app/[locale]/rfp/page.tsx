"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslate } from "@/lib/useTranslate";
import { translateHybrid } from "@/lib/translateHybrid";
import { useLocaleRouter } from "@/lib/useLocaleRouter";

export default function ProjectInquiryPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { locale: language } = useLocaleRouter();
const { t } = useTranslate();

const [translated, setTranslated] =
  useState<any>(null);

  useEffect(() => {
  const run = async () => {
    setTranslated({
      heroBadge: await translateHybrid(
        "Project Inquiry",
        language
      ),

      heroTitle1: await translateHybrid(
        "Tell Us About",
        language
      ),

      heroTitle2: await translateHybrid(
        "Your Project",
        language
      ),

      heroDesc: await translateHybrid(
        "Share your business goals, current challenges, and project requirements. Our team will analyze your needs and recommend the best digital solution for your company.",
        language
      ),

      basicInfo: await translateHybrid(
        "Basic Information",
        language
      ),

      projectInfo: await translateHybrid(
        "Project Information",
        language
      ),

      fullName: await translateHybrid(
        "Full Name",
        language
      ),

      companyName: await translateHybrid(
        "Company Name",
        language
      ),

      email: await translateHybrid(
        "Email Address",
        language
      ),

      phone: await translateHybrid(
        "Phone Number",
        language
      ),

      submit: await translateHybrid(
        "Submit Project Inquiry",
        language
      ),

      submitting: await translateHybrid(
        "Submitting...",
        language
      ),

      success: await translateHybrid(
        "Inquiry submitted successfully.",
        language
      ),
    });
  };

  run();

}, [language]);

  const [form, setForm] = useState({
    fullName: "",
    companyName: "",
    email: "",
    phone: "",
    service: "",
    budget: "",
    timeline: "",
    currentProblem: "",
    projectGoals: "",
    features: "",
    referenceUrl: "",
    additionalNotes: "",
  });

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      const api = process.env.NEXT_PUBLIC_API_URL;

      const res = await fetch(`${api}/project-inquiry`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(form),
            });

      const data = await res.json();

      if (data.success) {
        setSuccess(true);

        setForm({
          fullName: "",
          companyName: "",
          email: "",
          phone: "",
          service: "",
          budget: "",
          timeline: "",
          currentProblem: "",
          projectGoals: "",
          features: "",
          referenceUrl: "",
          additionalNotes: "",
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
  <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#f3f2ef] via-[#f8f7f5] to-white py-28 px-6">
      {/* background ambience */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">

        {/* top blur */}
        <div className="absolute top-[-180px] left-[-120px] w-[700px] h-[700px] rounded-full bg-black/[0.05] blur-[160px]" />

        {/* center glow */}
        <div className="absolute top-[25%] left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-zinc-400/20 blur-[180px]" />

        {/* bottom right */}
        <div className="absolute bottom-[-250px] right-[-150px] w-[700px] h-[700px] rounded-full bg-black/[0.04] blur-[170px]" />

        {/* floating glass orb */}
        <div className="absolute top-[18%] right-[10%] w-40 h-40 rounded-full border border-white/40 bg-white/30 backdrop-blur-3xl shadow-[0_20px_80px_rgba(0,0,0,0.08)]" />

        {/* floating glass orb */}
        <div className="absolute bottom-[12%] left-[8%] w-28 h-28 rounded-full border border-white/30 bg-white/20 backdrop-blur-3xl shadow-[0_20px_80px_rgba(0,0,0,0.06)]" />

        {/* subtle noise */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('/noise.png')]" />

        </div>

      <div className="relative z-10 max-w-6xl mx-auto">

        {/* HERO */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="uppercase tracking-[0.25em] text-black/40 text-sm">
            {
            translated?.heroBadge ||
            t("projectInquiry", "heroBadge")
            }
          </span>

          <h1 className="text-5xl md:text-6xl font-bold text-black mt-5 leading-tight">
            {
            translated?.heroTitle1 ||
            t("projectInquiry", "heroTitle1")
            }
            <br />
            {
            translated?.heroTitle2 ||
            t("projectInquiry", "heroTitle2")
            }
          </h1>

          <p className="text-black/60 max-w-2xl mx-auto mt-6 leading-relaxed">
            {
            translated?.heroDesc ||
            t("projectInquiry", "heroDesc")
            }
          </p>
        </motion.div>

        {/* FORM */}
        <motion.form
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          onSubmit={handleSubmit}
          className="bg-white border border-black/10 rounded-[32px] p-8 md:p-12 shadow-sm space-y-10"
        >

          {/* BASIC */}
          <div>
            <h2 className="text-2xl font-bold text-black mb-6">
              {
                translated?.basicInfo ||
                t("projectInquiry", "basicInfo")
                }
            </h2>

            <div className="grid md:grid-cols-2 gap-6">

              <Input
               label={
                translated?.fullName ||
                t("projectInquiry", "fullName")
                }
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                required
              />

              <Input
                label="Company Name"
                name="companyName"
                value={form.companyName}
                onChange={handleChange}
                required
              />

              <Input
                label="Email Address"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
              />

              <Input
                label="Phone Number"
                name="phone"
                value={form.phone}
                onChange={handleChange}
              />

            </div>
          </div>

          {/* PROJECT */}
          <div>
            <h2 className="text-2xl font-bold text-black mb-6">
              {
                translated?.projectInfo ||
                t("projectInquiry", "projectInfo")
                }
            </h2>

            <div className="grid md:grid-cols-2 gap-6 mb-6">

              <Select
                label="Service Needed"
                name="service"
                value={form.service}
                onChange={handleChange}
              >
                <option value="">Select service</option>
                <option>Web Development</option>
                <option>Mobile App Development</option>
                <option>UI/UX Design</option>
                <option>Branding</option>
                <option>IT Consulting</option>
              </Select>

              <Select
                label="Estimated Budget"
                name="budget"
                value={form.budget}
                onChange={handleChange}
              >
                <option value="">Select budget</option>
                <option>Below Rp10jt</option>
                <option>Rp10jt - Rp50jt</option>
                <option>Rp50jt - Rp100jt</option>
                <option>Rp100jt+</option>
              </Select>

            </div>

            <Input
              label="Expected Timeline"
              name="timeline"
              value={form.timeline}
              onChange={handleChange}
            />
          </div>

          <Textarea
            label="Current Business Problem"
            name="currentProblem"
            value={form.currentProblem}
            onChange={handleChange}
          />

          <Textarea
            label="Project Goals"
            name="projectGoals"
            value={form.projectGoals}
            onChange={handleChange}
          />

          <Textarea
            label="Features Needed"
            name="features"
            value={form.features}
            onChange={handleChange}
          />

          <Input
            label="Reference Website / URL"
            name="referenceUrl"
            value={form.referenceUrl}
            onChange={handleChange}
          />

          <Textarea
            label="Additional Notes"
            name="additionalNotes"
            value={form.additionalNotes}
            onChange={handleChange}
          />

          <button
            type="submit"
            disabled={loading}
            className="
                w-full
                rounded-full
                border
                border-black/15
                bg-white
                py-5
                text-black
                font-medium
                tracking-wide
                transition-all
                duration-300
                hover:bg-black/[0.03]
                hover:border-black/30
                active:scale-[0.99]
                disabled:opacity-60
            "
            >
            {loading ? "Submitting..." : "Submit Project Inquiry"}
            </button>

          {success && (
            <div className="p-5 rounded-2xl bg-green-100 text-green-700 text-sm">
              Inquiry submitted successfully.
            </div>
          )}

        </motion.form>
      </div>
    </main>
  );
}

function Input({
  label,
  ...props
}: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-black mb-2">
        {label}
      </label>

      <input
        {...props}
        className="w-full rounded-2xl border border-black/10 px-5 py-4 outline-none focus:border-black transition-all"
      />
    </div>
  );
}

function Textarea({
  label,
  ...props
}: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-black mb-2">
        {label}
      </label>

      <textarea
        {...props}
        rows={5}
        className="w-full rounded-2xl border border-black/10 px-5 py-4 outline-none focus:border-black transition-all resize-none"
      />
    </div>
  );
}

function Select({
  label,
  children,
  ...props
}: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-black mb-2">
        {label}
      </label>

      <select
        {...props}
        className="w-full rounded-2xl border border-black/10 px-5 py-4 outline-none focus:border-black transition-all bg-white"
      >
        {children}
      </select>
    </div>
  );
}