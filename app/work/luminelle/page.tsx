import luminelleData from "@/data/luminelle.json";
import Header from "@/components/layout/Header";
import LuminelleHero from "@/app/work/luminelle/components/LuminelleHero";
import ProjectInfo from "@/app/work/luminelle/components/ProjectInfo";
import ProjectMediaGrid, { type GridItem } from "@/app/work/luminelle/components/ProjectMediaGrid";
import NextProjectNav from "@/app/work/luminelle/components/NextProjectNav";

import type { Metadata } from "next";
import Schema, { projectDetailSchema } from "@/components/seo/Schema";

/* ─── SEO Metadata ─────────────────────────────────────────────────────── */

export const metadata: Metadata = {
  title: luminelleData.seo.title,
  description: luminelleData.seo.description,
  keywords: luminelleData.seo.keywords,
  alternates: {
    canonical: luminelleData.seo.canonical,
  },
  openGraph: {
    type: "article",
    url: luminelleData.seo.canonical,
    siteName: "Vorlyx",
    title: luminelleData.seo.title,
    description: luminelleData.seo.description,
    images: [
      {
        url: `https://vorlyx.com${luminelleData.seo.ogImage}`,
        width: 1200,
        height: 630,
        alt: `${luminelleData.seo.title} – Vorlyx`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: luminelleData.seo.title,
    description: luminelleData.seo.description,
    images: [`https://vorlyx.com${luminelleData.seo.ogImage}`],
  },
};

/* ─── Module-level pre-computed JSON-LD (built once at module load) ────── */

const LUMINELLE_JSON_LD = projectDetailSchema({
  slug: luminelleData.seo.slug,
  name: "Luminelle",
  description: luminelleData.seo.description,
  image: luminelleData.seo.ogImage,
  technologies: luminelleData.seo.technologies,
  datePublished: luminelleData.seo.datePublished,
  category: luminelleData.seo.category,
});

/**
 * Luminelle project detail page
 * Displays project hero, info, media grid, and next project navigation
 * Background: Light Gray (#EDEDED) except hero section
 * Follows Single Core Route architecture
 * No footer on this page
 */
export default function LuminellePage() {
  return (
    <main className="w-full min-h-screen max-w-[1920px] mx-auto overflow-x-hidden">
      {/* JSON-LD Schema for Luminelle project */}
      <Schema data={LUMINELLE_JSON_LD} id="schema-luminelle-project" />

      {/* Header Navigation with white text (automatically applied via route detection) */}
      <Header
        logo={luminelleData.navigation.logo}
        links={luminelleData.navigation.links}
      />

      {/* Luminelle Hero Section */}
      <LuminelleHero
        title={luminelleData.hero.title}
        media={luminelleData.hero.media}
      />

      {/* Project Info Section */}
      <ProjectInfo
        about={luminelleData.info.about}
        whatWeDid={luminelleData.info.whatWeDid}
        technology={luminelleData.info.technology}
      />

      {/* Project Media Grid Section */}
      <ProjectMediaGrid gridItems={luminelleData.gridItems as GridItem[]} />

      {/* Next Project Navigation */}
      <NextProjectNav
        {...luminelleData.nextProject}
        imageSrc={luminelleData.nextProject.image}
      />
    </main>
  );
}