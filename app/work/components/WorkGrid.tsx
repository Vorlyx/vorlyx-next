"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";

interface Project {
  id: number;
  image?: string;
  video?: string;
  projectTitle: string;
  technologies: string;
  href?: string;
  x?: number | string;
  y?: number | string;
  w?: number | string;
  h?: number | string;
}

interface WorkGridProps {
  projects: Project[];
}

/* ─── Module-level pure helpers (never recreated) ───────────────────────── */

const preventOrphan = (text: string): string => {
  const words = text.trim().split(" ");
  if (words.length <= 1) return text;
  const last = words.pop();
  return `${words.join(" ")}\u00A0${last}`;
};

const formatValue = (
  val: number | string | undefined,
  defaultVal: string
): string => {
  if (val === undefined) return defaultVal;
  return typeof val === "number" ? `${val}%` : val;
};

/* ─── Module-level style/class constants ────────────────────────────────── */

const IMAGE_SIZES_DEFAULT = "(max-width: 768px) 100vw, 842px";
const IMAGE_SIZES_LAST = "100vw";

const CARD_CLASSNAME_DEFAULT =
  "relative w-full overflow-hidden bg-[#171717] rounded-[32px] group cursor-pointer aspect-[842/500]";
const CARD_CLASSNAME_LAST =
  "relative w-full overflow-hidden bg-[#171717] rounded-[32px] group cursor-pointer aspect-[842/500] md:aspect-auto md:h-[600px]";

/* ─── Types for pre-computed derived data ───────────────────────────────── */

interface DerivedProject {
  project: Project;
  isLastCard: boolean;
  href: string;
  hasVideo: boolean;
  hasImage: boolean;
  videoSrc?: string;
  imageSrc?: string;
  positionStyle: React.CSSProperties;
  cardClassName: string;
  imageSizes: string;
  titleFormatted: string;
  techFormatted: string;
  wrapperClassName: string;
}

export default function WorkGrid({ projects }: WorkGridProps) {
  const derivedProjects = useMemo<DerivedProject[]>(() => {
    return projects.map((project, index) => {
      const isLastCard = index === projects.length - 1;
      const hasVideo = Boolean(project.video && !project.image);
      const hasImage = Boolean(project.image);

      return {
        project,
        isLastCard,
        href: project.href || "/work",
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
        cardClassName: isLastCard
          ? CARD_CLASSNAME_LAST
          : CARD_CLASSNAME_DEFAULT,
        imageSizes: isLastCard ? IMAGE_SIZES_LAST : IMAGE_SIZES_DEFAULT,
        titleFormatted: preventOrphan(project.projectTitle),
        techFormatted: preventOrphan(project.technologies),
        wrapperClassName: `${isLastCard ? "md:col-span-2" : ""} flex flex-col`,
      };
    });
  }, [projects]);

  return (
    <section
      id="work-grid-section"
      className="relative w-full max-w-[1920px] mx-auto bg-[#171717] py-16 md:py-24"
    >
      <div className="w-full max-w-[1920px] mx-auto px-2 md:px-4 lg:px-10">

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8">

          {derivedProjects.map((d) => {
            const {
              project,
              href,
              hasVideo,
              hasImage,
              videoSrc,
              imageSrc,
              positionStyle,
              cardClassName,
              imageSizes,
              titleFormatted,
              techFormatted,
              wrapperClassName,
            } = d;

            return (
              <div
                key={project.id}
                className={wrapperClassName}
              >

                <Link href={href} className="block">

                  {/* CARD */}
                  <div
                    className={cardClassName}
                  >

                    {/* MEDIA WRAPPER */}
                    <div className="relative w-full h-full overflow-hidden rounded-[32px]">

                      {/* POSITION CONTROL */}
                      <div
                        className="absolute"
                        style={positionStyle}
                      >

                        {hasVideo && videoSrc ? (
                          <video
                            src={videoSrc}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                          />
                        ) : hasImage && imageSrc ? (
                          <Image
                            src={imageSrc}
                            alt={project.projectTitle}
                            fill
                            className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                            sizes={imageSizes}
                          />
                        ) : null}

                      </div>
                    </div>
                  </div>

                </Link>

                {/* PROJECT INFO */}
                <div className="mt-2">

                  <Link
                    href={href}
                    className="block hover:opacity-80 transition-opacity"
                  >

                    {/* 🔥 apply orphan protection here */}
                    <h3 className="font-lato text-[18px] sm:text-[24px] md:text-[28px] font-bold text-[#e5e5e5] leading-tight mb-1">
                      {titleFormatted}
                    </h3>

                    <p className="font-lato text-[14px] sm:text-[18px] md:text-[22px] text-[#9e9e9e] leading-tight">
                      {techFormatted}
                    </p>

                  </Link>

                </div>

              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}