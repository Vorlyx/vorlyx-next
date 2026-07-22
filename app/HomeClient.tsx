'use client';

import dynamic from "next/dynamic";
import homeData from "@/data/home.json";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import type { StickyCard } from "@/app/types/home";

// Dynamically import client-only landing components (vh units, scrolling, animations)
const HeroSection = dynamic(
  () => import("@/components/landing/HeroSection"),
  { ssr: false }
);

const CreativeStrategistsSection = dynamic(
  () => import("@/components/landing/CreativeStrategistsSection"),
  { ssr: false }
);

const Section3 = dynamic(
  () => import("@/components/landing/Section3"),
  { ssr: false }
);

const StickyCardsSection = dynamic(
  () => import("@/components/landing/StickyCardsSection"),
  { ssr: false }
);

const CapabilitiesSection = dynamic(
  () => import("@/components/landing/CapabilitiesSection"),
  { ssr: false }
);

const IconicMoveSection = dynamic(
  () => import("@/components/landing/IconicMoveSection"),
  { ssr: false }
);

export default function HomeClient() {
  return (
    <>
      {/* Header Navigation */}
      <Header
        logo={homeData.navigation.logo}
        links={homeData.navigation.links}
      />

      {/* Hero Section */}
      <HeroSection
        vorlyxText={homeData.hero.vorlyxText}
        video={homeData.hero.video}
      />

      {/* Section 2 */}
      <CreativeStrategistsSection
        headline={homeData.section2.headline}
        body={homeData.section2.body}
        button={homeData.section2.button}
        vorlyxLogo={homeData.section2.vorlyxLogo}
      />

      {/* Section 3 */}
      <Section3
        headline={homeData.section3.headline}
        button={homeData.section3.button}
      />

      {/* Sticky Cards Section */}
      <StickyCardsSection
        stickyCards={homeData.section3.stickyCards as StickyCard[]}
      />

      {/* Section 4 */}
      <div className="w-full bg-vorlyx-light-gray">
        <CapabilitiesSection
          title={homeData.section4.capabilities.title}
          body={homeData.section4.capabilities.body}
          button={homeData.section4.capabilities.button}
        />

        <IconicMoveSection />
      </div>

      {/* Footer */}
      <Footer
        logo={homeData.footer.logo}
        followUs={homeData.footer.followUs}
        emailUs={homeData.footer.emailUs}
        newsletter={homeData.footer.newsletter}
        navLinks={homeData.footer.navLinks}
        copyright={homeData.footer.copyright}
      />
    </>
  );
}
