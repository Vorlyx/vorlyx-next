"use client";

import { useMemo } from "react";
import Link from "next/link";

interface CapabilitiesSectionProps {
  title: string;
  body: string;
  button: { label: string; href: string };

  topSpacing?: string;
  leftWidth?: string;
  bodyWidth?: string;
  titleBottom?: string;
  columnGap?: string;
}

/* ─── Module-level constants (never recreated) ──────────────────────────── */

// Arrow SVG path — shared between desktop and mobile buttons
const ARROW_PATH_D = "M5 12H19M19 12L12 5M19 12L12 19";

// Pre-computed JSX for the special "DISCIPLINES WE OWN" title layout
const DISCIPLINES_TITLE = (
  <>
    DISCIPLINES <br />
    WE OWN
  </>
);

export default function CapabilitiesSection({
  title,
  body,
  button,
  topSpacing = "pt-[clamp(40px,6vw,80px)]",
  leftWidth = "max-w-[600px]",
  bodyWidth = "max-w-[1080px]",
  titleBottom = "mb-[40px] sm:mb-[80px] md:mb-[120px] ipad:mb-[100px] ipadpro:mb-[120px]",
  columnGap = "gap-10 md:gap-12 ipad:gap-12 ipadpro:gap-12",
}: CapabilitiesSectionProps) {
  // Only recompute title JSX when `title` prop changes
  const titleContent = useMemo(() => {
    if (title.toUpperCase().includes("DISCIPLINES WE OWN")) {
      return DISCIPLINES_TITLE;
    }
    return title;
  }, [title]);

  return (
    <section
      className="
        relative z-20
        w-full
        bg-vorlyx-light-gray
        pb-8 md:pb-16 lg:pb-24
        mt-0
      "
    >
      <div
        className={`w-full max-w-[1920px] mx-auto px-6 sm:px-8 md:px-16 lg:px-24 ${topSpacing}`}
      >
        <div
          className={`flex flex-col md:flex-row ipad:flex-row ipadpro:flex-row items-start ${columnGap}`}
        >
          {/* LEFT COLUMN: Title + Desktop/iPad Button */}
          <div
            className={`
              flex flex-col
              ${leftWidth}
              md:w-[40%] md:max-w-none md:flex-shrink-0
              ipad:w-[40%] ipad:max-w-none ipad:flex-shrink-0
              ipadpro:w-[40%] ipadpro:max-w-none ipadpro:flex-shrink-0
            `}
          >
            <h2
              className={`
                font-lato
                font-bold
                text-vorlyx-black
                uppercase
                whitespace-nowrap md:whitespace-normal ipad:whitespace-normal ipadpro:whitespace-normal
                text-[28px]
                sm:text-[36px]
                md:text-[45px]
                ipad:text-[40px]
                ipadpro:text-[45px]
                lg:text-section4-title
                leading-[1.2]
                ${titleBottom}
              `}
            >
              {titleContent}
            </h2>

            {/* BUTTON: Visible on iPad (Air/Mini/Pro), Laptop, Desktop — Hidden on Mobile */}
            <Link
              href={button.href}
              className="
                hidden md:flex ipad:flex ipadpro:flex
                group bg-white rounded-full
                pl-6 pr-6 sm:pl-8 sm:pr-8 md:pl-12 md:pr-[40px]
                py-3 sm:py-3 md:py-4
                items-center gap-4 sm:gap-6 md:gap-8
                w-fit hover:bg-vorlyx-black
                transition-colors relative z-10
              "
            >
              <span
                className="
                  font-lato
                  font-light
                  text-black
                  group-hover:text-white
                  transition-colors
                  text-[32px] sm:text-[40px] md:text-[50px] ipad:text-[35px] ipadpro:text-[35px]
                "
              >
                {button.label}
              </span>

              <div
                className="
                  flex items-center justify-center ml-auto mr-[5px]
                  rounded-full
                  bg-vorlyx-black
                  group-hover:bg-white
                  transition-colors
                  w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12
                "
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="
                    text-white
                    group-hover:text-vorlyx-black
                    transition-colors
                    w-5 h-5 sm:w-6 sm:h-6 md:w-[30px] md:h-[30px]
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

          {/* RIGHT COLUMN: Body + Mobile Button */}
          <div
            className={`
              flex flex-col
              ${bodyWidth}
              md:flex-1 md:max-w-none
              ipad:flex-1 ipad:max-w-none
              ipadpro:flex-1 ipadpro:max-w-none
            `}
          >
            <p
              className="
                font-lato
                font-regular
                text-vorlyx-black
                text-[22px]
                sm:text-[28px]
                md:text-[34px]
                ipad:text-[30px]
                ipadpro:text-[34px]
                lg:text-[45px]
                leading-[1.3]
                md:leading-[1.4]
                ipad:leading-[1.4]
                ipadpro:leading-[1.4]
                lg:[text-wrap:pretty]
              "
            >
              {body}
            </p>

            {/* BUTTON: Visible ONLY on Mobile — Hidden on iPad/Laptop/Desktop */}
            <Link
              href={button.href}
              className="
                flex md:hidden ipad:hidden ipadpro:hidden
                mt-24 sm:mt-12
                group bg-white rounded-full
                pl-6 pr-6 sm:pl-8 sm:pr-8
                py-3 sm:py-3
                items-center gap-4 sm:gap-6
                w-fit hover:bg-vorlyx-black
                transition-colors relative z-10
              "
            >
              <span
                className="
                  font-lato
                  font-light
                  text-black
                  group-hover:text-white
                  transition-colors
                  text-[32px] sm:text-[40px]
                "
              >
                {button.label}
              </span>

              <div
                className="
                  flex items-center justify-center ml-auto mr-[5px]
                  rounded-full
                  bg-vorlyx-black
                  group-hover:bg-white
                  transition-colors
                  w-8 h-8 sm:w-10 sm:h-10
                "
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="
                    text-white
                    group-hover:text-vorlyx-black
                    transition-colors
                    w-5 h-5 sm:w-6 sm:h-6
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
      </div>
    </section>
  );
}