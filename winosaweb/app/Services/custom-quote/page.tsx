"use client";

import { useState } from "react";
import Footer from "@/components/layout/Footer";

const services = [
  "Web Development",
  "Mobile App Development",
  "UI/UX Design",
  "IT Consulting",
  "Cloud Solutions",
  "Cyber Security",
];

const features = [
  { label: "Modern visual design", price: 300 },
  { label: "Responsive on all devices", price: 200 },
  { label: "Admin dashboard to manage content", price: 400 },
  { label: "User login & profile system", price: 350 },
  { label: "Online payment / booking system", price: 500 },
  { label: "SEO & performance optimization", price: 250 },
  { label: "Third-party integrations", price: 300 },
  { label: "Custom animations & interactions", price: 200 },
  { label: "Security & data protection", price: 300 },
  { label: "Analytics & tracking setup", price: 180 },
  { label: "Multi-language support", price: 220 },
  { label: "Maintenance & future scalability", price: 260 },
];

export default function CustomQuotePage() {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<number[]>([]);
  const [description, setDescription] = useState("");
  const [generated, setGenerated] = useState(false);
  const [estimate, setEstimate] = useState(0);
  const [suggestion, setSuggestion] = useState("");
  const [error, setError] = useState("");

  const toggleService = (service: string) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  };

  const toggleFeature = (index: number) => {
    setSelectedFeatures((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  const generateEstimation = () => {
    if (selectedServices.length === 0) {
      setError("Please select at least one service before generating estimation.");
      return;
    }

    setError("");

    const featureCost = selectedFeatures.reduce(
      (sum, i) => sum + features[i].price,
      0
    );

    const serviceBase = selectedServices.length * 300;

    const complexityBonus =
      description.length > 150 ? 600 :
      description.length > 80 ? 400 : 200;

    const total = featureCost + serviceBase + complexityBonus;

    let serviceSuggestion = "Custom Digital Solution";

    if (description.toLowerCase().includes("ecommerce"))
      serviceSuggestion = "E-commerce Website";

    if (description.toLowerCase().includes("dashboard"))
      serviceSuggestion = "Web Application Dashboard";

    if (description.toLowerCase().includes("booking"))
      serviceSuggestion = "Online Booking Platform";

    setSuggestion(serviceSuggestion);
    setEstimate(total);
    setGenerated(true);
  };

  return (
    <>
      <main className="w-full bg-white py-32 overflow-x-hidden">
        <div className="max-w-[1280px] mx-auto px-8 text-black">

          <div className="text-center mb-20">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Custom Project Estimation
            </h1>
            <p className="text-black/70 max-w-2xl mx-auto">
              Choose the services, features, and describe your idea.
              We’ll recommend the best solution and price range.
            </p>
          </div>

          <section className="mb-20">
            <h2 className="text-xl font-bold mb-6">
              Select Services *
            </h2>

            <div className="flex flex-wrap gap-4">
              {services.map((service) => (
                <button
                  key={service}
                  onClick={() => toggleService(service)}
                  className={`
                    px-5 py-2 rounded-full border text-sm transition
                    ${
                      selectedServices.includes(service)
                        ? "bg-yellow-100 border-black"
                        : "border-black/30 hover:bg-black/5"
                    }
                  `}
                >
                  {service}
                </button>
              ))}
            </div>
          </section>

          {/* FEATURES */}
          <section className="mb-20">
            <h2 className="text-xl font-bold mb-6">
              Select Features
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((item, i) => (
                <button
                  key={i}
                  onClick={() => toggleFeature(i)}
                  className={`
                    px-6 py-4 rounded-2xl border text-sm text-left transition
                    ${
                      selectedFeatures.includes(i)
                        ? "bg-yellow-100 border-black"
                        : "border-black/30 hover:bg-black/5"
                    }
                  `}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </section>

          {/* DESCRIPTION */}
          <section className="mb-20">
            <h2 className="text-xl font-bold mb-6">
              Describe Your Project
            </h2>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell us what kind of website or system you want to build..."
              className="w-full min-h-[200px] border border-black rounded-[24px] p-6 text-sm focus:outline-none"
            />
          </section>

          {/* GENERATE BUTTON */}
          <button
            onClick={generateEstimation}
            disabled={selectedServices.length === 0}
            className={`
              w-full py-5 rounded-full font-semibold transition
              ${
                selectedServices.length === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-black text-white hover:bg-black/80"
              }
            `}
          >
            Generate Estimation
          </button>

          {error && (
            <p className="text-red-500 text-sm mt-4 text-center">
              {error}
            </p>
          )}

          {generated && (
            <section className="mt-24 border border-black rounded-[32px] p-12 text-center">
              <p className="text-sm mb-3">
                Recommended solution
              </p>

              <div className="inline-block px-5 py-2 rounded-full border border-black text-sm mb-6">
                {suggestion}
              </div>

              <div className="text-4xl md:text-5xl font-bold mb-4">
                ${estimate} – ${estimate + 500}
              </div>

              <p className="text-sm text-black/60 mb-12">
                Final pricing may vary after detailed consultation.
              </p>

              <a
                href="https://wa.me/6281234567890"
                className="flex items-center justify-center gap-3 w-full py-4 rounded-full bg-green-500 text-white font-semibold hover:bg-green-600 transition"
              >
                Continue Consultation
              </a>
            </section>
          )}

        </div>
      </main>

      <Footer />
    </>
  );
}
