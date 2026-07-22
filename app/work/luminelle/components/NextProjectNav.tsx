"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useMemo } from "react";

interface NextProjectNavProps {
  name: string;
  link: string;
  imageSrc?: string;

  // Desktop layout
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  heightPx?: number;

  // Mobile layout overrides (< 768px)
  mx?: number;
  my?: number;
  mw?: number;
  mh?: number;
  mheightPx?: number;

  // iPad Mini & Air layout overrides (768px - 1023px)
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
}

/* ─── Module-level constants ────────────────────────────────────────────── */

const MQ_MOBILE = "(max-width: 767px)";
const MQ_IPAD_MINI_AIR = "(min-width: 768px) and (max-width: 1023px)";
const MQ_IPAD_PRO = "(min-width: 1024px) and (max-width: 1366px)";

const INNER_WRAPPER_STYLE: React.CSSProperties = { left: "0%" };

export default function NextProjectNav({
  name,
  link,
  imageSrc = "/assets/Pictures/Projects/Rhexo/Screen.png",

  // Desktop defaults
  x = 0,
  y = -220,
  w = 100,
  h = 700,
  heightPx = 260,

  // Mobile defaults
  mx = 0,
  my = -100,
  mw = 100,
  mh = 360,
  mheightPx = 140,

  // iPad Mini & Air defaults
  ax = 0,
  ay = -140,
  aw = 100,
  ah = 450,
  aheightPx = 180,

  // iPad Pro defaults
  px = 0,
  py = -180,
  pw = 100,
  ph = 550,
  pheightPx = 220,
}: NextProjectNavProps) {
  /* ── Unified device detection via matchMedia ─────────────────────────── */
  const [device, setDevice] = useState({
    isMobile: false,
    isIpadMiniAir: false,
    isIpadPro: false,
  });

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

  /* ── Active layout values — only recompute when device or props change ── */
  const { activeX, activeY, activeW, activeH, activeContainerHeight } = useMemo(() => {
    const { isMobile, isIpadMiniAir, isIpadPro } = device;
    return {
      activeX: isMobile ? mx : isIpadMiniAir ? ax : isIpadPro ? px : x,
      activeY: isMobile ? my : isIpadMiniAir ? ay : isIpadPro ? py : y,
      activeW: isMobile ? mw : isIpadMiniAir ? aw : isIpadPro ? pw : w,
      activeH: isMobile ? mh : isIpadMiniAir ? ah : isIpadPro ? ph : h,
      activeContainerHeight: isMobile
        ? mheightPx
        : isIpadMiniAir
        ? aheightPx
        : isIpadPro
        ? pheightPx
        : heightPx,
    };
  }, [
    device,
    x, y, w, h, heightPx,
    mx, my, mw, mh, mheightPx,
    ax, ay, aw, ah, aheightPx,
    px, py, pw, ph, pheightPx,
  ]);

  /* ── Pre-built style objects ─────────────────────────────────────────── */
  const linkStyle = useMemo<React.CSSProperties>(
    () => ({
      height: `${activeContainerHeight}px`,
      marginBottom: "-30px",
    }),
    [activeContainerHeight]
  );

  const imageWrapperStyle = useMemo<React.CSSProperties>(
    () => ({
      top: `${activeY}%`,
      left: `${activeX}%`,
      width: `${activeW}%`,
      height: `${activeH}%`,
    }),
    [activeX, activeY, activeW, activeH]
  );

  return (
    <section className="w-full bg-[#EDEDED] pt-12 md:pt-16 lg:pt-20 pb-0 relative overflow-hidden">
      <div className="w-full max-w-[1920px] mx-auto px-8 md:px-16 lg:px-24">
        <div className="flex flex-col items-center text-center gap-6 md:gap-8">
          {/* Top text */}
          <p className="font-lato text-[16px] md:text-[18px] lg:text-[20px] font-normal text-black/60 tracking-wide">
            Next Project
          </p>

          {/* Project name */}
          <h2 className="font-lato text-[48px] md:text-[64px] lg:text-[80px] xl:text-[96px] font-bold text-black tracking-tight leading-4 uppercase">
            {name}
          </h2>

          {/* Container */}
          <div className="w-full relative mt-8 md:mt-12 overflow-visible">
            <Link
              href={link}
              className="
                w-full bg-white rounded-t-[30px]
                hover:scale-105 transition-all duration-300 ease-in-out
                cursor-pointer relative overflow-hidden block
              "
              style={linkStyle}
            >
              {/* Wrapper for absolute positioning */}
              <div
                className="absolute left-0 top-0 w-full h-full"
                style={INNER_WRAPPER_STYLE}
              >
                {/* Unified Dynamic Screenshot */}
                <div
                  className="absolute transition-all duration-300"
                  style={imageWrapperStyle}
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={imageSrc}
                      alt={name}
                      fill
                      className="object-contain rounded-t-[30px]"
                    />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}