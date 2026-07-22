import newsData from "@/data/news.json";
import Header from "@/components/layout/Header";
import NewsHero from "./components/NewsHero";
import NewsGrid from "./components/NewsGrid";
import IconicMoveSection from "@/components/landing/IconicMoveSection";
import Footer from "@/components/layout/Footer";

import type { Metadata } from "next";
import Schema, { newsCollectionSchema } from "@/components/seo/Schema";

export const metadata: Metadata = {
  title: "News | Vorlyx",
  description:
    "Unfiltered: company chapters, design thoughts, dev wins, and everything in between.",
  alternates: {
    canonical: "https://vorlyx.com/news",
  },
  openGraph: {
    title: "News | Vorlyx",
    description:
      "Unfiltered: company chapters, design thoughts, dev wins, and everything in between.",
    url: "https://vorlyx.com/news",
    siteName: "Vorlyx",
    type: "website",
    images: [
      {
        // ideally a dedicated OG image; fallback can be one of the article images
        url: "https://vorlyx.com/og/News_og.png",
        width: 1200,
        height: 630,
        alt: "Vorlyx News",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "News | Vorlyx",
    description:
      "Unfiltered: company chapters, design thoughts, dev wins, and everything in between.",
    images: ["https://vorlyx.com/og/News_og.png"],
  },
};

/* ─── Module-level pre-computed JSON-LD (built once at module load) ────── */

const NEWS_JSON_LD = newsCollectionSchema(newsData.articles);

/**
 * News page component
 * Displays news articles with hero, grid, iconic move, and footer
 * Background: Light Gray (#EDEDED)
 * Follows Single Core Route architecture
 */
export default function NewsPage() {
  return (
    <main className="w-full min-h-screen max-w-[1920px] mx-auto bg-[#EDEDED]">
      <Schema data={NEWS_JSON_LD} id="news-schema" />

      {/* Header Navigation with black text (automatically applied via route detection) */}
      <Header
        logo={newsData.navigation.logo}
        links={newsData.navigation.links}
      />

      {/* News Hero Section */}
      <NewsHero subtitle={newsData.hero.subtitle} />

      {/* News Grid Section */}
      <NewsGrid articles={newsData.articles} seeMore={newsData.seeMore} />

      {/* Iconic Move Section */}
      <IconicMoveSection
        headline={newsData.iconicMove.headline}
        button={newsData.iconicMove.button}
      />

      {/* Footer */}
      <Footer
        logo={newsData.footer.logo}
        followUs={newsData.footer.followUs}
        emailUs={newsData.footer.emailUs}
        newsletter={newsData.footer.newsletter}
        navLinks={newsData.footer.navLinks}
        copyright={newsData.footer.copyright}
      />
    </main>
  );
}