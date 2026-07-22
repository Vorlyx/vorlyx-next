"use client";

import { useMemo } from "react";

interface ProjectInfoProps {
  about: string;
  whatWeDid: string[];
  technology: string[];
}

/* ─── Module-level helpers & constants ──────────────────────────────────── */

/**
 * Helper function to prevent orphan words.
 * Replaces the last space in a string with a non-breaking space,
 * forcing the last two words to wrap together.
 */
const preventOrphans = (text: string) => {
  if (!text) return text;
  const trimmed = text.trim();
  const lastSpaceIndex = trimmed.lastIndexOf(" ");

  if (lastSpaceIndex === -1) return trimmed;

  return (
    trimmed.substring(0, lastSpaceIndex) +
    "\u00A0" +
    trimmed.substring(lastSpaceIndex + 1)
  );
};

// Pure formatter that determines bullet + content once per string
const formatListItem = (item: string) => {
  const isBulleted = item.startsWith("· ");
  const content = isBulleted ? item.slice(2) : item;
  return { isBulleted, content: preventOrphans(content) };
};

// Static inline style objects (never recreated)
const TEXT_WRAP_PRETTY: React.CSSProperties = { textWrap: "pretty" };

// Inline CSS block (module-level string — parsed once)
const RESPONSIVE_GRID_CSS = `
  /* Default tablet+ layout */
  @media (min-width: 768px) {
    #project-info-grid {
      grid-template-columns: 350px 400px;
    }
  }

  /* ----------------------------------------- */
  /* ✅ iPad mini overflow fix (ONLY 768–1023px) */
  /* This prevents text from spilling outside.  */
  /* ----------------------------------------- */
  @media (min-width: 768px) and (max-width: 1023px) {
    #project-info-grid {
      grid-template-columns: 330px 360px; /* narrower + balanced */
    }

    /* Optional but safe: ensure long words wrap cleanly */
    #project-info-grid li span,
    #project-info-grid p,
    #project-info-grid h2 {
      overflow-wrap: anywhere;
      word-break: normal;
    }
  }

  /* iPad Pro / small laptop */
  @media (min-width: 1024px) {
    #project-info-grid {
      grid-template-columns: 400px 460px;
    }
  }

  /* Large desktop */
  @media (min-width: 1280px) {
    #project-info-grid {
      grid-template-columns: 700px 600px;
    }
  }
`;

/**
 * Project Info Section
 * ABOUT (Left)
 * WHAT WE DID + TECHNOLOGY (Right stacked)
 * Full support for iPad mini overflow correction with **no impact** on mobile, iPad Pro, desktop, laptop.
 */
export default function ProjectInfo({
  about,
  whatWeDid,
  technology,
}: ProjectInfoProps) {
  // Pre-format about text — only recomputes when prop changes
  const formattedAbout = useMemo(() => preventOrphans(about), [about]);

  // Pre-format each list — only recomputes when props change
  const formattedWhatWeDid = useMemo(
    () => whatWeDid.map(formatListItem),
    [whatWeDid]
  );

  const formattedTechnology = useMemo(
    () => technology.map(formatListItem),
    [technology]
  );

  return (
    <section
      id="project-info-section"
      className="w-full bg-[#EDEDED] py-12 md:py-16 lg:py-20"
    >
      <style>{RESPONSIVE_GRID_CSS}</style>

      <div className="w-full max-w-[1920px] mx-auto px-8 md:px-16 lg:px-24">
        <div
          id="project-info-grid"
          className="grid grid-cols-1 gap-8 md:gap-16 lg:gap-28"
        >
          {/* Left Column: ABOUT */}
          <div className="flex flex-col">
            <h2 className="font-lato text-[24px] md:text-[28px] lg:text-[32px] font-bold text-black uppercase mb-4 md:mb-6">
              ABOUT
            </h2>
            <p
              className="font-lato text-[16px] md:text-[18px] lg:text-[20px] font-regular text-black/80 leading-relaxed"
              style={TEXT_WRAP_PRETTY}
            >
              {formattedAbout}
            </p>
          </div>

          {/* Right Column: WHAT WE DID + TECHNOLOGY */}
          <div className="flex flex-col gap-8 md:gap-12 lg:gap-16">
            {/* WHAT WE DID */}
            <div className="flex flex-col">
              <h2 className="font-lato text-[24px] md:text-[28px] lg:text-[32px] font-bold text-black uppercase mb-4 md:mb-6">
                WHAT WE DID
              </h2>
              <ul className="flex flex-col gap-0">
                {formattedWhatWeDid.map(({ isBulleted, content }, index) => (
                  <li
                    key={index}
                    className="font-lato text-[16px] md:text-[18px] lg:text-[20px] font-regular text-black/80 leading-relaxed flex items-start"
                  >
                    {isBulleted && <span className="mr-1.5 shrink-0">·</span>}
                    <span style={TEXT_WRAP_PRETTY}>{content}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* TECHNOLOGY */}
            <div className="flex flex-col">
              <h2 className="font-lato text-[24px] md:text-[28px] lg:text-[32px] font-bold text-black uppercase mb-4 md:mb-6">
                TECHNOLOGY
              </h2>
              <ul className="flex flex-col gap-0">
                {formattedTechnology.map(({ isBulleted, content }, index) => (
                  <li
                    key={index}
                    className="font-lato text-[16px] md:text-[18px] lg:text-[20px] font-regular text-black/80 leading-relaxed flex items-start"
                  >
                    {isBulleted && <span className="mr-1.5 shrink-0">·</span>}
                    <span style={TEXT_WRAP_PRETTY}>{content}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}