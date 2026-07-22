"use client";

import { useMemo } from "react";
import Image from "next/image";

interface TeamMember {
  name: string;
  title: string;
  image: string;
  bio: string | string[];
}

interface TeamSectionProps {
  teamMembers: TeamMember[];
}

/* ─── Module-level helpers & constants ──────────────────────────────────── */

/**
 * Helper function to prevent orphan words
 * Replaces the last space in a string with a non-breaking space
 */
function preventOrphans(text: string): string {
  const lastSpaceIndex = text.lastIndexOf(" ");
  if (lastSpaceIndex === -1) return text;
  return (
    text.substring(0, lastSpaceIndex) +
    "\u00A0" +
    text.substring(lastSpaceIndex + 1)
  );
}

// Image configuration for each team member — static, extracted to module scope
const IMAGE_CONFIG = [
  {
    zoom: 1.3,
    position: "50% 3%",
  },
  {
    zoom: 1.7,
    position: "50% 5%",
  },
];

// Text configuration for each team member — static, extracted to module scope
const TEXT_CONFIG = [
  {
    fontSize: "25px",
    lineHeight: "1.3",
    letterSpacing: "0.02em",
    marginTop: "50px",
    marginBottom: "30px",
  },
  {
    fontSize: "25px",
    lineHeight: "1.3",
    letterSpacing: "0.02em",
    marginTop: "50px",
    marginBottom: "30px",
  },
];

// Static heading style (used by both member h3 elements)
const HEADING_STYLE: React.CSSProperties = { lineHeight: "1.0" };

// Static container div style for the bio text block
const BIO_CONTAINER_STYLE_BASE = {
  wordBreak: "normal" as const,
  overflowWrap: "break-word" as const,
};

/**
 * Team Section component
 * Displays two team member profiles in a two-column layout
 * Background: Light Gray (#EDEDED)
 */
export default function TeamSection({ teamMembers }: TeamSectionProps) {
  // Pre-compute all per-member derived data once per `teamMembers` change
  const processedMembers = useMemo(
    () =>
      teamMembers.map((member, index) => {
        const imageConfig = IMAGE_CONFIG[index];
        const textStyle = TEXT_CONFIG[index];

        // Pre-compute title split
        const titleParts = member.title.split(" ");
        const titleFirst = titleParts[0];
        const titleRest = titleParts.slice(1).join(" ");

        // Pre-compute image style
        const imageStyle: React.CSSProperties = {
          transform: `scale(${imageConfig.zoom})`,
          objectPosition: imageConfig.position,
        };

        // Pre-format bio paragraphs
        const bioIsArray = Array.isArray(member.bio);
        const bioParagraphs = bioIsArray
          ? (member.bio as string[]).map(preventOrphans)
          : [preventOrphans(member.bio as string)];

        // Pre-compute bio container margin
        const bioContainerStyle: React.CSSProperties = {
          marginTop: textStyle.marginTop,
        };

        return {
          member,
          index,
          imageStyle,
          bioContainerStyle,
          textStyle,
          bioParagraphs,
          bioIsArray,
          titleFirst,
          titleRest,
          wrapperClassName: `flex flex-col min-w-0 ${
            index === 1 ? "lg:-ml-[150px]" : ""
          } ${index === 0 ? "order-2 sm:order-1" : "order-1 sm:order-2"}`,
        };
      }),
    [teamMembers]
  );

  return (
    <section className="w-full bg-[#EDEDED] pt-0 pb-12 md:pb-16 lg:pb-24">
      <div className="w-full max-w-[1920px] mx-auto px-8 md:px-16 lg:px-24">
        {/* Activated 2 columns earlier (sm:grid-cols-2) and adjusted gap for iPads */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 sm:gap-8 lg:gap-0">
          {processedMembers.map((d) => {
            const {
              member,
              index,
              imageStyle,
              bioContainerStyle,
              textStyle,
              bioParagraphs,
              titleFirst,
              titleRest,
              wrapperClassName,
            } = d;

            return (
              <div
                key={index}
                // CHANGED: Added order logic here. 
                // Index 0 (Negar): order-2 on mobile, order-1 on sm+
                // Index 1 (Mir): order-1 on mobile, order-2 on sm+
                className={wrapperClassName}
              >
                {/* Team Member Image */}
                <div
                  className="relative mb-6 md:mb-4 overflow-hidden rounded-[30px] w-full sm:w-full lg:w-[500px] h-[420px] sm:h-[400px] md:h-[500px] lg:h-[600px]"
                >
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                    style={imageStyle}
                    sizes="500px"
                  />
                </div>

                {/* Team Member Info */}
                <div
                  className="w-full sm:w-full lg:w-[500px] min-w-0"
                  style={BIO_CONTAINER_STYLE_BASE}
                >
                  {index === 1 ? (
                    // Mir: Combined name and title in single h3 with title split across lines
                    <h3
                      className="font-lato font-extrabold text-black uppercase mb-4 md:mb-4 text-[50px] sm:text-[36px] md:text-[40px] lg:text-[50px]"
                      style={HEADING_STYLE}
                    >
                      {member.name}
                      <br />
                      {titleFirst} {/* CHIEF */}
                      <br />
                      {titleRest}{" "}
                      {/* EXECUTIVE OFFICER */}
                    </h3>
                  ) : (
                    // Negar: Combined name and title in single h3 with title split across lines
                    <h3
                      className="font-lato font-extrabold text-black uppercase mb-4 md:mb-4 text-[50px] sm:text-[36px] md:text-[40px] lg:text-[50px]"
                      style={HEADING_STYLE}
                    >
                      {member.name}
                      <br />
                      {titleFirst} {/* CHIEF */}
                      <br />
                      {titleRest}{" "}
                      {/* CREATIVE OFFICER */}
                    </h3>
                  )}
                  <div style={bioContainerStyle}>
                    {bioParagraphs.map((paragraph, pIndex) => (
                      <p
                        key={pIndex}
                        className="font-lato font-regular text-[#919191] text-left"
                        style={{
                          fontSize: textStyle.fontSize,
                          lineHeight: textStyle.lineHeight,
                          letterSpacing: textStyle.letterSpacing,
                          marginBottom:
                            pIndex < bioParagraphs.length - 1
                              ? textStyle.marginBottom
                              : "0",
                          wordBreak: "normal",
                          overflowWrap: "break-word",
                          textAlign: "left",
                        }}
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}