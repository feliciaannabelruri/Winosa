"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLanguageStore } from "@/store/useLanguageStore";
import { autoTranslate } from "@/lib/autoTranslate";

export default function ProjectInquiryPage() {
  const { language } = useLanguageStore();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [translated, setTranslated] = useState({
    heroTag: "Project Inquiry",
    heroTitle: "Tell Us About Your Project",
    heroDesc:
      "Share your business goals, current challenges, and project requirements. Our team will analyze your needs and recommend the best digital solution for your company.",

    basicInfo: "Basic Information",
    projectInfo: "Project Information",

    fullName: "Full Name",
    companyName: "Company Name",
    email: "Email Address",
    phone: "Phone Number",

    serviceNeeded: "Service Needed",
    estimatedBudget: "Estimated Budget",
    expectedTimeline: "Expected Timeline",

    currentProblem: "Current Business Problem",
    projectGoals: "Project Goals",
    featuresNeeded: "Features Needed",
    referenceUrl: "Reference Website / URL",
    additionalNotes: "Additional Notes",

    selectService: "Select service",
    selectBudget: "Select budget",

    submit: "Submit Project Inquiry",
    submitting: "Submitting...",

    success: "Inquiry submitted successfully.",
  });

        useEffect(() => {
        if (!language) return;

        const run = async () => {
            const [
            heroTag,
            heroTitle,
            heroDesc,
            basicInfo,
            projectInfo,
            fullName,
            companyName,
            email,
            phone,
            serviceNeeded,
            estimatedBudget,
            expectedTimeline,
            currentProblem,
            projectGoals,
            featuresNeeded,
            referenceUrl,
            additionalNotes,
            selectService,
            selectBudget,
            submit,
            submitting,
            successText,
            ] = await Promise.all([
            autoTranslate("Project Inquiry", language),

            autoTranslate(
                "Tell Us About Your Project",
                language
            ),

            autoTranslate(
                "Share your business goals, current challenges, and project requirements. Our team will analyze your needs and recommend the best digital solution for your company.",
                language
            ),

            autoTranslate("Basic Information", language),

            autoTranslate("Project Information", language),

            autoTranslate("Full Name", language),

            autoTranslate("Company Name", language),

            autoTranslate("Email Address", language),

            autoTranslate("Phone Number", language),

            autoTranslate("Service Needed", language),

            autoTranslate("Estimated Budget", language),

            autoTranslate("Expected Timeline", language),

            autoTranslate("Current Business Problem", language),

            autoTranslate("Project Goals", language),

            autoTranslate("Features Needed", language),

            autoTranslate("Reference Website / URL", language),

            autoTranslate("Additional Notes", language),

            autoTranslate("Select service", language),

            autoTranslate("Select budget", language),

            autoTranslate("Submit Project Inquiry", language),

            autoTranslate("Submitting...", language),

            autoTranslate(
                "Inquiry submitted successfully.",
                language
            ),
            ]);

            setTranslated({
            heroTag,
            heroTitle,
            heroDesc,
            basicInfo,
            projectInfo,
            fullName,
            companyName,
            email,
            phone,
            serviceNeeded,
            estimatedBudget,
            expectedTimeline,
            currentProblem,
            projectGoals,
            featuresNeeded,
            referenceUrl,
            additionalNotes,
            selectService,
            selectBudget,
            submit,
            submitting,
            success: successText,
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

      <div className="absolute inset-0 overflow-hidden pointer-events-none">

        <div className="absolute top-[-180px] left-[-120px] w-[700px] h-[700px] rounded-full bg-black/[0.05] blur-[160px]" />

        <div className="absolute top-[25%] left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-zinc-400/20 blur-[180px]" />

        <div className="absolute bottom-[-250px] right-[-150px] w-[700px] h-[700px] rounded-full bg-black/[0.04] blur-[170px]" />

        <div className="absolute top-[18%] right-[10%] w-40 h-40 rounded-full border border-white/40 bg-white/30 backdrop-blur-3xl shadow-[0_20px_80px_rgba(0,0,0,0.08)]" />

        <div className="absolute bottom-[12%] left-[8%] w-28 h-28 rounded-full border border-white/30 bg-white/20 backdrop-blur-3xl shadow-[0_20px_80px_rgba(0,0,0,0.06)]" />

        <div className="absolute inset-0 opacity-[0.03] bg-[url('/noise.png')]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="uppercase tracking-[0.25em] text-black/40 text-sm">
            {translated.heroTag}
          </span>

          <h1 className="text-5xl md:text-6xl font-bold text-black mt-5 leading-tight">
            {translated.heroTitle}
          </h1>

          <p className="text-black/60 max-w-2xl mx-auto mt-6 leading-relaxed">
            {translated.heroDesc}
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          onSubmit={handleSubmit}
          className="bg-white border border-black/10 rounded-[32px] p-8 md:p-12 shadow-sm space-y-10"
        >

          <div>
            <h2 className="text-2xl font-bold text-black mb-6">
              {translated.basicInfo}
            </h2>

            <div className="grid md:grid-cols-2 gap-6">

              <Input
                label={translated.fullName}
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                required
              />

              <Input
                label={translated.companyName}
                name="companyName"
                value={form.companyName}
                onChange={handleChange}
                required
              />

              <Input
                label={translated.email}
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
              />

              <Input
                label={translated.phone}
                name="phone"
                value={form.phone}
                onChange={handleChange}
              />

            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-black mb-6">
              {translated.projectInfo}
            </h2>

            <div className="grid md:grid-cols-2 gap-6 mb-6">

              <Select
                label={translated.serviceNeeded}
                name="service"
                value={form.service}
                onChange={handleChange}
              >
                <option value="">{translated.selectService}</option>
                <option>Web Development</option>
                <option>Mobile App Development</option>
                <option>UI/UX Design</option>
                <option>Branding</option>
                <option>IT Consulting</option>
              </Select>

              <Select
                label={translated.estimatedBudget}
                name="budget"
                value={form.budget}
                onChange={handleChange}
              >
                <option value="">{translated.selectBudget}</option>
                <option>Below Rp10jt</option>
                <option>Rp10jt - Rp50jt</option>
                <option>Rp50jt - Rp100jt</option>
                <option>Rp100jt+</option>
              </Select>

            </div>

            <Input
              label={translated.expectedTimeline}
              name="timeline"
              value={form.timeline}
              onChange={handleChange}
            />
          </div>

          <Textarea
            label={translated.currentProblem}
            name="currentProblem"
            value={form.currentProblem}
            onChange={handleChange}
          />

          <Textarea
            label={translated.projectGoals}
            name="projectGoals"
            value={form.projectGoals}
            onChange={handleChange}
          />

          <Textarea
            label={translated.featuresNeeded}
            name="features"
            value={form.features}
            onChange={handleChange}
          />

          <Input
            label={translated.referenceUrl}
            name="referenceUrl"
            value={form.referenceUrl}
            onChange={handleChange}
          />

          <Textarea
            label={translated.additionalNotes}
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
            {loading
              ? translated.submitting
              : translated.submit}
          </button>

          {success && (
            <div className="p-5 rounded-2xl bg-green-100 text-green-700 text-sm">
              {translated.success}
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