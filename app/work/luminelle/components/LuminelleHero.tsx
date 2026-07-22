"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";

interface LuminelleHeroProps {
  title: string;
  media: string;
}

/* ─── Module-level constants ────────────────────────────────────────────── */

const VIDEO_EXTENSIONS = [".mp4", ".webm"] as const;

const MEDIA_CLASS_BASE =
  "w-full h-auto md:h-full object-contain md:object-cover transition-opacity duration-500";

const MEDIA_CLASS_VISIBLE = `${MEDIA_CLASS_BASE} opacity-100`;
const MEDIA_CLASS_HIDDEN = `${MEDIA_CLASS_BASE} opacity-0`;

export default function LuminelleHero({ title, media }: LuminelleHeroProps) {
  const [mediaLoaded, setMediaLoaded] = useState(false);

  // Detect if media is video — only recompute when `media` prop changes
  const isVideo = useMemo(
    () => VIDEO_EXTENSIONS.some((ext) => media?.endsWith(ext)),
    [media]
  );

  // Pick the correct className based on load state (no template rebuild)
  const mediaClassName = mediaLoaded ? MEDIA_CLASS_VISIBLE : MEDIA_CLASS_HIDDEN;

  // Reset loading state when media changes
  useEffect(() => {
    queueMicrotask(() => {
      setMediaLoaded(false);
    });
  }, [media]);

  return (
    <section
      id="hero-section"
      className="
        relative
        w-full
        max-w-[1920px]
        mx-auto
        h-auto
        md:h-[680px]
        lg:h-[753px]
        bg-[#171717]
        overflow-hidden
      "
    >
      {/* ---------------- Media Background ---------------- */}
      {/* 
         Mobile:
         - Height follows the media (h-auto)
         - object-contain shows the full image/video without cropping

         Tablet/Desktop:
         - Fixed hero height
         - object-cover fills the hero section
      */}
      {media && (
        <div className="relative md:absolute inset-0 w-full h-auto md:h-full z-0">
          {isVideo ? (
            <video
              src={media}
              autoPlay
              muted
              loop
              playsInline
              onLoadedData={() => setMediaLoaded(true)}
              className={mediaClassName}
            />
          ) : (
            <Image
              src={media}
              alt="Luminelle Hero"
              width={1920}
              height={1080}
              priority
              onLoad={() => setMediaLoaded(true)}
              className={mediaClassName}
            />
          )}
        </div>
      )}

      {/* ---------------- Title Overlay ---------------- */}
      {/* 
         Title stays bottom-left exactly like other hero sections
         Responsive typography preserved
      */}
      <div className="absolute bottom-0 left-0 z-10 px-8 md:px-16 lg:px-24 pb-8 md:pb-12 lg:pb-16">
        <h1 className="font-lato text-[42px] sm:text-[52px] md:text-[80px] lg:text-[100px] xl:text-[100px] font-bold text-white uppercase tracking-tight leading-none">
          {title}
        </h1>
      </div>
    </section>
  );
}