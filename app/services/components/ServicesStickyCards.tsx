"use client";

import { useEffect, useRef, useMemo, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface StickyCard {
  category: string;
  description: string;
  services: string[];
}

interface ServicesStickyCardsProps {
  stickyCards: StickyCard[];
}

/* ─── Module-level constants (never recreated) ──────────────────────────── */

// Timing configuration — tuned for maximum smoothness
const HOLD_DURATION = 4.0;
const SLIDE_DURATION = 2.0;
const SCROLL_PER_UNIT = 180;
const SCRUB_VALUE = 3.0;

// Card shrink physics
const SHRINK_PER_LAYER = 0.08;
const MIN_SCALE = 0.68;

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

// Card base style — only zIndex + visibility + optional borderTop differ per card
const CARD_STYLE_BASE: React.CSSProperties = {
  background: "#171717",
  color: "white",
  padding: "0",
  top: 0,
  left: 0,
  position: "absolute",
  borderRadius: "0",
  height: "100svh",
  minHeight: "100svh",
  display: "flex",
  alignItems: "center",
  width: "100%",
  transformOrigin: "top center",
  willChange: "transform",
  backfaceVisibility: "hidden",
};

// Responsive CSS block for iPad Mini/Air/Pro tuning
const RESPONSIVE_CSS = `
  @media screen and (min-width: 768px) and (max-width: 1024px) {
    #services-sticky-cards-section .target-grid { 
      display: flex !important;
      flex-direction: column !important;
      gap: 32px !important;
      margin: 0 !important;
    }
    #services-sticky-cards-section .target-col-title { 
      width: 100% !important; 
      border-bottom: 1px solid rgba(255, 255, 255, 0.3) !important;
      padding-bottom: 30px !important;
      margin-bottom: 0px !important;
    }
    #services-sticky-cards-section .target-title { 
      font-size: 28px !important; 
      line-height: 1.2 !important; 
      white-space: normal !important;
      word-wrap: break-word !important;
      text-transform: uppercase !important;
      letter-spacing: 0.02em !important;
    }
    #services-sticky-cards-section .target-col-desc { 
      width: 100% !important; 
    }
    #services-sticky-cards-section .target-desc { 
      font-size: 16px !important; 
      max-width: 100% !important; 
      line-height: 1.6 !important;
      color: rgba(255, 255, 255, 0.9) !important;
    }
    #services-sticky-cards-section .target-service-container {
      width: 100% !important;
      gap: 20px !important;
      margin-top: 10px !important;
    }
    #services-sticky-cards-section .target-service { 
      font-size: 16px !important; 
      line-height: 1.5 !important;
      color: rgba(255, 255, 255, 0.8) !important;
    }
    #services-sticky-cards-section .target-separator {
      margin-top: 20px !important;
      background-color: rgba(255, 255, 255, 0.2) !important;
    }
  }
  @media screen and (min-width: 768px) and (max-width: 819px) {
    #services-sticky-cards-section .target-container { 
      padding-left: 135px !important;
      padding-right: 40px !important; 
    }
    #services-sticky-cards-section .target-grid { 
      max-width: 500px !important;
    }
  }
  @media screen and (min-width: 820px) and (max-width: 833px) {
    #services-sticky-cards-section .target-container { 
      padding-left: 125px !important;
      padding-right: 70px !important; 
    }
    #services-sticky-cards-section .target-grid { 
      max-width: 580px !important;
    }
  }
  @media screen and (min-width: 834px) and (max-width: 1024px) {
    #services-sticky-cards-section .target-container { 
      padding-left: 180px !important; 
      padding-right: 70px !important; 
    }
    #services-sticky-cards-section .target-grid { 
      max-width: 680px !important;
    }
    #services-sticky-cards-section .target-title { 
      font-size: 32px !important; 
    }
    #services-sticky-cards-section .target-desc { 
      font-size: 18px !important; 
    }
    #services-sticky-cards-section .target-service { 
      font-size: 18px !important; 
    }
  }
`;

// Pre-built props for the injected style tag
const RESPONSIVE_CSS_PROPS = {
  __html: RESPONSIVE_CSS,
};

export default function ServicesStickyCards({
  stickyCards,
}: ServicesStickyCardsProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const bgWrapperRef = useRef<HTMLDivElement>(null);

  /* ── Derived values — only recompute when card count changes ─────────── */
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

  /* ── Cache bg-wrapper element ref (used by scroll callbacks) ─────────── */
  const fadeBgOut = useCallback(() => {
    const bg = bgWrapperRef.current;
    if (!bg) return;
    bg.style.transition = "opacity 0.5s ease-out";
    bg.style.opacity = "0";
  }, []);

  const fadeBgIn = useCallback(() => {
    const bg = bgWrapperRef.current;
    if (!bg) return;
    bg.style.transition = "opacity 0.5s ease-in";
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

      // Capture viewport height once per setup
      const viewportH = window.innerHeight;

      // Initial state
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

      // Animate each card
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
            ease: "power4.out",
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
              ease: "power4.out",
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
      console.error("Error setting up ServicesStickyCards:", error);
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
        id="services-sticky-cards-section"
        className="services-container relative w-full overflow-hidden ipad-target-section"
        ref={containerRef}
        style={CONTAINER_STYLE}
      >
        <style dangerouslySetInnerHTML={RESPONSIVE_CSS_PROPS} />

        {/* Background */}
        <div
          ref={bgWrapperRef}
          className="black-bg-wrapper absolute inset-0"
          style={BG_WRAPPER_STYLE}
        />

        {stickyCards.map((card, index) => {
          const cardStyle: React.CSSProperties = {
            ...CARD_STYLE_BASE,
            zIndex: index + 1,
            visibility: index === 0 ? "visible" : "hidden",
            ...(index > 0 && { borderTop: "0.05pt solid #EDEDED" }),
          };

          return (
            <div
              key={`card-${index}`}
              id={`card${index + 1}`}
              ref={(el) => {
                cardsRef.current[index] = el;
              }}
              className="card absolute w-full"
              style={cardStyle}
            >
              <div className="w-full max-w-[1920px] mx-auto px-6 md:px-12 lg:px-16 py-16 md:py-20 lg:py-24 target-container">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 lg:gap-12 target-grid">
                  <div className="flex items-start target-col target-col-title">
                    <h3 className="font-lato text-[28px] sm:text-[32px] md:text-[38px] lg:text-[47px] font-bold text-white/90 leading-[1.1] tracking-tight target-title">
                      {card.category || `Card ${index + 1}`}
                    </h3>
                  </div>

                  <div className="flex items-start target-col target-col-desc">
                    <p className="font-lato text-[14px] sm:text-[15px] md:text-[16px] lg:text-[20px] font-normal text-white/90 leading-relaxed max-w-[90%] target-desc">
                      {card.description || "No description available"}
                    </p>
                  </div>

                  <div className="flex flex-col gap-4 md:gap-5 target-col target-service-container">
                    {card.services && card.services.length > 0 ? (
                      card.services.map((service, serviceIndex) => (
                        <div
                          key={`service-${serviceIndex}`}
                          className="flex flex-col"
                        >
                          <p className="font-lato text-[13px] sm:text-[14px] md:text-[15px] lg:text-[18px] font-normal text-white/90 leading-snug target-service">
                            {service}
                          </p>
                          {serviceIndex < card.services.length - 1 && (
                            <div className="mt-4 md:mt-5 h-px bg-white/40 target-separator" />
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="font-lato text-[13px] sm:text-[14px] md:text-[15px] lg:text-[16px] font-normal text-white/50">
                        No services listed
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}