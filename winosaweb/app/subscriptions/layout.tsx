import { getSiteSettings } from "@/lib/getSiteSettings";
import { ReactNode } from "react";

export async function generateMetadata() {
  const s = await getSiteSettings();
  return {
    title: s?.metaTitle
      ? `Pricing & Plans | ${s.metaTitle}`
      : "Pricing & Plans | Winosa Digital Agency",
    description:
      s?.metaDescription ||
      "Flexible pricing plans for web development, mobile apps, and UI/UX design. Starter, Business, and Enterprise.",
    openGraph: {
      title: s?.metaTitle ? `Pricing & Plans | ${s.metaTitle}` : "Pricing & Plans | Winosa",
      description: s?.metaDescription || "Simple, transparent pricing for digital services.",
      images: [s?.logo || "/og-image.jpg"],
    },
  };
}

export default function SubscriptionsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

