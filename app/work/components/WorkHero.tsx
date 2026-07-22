"use client";

import Image from "next/image";

interface WorkHeroProps {
  title: string;
  subtitle: string;
}

/* ─── Module-level constants (never recreated) ──────────────────────────── */

// Vertical offset to push the WORK title/subtitle group down
const CONTENT_TRANSFORM_STYLE: React.CSSProperties = {
  transform: "translateY(20%)",
};

// Ensures the R vector SVG maintains its aspect ratio
const R_IMAGE_STYLE: React.CSSProperties = {
  objectFit: "contain",
};

/**
 * Work Hero Section component
 * Displays large "WORK" title and subtitle text
 * Height: 680px (same as Home page Hero section)
 * Background: Light Gray (#EDEDED)
 */
export default function WorkHero({ subtitle }: WorkHeroProps) {
  return (
    <section
      id="work-hero-section"
      className="relative w-full max-w-[1920px] mx-auto bg-[#EDEDED] flex items-center justify-center min-h-screen"
    >
      <div className="w-full max-w-[1920px] mx-auto px-8 md:px-16 lg:px-24">
        <div
          className="flex flex-col items-center text-center"
          style={CONTENT_TRANSFORM_STYLE}
        >
          {/* Main "WORK" Title */}
          <h1 className="font-lato text-[80px] sm:text-[180px] md:text-[250px] lg:text-[300px] font-bold text-black uppercase tracking-tight leading-none mb-6 md:mb-2 flex items-center">
            WO
            <span
               // Adjusted here: Removed inline style, added responsive translate-y
              className="inline-flex items-center mx-0 mr-[0.03em] translate-y-[-2px] sm:translate-y-[0.04em]"
            >
              <Image
                src="/assets/Logo/R_Vector.svg"
                alt="R"
                width={120}
                height={300}
                className="h-[0.93em] w-auto"
                style={R_IMAGE_STYLE}
              />
            </span>
            <span className="ml-[-0.1em]">K</span>
          </h1>

          {/* Subtitle Text */}
          <p className="font-lato text-[20px] sm:text-[28px] md:text-[32px] lg:text-[38px] font-normal text-black max-w-4xl leading-tight text-left">
            {subtitle}
          </p>
        </div>
      </div>
    </section>
  );
}