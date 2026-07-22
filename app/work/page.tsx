import workData from "@/data/work.json";
import Header from "@/components/layout/Header";
import WorkHero from "./components/WorkHero";
import WorkGrid from "./components/WorkGrid";
import IconicMoveSection from "@/components/landing/IconicMoveSection";
import Footer from "@/components/layout/Footer";
import type { Metadata } from "next";
import Schema, { workCollectionSchema } from "@/components/seo/Schema";

export const metadata: Metadata = {
  title: "Work – Digital Products, Brands & Experiences | Vorlyx",
  description:
    "Explore Vorlyx's portfolio of digital products, brands, and experiences — from luxury e‑commerce to healthcare, AI‑powered fitness, and premium cosmetics ecosystems.",
  alternates: {
    canonical: "https://vorlyx.com/work",
  },
  openGraph: {
    type: "website",
    url: "https://vorlyx.com/work",
    siteName: "Vorlyx",
    title: "Vorlyx Work – Selected Digital Products, Brands & Experiences",
    description:
      "A curated selection of Vorlyx projects, including Luminelle luxury watches, Rhexo AI fitness, Éclavie cosmetics, Nexara healthcare, and Echove electronics.",
    images: [
      {
        // You can change this to a dedicated Work OG image if you have it
        url: "https://vorlyx.com/og/Work_og.png",
        width: 1200,
        height: 630,
        alt: "Vorlyx Work – Selected digital products, brands & experiences",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vorlyx Work – Digital Products, Brands & Experiences",
    description:
      "Quiet certainty. Thoughtful design meets precise technology across luxury, health, AI and modern commerce.",
    images: ["https://vorlyx.com/og/Work_og.png"],
  },
};


//import { calcGeneratorDuration } from "framer-motion";

/* ─── Module-level pre-computed data ────────────────────────────────────── */

// JSON-LD schema for the Work page: CollectionPage + Breadcrumbs + ItemList
// Built once at module load — reused across every request instead of being
// rebuilt on each render.
const WORK_JSON_LD = workCollectionSchema(workData.projects);

/**
 * Work page component
 * Displays work portfolio with hero section, project grid, iconic move section, and footer
 * Background: Light Gray (#EDEDED)
 */
export default function WorkPage() {
  return (
    <main className="w-full min-h-screen max-w-[1920px] mx-auto bg-[#EDEDED]">
      {/* JSON-LD Schema for Work page */}
      <Schema data={WORK_JSON_LD} id="schema-work-page" />
      {/* Header Navigation with black text (automatically applied via route detection) */}
      <Header
        logo={workData.navigation.logo}
        links={workData.navigation.links}
      />

      {/* Work Hero Section */}
      <WorkHero
        title={workData.hero.title}
        subtitle={workData.hero.subtitle}
      />

      {/* Work Grid Section */}
      <WorkGrid projects={workData.projects} />

      {/* Iconic Move Section */}
      <IconicMoveSection
        headline={workData.iconicMove.headline}
        button={workData.iconicMove.button}
      />

      {/* Footer */}
      <Footer
        logo={workData.footer.logo}
        followUs={workData.footer.followUs}
        emailUs={workData.footer.emailUs}
        newsletter={workData.footer.newsletter}
        navLinks={workData.footer.navLinks}
        copyright={workData.footer.copyright}
      />
    </main>
  );
}