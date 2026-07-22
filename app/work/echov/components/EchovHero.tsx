"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";

interface EchovHeroProps {
  title: string;
  media: string;
}

/* ─── Module-level constants ────────────────────────────────────────────── */

// Manual controls for how the video sits inside the hero container
// Values are percentages of the container width/height for easy adjustment
const ECHOV_HERO_VIDEO_X = -30; // 0 = left edge, 50 = center, 100 = right edge
const ECHOV_HERO_VIDEO_Y = -20; // 0 = top edge, 50 = center, 100 = bottom edge
const ECHOV_HERO_VIDEO_W = 161; // width of the video box within container (%)
const ECHOV_HERO_VIDEO_H = 161; // height of the video box within container (%)

// Pre-built style object for the video positioning box (never recreated)
const VIDEO_BOX_STYLE: React.CSSProperties = {
  left: `${ECHOV_HERO_VIDEO_X}%`,
  top: `${ECHOV_HERO_VIDEO_Y}%`,
  width: `${ECHOV_HERO_VIDEO_W}%`,
  height: `${ECHOV_HERO_VIDEO_H}%`,
};

// Static video style — border/outline reset
const VIDEO_STYLE_BASE: React.CSSProperties = {
  border: "none",
  outline: "none",
};

/**
 * Echov Hero Section component
 * Full-width image/video background with "ECHOV" text overlay
 * Height: Responsive, switching to fixed heights on larger screens to maintain legacy behavior.
 * Background: Dark (image/video)
 * Text: White (#FFFFFF), Lato Extra Bold/Black
 */
export default function EchovHero({ title, media }: EchovHeroProps) {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Memoized derivations — only recompute when `media` changes
  const isVideo = useMemo(
    () => Boolean(media && (media.includes(".mp4") || media.includes(".webm"))),
    [media]
  );
  const isGif = useMemo(() => Boolean(media && media.includes(".gif")), [media]);

  // Combined video style — recompute only when videoLoaded changes
  const videoStyle = useMemo<React.CSSProperties>(
    () => ({
      ...VIDEO_STYLE_BASE,
      opacity: videoLoaded ? 1 : 0,
    }),
    [videoLoaded]
  );

  useEffect(() => {
    // Handle video loading for non-GIF files
    const currentVideo = videoRef.current;
    if (currentVideo && media && !media.includes(".gif")) {
      const handleLoadedData = () => {
        setVideoLoaded(true);
      };
      currentVideo.addEventListener("loadeddata", handleLoadedData);

      if (currentVideo.readyState >= 2) {
        setVideoLoaded(true);
      }

      return () => {
        if (currentVideo) {
          currentVideo.removeEventListener("loadeddata", handleLoadedData);
        }
      };
    } else if (media && media.includes(".gif")) {
      // GIF loads asynchronously to avoid the ESLint warning
      queueMicrotask(() => setVideoLoaded(true));
    }
  }, [media]);

  return (
    <section
      id="hero-section"
      className="
        relative
        w-full
        max-w-[1920px]
        mx-auto
        min-h-[350px]         /* 👈 ADDED: Minimum height for mobile visibility */
        h-auto               /* 👈 MODIFIED: Mobile is now responsive height */
        md:h-[680px]         /* 👈 MODIFIED: Eclavie structure height */
        lg:h-[753px]         /* 👈 MODIFIED: Matches old fixed height on large screens */
        bg-[#171717]
        overflow-hidden
      "
    >
      {/* Background Media */}
      {media && (
        <div className="absolute inset-0 w-full h-full z-0">
          {/* Flexible X/Y/W/H box: same for video and image */}
          <div className="absolute" style={VIDEO_BOX_STYLE}>
            <div className="relative w-full h-full">
              {isGif ? (
                <Image
                  src={media}
                  alt="Echov hero background"
                  fill
                  className="object-contain"
                  unoptimized
                  priority
                />
              ) : isVideo ? (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-contain opacity-0 transition-opacity duration-500 border-0 outline-none"
                    style={videoStyle}
                  >
                    <source src={media} type="video/mp4" />
                    <source src={media} type="video/webm" />
                  </video>
                  {!videoLoaded && (
                    <div className="absolute inset-0 bg-[#171717]" />
                  )}
                </>
              ) : (
                <Image
                  src={media}
                  alt="Echov hero background"
                  fill
                  className="object-contain"
                  priority
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Title Overlay - Bottom Left */}
      <div className="absolute bottom-0 left-0 z-10 px-8 md:px-16 lg:px-24 pb-8 md:pb-12 lg:pb-16">
        <h1 className="font-lato text-[42px] sm:text-[52px] md:text-[80px] lg:text-[100px] xl:text-[100px] font-bold text-white uppercase tracking-tight leading-none">
          {title}
        </h1>
      </div>
    </section>
  );
}