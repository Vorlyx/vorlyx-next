"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";

interface EclavieHeroProps {
  title: string;
  media: string;
}

/* ─── Module-level constants ────────────────────────────────────────────── */

const VIDEO_EXTENSIONS = [".mp4", ".webm"] as const;

const MEDIA_CLASS_BASE =
  "w-full h-auto md:h-full object-contain md:object-cover transition-opacity duration-500";

const MEDIA_CLASS_VISIBLE = `${MEDIA_CLASS_BASE} opacity-100`;
const MEDIA_CLASS_HIDDEN = `${MEDIA_CLASS_BASE} opacity-0`;

export default function EclavieHero({ title, media }: EclavieHeroProps) {
  const [mediaLoaded, setMediaLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Memoized derivations — only recompute when `media` changes
  const isVideo = useMemo(
    () => VIDEO_EXTENSIONS.some((ext) => media?.endsWith(ext)),
    [media]
  );
  const isGif = useMemo(() => media?.endsWith(".gif") ?? false, [media]);

  // Pick className based on load state (no template rebuild)
  const mediaClassName = mediaLoaded ? MEDIA_CLASS_VISIBLE : MEDIA_CLASS_HIDDEN;

  useEffect(() => {
    queueMicrotask(() => setMediaLoaded(false));

    if (!isVideo) return;

    const v = videoRef.current;
    if (!v) return;

    const onLoaded = () => setMediaLoaded(true);
    v.addEventListener("loadeddata", onLoaded);

    if (v.readyState >= 2) setMediaLoaded(true);

    return () => v.removeEventListener("loadeddata", onLoaded);
  }, [media, isVideo]);

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
      {/* ---------- Background Media ---------- */}
      {media && (
        <div className="relative md:absolute inset-0 w-full h-auto md:h-full z-0">
          {isGif ? (
            <Image
              src={media}
              alt="Eclavie Hero"
              width={1920}
              height={1080}
              priority
              unoptimized
              onLoad={() => setMediaLoaded(true)}
              className={mediaClassName}
            />
          ) : isVideo ? (
            <video
              ref={videoRef}
              src={media}
              autoPlay
              muted
              loop
              playsInline
              className={mediaClassName}
            />
          ) : (
            <Image
              src={media}
              alt="Eclavie Hero"
              width={1920}
              height={1080}
              priority
              onLoad={() => setMediaLoaded(true)}
              className={mediaClassName}
            />
          )}
        </div>
      )}

      {/* ---------- Title Overlay ---------- */}
      <div className="absolute bottom-0 left-0 z-10 px-8 md:px-16 lg:px-24 pb-8 md:pb-12 lg:pb-16">
        <h1 className="font-lato text-[42px] sm:text-[52px] md:text-[80px] lg:text-[100px] xl:text-[100px] font-bold text-white uppercase tracking-tight leading-none">
          {title}
        </h1>
      </div>
    </section>
  );
}