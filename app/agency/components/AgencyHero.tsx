"use client";

import Link from "next/link";
import Image from "next/image";

interface AgencyHeroProps {
  headline: string;
  button: { label: string; href: string };
}

/* ─── Module-level constant ─────────────────────────────────────────────── */

const ARROW_PATH_D = "M5 12H19M19 12L12 5M19 12L12 19";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function AgencyHero({ headline: _headline, button }: AgencyHeroProps) {
  return (
    <section
      id="agency-hero-section"
      className="
    relative w-full max-w-[1920px] mx-auto bg-[#EDEDED]
    flex items-center justify-center
    
    min-h-[915px]          /* Mobile */
    sm:min-h-[1180px]       /* iPad Mini / Air */
    ipadpro:min-h-[1366px]  /* iPad Pro */
    lg:min-h-[680px]       /* Laptop & Desktop */
  "
    >
      <div className="w-full max-w-[1920px] mx-auto px-4 md:px-8 lg:px-16 pt-24 md:pt-32 lg:pt-30">
        <div className="flex flex-col items-center justify-center">

          {/* ===========================
              HEADLINE
          =========================== */}
          <h1
            className="font-lato font-black text-black uppercase text-center leading-none
              text-5xl sm:text-8xl  ipadpro:text-8xl md:text-6xl lg:text-9xl xl:text-9xl 2xl:text-[155px]
              mb-8 md:mb-12 lg:mb-4"
          >
            {/* LINE 1: THE + LOGO + OF */}
            <span
              className="
                flex items-center justify-center w-full
                /* Mobile/tablet reduced gap */
                gap-2 sm:gap-3 md:gap-4
                /* Laptop untouched */
                lg:gap-4 xl:gap-4 2xl:gap-4
              "
            >
              <span>THE</span>

              <Image
                src="/assets/Logo/Vorlyx_Noise.svg"
                alt="Vorlyx"
                width={300}
                height={88}
                className="
                  inline-block w-auto
                  /* ADDED VISUAL ALIGNMENT TWEAK FOR MOBILE HERE */
    translate-y-[-3px] sm:translate-y-0
                  
                  /* Mobile/tablet sizes */
                  h-[60px] sm:h-[100px] md:h-[75px] ipadpro:h-[120px]
                  
                  /* Laptop original values (unchanged) */
                  lg:h-[150px] xl:h-[150px] 2xl:h-[210px]

                  /* Original negative margins preserved on laptop */
                  -mx-2 sm:-mx-3 md:-mx-4
                  lg:-mx-4 xl:-mx-5 2xl:-mx-8

                  -mt-1 sm:-mt-1 md:-mt-2
                  lg:-mt-3 xl:-mt-4 2xl:-mt-6
                "
                priority
              />

              <span>OF</span>
            </span>

            {/* LINE 2: CREATIVE (vertical spacing reduced on mobile/tablet) */}
            <span
              className="
                block
                mt-1 sm:mt-1 md:mt-2   /* tighter mobile/tablet */
                lg:-mt-2 xl:-mt-3 2xl:-mt-4  /* original laptop */
              "
            >
              CREATIVE
            </span>

            {/* LINE 3: STRATEGISTS. */}
            <span
              className="
                block
                mt-0 sm:mt-0 md:-mt-1    /* tighter mobile/tablet */
                lg:-mt-3 xl:-mt-4 2xl:-mt-4  /* original laptop */
              "
            >
              STRATEGISTS.
            </span>
          </h1>

          {/* ===========================
              CTA BUTTON
          =========================== */}
          <Link
            href={button.href}
            className="
              group bg-white rounded-full flex items-center w-fit
              
              /* Laptop original (unchanged) */
              lg:pl-12 lg:pr-[40px] lg:py-4 lg:gap-10

              /* Mobile & tablet adjustments */
              pl-6 pr-6 py-3 gap-5
              sm:pl-8 sm:pr-8 sm:py-4 sm:gap-7
              md:pl-10 md:pr-[36px] md:py-4 md:gap-8

              hover:bg-vorlyx-black transition-colors
            "
          >
            <span
              className="
                font-lato font-light text-black group-hover:text-white transition-colors

                /* Mobile/tablet text */
                text-[32px] sm:text-[40px] md:text-[60px]

                /* Laptop original text size preserved */
                lg:text-[50px] xl:text-[55px]
              "
            >
              {button.label}
            </span>

            <div
              className="
                rounded-full flex items-center justify-center
                bg-vorlyx-black group-hover:bg-white transition-colors
                
                /* Mobile/tablet icon container */
                w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11

                /* Laptop original */
                lg:w-12 lg:h-12
              "
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="
                  text-white group-hover:text-vorlyx-black transition-colors

                  /* Mobile/tablet icon */
                  w-5 h-5 sm:w-6 sm:h-6 md:w-[26px] md:h-[26px]

                  /* Laptop original */
                  lg:w-[30px] lg:h-[30px]
                "
              >
                <path
                  d={ARROW_PATH_D}
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}