// components/seo/Schema.tsx
import Script from "next/script";

type JsonLd = Record<string, unknown>;

interface SchemaProps {
  data: JsonLd;
  id?: string;
}

export default function Schema({ data, id = "schema-org" }: SchemaProps) {
  return (
    <Script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data),
      }}
    />
  );
}
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Vorlyx",
    url: "https://vorlyx.com",
    logo: "https://vorlyx.com/logo.png",
    description:
      "We forge unbreakable brands that dominate markets through ruthless strategy, fearless design, and flawless development.",
    email: "hello@vorlyx.com",
    sameAs: [
      "https://www.instagram.com/vorlyx.agency",
      "https://www.linkedin.com/company/vorlyxagency",
      "https://www.facebook.com/vorlyxagency",
    ],
  };
}
// components/seo/Schema.tsx

export function workCollectionSchema(projects: Array<{
  projectTitle: string;
  technologies: string;
  href: string;
  image?: string;
}>) {
  const mappedProjects = projects.map((project, index) => ({
    "@type": "CreativeWork",
    name: project.projectTitle,
    description: project.technologies,
    url: `https://vorlyx.com${project.href}`,
    position: index + 1,
    image: project.image ? `https://vorlyx.com${project.image}` : undefined,
  }));

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Vorlyx Work – Portfolio",
    url: "https://vorlyx.com/work",
    description:
      "Selected work from Vorlyx across luxury watches, AI‑powered fitness, healthcare platforms, premium cosmetics, and high‑end electronics.",
    isPartOf: {
      "@type": "WebSite",
      name: "Vorlyx",
      url: "https://vorlyx.com",
    },
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
          name: "Work",
          item: "https://vorlyx.com/work",
        },
      ],
    },
    mainEntity: {
      "@type": "ItemList",
      name: "Vorlyx Selected Work",
      itemListOrder: "http://schema.org/ItemListOrderAscending",
      numberOfItems: mappedProjects.length,
      itemListElement: mappedProjects.map((project, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: project.url,
        item: project,
      })),
    },
  };
}

interface StickyCard {
  category: string;
  description: string;
  services: string[];
}

export function servicesPageSchema(stickyCards: StickyCard[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ServicePage",
    name: "Vorlyx Services",
    url: "https://vorlyx.com/services",
    description:
      "Explore Vorlyx digital services: strategy, design, and development.",
    mainEntity: organizationSchema(),
    hasPart: stickyCards.map((card) => ({
      "@type": "Service",
      name: card.category,
      description: card.description,
      provider: organizationSchema(),
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: `${card.category} Offerings`,
        itemListElement: card.services.map((service) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: service,
          },
        })),
      },
    })),
  };
}

interface NewsArticle {
  id: number;
  date: string;
  headline: string;
  subHeadline: string;
  image: string;
  //url: string; // Assuming you've added the 'url' field as discussed
}
export function newsCollectionSchema(articles: NewsArticle[]) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Vorlyx News & Insights",
    "url": "https://vorlyx.com/news",
    "description": "Company chapters, design thoughts, and development wins from the Vorlyx team.",
    "publisher": organizationSchema(),
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": articles.length,
      "itemListElement": articles.map((article, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "CreativeWork",
          "headline": article.headline.replace(/\n/g, " "),
          "description": article.subHeadline.replace(/\n/g, " "),
          "image": `https://vorlyx.com${article.image}`,
          "author": {
            "@type": "Organization",
            "name": "Vorlyx"
          },
        //  "url": article.url // The LinkedIn URL
        }
      }))
    }
  };
}
interface ContactDetailsSchemaInput {
  businessEmail: string;
  jobsEmail: string;
}

export function contactPageSchema(contact: ContactDetailsSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Vorlyx",
    url: "https://vorlyx.com/contact",
    description:
      "Get in touch with Vorlyx for new business, partnerships, and career opportunities.",
    mainEntity: {
      ...organizationSchema(),
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "sales",
          email: contact.businessEmail,
          availableLanguage: ["English"],
          url: "https://vorlyx.com/contact",
        },
        {
          "@type": "ContactPoint",
          contactType: "recruiting",
          email: contact.jobsEmail,
          availableLanguage: ["English"],
          url: "https://vorlyx.com/contact",
        },
      ],
    },
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
          name: "Contact",
          item: "https://vorlyx.com/contact",
        },
      ],
    },
  };
}

/* ─── Project Detail Page Schema ─────────────────────────────────────────
 * Used by individual project pages: Luminelle, Rhexo, Éclavie, Nexara, Echov.
 * Emits CreativeWork + Breadcrumbs so Google can render rich results and
 * proper "Home > Work > [Project]" navigation in search.
 * ──────────────────────────────────────────────────────────────────────── */

interface ProjectDetailSchemaInput {
  slug: string;             // e.g., "luminelle"
  name: string;             // e.g., "Luminelle"
  description: string;      // 1-2 sentence project summary
  image: string;            // absolute or site-relative path to hero/cover image
  technologies?: string[];  // e.g., ["UX/UI", "Branding"]
  datePublished?: string;   // ISO date, e.g., "2024-11-15"
  category?: string;        // e.g., "Luxury E-Commerce", "Healthcare"
}

export function projectDetailSchema(project: ProjectDetailSchemaInput) {
  const projectUrl = `https://vorlyx.com/work/${project.slug}`;
  const imageUrl = project.image.startsWith("http")
    ? project.image
    : `https://vorlyx.com${project.image}`;

  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.name,
    description: project.description,
    url: projectUrl,
    image: imageUrl,
    ...(project.datePublished && { datePublished: project.datePublished }),
    ...(project.category && { genre: project.category }),
    ...(project.technologies &&
      project.technologies.length > 0 && {
        keywords: project.technologies.join(", "),
      }),
    creator: organizationSchema(),
    publisher: organizationSchema(),
    isPartOf: {
      "@type": "CollectionPage",
      name: "Vorlyx Work – Portfolio",
      url: "https://vorlyx.com/work",
    },
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
          name: "Work",
          item: "https://vorlyx.com/work",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: project.name,
          item: projectUrl,
        },
      ],
    },
  };
}