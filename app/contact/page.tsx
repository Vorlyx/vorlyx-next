import contactData from "@/data/contact.json";
import Header from "@/components/layout/Header";
import ContactHero from "./components/ContactHero";
import ContactIntro from "./components/ContactIntro";
import ContactDetails from "./components/ContactDetails";
import IconicMoveSection from "@/components/landing/IconicMoveSection";
import Footer from "@/components/layout/Footer";

import type { Metadata } from "next";
import Schema, { contactPageSchema } from "@/components/seo/Schema";

export const metadata: Metadata = {
  title: "Contact | Vorlyx",
  description:
    "Get in touch with Vorlyx for new business, collaborations, project inquiries, and career opportunities.",
  alternates: {
    canonical: "https://vorlyx.com/contact",
  },
  openGraph: {
    title: "Contact | Vorlyx",
    description:
      "Get in touch with Vorlyx for new business, collaborations, project inquiries, and career opportunities.",
    url: "https://vorlyx.com/contact",
    siteName: "Vorlyx",
    type: "website",
    images: [
      {
        url: "https://vorlyx.com/og/Contact_og.png",
        width: 1200,
        height: 630,
        alt: "Contact Vorlyx – Let's Talk",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact | Vorlyx",
    description:
      "Get in touch with Vorlyx for new business, collaborations, project inquiries, and career opportunities.",
    images: ["https://vorlyx.com/og/Contact_og.png"],
  },
};

/* ─── Module-level pre-computed JSON-LD (built once at module load) ────── */

const CONTACT_JSON_LD = contactPageSchema(contactData.contactDetails);

/**
 * Contact page component
 * Displays contact information with hero, intro, contact details, iconic move, and footer
 * Background: Light Gray (#EDEDED)
 * Follows Single Core Route architecture
 */
export default function ContactPage() {
  return (
    <main className="w-full min-h-screen max-w-[1920px] mx-auto bg-[#EDEDED]">
      <Schema data={CONTACT_JSON_LD} id="contact-schema" />

      {/* Header Navigation with black text (automatically applied via route detection) */}
      <Header
        logo={contactData.navigation.logo}
        links={contactData.navigation.links}
      />

      {/* Contact Hero Section */}
      <ContactHero
        title={contactData.hero.title}
        subtitle={contactData.hero.subtitle}
      />

      {/* Contact Intro Section */}
      <ContactIntro
        title={contactData.intro.title}
        text={contactData.intro.text}
      />

      {/* Contact Details Section */}
      <ContactDetails
        businessEmail={contactData.contactDetails.businessEmail}
        jobsEmail={contactData.contactDetails.jobsEmail}
      />

      {/* Iconic Move Section */}
      <IconicMoveSection
        headline={contactData.iconicMove.headline}
        button={contactData.iconicMove.button}
      />

      {/* Footer */}
      <Footer
        logo={contactData.footer.logo}
        followUs={contactData.footer.followUs}
        emailUs={contactData.footer.emailUs}
        newsletter={contactData.footer.newsletter}
        navLinks={contactData.footer.navLinks}
        copyright={contactData.footer.copyright}
      />
    </main>
  );
}