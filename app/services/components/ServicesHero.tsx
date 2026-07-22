"use client";

import Image from "next/image";

interface ServicesHeroProps {
  subtitle: string;
}

/* ─── Module-level constants ────────────────────────────────────────────── */

// Inline transform for the V letter (never recreated)
const V_LETTER_TRANSFORM_STYLE: React.CSSProperties = {
  transform: "translateY(0.04em)",
};

export default function ServicesHero({ subtitle }: ServicesHeroProps) {
  return (
    <section
      id="services-hero-section"
      className="
        relative w-full max-w-[1920px] mx-auto bg-[#EDEDED] flex items-center justify-center
        min-h-[915px]         /* mobile default */
        sm:min-h-[1180px]      /* small tablets */
        md:min-h-[1366px]      /* big tablets */
        lg:min-h-[680px]      /* laptops & desktops (your original) */
      "
    >
      <div className="w-full max-w-[1920px] mx-auto px-10 sm:px-10 md:px-16 lg:px-24 pb-0 md:pb-0">
        <div
          className="
            flex flex-col items-center text-center
            lg:translate-y-[20%]   /* only laptop, identical to your original */
          "
        >
          {/* Main "SERVICES" Title */}
          <h1
            className="
              font-lato font-bold text-black uppercase tracking-tight leading-none mb-6 md:mb-8
              text-[68px] sm:text-[140px] md:text-[200px] lg:text-[250px] xl:text-[300px]
              flex items-center
            "
          >
            SER
            <span
              className="inline-flex items-center ml-[-0.08em] mr-[0.03em]"
              style={V_LETTER_TRANSFORM_STYLE}
            >
              <Image
                src="/assets/Logo/V_Letter.svg"
                alt="V"
                width={120}
                height={300}
                className="h-[0.93em] w-auto object-contain
                translate-y-[-2px] sm:translate-y-0"
              />
            </span>
            <span className="ml-[-0.13em]">ICES</span>
          </h1>

          {/* Subtitle */}
          <p
            className="
              font-lato font-normal text-black leading-tight text-left max-w-5xl
              text-[20px] sm:text-[24px] md:text-[28px] lg:text-[32px] xl:text-[38px]
              px-4 sm:px-0
            "
          >
            {subtitle}
          </p>
        </div>
      </div>
    </section>
  );
}