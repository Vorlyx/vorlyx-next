"use client";

import Image from "next/image";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";

export interface GridItem {
  id: number;
  label: string;
  type: "image" | "video";
  src: string;

  // Desktop layout
  x: number;
  y: number;
  w: number;
  h: number;

  // Mobile layout overrides (optional)
  mx?: number;
  my?: number;
  mw?: number;
  mh?: number;

  // 3. iPad Mini & Air layout (768px - 1023px)
  ax?: number;
  ay?: number;
  aw?: number;
  ah?: number;
  aheightPx?: number;

  // iPad Pro layout overrides
  px?: number;
  py?: number;
  pw?: number;
  ph?: number;

  aspectRatio?: string;
  heightPx?: number;
  mheightPx?: number;
  pheightPx?: number;
  containerBg?: string;
  borderRadius?: number;
  objectFit?: "cover" | "contain";
  boxShadow?: string;
}

interface ProjectMediaGridProps {
  gridItems: GridItem[];
}

/* ─── Module-level constants ────────────────────────────────────────────── */

const MQ_MOBILE = "(max-width: 767px)";
const MQ_IPAD_MINI_AIR = "(min-width: 768px) and (max-width: 1023px)";
const MQ_IPAD_PRO = "(min-width: 1024px) and (max-width: 1366px)";

const DEFAULT_CONTAINER_BG = "#ffffff";
const DEFAULT_OBJECT_FIT: "cover" | "contain" = "cover";

// Pure helper — picks the right per-device value from the item
const pickValue = <T,>(
  isMobile: boolean,
  isMiniAir: boolean,
  isPro: boolean,
  mobileVal: T | undefined,
  miniAirVal: T | undefined,
  proVal: T | undefined,
  defaultVal: T
): T => {
  if (isMobile && mobileVal != null) return mobileVal;
  if (isMiniAir && miniAirVal != null) return miniAirVal;
  if (isPro && proVal != null) return proVal;
  return defaultVal;
};

export default function ProjectMediaGrid({ gridItems }: ProjectMediaGridProps) {
  const [videoLoadedStates, setVideoLoadedStates] = useState<
    Record<number, boolean>
  >({});

  const videoRefs = useRef<Record<number, HTMLVideoElement | null>>({});

  // Unified device state — one object, one setter, one effect
  const [device, setDevice] = useState({
    isMobile: false,
    isIpadMiniAir: false,
    isIpadPro: false,
  });

  /* ── Unified device detection via matchMedia (single effect) ─────────── */
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const mqMobile = window.matchMedia(MQ_MOBILE);
    const mqMiniAir = window.matchMedia(MQ_IPAD_MINI_AIR);
    const mqPro = window.matchMedia(MQ_IPAD_PRO);

    const detect = () => {
      setDevice((prev) => {
        const next = {
          isMobile: mqMobile.matches,
          isIpadMiniAir: mqMiniAir.matches,
          isIpadPro: mqPro.matches,
        };
        // Guard: only update if changed
        if (
          prev.isMobile === next.isMobile &&
          prev.isIpadMiniAir === next.isIpadMiniAir &&
          prev.isIpadPro === next.isIpadPro
        ) {
          return prev;
        }
        return next;
      });
    };

    detect();
    mqMobile.addEventListener("change", detect);
    mqMiniAir.addEventListener("change", detect);
    mqPro.addEventListener("change", detect);

    return () => {
      mqMobile.removeEventListener("change", detect);
      mqMiniAir.removeEventListener("change", detect);
      mqPro.removeEventListener("change", detect);
    };
  }, []);

  /* ── Video load tracking ─────────────────────────────────────────────── */
  useEffect(() => {
    const cleanupFunctions: Array<() => void> = [];

    gridItems.forEach((item) => {
      if (item.type === "video" && !item.src.includes(".gif")) {
        const video = videoRefs.current[item.id];

        if (video) {
          const handleLoadedData = () => {
            setVideoLoadedStates((prev) => ({ ...prev, [item.id]: true }));
          };

          video.addEventListener("loadeddata", handleLoadedData);

          if (video.readyState >= 2) {
            setVideoLoadedStates((prev) => ({ ...prev, [item.id]: true }));
          }

          cleanupFunctions.push(() => {
            video.removeEventListener("loadeddata", handleLoadedData);
          });
        }
      } else if (item.type === "video" && item.src.includes(".gif")) {
        queueMicrotask(() =>
          setVideoLoadedStates((prev) => ({ ...prev, [item.id]: true }))
        );
      }
    });

    return () => {
      cleanupFunctions.forEach((cleanup) => cleanup());
    };
  }, [gridItems]);

  /* ── Sorted items & layout — only recompute when gridItems changes ───── */
  const sortedItems = useMemo(
    () => [...gridItems].sort((a, b) => a.id - b.id),
    [gridItems]
  );

  const gridLayout = useMemo(
    () => [
      [sortedItems[0], sortedItems[1]],
      [sortedItems[2]],
      [sortedItems[3]],
      [sortedItems[4], sortedItems[5]],
      [sortedItems[6]],
      [sortedItems[7], sortedItems[8]],
      [sortedItems[9]],
    ],
    [sortedItems]
  );

  /* ── Render a single media item — memoized against device + video states ── */
  const renderMediaItem = useCallback(
    (item: GridItem) => {
      const isVideo = item.type === "video";
      const isGif = item.src.includes(".gif");
      const videoLoaded = videoLoadedStates[item.id] || false;

      const { isMobile, isIpadMiniAir, isIpadPro } = device;

      const posX = pickValue(
        isMobile,
        isIpadMiniAir,
        isIpadPro,
        item.mx,
        item.ax,
        item.px,
        item.x
      );
      const posY = pickValue(
        isMobile,
        isIpadMiniAir,
        isIpadPro,
        item.my,
        item.ay,
        item.py,
        item.y
      );
      const width = pickValue(
        isMobile,
        isIpadMiniAir,
        isIpadPro,
        item.mw,
        item.aw,
        item.pw,
        item.w
      );
      const height = pickValue(
        isMobile,
        isIpadMiniAir,
        isIpadPro,
        item.mh,
        item.ah,
        item.ph,
        item.h
      );

      const boxStyle: React.CSSProperties = {
        position: "absolute",
        left: `${posX}%`,
        top: `${posY}%`,
        width: `${width}%`,
        height: `${height}%`,
      };

      const objectFit = item.objectFit ?? DEFAULT_OBJECT_FIT;
      const containerBg = item.containerBg ?? DEFAULT_CONTAINER_BG;
      const mediaBorderRadius = item.borderRadius;
      const hasShadow = item.boxShadow != null;

      const mediaBoxStyle: React.CSSProperties = {
        ...boxStyle,
        ...(mediaBorderRadius != null && {
          borderRadius: `${mediaBorderRadius}px`,
          overflow: "hidden",
          isolation: "isolate",
          clipPath: `inset(0 round ${mediaBorderRadius}px)`,
        }),
      };

      const shadowWrapperStyle: React.CSSProperties = hasShadow
        ? {
            ...boxStyle,
            boxShadow: item.boxShadow,
            ...(mediaBorderRadius != null && {
              borderRadius: `${mediaBorderRadius}px`,
            }),
          }
        : boxStyle;

      return (
        <div
          className="relative w-full h-full overflow-hidden"
          style={{ borderRadius: "35px", backgroundColor: containerBg }}
        >
          <div
            className="absolute inset-0"
            style={{ backgroundColor: containerBg }}
          >
            {isVideo && !isGif ? (
              <>
                <div
                  className="absolute transition-opacity duration-500"
                  style={{
                    ...(hasShadow ? shadowWrapperStyle : boxStyle),
                    opacity: videoLoaded ? 1 : 0,
                  }}
                >
                  <div
                    className="h-full w-full overflow-hidden"
                    style={
                      mediaBorderRadius != null
                        ? {
                            borderRadius: `${mediaBorderRadius}px`,
                            clipPath: `inset(0 round ${mediaBorderRadius}px)`,
                          }
                        : undefined
                    }
                  >
                    <video
                      ref={(el) => {
                        videoRefs.current[item.id] = el;
                      }}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className={
                        objectFit === "contain"
                          ? "absolute inset-0 w-full h-full border-0 outline-none object-contain"
                          : "absolute inset-0 w-full h-full border-0 outline-none object-cover"
                      }
                      style={{
                        border: "none",
                        outline: "none",
                        background: containerBg,
                        ...(mediaBorderRadius != null && {
                          borderRadius: `${mediaBorderRadius}px`,
                          overflow: "hidden",
                        }),
                      }}
                    >
                      <source src={item.src} type="video/mp4" />
                      <source src={item.src} type="video/webm" />
                    </video>
                  </div>
                </div>

                {!videoLoaded && (
                  <div
                    className="absolute"
                    style={{
                      ...(hasShadow ? shadowWrapperStyle : boxStyle),
                      backgroundColor: containerBg,
                    }}
                  />
                )}
              </>
            ) : isGif ? (
              <div
                className="absolute"
                style={hasShadow ? shadowWrapperStyle : boxStyle}
              >
                <div
                  className="h-full w-full overflow-hidden"
                  style={mediaBoxStyle}
                >
                  <Image
                    src={item.src}
                    alt={item.label}
                    fill
                    className={
                      objectFit === "contain"
                        ? "object-contain"
                        : "object-cover"
                    }
                    unoptimized
                  />
                </div>
              </div>
            ) : (
              <div
                className="absolute"
                style={hasShadow ? shadowWrapperStyle : boxStyle}
              >
                <div
                  className="h-full w-full overflow-hidden"
                  style={mediaBoxStyle}
                >
                  <Image
                    src={item.src}
                    alt={item.label}
                    fill
                    className={
                      objectFit === "contain"
                        ? "object-contain"
                        : "object-cover"
                    }
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      );
    },
    [device, videoLoadedStates]
  );

  return (
    <section className="w-full bg-[#EDEDED] py-12 md:py-16 lg:py-20">
      <div className="w-full max-w-[1920px] mx-auto px-8 md:px-16 lg:px-24">
        <div className="flex flex-col gap-6 md:gap-8 lg:gap-10">
          {gridLayout.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className={`grid gap-6 md:gap-8 lg:gap-10 ${
                row.length === 1
                  ? "grid-cols-1"
                  : device.isIpadMiniAir
                  ? "grid-cols-2"
                  : "grid-cols-1 sm:grid-cols-2"
              }`}
            >
              {row.map((item) => {
                const defaultAspectClass =
                  row.length === 1 ? "aspect-[16/9]" : "aspect-square";

                const hasCustomSize =
                  item.heightPx != null || item.aspectRatio;

                const heightPx = pickValue(
                  device.isMobile,
                  device.isIpadMiniAir,
                  device.isIpadPro,
                  item.mheightPx,
                  item.aheightPx,
                  item.pheightPx,
                  item.heightPx
                );

                const containerStyle =
                  heightPx != null
                    ? { height: `${heightPx}px` }
                    : item.aspectRatio
                    ? { aspectRatio: item.aspectRatio }
                    : undefined;

                return (
                  <div
                    key={item.id}
                    className={`w-full ${
                      hasCustomSize ? "" : defaultAspectClass
                    }`}
                    style={containerStyle}
                  >
                    {renderMediaItem(item)}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}