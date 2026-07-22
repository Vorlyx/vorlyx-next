import nexaraData from "@/data/nexara.json";
import Header from "@/components/layout/Header";
import NexaraHero from "@/app/work/nexara/components/NexaraHero";
import ProjectInfo from "@/app/work/luminelle/components/ProjectInfo";
import NexaraProjectMediaGrid from "@/app/work/nexara/components/NexaraProjectMediaGrid";
import { type GridItem } from "@/app/work/luminelle/components/ProjectMediaGrid";
import NextProjectNav from "@/app/work/nexara/components/NexaraNextProjectNav";

import type { Metadata } from "next";
import Schema, { projectDetailSchema } from "@/components/seo/Schema";

/* ─── SEO Metadata ─────────────────────────────────────────────────────── */

export const metadata: Metadata = {
  title: nexaraData.seo.title,
  description: nexaraData.seo.description,
  keywords: nexaraData.seo.keywords,
  alternates: {
    canonical: nexaraData.seo.canonical,
  },
  openGraph: {
    type: "article",
    url: nexaraData.seo.canonical,
    siteName: "Vorlyx",
    title: nexaraData.seo.title,
    description: nexaraData.seo.description,
    images: [
      {
        url: `https://vorlyx.com${nexaraData.seo.ogImage}`,
        width: 1200,
        height: 630,
        alt: `${nexaraData.seo.title} – Vorlyx`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: nexaraData.seo.title,
    description: nexaraData.seo.description,
    images: [`https://vorlyx.com${nexaraData.seo.ogImage}`],
  },
};

/* ─── Module-level pre-computed JSON-LD (built once at module load) ────── */

const NEXARA_JSON_LD = projectDetailSchema({
  slug: nexaraData.seo.slug,
  name: "Nexara",
  description: nexaraData.seo.description,
  image: nexaraData.seo.ogImage,
  technologies: nexaraData.seo.technologies,
  datePublished: nexaraData.seo.datePublished,
  category: nexaraData.seo.category,
});

/**
 * Nexara project detail page
 * Displays project hero, info, media grid, and next project navigation
 * Background: Light Gray (#EDEDED) except hero section
 * Follows Single Core Route architecture
 * No footer on this page
 */
export default function NexaraPage() {
  return (
    <main
      className="w-full min-h-screen max-w-[1920px] mx-auto overflow-x-hidden"
      aria-label="Nexara Project Details"
    >
      {/* JSON-LD Schema for Nexara project */}
      <Schema data={NEXARA_JSON_LD} id="schema-nexara-project" />

      {/* Header Navigation with white text (automatically applied via route detection) */}
      <Header
        logo={nexaraData.navigation.logo}
        links={nexaraData.navigation.links}
      />

      {/* Nexara Hero Section */}
      <NexaraHero
        title={nexaraData.hero.title}
        media={nexaraData.hero.media}
      />

      {/* Project Info Section */}
      <ProjectInfo
        about={nexaraData.info.about}
        whatWeDid={nexaraData.info.whatWeDid}
        technology={nexaraData.info.technology}
      />

      {/* Project Media Grid Section */}
      <NexaraProjectMediaGrid
        gridItems={nexaraData.gridItems as GridItem[]}
      />

      {/* Next Project Navigation */}
      <NextProjectNav
        {...nexaraData.nextProject}
        image={nexaraData.nextProject.image}
      />
    </main>
  );
}