"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";

interface ContactIntroProps {
  title: string;
  text: string;
}

/* ─── Module-level constants (never recreated) ──────────────────────────── */

const TRIGGER_START = 0.85;
const TRIGGER_END = 0.15;

// Extracted color helper for better performance
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
  transitionDuration: 0.4,
  easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
};

// Static inline max-width for the paragraph (matches the 917px bounding box)
const PARAGRAPH_STYLE: React.CSSProperties = { maxWidth: "917px" };

/* ─── Pure helpers ──────────────────────────────────────────────────────── */

/**
 * Given a text string, return normalized text, word array, per-word start indices,
 * and total letter count — all pre-computed for animation.
 */
const processText = (text: string) => {
  const normalized = text.replace(/\s+/g, " ").trim();
  const words = normalized.split(" ");

  // Pre-compute the global letter start index for each word
  const wordStartIndices: number[] = [];
  let count = 0;
  for (let i = 0; i < words.length; i++) {
    wordStartIndices.push(count);
    count += words[i].length;
  }

  return {
    words,
    wordStartIndices,
    totalLetters: count,
  };
};

/**
 * Contact Intro Section component
 * Displays title on left and body text on right with scroll-based blur reveal animation
 */
export default function ContactIntro({
  title,
  text,
}: ContactIntroProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const textRef = useRef<HTMLParagraphElement>(null);

  /* ── Scroll-based reveal ─────────────────────────────────────────────── */
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

  /* ── Pre-process text — only recompute when `text` prop changes ──────── */
  const { words, wordStartIndices, totalLetters } = useMemo(
    () => processText(text),
    [text]
  );

  /* ── Pre-split title on newlines — only recompute when `title` changes ─ */
  const titleLines = useMemo(() => title.split("\n"), [title]);

  /* ── Style calculator — memoized against scrollProgress + totalLetters ── */
  const getLetterStyle = useCallback(
    (globalIndex: number): React.CSSProperties => {
      const animationRange = 0.7;
      const letterStartProgress = (globalIndex / totalLetters) * animationRange;

      let letterProgress = 0;
      if (scrollProgress > letterStartProgress) {
        const letterAnimationRange = animationRange / totalLetters;
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

      return {
        position: "relative",
        display: "inline-block",
        filter: `blur(${blur}px)`,
        opacity: opacity,
        color: `rgb(${r}, ${g}, ${b})`,
        transition: `filter ${CONFIG.transitionDuration}s ${CONFIG.easing}, opacity ${CONFIG.transitionDuration}s ${CONFIG.easing}, color ${CONFIG.transitionDuration}s ${CONFIG.easing}`,
      };
    },
    [scrollProgress, totalLetters]
  );

  /* ── Rendered words — memoized against words + getLetterStyle ────────── */
  const renderedWords = useMemo(
    () =>
      words.map((word, wordIndex) => {
        const wordStartIndex = wordStartIndices[wordIndex];
        const isLastWord = wordIndex === words.length - 1;
        const isSecondToLastWord = wordIndex === words.length - 2;

        return (
          <React.Fragment key={wordIndex}>
            {/* Wrap each word in an inline-block to guarantee the word is NEVER cut or split */}
            <span className="inline-block">
              {word.split("").map((letter, letterIndex) => {
                const globalIndex = wordStartIndex + letterIndex;
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
            {/* Standard space between words, non-breaking space on the last gap to prevent orphans */}
            {!isLastWord && (isSecondToLastWord ? "\u00A0" : " ")}
          </React.Fragment>
        );
      }),
    [words, wordStartIndices, getLetterStyle]
  );

  /* ── Rendered title lines — memoized against titleLines ──────────────── */
  const renderedTitleLines = useMemo(
    () =>
      titleLines.map((line, index) => (
        <span key={index} className="block">
          {line}
        </span>
      )),
    [titleLines]
  );

  return (
    <section
      className="relative w-full max-w-[1920px] mx-auto bg-vorlyx-light-gray"
      style={{ minHeight: "580px" }}
    >
      <div className="w-full h-full max-w-[1920px] mx-auto px-8 md:px-16 lg:px-24 pt-44 md:pt-32 pb-40">
        {/* FIX: Changed trigger from md:grid-cols to sm:grid-cols so iPads (Air/Mini) become side-by-side */}
        <div className="grid grid-cols-1 sm:grid-cols-[1fr,1.1fr] gap-8 sm:gap-12 md:gap-16 h-full items-start">

          {/* Left Title */}
          {/* FIX: Changed md:mt-0 to sm:mt-0 to remove the 80px gap when side-by-side on iPads */}
          <div className="flex flex-col justify-start mt-20 sm:mt-0">
            <h2 className="font-lato text-[40px] font-extrabold text-vorlyx-black uppercase leading-[40px]
                            sm:text-[48px] sm:leading-[50px] sm:mb-2
                md:text-[64px] md:leading-[55px] md:mb-0">
              {renderedTitleLines}
            </h2>
          </div>

          {/* Right Body Text - with scroll-based blur reveal animation */}
          <div className="flex items-start ipadpro:ml-25 lg:ml-48 xl:ml-10">
            <p
              ref={textRef}
              className="font-lato text-[20px] leading-[30px] sm:text-[30px] sm:leading-[36px] md:text-[38px] md:leading-[44px] lg:text-[45px] lg:leading-[50px] font-semibold text-vorlyx-black uppercase"
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