"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";

interface CreativeStrategistsProps {
  title: string;
  body: string;
}

/* ─── Module-level constants (never recreated) ──────────────────────────── */

const TRIGGER_START = 0.85;
const TRIGGER_END = 0.15;

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
};

// Pre-compute RGB values once at module load
const INITIAL_RGB = hexToRgb("#999999");
const FINAL_RGB = hexToRgb("#000000");

const CONFIG = {
  initialBlur: 8,
  finalBlur: 0,
  initialOpacity: 0.2,
  finalOpacity: 1,
  letterStaggerDelay: 0.015,
  transitionDuration: 0.4,
  easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
};

// Lines that make up the animated body text
const LINES = [
  "WE FORGE UNBREAKABLE BRANDS",
  "THAT DOMINATE MARKETS AND",
  "REDEFINE INDUSTRIES THROUGH",
  "RUTHLESS STRATEGY AND",
  "FEARLESS DESIGN.",
];

// Prevent Orphan: Replace last space with non-breaking space
const preventOrphan = (text: string) => {
  const lastSpaceIndex = text.lastIndexOf(" ");
  if (lastSpaceIndex !== -1) {
    return (
      text.substring(0, lastSpaceIndex) +
      "\u00A0" +
      text.substring(lastSpaceIndex + 1)
    );
  }
  return text;
};

// Pre-compute the processed text and words array once at module load
// (LINES is a static constant, not a prop, so this only runs once ever)
const PROCESSED_TEXT = preventOrphan(LINES.join(" "));
const WORDS_ARRAY = PROCESSED_TEXT.split(" ");
const TOTAL_LETTERS = PROCESSED_TEXT.length;

// Pre-compute the starting global index for each word (avoids reducing on every render)
const WORD_START_INDICES: number[] = (() => {
  const indices: number[] = [];
  let sum = 0;
  for (let i = 0; i < WORDS_ARRAY.length; i++) {
    indices.push(sum);
    sum += WORDS_ARRAY[i].length + 1; // +1 for the space
  }
  return indices;
})();

export default function CreativeStrategists({
  title,
  body,
}: CreativeStrategistsProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!textRef.current) return;

      const windowHeight = window.innerHeight;
      const elementTop = textRef.current.getBoundingClientRect().top;

      const triggerStartY = windowHeight * TRIGGER_START;
      const triggerEndY = windowHeight * TRIGGER_END;
      const totalDistance = triggerStartY - triggerEndY;

      let progress = 0;

      if (elementTop < triggerStartY) {
        const distance = triggerStartY - elementTop;
        progress = Math.min(1, Math.max(0, distance / totalDistance));
      }

      setScrollProgress(progress);
    };

    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Helper to calculate animation styles — memoized against scrollProgress
  const getLetterStyle = useCallback(
    (globalIndex: number): React.CSSProperties => {
      const animationRange = 0.7;
      const letterStartProgress = (globalIndex / TOTAL_LETTERS) * animationRange;
      let letterProgress = 0;

      if (scrollProgress > letterStartProgress) {
        const letterAnimationRange = animationRange / TOTAL_LETTERS;
        const relativeProgress =
          (scrollProgress - letterStartProgress) / letterAnimationRange;
        letterProgress = Math.min(1, Math.max(0, relativeProgress));
      }

      const blur =
        CONFIG.initialBlur +
        (CONFIG.finalBlur - CONFIG.initialBlur) * letterProgress;

      const opacity =
        CONFIG.initialOpacity +
        (CONFIG.finalOpacity - CONFIG.initialOpacity) * letterProgress;

      // Use pre-computed RGB constants (no hex parsing per letter)
      const r = Math.round(
        INITIAL_RGB.r + (FINAL_RGB.r - INITIAL_RGB.r) * letterProgress
      );
      const g = Math.round(
        INITIAL_RGB.g + (FINAL_RGB.g - INITIAL_RGB.g) * letterProgress
      );
      const b = Math.round(
        INITIAL_RGB.b + (FINAL_RGB.b - INITIAL_RGB.b) * letterProgress
      );

      const color = `rgb(${r}, ${g}, ${b})`;

      return {
        position: "relative",
        display: "inline-block",
        filter: `blur(${blur}px)`,
        opacity: opacity,
        color: color,
        transition: `filter ${CONFIG.transitionDuration}s ${CONFIG.easing}, opacity ${CONFIG.transitionDuration}s ${CONFIG.easing}, color ${CONFIG.transitionDuration}s ${CONFIG.easing}`,
      };
    },
    [scrollProgress]
  );

  // Memoized rendered word map — only rebuilds when scrollProgress changes
  const renderedWords = useMemo(
    () =>
      WORDS_ARRAY.map((word, wordIndex) => {
        const startIdx = WORD_START_INDICES[wordIndex];

        return (
          <span key={wordIndex}>
            {/* Word characters (kept together) */}
            <span className="inline-block whitespace-nowrap">
              {word.split("").map((letter, letterIndex) => {
                const globalIndex = startIdx + letterIndex;
                return (
                  <span
                    key={letterIndex}
                    style={getLetterStyle(globalIndex)}
                  >
                    {letter}
                  </span>
                );
              })}
            </span>

            {/* Real space for natural wrapping (except after the very last word) */}
            {wordIndex < WORDS_ARRAY.length - 1 && (
              <span className="whitespace-pre-wrap">
                <span style={getLetterStyle(startIdx + word.length)}>
                  {" "}
                </span>
              </span>
            )}
          </span>
        );
      }),
    [getLetterStyle]
  );

  return (
    <section
      className="relative w-full max-w-[1920px] mx-auto bg-vorlyx-light-gray
      h-auto md:h-auto lg:h-[580px]"
    >
      <div
        className="
        w-full h-full max-w-[1920px] mx-auto
        
        /* mobile */
        px-7 pt-15 pb-16 ipadpro:pb-16
        
        /* tablet */
        sm:px-8 sm:pt-24
        
        /* laptop (unchanged) */
        md:px-16 md:pt-32 lg:px-24 lg:pt-32 lg:pb-16
      "
      >
        <div
          className="
          grid grid-cols-1
          
          /* FIXED: Changed from md: to sm: so iPad Mini/Air catch the 2-column layout */
          sm:grid-cols-[0.8fr,1.1fr]
          
          /* FIXED typo: ipadpro:gap-8 */
          gap-10 sm:gap-12 md:gap-16 ipadpro:gap-8
          h-full items-start
        "
        >
          {/* Left Title */}
          <div className="flex flex-col justify-start">
            <h2
              className="
              font-lato font-extrabold text-vorlyx-black uppercase
              
              /* mobile */
              text-[40px] leading-[36px]
              
              /* tablet */
              sm:text-[48px] sm:leading-[42px]
              
              /* laptop unchanged */
              md:text-[64px] md:leading-[55px]
            "
            >
              {title}
            </h2>
          </div>

          {/* Right Body Text */}
          {/* Added min-w-0 to prevent flex/grid from overflowing the text bounds */}
          <div className="flex items-start min-w-0">
            {/* Mobile version (no animation, left aligned) */}
            <p
              className="
              sm:hidden
              font-lato font-semibold text-vorlyx-black
              text-[24px] leading-[28px]
              text-left
              max-w-[600px]
              "
            >
              {body}
            </p>

            {/* Tablet + Laptop animated version */}
            <p
              ref={textRef}
              className="
              hidden sm:block
              font-lato font-semibold text-vorlyx-black
              /* Added specific sm: sizes for the iPad Mini/Air so it fits perfectly */
              sm:text-[32px] sm:leading-[38px] md:text-[45px] md:leading-[50px] ipadpro:text-[35px]
              text-left
              max-w-[1000px]
              "
            >
              {renderedWords}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}