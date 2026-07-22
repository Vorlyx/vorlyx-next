import rhexoData from "@/data/rhexo.json";
import Header from "@/components/layout/Header";
import RhexoHero from "@/app/work/rhexo/components/RhexoHero";
import ProjectInfo from "@/app/work/luminelle/components/ProjectInfo";
import RhexoProjectMediaGrid from "@/app/work/rhexo/components/RhexoProjectMediaGrid";
import { type GridItem } from "@/app/work/luminelle/components/ProjectMediaGrid";
import NextProjectNav from "@/app/work/rhexo/components/RhexoNextProjectNav";

import type { Metadata } from "next";
import Schema, { projectDetailSchema } from "@/components/seo/Schema";

/* ─── SEO Metadata ─────────────────────────────────────────────────────── */

export const metadata: Metadata = {
  title: rhexoData.seo.title,
  description: rhexoData.seo.description,
  keywords: rhexoData.seo.keywords,
  alternates: {
    canonical: rhexoData.seo.canonical,
  },
  openGraph: {
    type: "article",
    url: rhexoData.seo.canonical,
    siteName: "Vorlyx",
    title: rhexoData.seo.title,
    description: rhexoData.seo.description,
    images: [
      {
        url: `https://vorlyx.com${rhexoData.seo.ogImage}`,
        width: 1200,
        height: 630,
        alt: `${rhexoData.seo.title} – Vorlyx`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: rhexoData.seo.title,
    description: rhexoData.seo.description,
    images: [`https://vorlyx.com${rhexoData.seo.ogImage}`],
  },
};

/* ─── Module-level pre-computed JSON-LD (built once at module load) ────── */

const RHEXO_JSON_LD = projectDetailSchema({
  slug: rhexoData.seo.slug,
  name: "Rhexo",
  description: rhexoData.seo.description,
  image: rhexoData.seo.ogImage,
  technologies: rhexoData.seo.technologies,
  datePublished: rhexoData.seo.datePublished,
  category: rhexoData.seo.category,
});

/**
 * Rhexo project detail page
 * Displays project hero, info, media grid, and next project navigation
 * Background: Light Gray (#EDEDED) except hero section
 * Follows Single Core Route architecture
 * No footer on this page
 */
export default function RhexoPage() {
  return (
    <main className="w-full min-h-screen max-w-[1920px] mx-auto overflow-x-hidden">
      {/* JSON-LD Schema for Rhexo project */}
      <Schema data={RHEXO_JSON_LD} id="schema-rhexo-project" />

      {/* Header Navigation with white text (automatically applied via route detection) */}
      <Header
        logo={rhexoData.navigation.logo}
        links={rhexoData.navigation.links}
      />

      {/* Rhexo Hero Section */}
      <RhexoHero
        title={rhexoData.hero.title}
        media={rhexoData.hero.media}
      />

      {/* Project Info Section */}
      <ProjectInfo
        about={rhexoData.info.about}
        whatWeDid={rhexoData.info.whatWeDid}
        technology={rhexoData.info.technology}
      />

      {/* Project Media Grid Section */}
      <RhexoProjectMediaGrid gridItems={rhexoData.gridItems as GridItem[]} />

      {/* Next Project Navigation */}
      <NextProjectNav
        {...rhexoData.nextProject}
        image={rhexoData.nextProject.image}
      />

    </main>
  );
}