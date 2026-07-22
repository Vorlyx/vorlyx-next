"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Link from "next/link";

interface Section3Props {
  headline: string;
  button: { label: string; href: string };
}

// ─── Module-level constants (never recreated) ────────────────────────────────
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
const FINAL_RGB = hexToRgb("#E1E1E1");

const CONFIG = {
  initialBlur: 8,
  finalBlur: 0,
  initialOpacity: 0.2,
  finalOpacity: 1,
  transitionDuration: 0.4,
  easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
};

/**
 * Section 3 - Design Philosophy Section
 * Contains headline and button, without sticky cards
 * Sticky cards are now in a separate StickyCardsSection component
 */
export default function Section3({ headline, button }: Section3Props) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const textRef = useRef<HTMLHeadingElement>(null);

  // Handle scroll-based blur reveal with bidirectional support
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

  // Split headline text — only recompute when `headline` changes
  const { firstPart, firstWord, middlePart, afterVorlyx, totalLetters } =
    useMemo(() => {
      const parts = headline.split("VORLYX");
      const beforeVorlyx = parts[0] || "";
      const after = parts[1] || "";
      const fp = beforeVorlyx.split("FIRST")[0];
      const fw = "FIRST";
      const mp = beforeVorlyx.split("FIRST")[1] || "";
      const fullText = fp + fw + mp + "VORLYX" + after;
      return {
        firstPart: fp,
        firstWord: fw,
        middlePart: mp,
        afterVorlyx: after,
        totalLetters: fullText.length,
      };
    }, [headline]);

  const renderRevealText = useCallback(
    (text: string, startLetterIndex: number, className: string = "") => {
      const cleanText = text.replace(/\n/g, "");
      const chunks = cleanText.match(/\S+|\s+/g) || [];
      let currentIndex = startLetterIndex;

      return (
        <span className={className}>
          {chunks.map((chunk, chunkIndex) => {
            const isSpace = /^\s+$/.test(chunk);

            if (isSpace) {
              const spaceSpan = (
                <span key={`space-${chunkIndex}`} className="whitespace-pre-wrap">
                  {chunk}
                </span>
              );
              currentIndex += chunk.length;
              return spaceSpan;
            }

            const wordSpan = (
              <span key={`word-${chunkIndex}`} className="inline-block whitespace-nowrap">
                {chunk.split("").map((letter, letterIndex) => {
                  const letterGlobalIndex = currentIndex + letterIndex;

                  const animationRange = 0.7;
                  const letterStartProgress =
                    (letterGlobalIndex / totalLetters) * animationRange;

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
                  const color = `rgb(${r}, ${g}, ${b})`;

                  return (
                    <span
                      key={letterIndex}
                      style={{
                        position: "relative",
                        display: "inline-block",
                        filter: `blur(${blur}px)`,
                        opacity: opacity,
                        color: color,
                        transition: `filter ${CONFIG.transitionDuration}s ${CONFIG.easing}, opacity ${CONFIG.transitionDuration}s ${CONFIG.easing}, color ${CONFIG.transitionDuration}s ${CONFIG.easing}`,
                      }}
                    >
                      {letter}
                    </span>
                  );
                })}
              </span>
            );

            currentIndex += chunk.length;
            return wordSpan;
          })}
        </span>
      );
    },
    [scrollProgress, totalLetters]
  );

  return (
    <section id="section-3" className="relative bg-[#171717] w-full ipadpro:h-[720px]">
      {/* Top Overlay Text + Button */}
      <div className="relative z-50 w-full max-w-[1920px] mx-auto px-8 md:px-16 lg:px-24 pt-8 md:pt-16 pb-16 md:pb-24 lg:pb-32 ipadpro:pt-32 pb-16">
        
        <div className="grid grid-cols-1 sm:grid-cols-[2fr,1fr] gap-4 sm:gap-8 ipadpro:gap-10 items-start">
          
          {/* Left Column - Headline */}
          <div className="w-full max-w-none min-w-0
                          pt-10 mb-[35px] px-0 sm:px-2"
          >
            <h2
              ref={textRef}
              className="font-lato text-[26px] sm:text-[26px] md:text-[48px] ipadpro:text-[40px] font-bold text-[#E1E1E1] uppercase leading-[1.2] md:leading-[60px] max-sm:[text-wrap:balance] lg:[text-wrap:balance]">
              {/* FIX: Added lg:[text-wrap:balance] to auto-balance lines on laptop/desktop and prevent "LATER." orphan, leaving iPad unaffected */}
              {renderRevealText(firstPart, 0)}
              
              <br className="hidden sm:block lg:hidden ipadpro:hidden" />
              
              {renderRevealText(firstWord, firstPart.length)}
              {renderRevealText(
                middlePart,
                firstPart.length + firstWord.length
              )}
              <br />
              <span className="font-lato text-[22px] sm:text-[26px] md:text-[45px] ipadpro:text-[35px] font-normal">
                {renderRevealText(
                  "VORLYX",
                  firstPart.length + firstWord.length + middlePart.length
                )}
                {renderRevealText(
                  afterVorlyx,
                  firstPart.length +
                    firstWord.length +
                    middlePart.length +
                    "VORLYX".length
                )}
              </span>
            </h2>
          </div>

          {/* Right Column - Button */}
          <div className="flex justify-start sm:justify-end lg:mt-8 xl:mt-8">
            <Link
              href={button.href}
              className="group bg-[#4A4A4A] rounded-full pl-6 pr-6 sm:pl-8 sm:pr-8 md:pl-12 md:pr-[40px] py-3 sm:py-3 md:py-4 flex items-center gap-4 sm:gap-6 md:gap-10 w-fit hover:bg-[#E1E1E1] transition-colors"
            >
              <span className="font-lato text-[32px] sm:text-[40px] md:text-[50px] font-light text-white group-hover:text-vorlyx-black transition-colors">
                {button.label}
              </span>
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center ml-auto mr-[5px] group-hover:bg-vorlyx-black transition-colors">
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-5 h-5 sm:w-6 sm:h-6 md:w-[30px] md:h-[30px] text-[#4A4A4A] group-hover:text-white transition-colors"
                >
                  <path
                    d="M5 12H19M19 12L12 5M19 12L12 19"
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