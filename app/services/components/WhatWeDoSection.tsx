"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";

interface WhatWeDoSectionProps {
  title: string;
  description: string;
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

// Fallback text if no description is provided
const FALLBACK_TEXT =
  "WE CRAFT INTUITIVE EXPERIENCES THAT FEEL EFFORTLESS AND ENGINEER FLAWLESS SYSTEMS THAT PERFORM RELENTLESSLY.";

// Static inline style for the paragraph
const PARAGRAPH_STYLE: React.CSSProperties = { textWrap: "pretty" };

// Pure helper: process text into words with orphan prevention + letter indexing
const processText = (text: string) => {
  const rawWords = text.trim().split(/\s+/);

  // Prevent orphans: join the last two words with a non-breaking space
  if (rawWords.length > 1) {
    const lastWord = rawWords.pop();
    const prevWord = rawWords.pop();
    rawWords.push(`${prevWord}\u00A0${lastWord}`);
  }

  // Pre-calculate global letter indices for smooth cascade animation
  let currentGlobalIndex = 0;
  const processedWords = rawWords.map((word) =>
    word.split("").map((char) => ({
      char,
      index: currentGlobalIndex++,
    }))
  );

  return {
    processedWords,
    totalLetters: currentGlobalIndex,
  };
};

export default function WhatWeDoSection({
  title,
  description,
}: WhatWeDoSectionProps) {
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

  // Process text — only recompute when `description` changes
  const { processedWords, totalLetters } = useMemo(
    () => processText(description || FALLBACK_TEXT),
    [description]
  );

  // Style calculator — memoized against scrollProgress and totalLetters
  const getLetterStyle = useCallback(
    (index: number): React.CSSProperties => {
      const animationRange = 0.7;
      const letterStartProgress = (index / totalLetters) * animationRange;

      let letterProgress = 0;
      if (scrollProgress > letterStartProgress) {
        const letterAnimRange = animationRange / totalLetters;
        const relativeProgress =
          (scrollProgress - letterStartProgress) / letterAnimRange;
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

      return {
        display: "inline-block",
        filter: `blur(${blur}px)`,
        opacity,
        color: `rgb(${r}, ${g}, ${b})`,
        transition: `filter ${CONFIG.transitionDuration}s ${CONFIG.easing}, opacity ${CONFIG.transitionDuration}s ${CONFIG.easing}, color ${CONFIG.transitionDuration}s ${CONFIG.easing}`,
      };
    },
    [scrollProgress, totalLetters]
  );

  // Rendered word content — memoized against processedWords and scrollProgress
  const renderedWords = useMemo(
    () =>
      processedWords.map((wordData, wordIndex) => (
        <span key={`word-wrapper-${wordIndex}`}>
          {/* Keep the word bound together so it doesn't get cut in half */}
          <span className="inline-block whitespace-nowrap">
            {wordData.map((item) => (
              <span
                key={`letter-${item.index}`}
                style={getLetterStyle(item.index)}
              >
                {item.char === "\u00A0" ? "\u00A0" : item.char}
              </span>
            ))}
          </span>
          {/* Insert a normal, wrapping space between words (but not after the very last word) */}
          {wordIndex < processedWords.length - 1 && " "}
        </span>
      )),
    [processedWords, getLetterStyle]
  );

  return (
    <section
      id="what-we-do-section"
      className="relative w-full max-w-[1920px] mx-auto bg-vorlyx-light-gray"
      // Changed to minHeight so it can expand if text wraps to many lines on mobile
      style={{ minHeight: "580px" }}
    >
      <div className="w-full h-full max-w-[1920px] mx-auto px-8 md:px-16 lg:px-24 pt-20 md:pt-32 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-[0.8fr,1.1fr] gap-y-2 md:gap-16 h-full items-start">
          {/* Left Title */}
          <div className="flex flex-col justify-start">
            <h2
              className="
                font-lato font-extrabold text-vorlyx-black uppercase
                text-[40px] leading-[20px] mb-0
                sm:text-[48px] sm:leading-[42px] sm:mb-2
                ipadpro:text-[52px]
                md:text-[64px] md:leading-[55px] md:mb-0
              "
            >
              {title}
            </h2>
          </div>

          {/* Right Animated Paragraph */}
          <div className="flex items-start">
            <p
              ref={textRef}
              className="
                font-lato font-semibold text-vorlyx-black
                text-left w-full max-w-[1200px]

                text-[20px] leading-[28px] mt-[80px]
                sm:text-[32px] sm:leading-[45px] sm:mt-[80px]
                ipadpro:text-[36px] ipadpro:mt-[-5px]
                md:text-[45px] md:leading-[50px] md:mt-0
              "
              // Optional: Tells modern browsers to balance text nicely
              style={PARAGRAPH_STYLE}
            >
              {renderedWords}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}