"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";

import type {
  StickyCard,
  StickyCardLayoutSide,
} from "@/app/types/home";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type LayoutItem = StickyCardLayoutSide;
type Device = "mobile" | "air" | "tablet" | "desktop";

interface StickyCardsSectionProps {
  stickyCards: StickyCard[];
}

/* ─── Module-level constants (never recreated) ──────────────────────────── */

// Timing configuration
const HOLD_DURATION = 3.0;
const SLIDE_DURATION = 1.2;
const SCROLL_PER_UNIT = 100;
const SCRUB_VALUE = 2.2;

// Card shrink physics
const SHRINK_PER_LAYER = 0.08;
const MIN_SCALE = 0.68;

// Device breakpoints — kept flexible via matchMedia queries
const MEDIA_QUERIES = {
  mobile: "(max-width: 767px)",
  air: "(min-width: 768px) and (max-width: 1023px)",
  tablet: "(min-width: 1024px) and (max-width: 1366px)",
  desktop: "(min-width: 1367px)",
} as const;

// Static style objects (no state/props dependencies — safe at module scope)
const SECTION_STYLE_BASE: React.CSSProperties = {
  backgroundColor: "transparent",
};

const CONTAINER_STYLE: React.CSSProperties = {
  height: "100svh",
  backgroundColor: "transparent",
};

const BG_WRAPPER_STYLE: React.CSSProperties = {
  backgroundColor: "#171717",
  opacity: 1,
  zIndex: 0,
  pointerEvents: "none",
};

// Base card style (only zIndex + visibility differ per-card, added inline)
const CARD_STYLE_BASE: React.CSSProperties = {
  background: "transparent",
  padding: "0",
  top: 0,
  left: 0,
  position: "absolute",
  borderRadius: "24px",
  overflow: "hidden",
  height: "100svh",
  minHeight: "100svh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  transformOrigin: "top center",
  willChange: "transform",
  backfaceVisibility: "hidden",
};

const TITLE_H3_STYLE: React.CSSProperties = {
  fontSize: "clamp(32px,5vw,50px)",
  lineHeight: "1.2",
};

/* ─── Pure helper functions (module-scope, no re-creation) ──────────────── */

const buildStyle = (item?: LayoutItem): React.CSSProperties => {
  if (!item) return {};

  const transforms: string[] = [];
  if (item.rotate !== undefined) transforms.push(`rotate(${item.rotate}deg)`);
  if (item.scale !== undefined) transforms.push(`scale(${item.scale})`);

  return {
    position: "absolute",
    left: item.x !== undefined ? `${item.x}px` : undefined,
    right: item.right !== undefined ? `${item.right}px` : undefined,
    bottom: item.y !== undefined ? `${item.y}px` : undefined,
    width: item.w !== undefined ? `${item.w}%` : undefined,
    height: item.h !== undefined ? `${item.h}%` : undefined,
    textAlign: item.align,
    maxWidth: item.maxWidth ? `${item.maxWidth}px` : undefined,
    transform: transforms.length ? transforms.join(" ") : undefined,
    opacity: item.opacity,
    zIndex: item.z,
  };
};

const parseTechnologies = (techString: string): string[] =>
  techString
    .split(/[,\/·|]/)
    .map((tech) => tech.trim())
    .filter(Boolean);

/* ─── Component ─────────────────────────────────────────────────────────── */

export default function StickyCardsSection({
  stickyCards,
}: StickyCardsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const bgWrapperRef = useRef<HTMLDivElement>(null);

  const [device, setDevice] = useState<Device>("desktop");

  /* ── Derived values (only recompute when card count changes) ─────────── */
  const { totalCards, scrollDistance } = useMemo(() => {
    const count = stickyCards?.length || 0;
    const timelineLength =
      count > 1 ? (HOLD_DURATION + SLIDE_DURATION) * (count - 1) : 0;
    return {
      totalCards: count,
      scrollDistance: timelineLength * SCROLL_PER_UNIT,
    };
  }, [stickyCards]);

  // Section style — merged only when scrollDistance changes
  const sectionStyle = useMemo<React.CSSProperties>(
    () => ({
      ...SECTION_STYLE_BASE,
      height: `calc(100svh + ${scrollDistance}px)`,
    }),
    [scrollDistance]
  );

  /* ── Device detection via matchMedia (more efficient than resize) ────── */
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const mqls = {
      mobile: window.matchMedia(MEDIA_QUERIES.mobile),
      air: window.matchMedia(MEDIA_QUERIES.air),
      tablet: window.matchMedia(MEDIA_QUERIES.tablet),
      desktop: window.matchMedia(MEDIA_QUERIES.desktop),
    };

    const detect = () => {
      let next: Device = "desktop";
      if (mqls.mobile.matches) next = "mobile";
      else if (mqls.air.matches) next = "air";
      else if (mqls.tablet.matches) next = "tablet";
      else if (mqls.desktop.matches) next = "desktop";

      // Guard: only update state if value actually changed
      setDevice((prev) => (prev === next ? prev : next));
    };

    detect();

    // matchMedia change listeners are fired only when the query state flips
    Object.values(mqls).forEach((mql) => mql.addEventListener("change", detect));

    // Also listen to orientationchange for mobile/tablet flexibility
    window.addEventListener("orientationchange", detect);

    return () => {
      Object.values(mqls).forEach((mql) =>
        mql.removeEventListener("change", detect)
      );
      window.removeEventListener("orientationchange", detect);
    };
  }, []);

  /* ── Cache bg-wrapper element ref (used by scroll callbacks) ─────────── */
  const fadeBgOut = useCallback(() => {
    const bg = bgWrapperRef.current;
    if (!bg) return;
    bg.style.transition = "opacity 0.35s ease-out";
    bg.style.opacity = "0";
  }, []);

  const fadeBgIn = useCallback(() => {
    const bg = bgWrapperRef.current;
    if (!bg) return;
    bg.style.transition = "opacity 0.35s ease-in";
    bg.style.opacity = "1";
  }, []);

  /* ── GSAP animation setup ────────────────────────────────────────────── */
  useEffect(() => {
    try {
      if (!sectionRef.current || !containerRef.current) return;

      const section = sectionRef.current;
      const container = containerRef.current;
      const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];

      if (cards.length <= 1) return;

      // Kill only triggers related to this section/container
      const killOwnTriggers = () => {
        ScrollTrigger.getAll().forEach((trigger) => {
          const trig = trigger.vars.trigger;
          const pin = trigger.vars.pin;
          if (trig === section || trig === container || pin === container) {
            trigger.kill();
          }
        });
      };

      killOwnTriggers();

      // Capture viewport height once per setup (ScrollTrigger.refresh will
      // recalculate on resize; this initial value is fine)
      const viewportH = window.innerHeight;

      cards.forEach((card, index) => {
        gsap.set(card, {
          zIndex: index + 1,
          y: index === 0 ? 0 : viewportH,
          scale: 1,
          opacity: 1,
          visibility: index === 0 ? "visible" : "hidden",
          force3D: true,
        });
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: `+=${scrollDistance}`,
          scrub: SCRUB_VALUE,
          pin: container,
          pinSpacing: false,
          anticipatePin: 0,
          invalidateOnRefresh: true,
          markers: false,
          onLeave: fadeBgOut,
          onEnterBack: fadeBgIn,
        },
      });

      cards.forEach((card, index) => {
        if (index === 0) return;

        const slideStart =
          (index - 1) * (HOLD_DURATION + SLIDE_DURATION) + HOLD_DURATION;

        tl.set(card, { visibility: "visible" }, slideStart - 0.01);

        tl.to(
          card,
          {
            y: 0,
            duration: SLIDE_DURATION,
            ease: "power3.out",
            zIndex: (index + 1) * 10,
            force3D: true,
          },
          slideStart
        );

        for (let prev = 0; prev < index; prev++) {
          const prevCard = cards[prev];
          if (!prevCard) continue;

          const depth = index - prev;
          const targetScale = Math.max(MIN_SCALE, 1 - depth * SHRINK_PER_LAYER);

          tl.to(
            prevCard,
            {
              scale: targetScale,
              transformOrigin: "top center",
              duration: SLIDE_DURATION,
              ease: "power3.out",
              force3D: true,
            },
            slideStart
          );
        }
      });

      ScrollTrigger.refresh();

      // Debounced resize handler — avoids firing refresh on every pixel change
      let resizeTimer: number | null = null;
      const handleResize = () => {
        if (resizeTimer !== null) window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(() => {
          ScrollTrigger.refresh();
        }, 150);
      };

      window.addEventListener("resize", handleResize);
      window.addEventListener("orientationchange", handleResize);

      return () => {
        if (resizeTimer !== null) window.clearTimeout(resizeTimer);
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("orientationchange", handleResize);
        killOwnTriggers();
      };
    } catch (error) {
      console.error("Error setting up StickyCardsSection:", error);
      return () => {};
    }
  }, [stickyCards, scrollDistance, fadeBgOut, fadeBgIn]);

  /* ── Trim stale card refs when card count shrinks ────────────────────── */
  useEffect(() => {
    cardsRef.current.length = totalCards;
  }, [totalCards]);

  if (!stickyCards || stickyCards.length === 0) {
    return (
      <section className="relative bg-[#171717] text-white p-8">
        No cards available
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="relative w-full"
      style={sectionStyle}
    >
      <div
        ref={containerRef}
        className="sticky-cards-container relative w-full overflow-hidden"
        style={CONTAINER_STYLE}
      >
        <div
          ref={bgWrapperRef}
          className="bg-wrapper absolute inset-0"
          style={BG_WRAPPER_STYLE}
        />

        {stickyCards.map((card, index) => {
          const technologies = parseTechnologies(card.technologies);
          const projectSlug = card.href || `/project-${index + 1}`;
          const layout = card.layout || {};
          const deviceLayout = layout[device] || {};

          const titleStyle = buildStyle(deviceLayout.title);
          const techStyle = buildStyle(deviceLayout.tech);
          const mediaStyle = buildStyle(deviceLayout.media);

          const cardStyle: React.CSSProperties = {
            ...CARD_STYLE_BASE,
            zIndex: index + 1,
            visibility: index === 0 ? "visible" : "hidden",
          };

          const mediaWrapperStyle: React.CSSProperties = {
            width: "100%",
            height: "100%",
            ...mediaStyle,
          };

          return (
            <div
              key={`card-${index}`}
              ref={(el) => {
                cardsRef.current[index] = el;
              }}
              className="card absolute w-full"
              style={cardStyle}
            >
              <div className="relative flex h-full w-full origin-top flex-col overflow-hidden">
                <Link
                  href={projectSlug}
                  className="relative h-full w-full cursor-pointer"
                >
                  <div className="absolute" style={mediaWrapperStyle}>
                    {card.image && (
                      <Image
                        src={card.image}
                        alt={card.projectTitle}
                        width={2000}
                        height={1200}
                        className="w-full h-full object-contain"
                        priority={index === 0}
                      />
                    )}

                    {card.video && (
                      <video
                        src={card.video}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-contain"
                      />
                    )}
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />

                  <div className="absolute inset-0 z-10">
                    <div style={titleStyle} className="text-white">
                      <h3
                        className="font-lato font-bold text-white"
                        style={TITLE_H3_STYLE}
                      >
                        {card.projectTitle}
                      </h3>
                    </div>

                    <div style={techStyle}>
                      {technologies.map((tag, idx) => (
                        <span key={idx} className="text-white">
                          {tag}
                          {idx < technologies.length - 1 && (
                            <span className="mx-4 text-white">/</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}