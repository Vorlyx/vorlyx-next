"use client";

import { useMemo } from "react";
import Image from "next/image";

/**
 * Contact Hero Section component
 * Displays large "CONTACT" title and subtitle text
 * Height: 680px (same as other hero sections)
 * Background: Light Gray (#EDEDED)
 */
interface ContactHeroProps {
  title: string;
  subtitle: string;
}

/* ─── Module-level constants ────────────────────────────────────────────── */

// Inline transform for the N letter (never recreated)
const N_LETTER_TRANSFORM_STYLE: React.CSSProperties = {
  transform: "translateY(0.04em)",
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function ContactHero({ title: _title, subtitle }: ContactHeroProps) {
  // Memoize the subtitle HTML — only rebuild when `subtitle` prop changes
  const subtitleHtml = useMemo(
    () => ({
      __html: subtitle.replace("what's next", "what's&nbsp;next"),
    }),
    [subtitle]
  );

  return (
    <section
      id="contact-hero-section"
      className="relative w-full max-w-[1920px] mx-auto bg-[#EDEDED] flex items-center justify-center
          
    min-h-[915px]          /* Mobile */
    sm:min-h-[1100px]       /* iPad Mini / Air */
    ipadpro:min-h-[1366px]  /* iPad Pro */
    lg:min-h-[680px]       /* Laptop & Desktop */
  "
    >
      <div className="w-full max-w-[1920px] mx-auto px-10 md:px-16 lg:px-24">
        <div className="flex flex-col items-center text-center translate-y-[10%] md:translate-y-[20%]">

          {/* Main "CONTACT" Title */}
          {/* Using Lato Extra Bold/Black weight, massive size (250px+), solid black */}
          {/* Split "CONTACT" to replace "N" with SVG logo */}
          <h1 className="font-lato text-[70px] sm:text-[153px] ipadpro:text-[200px] md:text-[250px] lg:text-[250px] font-bold text-black uppercase tracking-tight leading-none mb-6 md:mb-8 flex items-center">
            CO
            <span
              className="inline-flex items-center ml-[-3px] sm:ml-[-10px] md:ml-[-15px] mr-[0.03em]"
              style={N_LETTER_TRANSFORM_STYLE}
            >
              <Image
                src="/assets/Logo/N_Letter.svg"
                alt="N"
                width={120}
                height={300}
                className="h-[0.95em] w-auto translate-y-[-5px] sm:translate-y-0"
              />
            </span>
            <span className="ml-[-3px] sm:ml-[-14px] md:ml-[-20px]">TACT</span>

          </h1>

          {/* Subtitle Text */}
          {/* Using Lato Regular/Semi-Bold, large size (50px), solid black */}
          <p
            className="font-lato text-[20px] sm:text-[28px] md:text-[32px] lg:text-[38px] font-normal text-black max-w-5xl mx-auto leading-tight text-left
  px-4 sm:px-0"
            dangerouslySetInnerHTML={subtitleHtml}
          />

        </div>
      </div>
    </section>
  );
}