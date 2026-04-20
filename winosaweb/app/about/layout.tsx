import { getSiteSettings } from "@/lib/getSiteSettings";
import { ReactNode } from "react";

export async function generateMetadata() {
  const s = await getSiteSettings();
  return {
    title: s?.metaTitle ? `About Us | ${s.metaTitle}` : "About Us | Winosa Digital Agency",
    description:
      s?.metaDescription ||
      "Learn about Winosa Mitra Bharatajaya — our story, team, mission, and vision.",
    openGraph: {
      title: s?.metaTitle ? `About Us | ${s.metaTitle}` : "About Us | Winosa",
      description: s?.metaDescription || "Developers, designers, strategists from Bandar Lampung.",
      images: [s?.logo || "/og-image.jpg"],
    },
  };
}

export default function AboutLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
