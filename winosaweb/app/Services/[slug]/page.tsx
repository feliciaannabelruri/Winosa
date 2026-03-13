"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import Footer from "@/components/layout/Footer";
import SectionCTA from "@/components/layout/SectionCTA";

// UI/UX
import UIUXHero from "@/components/sectionService/ui-ux/Hero";
import UIUXFeatures from "@/components/sectionService/ui-ux/Features";
import UIUXTech from "@/components/sectionService/ui-ux/Tech";
import UIUXPricing from "@/components/sectionService/ui-ux/Pricing";

// Mobile
import MobileHero from "@/components/sectionService/mobile/Hero";
import MobileFeatures from "@/components/sectionService/mobile/Features";
import MobileTech from "@/components/sectionService/mobile/Tech";
import MobilePricing from "@/components/sectionService/mobile/Pricing";

// Web
import WebHero from "@/components/sectionService/web/Hero";
import WebFeatures from "@/components/sectionService/web/Features";
import WebTech from "@/components/sectionService/web/Tech";
import WebPricing from "@/components/sectionService/web/Pricing";

export default function ServiceDetailPage() {
  const params = useParams();
  const slug = Array.isArray(params.slug)
    ? params.slug[0]
    : params.slug;

  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // ================= SEO =================

useEffect(() => {
  if (!service) return;

  document.title = service.title || service.name || "Service";

  const description =
    service.description ||
    service.shortDescription ||
    service.title ||
    "Professional digital services";

  const image =
    service.image || "/bg/bg1.jpg";

  const url =
    `${window.location.origin}/services/${slug}`;

  const setMeta = (property: string, content: string, isName = false) => {
    let element = document.querySelector(
      `meta[${isName ? "name" : "property"}="${property}"]`
    ) as HTMLMetaElement;

    if (!element) {
      element = document.createElement("meta");
      if (isName) element.setAttribute("name", property);
      else element.setAttribute("property", property);
      document.head.appendChild(element);
    }

    element.setAttribute("content", content);
  };

  setMeta("description", description, true);

  setMeta("og:title", service.title || service.name);
  setMeta("og:description", description);
  setMeta("og:image", image);
  setMeta("og:url", url);
  setMeta("og:type", "website");

  setMeta("twitter:card", "summary_large_image", true);
  setMeta("twitter:title", service.title || service.name, true);
  setMeta("twitter:description", description, true);
  setMeta("twitter:image", image, true);

}, [service, slug]);

  useEffect(() => {
    if (!slug) return;

    const fetchService = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/services/${slug}`
        );

        if (!res.ok) {
          setService(null);
          return;
        }

        const data = await res.json();
        setService(data.data);
      } catch (error) {
        console.error("Error fetching service:", error);
        setService(null);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [slug]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        Loading...
      </main>
    );
  }

  if (!service) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        Service not found
      </main>
    );
  }

  switch (slug) {
    case "ui-ux-design":
      return (
        <main className="bg-white">
          <UIUXHero data={service} />
          <UIUXFeatures data={service} />
          <UIUXTech data={service} />
          <UIUXPricing data={service} />
          <SectionCTA />
          <Footer />
        </main>
      );

    case "mobile-app-development":
      return (
        <main className="bg-white">
          <MobileHero data={service} />
          <MobileFeatures data={service} />
          <MobileTech data={service} />
          <MobilePricing data={service} />
          <SectionCTA />
          <Footer />
        </main>
      );

    case "web-development":
      return (
        <main className="bg-white">
          <WebHero data={service} />
          <WebFeatures data={service} />
          <WebTech data={service} />
          <WebPricing data={service} />
          <SectionCTA />
          <Footer />
        </main>
      );

    default:
      return (
        <main className="min-h-screen flex items-center justify-center">
          Service not found
        </main>
      );
  }
}