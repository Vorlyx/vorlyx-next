import eclavieData from "@/data/eclavie.json";
import Header from "@/components/layout/Header";
import EclavieHero from "@/app/work/eclavie/components/EclavieHero";
import ProjectInfo from "@/app/work/luminelle/components/ProjectInfo";
import EclavieProjectMediaGrid from "@/app/work/eclavie/components/EclavieProjectMediaGrid";
import { type GridItem } from "@/app/work/luminelle/components/ProjectMediaGrid";
import NextProjectNav from "@/app/work/eclavie/components/EclavieNextProjectNav";

import type { Metadata } from "next";
import Schema, { projectDetailSchema } from "@/components/seo/Schema";

/* ─── SEO Metadata ─────────────────────────────────────────────────────── */

export const metadata: Metadata = {
  title: eclavieData.seo.title,
  description: eclavieData.seo.description,
  keywords: eclavieData.seo.keywords,
  alternates: {
    canonical: eclavieData.seo.canonical,
  },
  openGraph: {
    type: "article",
    url: eclavieData.seo.canonical,
    siteName: "Vorlyx",
    title: eclavieData.seo.title,
    description: eclavieData.seo.description,
    images: [
      {
        url: `https://vorlyx.com${eclavieData.seo.ogImage}`,
        width: 1200,
        height: 630,
        alt: `${eclavieData.seo.title} – Vorlyx`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: eclavieData.seo.title,
    description: eclavieData.seo.description,
    images: [`https://vorlyx.com${eclavieData.seo.ogImage}`],
  },
};

/* ─── Module-level pre-computed JSON-LD (built once at module load) ────── */

const ECLAVIE_JSON_LD = projectDetailSchema({
  slug: eclavieData.seo.slug,
  name: "Éclavie",
  description: eclavieData.seo.description,
  image: eclavieData.seo.ogImage,
  technologies: eclavieData.seo.technologies,
  datePublished: eclavieData.seo.datePublished,
  category: eclavieData.seo.category,
});

/**
 * Eclavie project detail page
 * Displays project hero, info, media grid, and next project navigation
 * Background: Light Gray (#EDEDED) except hero section
 * Follows Single Core Route architecture
 * No footer on this page
 */
export default function EclaviePage() {
  return (
    <main
      className="w-full min-h-screen max-w-[1920px] mx-auto overflow-x-hidden"
      aria-label="Éclavie Project Details"
    >
      {/* JSON-LD Schema for Éclavie project */}
      <Schema data={ECLAVIE_JSON_LD} id="schema-eclavie-project" />

      {/* Header Navigation with white text (automatically applied via route detection) */}
      <Header
        logo={eclavieData.navigation.logo}
        links={eclavieData.navigation.links}
      />

      {/* Eclavie Hero Section */}
      <EclavieHero
        title={eclavieData.hero.title}
        media={eclavieData.hero.media}
      />

      {/* Project Info Section */}
      <ProjectInfo
        about={eclavieData.info.about}
        whatWeDid={eclavieData.info.whatWeDid}
        technology={eclavieData.info.technology}
      />

      {/* Project Media Grid Section */}
      <EclavieProjectMediaGrid
        gridItems={eclavieData.gridItems as GridItem[]}
      />

      {/* Next Project Navigation */}
      <NextProjectNav
        {...eclavieData.nextProject}
        image={eclavieData.nextProject.image}
      />
    </main>
  );
}