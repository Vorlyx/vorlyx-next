"use client";

import Image from "next/image";

interface NewsHeroProps {
  subtitle: string;
}

/* ─── Module-level constants ────────────────────────────────────────────── */

// Inline transform for the W letter (never recreated)
const W_LETTER_TRANSFORM_STYLE: React.CSSProperties = {
  transform: "translateY(0.04em)",
};

export default function NewsHero({ subtitle }: NewsHeroProps) {
  return (
    <section
      id="news-hero-section"
      className="relative w-full max-w-[1920px] mx-auto bg-[#EDEDED] flex items-center justify-center
      min-h-[915px]          /* Mobile */
    sm:min-h-[1100px]       /* iPad Mini / Air */
    ipadpro:min-h-[1366px]  /* iPad Pro */
    lg:min-h-[680px]       /* Laptop & Desktop */
    "
    >
      <div className="w-full max-w-[1920px] mx-auto px-10 sm:px-10 md:px-16 lg:px-24">

        {/* Content Wrapper */}
        <div
          className="
    flex flex-col items-center text-center 
    pt-[10px] sm:pt-[10px] ipadpro:pt-[10px] md:pt-[200px] lg:pt-0
    translate-y-0 md:translate-y-[20%]
  "
        >

          {/* Main NEWS Title */}
          <h1 className="font-lato text-[120px] sm:text-[180px] md:text-[250px] lg:text-[300px] font-bold text-black uppercase tracking-tight leading-none mb-6 md:mb-8 flex items-center">
            NE
            <span
              className="inline-flex items-center ml-[-0.08em] mr-[0.03em]"
              style={W_LETTER_TRANSFORM_STYLE}
            >
              <Image
                src="/assets/Logo/W_Letter.svg"
                alt="W"
                width={120}
                height={300}
                className="h-[0.93em] w-auto translate-y-[-5px] sm:translate-y-0"
              />
            </span>
            <span className="ml-[-0.13em]">S</span>
          </h1>

          {/* Subtitle */}
          <p className="font-lato text-[20px] sm:text-[28px] md:text-[32px] lg:text-[38px] font-normal text-black max-w-5xl mx-auto leading-tight text-left
          px-4 sm:px-0 ipadpro:px-4">
            {subtitle}
          </p>

        </div>

      </div>
    </section>
  );
}