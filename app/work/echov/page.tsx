import echovData from "@/data/echov.json";
import Header from "@/components/layout/Header";
import EchovHero from "@/app/work/echov/components/EchovHero";
import ProjectInfo from "@/app/work/luminelle/components/ProjectInfo";
import EchovProjectMediaGrid from "@/app/work/echov/components/EchovProjectMediaGrid";
import { type GridItem } from "@/app/work/luminelle/components/ProjectMediaGrid";
import NextProjectNav from "@/app/work/echov/components/EchovNextProjectNav";

import type { Metadata } from "next";
import Schema, { projectDetailSchema } from "@/components/seo/Schema";

/* ─── SEO Metadata ─────────────────────────────────────────────────────── */

export const metadata: Metadata = {
  title: echovData.seo.title,
  description: echovData.seo.description,
  keywords: echovData.seo.keywords,
  alternates: {
    canonical: echovData.seo.canonical,
  },
  openGraph: {
    type: "article",
    url: echovData.seo.canonical,
    siteName: "Vorlyx",
    title: echovData.seo.title,
    description: echovData.seo.description,
    images: [
      {
        url: `https://vorlyx.com${echovData.seo.ogImage}`,
        width: 1200,
        height: 630,
        alt: `${echovData.seo.title} – Vorlyx`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: echovData.seo.title,
    description: echovData.seo.description,
    images: [`https://vorlyx.com${echovData.seo.ogImage}`],
  },
};

/* ─── Module-level pre-computed JSON-LD (built once at module load) ────── */

const ECHOV_JSON_LD = projectDetailSchema({
  slug: echovData.seo.slug,
  name: "Echov",
  description: echovData.seo.description,
  image: echovData.seo.ogImage,
  technologies: echovData.seo.technologies,
  datePublished: echovData.seo.datePublished,
  category: echovData.seo.category,
});

/**
 * Echov project detail page
 * Displays project hero, info, media grid, and next project navigation
 * Background: Light Gray (#EDEDED) except hero section
 * Follows Single Core Route architecture
 * No footer on this page
 */
export default function EchovPage() {
  return (
    <main
      className="w-full min-h-screen max-w-[1920px] mx-auto overflow-x-hidden"
      aria-label="Echov Project Details"
    >
      {/* JSON-LD Schema for Echov project */}
      <Schema data={ECHOV_JSON_LD} id="schema-echov-project" />

      {/* Header Navigation with white text (automatically applied via route detection) */}
      <Header
        logo={echovData.navigation.logo}
        links={echovData.navigation.links}
      />

      {/* Echov Hero Section */}
      <EchovHero
        title={echovData.hero.title}
        media={echovData.hero.media}
      />

      {/* Project Info Section */}
      <ProjectInfo
        about={echovData.info.about}
        whatWeDid={echovData.info.whatWeDid}
        technology={echovData.info.technology}
      />

      {/* Project Media Grid Section */}
      <EchovProjectMediaGrid
        gridItems={echovData.gridItems as GridItem[]}
      />

      {/* Next Project Navigation */}
      <NextProjectNav
        {...echovData.nextProject}
        image={echovData.nextProject.image}
      />
    </main>
  );
}