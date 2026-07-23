'use client';

import dynamic from "next/dynamic";
import homeData from "@/data/home.json";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/landing/HeroSection";
import CreativeStrategistsSection from "@/components/landing/CreativeStrategistsSection";
import Section3 from "@/components/landing/Section3";
import CapabilitiesSection from "@/components/landing/CapabilitiesSection";
import IconicMoveSection from "@/components/landing/IconicMoveSection";
import type { StickyCard } from "@/app/types/home";

// Only sticky cards uses GSAP heavily → keep it dynamic but WITH ssr
const StickyCardsSection = dynamic(
  () => import("@/components/landing/StickyCardsSection"),
  {
    ssr: false,
    loading: () => (
      <div style={{ height: "100svh", background: "#171717" }} />
    ),
  }
);

export default function HomeClient() {
  return (
    <>
      <Header
        logo={homeData.navigation.logo}
        links={homeData.navigation.links}
      />

      <HeroSection
        vorlyxText={homeData.hero.vorlyxText}
        video={homeData.hero.video}
      />

      <CreativeStrategistsSection
        headline={homeData.section2.headline}
        body={homeData.section2.body}
        button={homeData.section2.button}
        vorlyxLogo={homeData.section2.vorlyxLogo}
      />

      <Section3
        headline={homeData.section3.headline}
        button={homeData.section3.button}
      />

      <StickyCardsSection
        stickyCards={homeData.section3.stickyCards as StickyCard[]}
      />

      <div className="w-full bg-vorlyx-light-gray">
        <CapabilitiesSection
          title={homeData.section4.capabilities.title}
          body={homeData.section4.capabilities.body}
          button={homeData.section4.capabilities.button}
        />

        <IconicMoveSection />
      </div>

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