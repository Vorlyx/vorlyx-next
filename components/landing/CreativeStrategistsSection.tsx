"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";

interface CreativeStrategistsSectionProps {
  headline: string;
  body: string;
  button: { label: string; href: string };
  vorlyxLogo: string;
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

// Helper to prevent orphans (pure function, safe outside component)
const preventOrphan = (text: string) => {
  const trimmedText = text.trimEnd();
  if (trimmedText.length === 0) return text;

  const lastSpaceIndex = trimmedText.lastIndexOf(" ");
  if (lastSpaceIndex !== -1) {
    const trailingSpaces = text.substring(trimmedText.length);
    return (
      trimmedText.substring(0, lastSpaceIndex) +
      "\u00A0" +
      trimmedText.substring(lastSpaceIndex + 1) +
      trailingSpaces
    );
  }
  return text;
};

/**
 * Creative Strategists Section component
 * Two-column layout with headline, body text, and Agency button
 * Light grey background with thin black borders
 */
export default function CreativeStrategistsSection({
  headline,
  body,
  button,
  vorlyxLogo,
}: CreativeStrategistsSectionProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const textRef = useRef<HTMLParagraphElement>(null);

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

  // Derived headline parts — only recompute when `headline` changes
  const { headlineParts, ofPart, restPart } = useMemo(() => {
    const parts = headline.split("Vorlyx");
    const after = parts[1] || "";
    return {
      headlineParts: parts,
      ofPart: after.split("CREATIVE")[0] || "",
      restPart: "CREATIVE" + (after.split("CREATIVE")[1] || ""),
    };
  }, [headline]);

  // Derived body text — only recompute when `body` changes
  const cleanBody = useMemo(
    () => preventOrphan(body.replace(/\n/g, "")),
    [body]
  );
  const totalLetters = cleanBody.length;

  const renderRevealBody = useCallback(
    (text: string) => {
      const chunks = text.match(/[^ ]+|[ ]+/g) || [];
      let currentIndex = 0;

      return (
        <>
          {chunks.map((chunk, chunkIndex) => {
            const isSpace = /^[ ]+$/.test(chunk);

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
        </>
      );
    },
    [scrollProgress, totalLetters]
  );

  return (
    <section
      className="relative w-full max-w-[1920px] mx-auto bg-vorlyx-light-gray
      
      h-[500px]             /* 1. Mobile (fully customizable!) */

    sm:h-[500px]          /* 2. iPad Mini */
    md:h-[500px]          /* 2. iPad Air / iPad 10th Gen */

    ipadpro:h-[700px]     /* 3. iPad Pro */

    lg:h-[650px]          /* 4. Laptop / Desktop */
  "
    >
      <div className="w-full h-full max-w-[1920px] mx-auto 
                      px-6 sm:px-8 md:px-17 lg:px-24 
                      pt-14 sm:pt-16 md:pt-16 lg:pt-20 ipadpro:pt-32 pb-16">
        
        {/* FIX IMPLEMENTED HERE: Changed md:grid-cols to sm:grid-cols to force side-by-side columns specifically on iPads */}
        <div className="grid grid-cols-1 sm:grid-cols-[1fr,1.2fr] gap-8 sm:gap-4 md:gap-8 h-full items-start">
          
          {/* Left Column - Headline and Button */}
          <div className="flex flex-col justify-start">
            <h1 className="font-lato 
              text-[32px] sm:text-[40px] md:text-[50px] lg:text-[64px] 
              font-extrabold text-vorlyx-black uppercase
              leading-[30px] sm:leading-[48px] md:leading-[64px] lg:leading-[55px]
              ipadpro:leading-[50px]
              mb-[35px] sm:mb-[120px] md:mb-[150px] ipadpro:mb-[200px]"
            >

              <div className="block ipadpro:hidden">
                <span className="flex flex-wrap items-center gap-2">
                  {headlineParts[0]}
                  <span className="inline-block">
                    <Image
                      src={vorlyxLogo}
                      alt="Vorlyx"
                      width={300}
                      height={70}
                      className="h-[32px] sm:h-[35px] md:h-[55px] w-auto"
                      priority
                    />
                  </span>
                  {ofPart}
                </span>
                <span className="block">{restPart}</span>
              </div>
              
              {/* iPad Pro ONLY headline layout */}
              <div className="hidden ipadpro:block">
                <div className="flex flex-wrap items-center gap-2">
                  {headlineParts[0]}
                  <span className="inline-block">
                    <Image
                      src={vorlyxLogo}
                      alt="Vorlyx"
                      width={300}
                      height={70}
                      className="h-[45px] w-auto"
                      priority
                    />
                  </span>
                  {ofPart}
                </div>

                <div>CREATIVE</div>
                <div>STRATEGISTS.</div>
              </div>

            </h1>
            <Link
              href={button.href}
              className="group bg-white rounded-full pl-12 pr-[40px] py-4 flex items-center gap-10 w-fit hover:bg-vorlyx-black transition-colors"
            >
              <span className="font-lato text-[32px] sm:text-[40px] md:text-[50px] font-light text-vorlyx-black group-hover:text-white transition-colors">
                {button.label}
              </span>
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-vorlyx-black rounded-full flex items-center justify-center ml-auto mr-[5px] group-hover:bg-white transition-colors">
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-5 h-5 sm:w-6 sm:h-6 md:w-[30px] md:h-[30px] text-white group-hover:text-vorlyx-black transition-colors"
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

          {/* Right Column - Body Text */}
          <div className="flex items-start">
            <p
              ref={textRef}
              className=" font-lato text-[21px] sm:text-[25px] md:text-[45px] ipadpro:text-[32px] font-semibold text-vorlyx-black leading-[1.2] sm:pr-0 sm:-translate-x-0 md:pr-4 lg:pr-0 ipadpro:pr-4 ipadpro:leading-[40px] md:leading-[60px] max-w-[1500px]"
            >
              {renderRevealBody(cleanBody)}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}