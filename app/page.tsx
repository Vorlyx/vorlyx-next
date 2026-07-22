import type { Metadata } from "next";
import Schema, { organizationSchema } from "@/components/seo/Schema";
import HomeClient from "./HomeClient";

/**
 * SEO Metadata for Home Page
 * This is the most-shared URL on the site — full OpenGraph coverage is essential
 */
export const metadata: Metadata = {
  title: "Vorlyx – Creative Strategists & Design-Tech Agency",
  description:
    "Vorlyx is a full-service design-tech agency that forges unbreakable brands through ruthless strategy, fearless design, and flawless development.",
  alternates: {
    canonical: "https://vorlyx.com",
  },
  openGraph: {
    type: "website",
    url: "https://vorlyx.com",
    siteName: "Vorlyx",
    title: "Vorlyx – Creative Strategists & Design-Tech Agency",
    description:
      "A full-service design-tech agency that builds boldly. Research, strategy, design, development, and deployment through user-centered innovation.",
    images: [
      {
        url: "https://vorlyx.com/og/Home_og.png",
        width: 1200,
        height: 630,
        alt: "Vorlyx – Creative Strategists & Design-Tech Agency",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vorlyx – Creative Strategists & Design-Tech Agency",
    description:
      "A full-service design-tech agency that builds boldly. Research, strategy, design, development, and deployment.",
    images: ["https://vorlyx.com/og/Home_og.png"],
  },
};

/* ─── Module-level pre-computed JSON-LD (built once at module load) ────── */

const HOME_JSON_LD = organizationSchema();

export default function Home() {
  return (
    <main className="w-full min-h-screen max-w-[1920px] mx-auto flex flex-col relative">

      {/* Schema must stay in server component for SEO */}
      <Schema data={HOME_JSON_LD} id="schema-home-organization" />

      {/* Client-only UI */}
      <HomeClient />

    </main>
  );
}