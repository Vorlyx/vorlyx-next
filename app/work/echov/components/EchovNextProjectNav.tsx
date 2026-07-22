"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useMemo } from "react";

interface EchovNextProjectNavProps {
  name: string;
  link: string;
  image: string;

  // Desktop
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  heightPx?: number;

  // Mobile (<768)
  mx?: number;
  my?: number;
  mw?: number;
  mh?: number;
  mheightPx?: number;

  // iPad Mini & Air (768–1023)
  ax?: number;
  ay?: number;
  aw?: number;
  ah?: number;
  aheightPx?: number;

  // iPad Pro (1024–1366)
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

// Responsive image sizes for the next-project preview (spans full container)
const NEXT_PROJECT_IMAGE_SIZES =
  "(max-width: 767px) 100vw, (max-width: 1366px) 90vw, 1920px";

export default function EchovNextProjectNav({
  name,
  link,
  image,

  // Desktop defaults
  x = 0,
  y = -250,
  w = 100,
  h = 700,
  heightPx = 260,

  // Mobile defaults
  mx = 0,
  my = -130,
  mw = 100,
  mh = 360,
  mheightPx = 140,

  // iPad Mini / Air defaults
  ax = 0,
  ay = -180,
  aw = 100,
  ah = 500,
  aheightPx = 180,

  // iPad Pro defaults
  px = 0,
  py = -230,
  pw = 100,
  ph = 600,
  pheightPx = 220,
}: EchovNextProjectNavProps) {
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

  /* ── Active layout values — memoized against device + props ──────────── */
  const { activeX, activeY, activeW, activeH, activeHeightPx } = useMemo(() => {
    const { isMobile, isIpadMiniAir, isIpadPro } = device;
    return {
      activeX: isMobile ? mx : isIpadMiniAir ? ax : isIpadPro ? px : x,
      activeY: isMobile ? my : isIpadMiniAir ? ay : isIpadPro ? py : y,
      activeW: isMobile ? mw : isIpadMiniAir ? aw : isIpadPro ? pw : w,
      activeH: isMobile ? mh : isIpadMiniAir ? ah : isIpadPro ? ph : h,
      activeHeightPx: isMobile
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
      height: `${activeHeightPx}px`,
      marginBottom: "-30px",
    }),
    [activeHeightPx]
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

          {/* Label */}
          <p className="font-lato text-[16px] md:text-[18px] lg:text-[20px] font-normal text-black/60 tracking-wide">
            Next Project
          </p>

          {/* Project Name */}
          <h2 className="font-lato text-[48px] md:text-[64px] lg:text-[80px] xl:text-[96px] font-bold text-black tracking-tight leading-4 uppercase">
            {name}
          </h2>

          {/* Container */}
          <div className="w-full relative mt-8 md:mt-12 overflow-visible">
            <Link
              href={link}
              className="
                w-full bg-white rounded-t-[30px]
                hover:scale-105 transition-transform duration-300 ease-in-out
                cursor-pointer relative overflow-hidden block
              "
              style={linkStyle}
            >
              <div className="absolute left-0 top-0 w-full h-full">

                <div
                  className="absolute w-full h-full transition-all duration-300"
                  style={imageWrapperStyle}
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={image}
                      alt={name}
                      fill
                      sizes={NEXT_PROJECT_IMAGE_SIZES}
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