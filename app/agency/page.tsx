import agencyData from "@/data/agency.json";
import Header from "@/components/layout/Header";
import AgencyHero from "./components/AgencyHero";
import CreativeStrategists from "./components/CreativeStrategists";
import TeamSection from "./components/TeamSection";
import VorlyxDoctrine from "./components/VorlyxDoctrine";
import IconicMoveSection from "@/components/landing/IconicMoveSection";
import Footer from "@/components/layout/Footer";

import type { Metadata } from "next";
import Schema, { organizationSchema } from "@/components/seo/Schema";

/**
 * SEO Metadata for Agency Page
 */
export const metadata: Metadata = {
  title: "Agency – Creative Strategists Behind Vorlyx",
  description:
    "Meet the creative strategists behind Vorlyx. We forge unbreakable brands through ruthless strategy, fearless design, and precision engineering.",
  alternates: {
    canonical: "https://vorlyx.com/agency",
  },
  openGraph: {
    type: "website",
    url: "https://vorlyx.com/agency",
    siteName: "Vorlyx",
    title: "Vorlyx Agency – Creative Strategists & Digital Innovators",
    description:
      "The Vorlyx team combines strategic thinking, fearless design, and advanced technology to build brands that dominate markets.",
    images: [
      {
        url: "https://vorlyx.com/og/Agency_og.png",
        width: 1200,
        height: 630,
        alt: "Vorlyx Agency – Creative Strategists",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vorlyx Agency – Creative Strategists",
    description:
      "Meet the team shaping Vorlyx and the doctrine guiding our creative strategy.",
    images: ["https://vorlyx.com/og/Agency_og.png"],
  },
};

/* ─── Module-level pre-computed schemas (built once at module load) ────── */

const TEAM_SCHEMAS = agencyData.teamMembers.map((member) => ({
  "@type": "Person",
  name: member.name,
  jobTitle: member.title,
  image: `https://vorlyx.com${member.image}`,
  worksFor: {
    "@type": "Organization",
    name: "Vorlyx",
    url: "https://vorlyx.com",
  },
}));

const AGENCY_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "About Vorlyx Agency",
  url: "https://vorlyx.com/agency",
  description:
    "Vorlyx is a digital strategy and design agency forging powerful brands and digital experiences.",
  mainEntity: organizationSchema(),
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://vorlyx.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Agency",
        item: "https://vorlyx.com/agency",
      },
    ],
  },
  employee: TEAM_SCHEMAS,
};

/**
 * Agency page component
 * Displays agency information with hero, creative strategists, team, doctrine, iconic move, and footer
 * Background: Light Gray (#EDEDED)
 */
export default function AgencyPage() {
  return (
    <main className="w-full min-h-screen max-w-[1920px] mx-auto bg-[#EDEDED]">
      {/* Structured Data */}
      <Schema data={AGENCY_JSON_LD} id="schema-agency-page" />

      {/* Header Navigation with black text (automatically applied via route detection) */}
      <Header
        logo={agencyData.navigation.logo}
        links={agencyData.navigation.links}
      />

      {/* Agency Hero Section */}
      <AgencyHero
        headline={agencyData.hero.headline}
        button={agencyData.hero.button}
      />

      {/* Creative Strategists Section */}
      <CreativeStrategists
        title={agencyData.creativeStrategists.title}
        body={agencyData.creativeStrategists.body}
      />

      {/* Team Section */}
      <div id="team-section">
        <TeamSection teamMembers={agencyData.teamMembers} />
      </div>

      {/* Vorlyx Doctrine Section */}
      <VorlyxDoctrine doctrine={agencyData.doctrine} />

      {/* Iconic Move Section */}
      <IconicMoveSection
        headline={agencyData.iconicMove.headline}
        button={agencyData.iconicMove.button}
      />

      {/* Footer */}
      <Footer
        logo={agencyData.footer.logo}
        followUs={agencyData.footer.followUs}
        emailUs={agencyData.footer.emailUs}
        newsletter={agencyData.footer.newsletter}
        navLinks={agencyData.footer.navLinks}
        copyright={agencyData.footer.copyright}
      />
    </main>
  );
}