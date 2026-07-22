import servicesData from "@/data/services.json";
import Header from "@/components/layout/Header";
import ServicesHero from "./components/ServicesHero";
import WhatWeDoSection from "./components/WhatWeDoSection";
import ServicesStickyCards from "./components/ServicesStickyCards";
import WorkShowcase from "./components/WorkShowcase";
import IconicMoveSection from "@/components/landing/IconicMoveSection";
import Footer from "@/components/layout/Footer";

import type { Metadata } from "next";
import Schema, { organizationSchema } from "@/components/seo/Schema";


/**
 * SEO Metadata for Services Page
 */
export const metadata: Metadata = {
  title: "Services – Branding, UX Design & Development | Vorlyx",
  description:
    "Vorlyx delivers cutting‑edge brand strategy, interface design, and robust development. Discover service offerings that fuse aesthetics and engineering for enduring digital impact.",
  alternates: {
    canonical: "https://vorlyx.com/services",
  },
  openGraph: {
    type: "website",
    url: "https://vorlyx.com/services",
    siteName: "Vorlyx",
    title: "Vorlyx Services – Brand Strategy, UX Design, Web Development",
    description:
      "Explore how Vorlyx crafts intuitive experiences and flawless systems through design, strategy, and development.",
    images: [
      {
        url: "https://vorlyx.com/og/Services_og.png",
        width: 1200,
        height: 630,
        alt: "Vorlyx Services – Creative & Technical Agency",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vorlyx Services – Strategy, Design & Tech",
    description:
      "We craft intuitive experiences and engineer systems that perform relentlessly.",
    images: ["https://vorlyx.com/og/Services_og.png"],
  },
};

/* ─── Module-level pre-computed schemas (built once at module load) ────── */

/**
 * Build individual Service schemas
 */
const SERVICE_ENTITIES = servicesData.stickyCards.map((card) => ({
  "@type": "Service",
  name: card.category,
  description: card.description,
  provider: organizationSchema(),
  areaServed: {
    "@type": "Place",
    name: "Global",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: `${card.category} Offerings`,
    itemListElement: card.services.map((s) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: s,
        provider: {
          "@type": "Organization",
          name: "Vorlyx",
        },
      },
    })),
  },
}));

/**
 * Schema for Services Page
 */
const SERVICES_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ServicePage",
  name: "Vorlyx Services",
  url: "https://vorlyx.com/services",
  description:
    "Explore Vorlyx's range of professional digital services — research, strategy, design, and development for visionary brands.",
  mainEntity: organizationSchema(),
  hasPart: SERVICE_ENTITIES,
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
        name: "Services",
        item: "https://vorlyx.com/services",
      },
    ],
  },
};

/**
 * Services page component
 * Displays services information with hero, what we do, sticky cards, work showcase, iconic move, and footer
 * Background: Light Gray (#EDEDED)
 * Follows Single Core Route architecture
 */
export default function ServicesPage() {
  return (
    <main className="w-full min-h-screen max-w-[1920px] mx-auto">
      {/* Inject structured data */}
      <Schema data={SERVICES_JSON_LD} id="schema-services-page" />

      {/* Header Navigation with black text (automatically applied via route detection) */}
      <Header
        logo={servicesData.navigation.logo}
        links={servicesData.navigation.links}
      />

      {/* Services Hero Section */}
      <ServicesHero
        subtitle={servicesData.hero.subtitle}
      />

      {/* What We Do Section */}
      <WhatWeDoSection
        title={servicesData.whatWeDo.title}
        description={servicesData.whatWeDo.description}
      />

      {/* Black sticky cards section - full bleed black */}
      <section className="w-full bg-[#000000]">
        <ServicesStickyCards stickyCards={servicesData.stickyCards} />
      </section>

      {/* Light gray sections - apply background here */}
      <section className="w-full bg-[#EDEDED]">
        <WorkShowcase
          title={servicesData.workShowcase.title}
          projects={servicesData.workShowcase.projects}
        />

        {/* Iconic Move Section */}
        <IconicMoveSection
          headline={servicesData.iconicMove.headline}
          button={servicesData.iconicMove.button}
        />
      </section>

      {/* Footer */}
      <Footer
        logo={servicesData.footer.logo}
        followUs={servicesData.footer.followUs}
        emailUs={servicesData.footer.emailUs}
        newsletter={servicesData.footer.newsletter}
        navLinks={servicesData.footer.navLinks}
        copyright={servicesData.footer.copyright}
      />
    </main>
  );
}