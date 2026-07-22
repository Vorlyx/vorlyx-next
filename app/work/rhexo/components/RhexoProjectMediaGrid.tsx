"use client";

import Image from "next/image";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { GridItem } from "@/app/work/luminelle/components/ProjectMediaGrid";

export type { GridItem };

interface RhexoProjectMediaGridProps {
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

export default function RhexoProjectMediaGrid({
  gridItems,
}: RhexoProjectMediaGridProps) {
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
          const handleLoaded = () =>
            queueMicrotask(() =>
              setVideoLoadedStates((prev) => ({ ...prev, [item.id]: true }))
            );

          video.addEventListener("loadeddata", handleLoaded);

          if (video.readyState >= 2) {
            queueMicrotask(() =>
              setVideoLoadedStates((prev) => ({ ...prev, [item.id]: true }))
            );
          }

          cleanupFunctions.push(() =>
            video.removeEventListener("loadeddata", handleLoaded)
          );
        }
      } else if (item.type === "video" && item.src.includes(".gif")) {
        queueMicrotask(() =>
          setVideoLoadedStates((prev) => ({ ...prev, [item.id]: true }))
        );
      }
    });

    return () => cleanupFunctions.forEach((cleanup) => cleanup());
  }, [gridItems]);

  /* ── Sorted items & layout — only recompute when gridItems changes ───── */
  const sortedItems = useMemo(
    () => [...gridItems].sort((a, b) => a.id - b.id),
    [gridItems]
  );

  const gridLayout = useMemo(
    () => [
      { items: [sortedItems[0]].filter(Boolean), cols: 1 },
      {
        items: [sortedItems[1], sortedItems[2]].filter(Boolean),
        cols: 2,
        widths: [1, 2],
      },
      { items: [sortedItems[3]].filter(Boolean), cols: 1 },
      {
        items: [sortedItems[4], sortedItems[5]].filter(Boolean),
        cols: 2,
        equalWidth: true,
      },
      { items: [sortedItems[6]].filter(Boolean), cols: 1 },
      {
        items: [sortedItems[7], sortedItems[8]].filter(Boolean),
        cols: 2,
        widths: [3, 2],
      },
      { items: [sortedItems[9]].filter(Boolean), cols: 1 },
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
                      onLoadedData={() =>
                        setVideoLoadedStates((prev) => ({
                          ...prev,
                          [item.id]: true,
                        }))
                      }
                      className={
                        objectFit === "contain"
                          ? "absolute inset-0 w-full h-full object-contain"
                          : "absolute inset-0 w-full h-full object-cover"
                      }
                      style={{
                        background: containerBg,
                        ...(mediaBorderRadius != null && {
                          borderRadius: `${mediaBorderRadius}px`,
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
                    unoptimized={isGif}
                    className={
                      objectFit === "contain" ? "object-contain" : "object-cover"
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

  /* ── Main return ─────────────────────────────────────────────────────── */
  return (
    <section className="w-full bg-[#EDEDED] py-12 md:py-16 lg:py-20">
      <div className="w-full max-w-[1920px] mx-auto px-8 md:px-16 lg:px-24">
        <div className="flex flex-col gap-6 md:gap-8 lg:gap-10">
          {gridLayout.map((row, rowIndex) => {
            const isTwoCol = !device.isMobile && row.cols === 2;

            const equalWidth =
              (row as { equalWidth?: boolean }).equalWidth === true;

            const rowHeightPx =
              isTwoCol && !equalWidth
                ? Math.max(
                    ...row.items.map((i) =>
                      pickValue(
                        device.isMobile,
                        device.isIpadMiniAir,
                        device.isIpadPro,
                        i.mheightPx,
                        i.aheightPx,
                        i.pheightPx,
                        i.heightPx ?? 0
                      ) ?? 0
                    )
                  )
                : null;

            const widthSum = row.widths?.reduce((a, b) => a + b, 0) ?? 0;
            const useFiveCols = row.widths && widthSum === 5;

            return (
              <div
                key={rowIndex}
                // FIX: Changed md:grid-cols-* to sm:grid-cols-* to trigger side-by-side on all tablets (Air/Mini included)
                className={`grid gap-6 md:gap-8 lg:gap-10 ${
                  row.cols === 1
                    ? "grid-cols-1"
                    : equalWidth
                    ? "grid-cols-1 sm:grid-cols-2"
                    : useFiveCols
                    ? "grid-cols-1 sm:grid-cols-5"
                    : "grid-cols-1 sm:grid-cols-3"
                }`}
                style={
                  rowHeightPx != null ? { height: `${rowHeightPx}px` } : undefined
                }
              >
                {row.items.map((item, itemIndex) => {
                  const defaultAspectClass =
                    row.cols === 1 ? "aspect-[16/9]" : "aspect-square";

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

                  const w = row.widths?.[itemIndex];

                  // FIX: Changed md:col-span-* to sm:col-span-* here as well
                  const colSpanClass = equalWidth
                    ? ""
                    : row.widths
                    ? useFiveCols
                      ? w === 3
                        ? "sm:col-span-3"
                        : "sm:col-span-2"
                      : w === 1
                      ? "sm:col-span-1"
                      : "sm:col-span-2"
                    : "";

                  const useStretch = isTwoCol && !equalWidth;

                  const showAspect =
                    !(item.heightPx || item.aspectRatio) && !useStretch;

                  return (
                    <div
                      key={item.id}
                      // FIX: Changed md:h-full to sm:h-full
                      className={`w-full ${colSpanClass} ${
                        showAspect ? defaultAspectClass : ""
                      } ${useStretch ? "min-h-0 sm:h-full" : ""}`}
                      style={
                        rowHeightPx != null
                          ? useStretch
                            ? { ...containerStyle, height: "100%" }
                            : { ...containerStyle, height: rowHeightPx }
                          : containerStyle
                      }
                    >
                      <div className="w-full h-full">
                        {renderMediaItem(item)}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}