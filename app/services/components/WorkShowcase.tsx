"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";

interface Project {
  title: string;
  subtitle: string;
  image?: string;
  video?: string;
  href?: string;
  x?: number | string;
  y?: number | string;
  w?: number | string;
  h?: number | string;
}

interface WorkShowcaseProps {
  title: string;
  projects: Project[];
}

/* ─── Module-level pure helpers ─────────────────────────────────────────── */

const preventOrphan = (text: string): string => {
  const words = text.trim().split(" ");
  if (words.length <= 1) return text;
  const lastWord = words.pop();
  return `${words.join(" ")}\u00A0${lastWord}`;
};

const formatValue = (
  val: number | string | undefined,
  defaultVal: string
): string => {
  if (val === undefined) return defaultVal;
  return typeof val === "number" ? `${val}%` : val;
};

/* ─── Module-level static values ────────────────────────────────────────── */

const SECTION_STYLE: React.CSSProperties = {
  paddingTop: "clamp(40px, 6vw, 80px)",
};

const IMAGE_SIZES =
  "(max-width: 640px) 300px, (max-width: 768px) 400px, (max-width: 1024px) 500px, 600px";

/* ─── Types for pre-computed derived data ───────────────────────────────── */

interface DerivedProject {
  project: Project;
  href: string;
  hasVideo: boolean;
  hasImage: boolean;
  videoSrc?: string;
  imageSrc?: string;
  positionStyle: React.CSSProperties;
  titleFormatted: string;
  subtitleFormatted: string;
}

export default function WorkShowcase({ title, projects }: WorkShowcaseProps) {
  const [isHovering, setIsHovering] = useState(false);

  // Pre-compute all per-project derived data — memoized against projects
  const derivedProjects = useMemo<DerivedProject[]>(() => {
    return projects.map((project) => {
      const hasVideo = Boolean(project.video && !project.image);
      const hasImage = Boolean(project.image);

      return {
        project,
        href: project.href ?? "/work",
        hasVideo,
        hasImage,
        videoSrc: hasVideo ? project.video : undefined,
        imageSrc: hasImage ? project.image : undefined,
        positionStyle: {
          left: formatValue(project.x, "0%"),
          top: formatValue(project.y, "0%"),
          width: formatValue(project.w, "100%"),
          height: formatValue(project.h, "100%"),
        },
        titleFormatted: preventOrphan(project.title),
        subtitleFormatted: preventOrphan(project.subtitle),
      };
    });
  }, [projects]);

  // Duplicate array for infinite marquee — memoized
  const marqueeItems = useMemo(
    () => [...derivedProjects, ...derivedProjects],
    [derivedProjects]
  );

  // Marquee container className
  const marqueeClassName = `horizontal-cards horizontal-cards-marquee work-showcase-marquee ${
    isHovering ? "work-showcase-marquee-paused" : ""
  }`;

  return (
    <section
      id="work-showcase-section"
      className="
        relative z-20
        w-full
        bg-[#EDEDED]
        pb-12 md:pb-16 lg:pb-24
        mt-0
      "
      style={SECTION_STYLE}
    >
      <div className="container w-full">
        {/* Section Title */}
        <div className="px-8 md:px-16 lg:px-24 mb-10 md:mb-14 lg:mb-20">
          <h2 className="font-lato text-[32px] md:text-[48px] lg:text-[60px] font-bold text-black uppercase">
            {title}
          </h2>
        </div>
      </div>

      {/* Horizontal Moving Cards */}
      <div className="relative w-screen ml-[calc(50%-50vw)] overflow-hidden">
        <div className={marqueeClassName}>
          {marqueeItems.map((d, index) => {
            const {
              project,
              href,
              hasVideo,
              hasImage,
              videoSrc,
              imageSrc,
              positionStyle,
              titleFormatted,
              subtitleFormatted,
            } = d;

            return (
              <Link
                key={`project-${index}`}
                href={href}
                className="card block hover:opacity-95 transition-opacity"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                {/* Media Container */}
                <div className="rounded-[25px] overflow-hidden bg-[#D9D9D9]">
                  <div className="relative w-full aspect-[842/500] overflow-hidden">
                    <div className="absolute" style={positionStyle}>
                      {hasVideo && videoSrc ? (
                        <video
                          src={videoSrc}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="w-full h-full object-cover"
                        />
                      ) : hasImage && imageSrc ? (
                        <Image
                          src={imageSrc}
                          alt={project.title}
                          fill
                          className="object-cover"
                          sizes={IMAGE_SIZES}
                        />
                      ) : null}
                    </div>
                  </div>
                </div>

                {/* Text */}
                <div className="mt-6">
                  <h3 className="font-lato text-[20px] sm:text-[25px] md:text-[35px] lg:text-[35px] font-bold text-black leading-[1.05]">
                    {titleFormatted}
                  </h3>
                  <p className="mt-2 font-lato text-[18px] sm:text-[20px] md:text-[24px] lg:text-[25px] font-normal text-black/70 leading-tight">
                    {subtitleFormatted}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}