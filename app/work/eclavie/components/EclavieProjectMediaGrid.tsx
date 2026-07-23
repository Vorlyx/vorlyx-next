"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Image from "next/image";

export interface GridItem {
  id: number;
  type: "video" | "image";
  src: string;
  label: string;

  // Desktop layout
  x: number;
  y: number;
  w: number;
  h: number;

  // Mobile layout overrides
  mx?: number;
  my?: number;
  mw?: number;
  mh?: number;

  // iPad Mini & Air layout (768px - 1023px)
  ax?: number;
  ay?: number;
  aw?: number;
  ah?: number;
  aheightPx?: number;

  // iPad Pro layout overrides (1024px - 1366px)
  px?: number;
  py?: number;
  pw?: number;
  ph?: number;
  pheightPx?: number;

  objectFit?: "cover" | "contain" | (string & {});
  containerBg?: string;
  containerBorderRadius?: number;
  borderRadius?: number;
  boxShadow?: string;

  heightPx?: number;
  mheightPx?: number;

  aspectRatio?: string;
}

interface EclavieProjectMediaGridProps {
  gridItems: GridItem[];
}

interface LayoutRow {
  items: (GridItem | undefined)[];
  cols: number;
  equalWidth?: boolean;
  widths?: number[];
}

/* ─── Module-level constants ────────────────────────────────────────────── */

const MQ_MOBILE = "(max-width: 767px)";
const MQ_IPAD_MINI_AIR = "(min-width: 768px) and (max-width: 1023px)";
const MQ_IPAD_PRO = "(min-width: 1024px) and (max-width: 1366px)";

const DEFAULT_CONTAINER_BG = "#ffffff";
const DEFAULT_OBJECT_FIT: "cover" | "contain" | (string & {}) = "cover";
const DEFAULT_OUTER_BORDER_RADIUS = "35px";

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
  if (isMobile && mobileVal !== undefined) return mobileVal;
  if (isMiniAir && miniAirVal !== undefined) return miniAirVal;
  if (isPro && proVal !== undefined) return proVal;
  return defaultVal;
};

export default function EclavieProjectMediaGrid({
  gridItems,
}: EclavieProjectMediaGridProps) {
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
          const handleLoadedData = () => {
            setVideoLoadedStates((prev) => ({ ...prev, [item.id]: true }));
          };

          video.addEventListener("loadeddata", handleLoadedData);

          if (video.readyState >= 2) {
            queueMicrotask(() => {
              setVideoLoadedStates((prev) => ({ ...prev, [item.id]: true }));
            });
          }

          cleanupFunctions.push(() => {
            video.removeEventListener("loadeddata", handleLoadedData);
          });
        }
      } else if (item.type === "video" && item.src.includes(".gif")) {
        queueMicrotask(() => {
          setVideoLoadedStates((prev) => ({ ...prev, [item.id]: true }));
        });
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

  const gridLayout: LayoutRow[] = useMemo(
    () => [
      { items: [sortedItems[0], sortedItems[1]], cols: 2, equalWidth: true },
      { items: [sortedItems[2]], cols: 1 },
      { items: [sortedItems[3]], cols: 1 },
      { items: [sortedItems[4], sortedItems[5]], cols: 2, equalWidth: true },
      { items: [sortedItems[6]], cols: 1 },
      { items: [sortedItems[7]], cols: 1 },
      { items: [sortedItems[8], sortedItems[9]], cols: 2, widths: [3, 4] },
    ],
    [sortedItems]
  );

  /* ── Render a single media item — memoized against device + video states ── */
  const renderMediaItem = useCallback(
    (item: GridItem) => {
      const isVideo = item.type === "video";
      const isGif = item.src.includes(".gif");
      const videoLoaded = videoLoadedStates[item.id] || false;

      const outerBorderRadius =
        item.containerBorderRadius !== undefined
          ? `${item.containerBorderRadius}px`
          : DEFAULT_OUTER_BORDER_RADIUS;

      const innerBorderRadius =
        item.borderRadius !== undefined
          ? `${item.borderRadius}px`
          : undefined;

      const containerBg = item.containerBg ?? DEFAULT_CONTAINER_BG;
      const objectFit = item.objectFit ?? DEFAULT_OBJECT_FIT;
      const hasShadow = item.boxShadow != null;

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

      const placementStyle: React.CSSProperties = {
        left: `${posX ?? 0}%`,
        top: `${posY ?? 0}%`,
        width: `${width ?? 100}%`,
        height: `${height ?? 100}%`,
        boxShadow: hasShadow ? item.boxShadow : undefined,
      };

      return (
        <div
          className="relative w-full h-full overflow-hidden"
          style={{
            borderRadius: outerBorderRadius,
            backgroundColor: containerBg,
          }}
        >
          {isVideo && !isGif ? (
            <>
              <video
                ref={(el) => {
                  videoRefs.current[item.id] = el;
                }}
                autoPlay
                loop
                muted
                playsInline
                onLoadedData={() =>
                  setVideoLoadedStates((prev) => ({ ...prev, [item.id]: true }))
                }
                onCanPlay={() =>
                  setVideoLoadedStates((prev) => ({ ...prev, [item.id]: true }))
                }
                onError={() =>
                  setVideoLoadedStates((prev) => ({ ...prev, [item.id]: true }))
                }
                className={`absolute border-0 outline-none transition-opacity duration-500 ${
                  objectFit === "contain" ? "object-contain" : "object-cover"
                }`}
                style={{
                  ...placementStyle,
                  borderRadius: innerBorderRadius,
                  opacity: videoLoaded ? 1 : 0,
                  backgroundColor: containerBg,
                }}
              >
                <source src={item.src} type="video/mp4" />
                <source src={item.src} type="video/webm" />
              </video>

              {!videoLoaded && (
                <div
                  className="absolute"
                  style={{
                    ...placementStyle,
                    borderRadius: innerBorderRadius,
                    backgroundColor: containerBg,
                  }}
                />
              )}
            </>
          ) : (
            <div
              className="absolute overflow-hidden"
              style={{
                ...placementStyle,
                borderRadius: innerBorderRadius,
              }}
            >
              <Image
  src={item.src}
  alt={item.label}
  fill
  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 50vw"
  unoptimized={isGif}
  className={
    objectFit === "contain" ? "object-contain" : "object-cover"
  }
/>
            </div>
          )}
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
            const rowItems = row.items.filter(Boolean) as GridItem[];

            const isTwoColRow =
              row.cols === 2 && (row.widths || row.equalWidth);

            const equalWidth = row.equalWidth === true;

            const rowHeightPx =
              !device.isMobile && isTwoColRow && !equalWidth
                ? Math.max(
                    ...rowItems.map((i) =>
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

            const useFiveCols = row.widths != null && widthSum === 5;
            const useSevenCols = row.widths != null && widthSum === 7;

            return (
              <div
                key={rowIndex}
                // FIX: Changed md:grid-cols-* to sm:grid-cols-* to trigger side-by-side on all tablets
                className={`grid gap-6 md:gap-8 lg:gap-10 ${
                  row.cols === 1
                    ? "grid-cols-1"
                    : equalWidth
                    ? "grid-cols-1 sm:grid-cols-2"
                    : useSevenCols
                    ? "grid-cols-1 sm:grid-cols-7"
                    : useFiveCols
                    ? "grid-cols-1 sm:grid-cols-5"
                    : "grid-cols-1 sm:grid-cols-3"
                } ${
                  isTwoColRow && !rowHeightPx && !equalWidth
                    ? useFiveCols || useSevenCols
                      ? "sm:aspect-[2/1] sm:grid-rows-1"
                      : "sm:aspect-[3/2] sm:grid-rows-1"
                    : ""
                }`}
                style={
                  rowHeightPx != null
                    ? { height: `${rowHeightPx}px` }
                    : undefined
                }
              >
                {rowItems.map((item, itemIndex) => {
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

                  const hasCustomSize =
                    heightPx != null || item.aspectRatio;

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
                    ? useSevenCols
                      ? w === 3
                        ? "sm:col-span-3"
                        : "sm:col-span-4"
                      : useFiveCols
                      ? w === 3
                        ? "sm:col-span-3"
                        : "sm:col-span-2"
                      : w === 1
                      ? "sm:col-span-1"
                      : "sm:col-span-2"
                    : "";

                  const useStretch =
                    !device.isMobile && isTwoColRow && !equalWidth;

                  const showAspect = hasCustomSize
                    ? false
                    : equalWidth || !isTwoColRow;

                  return (
                    <div
                      key={item.id}
                      // FIX: Changed md:min-h-0 md:h-full to sm:
                      className={`w-full ${colSpanClass} ${
                        showAspect ? defaultAspectClass : ""
                      } ${
                        useStretch ? "min-h-0 sm:min-h-0 sm:h-full" : ""
                      }`}
                      style={
                        rowHeightPx != null && useStretch
                          ? { minHeight: 0, height: "100%" }
                          : containerStyle
                      }
                    >
                      <div
                        className={
                          useStretch
                            ? "w-full h-full min-h-0"
                            : "w-full h-full"
                        }
                      >
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