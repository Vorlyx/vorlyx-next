"use client";

import { useCallback, useMemo, useState, useEffect } from "react";
import Image from "next/image";
import IconicCtaLink from "@/components/IconicCtaLink";

interface Article {
  id: number;
  date: string;
  headline: string;
  subHeadline: string;
  image: string;
  // Original laptop/desktop transforms
  imagePositionLg?: string;
  imageScaleLg?: number;
  imageOffsetXLg?: number;
  imageOffsetYLg?: number;
  // Specific mobile/tablet transforms
  imagePositionMd?: string;
  imageScaleMd?: number;
  imageOffsetXMd?: number;
  imageOffsetYMd?: number;
}

interface SeeMore {
  label: string;
}

interface NewsGridProps {
  articles: Article[];
  seeMore?: SeeMore;
}

/* ─── Module-level constants ────────────────────────────────────────────── */

const INITIAL_VISIBLE_COUNT = 4;

const MQ_LAPTOP = "(min-width: 1024px)";

// Static border-radius styles for the card and image
const CARD_STYLE: React.CSSProperties = { borderRadius: "50px" };
const IMAGE_WRAPPER_STYLE: React.CSSProperties = { borderRadius: "35px" };

// Responsive image sizes for the Next.js Image component
const IMAGE_SIZES = "(max-width: 768px) 100vw, 842px";

/* ─── Pure helper functions (module-scope, no re-creation) ──────────────── */

// Build a transform string from offset + scale
const buildTransform = (x: number, y: number, scale: number): string =>
  `translate(${x}px, ${y}px) scale(${scale})`;

// Split headline/subheadline text by newlines into an array of lines
const splitByNewline = (text: string): string[] => text.split("\n");

/* ─── Types for pre-computed derived data ───────────────────────────────── */

interface DerivedArticle {
  article: Article;
  headlineLines: string[];
  subHeadlineLines: string[];
  mobileTransform: string;
  mobileObjectPosition: string;
  laptopTransform: string;
  laptopObjectPosition: string;
}

export default function NewsGrid({ articles, seeMore }: NewsGridProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLaptop, setIsLaptop] = useState(false);

  /* ── Laptop breakpoint detection via matchMedia ──────────────────────── */
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const mql = window.matchMedia(MQ_LAPTOP);

    const detect = () => {
      setIsLaptop((prev) => (prev === mql.matches ? prev : mql.matches));
    };

    detect();
    mql.addEventListener("change", detect);

    return () => mql.removeEventListener("change", detect);
  }, []);

  /* ── Pre-compute all per-article derived data ────────────────────────── */
  const derivedArticles = useMemo<DerivedArticle[]>(
    () =>
      articles.map((article) => ({
        article,
        headlineLines: splitByNewline(article.headline),
        subHeadlineLines: splitByNewline(article.subHeadline),
        mobileTransform: buildTransform(
          article.imageOffsetXMd ?? 0,
          article.imageOffsetYMd ?? 0,
          article.imageScaleMd ?? 1
        ),
        mobileObjectPosition: article.imagePositionMd ?? "center",
        laptopTransform: buildTransform(
          article.imageOffsetXLg ?? 0,
          article.imageOffsetYLg ?? 0,
          article.imageScaleLg ?? 1
        ),
        laptopObjectPosition: article.imagePositionLg ?? "center",
      })),
    [articles]
  );

  /* ── Slice for visible articles ──────────────────────────────────────── */
  const visibleArticles = useMemo(
    () =>
      isExpanded ? derivedArticles : derivedArticles.slice(0, INITIAL_VISIBLE_COUNT),
    [derivedArticles, isExpanded]
  );

  /* ── See More button state ───────────────────────────────────────────── */
  const isSeeMoreActive = useMemo(
    () => articles.length > INITIAL_VISIBLE_COUNT && !isExpanded,
    [articles.length, isExpanded]
  );

  const handleSeeMore = useCallback(() => {
    setIsExpanded(true);
  }, []);

  return (
    <section
      id="news-grid-section"
      className="relative w-full max-w-[1920px] mx-auto bg-[#EDEDED] py-16 md:py-24 lg:py-32"
    >
      <div className="w-full max-w-[1920px] mx-auto pt-32 sm:pt-5 px-4 sm:px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-10">
          {visibleArticles.map((d) => {
            const {
              article,
              headlineLines,
              subHeadlineLines,
              mobileTransform,
              mobileObjectPosition,
              laptopTransform,
              laptopObjectPosition,
            } = d;

            // Build the image style — spread mobile defaults, override with laptop values if applicable
            const imageStyle: React.CSSProperties = {
              objectPosition: isLaptop ? laptopObjectPosition : mobileObjectPosition,
              transform: isLaptop ? laptopTransform : mobileTransform,
              transformOrigin: "center center",
            };

            return (
              <div
                key={article.id}
                className="bg-white shadow-sm overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-300 w-full lg:w-[700px] mx-auto h-full"
                style={CARD_STYLE}
              >
                {/* Text */}
                <div className="flex flex-col pt-8 px-6 md:px-8 lg:pt-[60px] lg:px-[50px] lg:h-[430px]">
                  <p className="font-lato text-[14px] sm:text-[16px] md:text-[20px] lg:text-[25px] font-light text-[#000000] mb-6 md:mb-8 uppercase tracking-wide">
                    {article.date}
                  </p>

                  <h3 className="font-lato text-[22px] sm:text-[26px] md:text-[30px] lg:text-[35px] font-normal text-black leading-snug md:leading-[32px] lg:leading-[40px] mb-6 lg:mb-[40px] lg:h-[80px]">
                    {headlineLines.map((line, index, arr) => (
                      <span key={index}>
                        {line}
                        {index < arr.length - 1 && <br />}
                      </span>
                    ))}
                  </h3>

                  <p className="font-lato text-[15px] sm:text-[17px] md:text-[18px] lg:text-[35px] font-light italic text-[#747474] mb-8 lg:mb-10 leading-snug lg:leading-[40px]">
                    {subHeadlineLines.map((line, index, arr) => (
                      <span key={index}>
                        {line}
                        {index < arr.length - 1 && <br />}
                      </span>
                    ))}
                  </p>
                </div>

                {/* Image */}
                <div
                  className="relative overflow-hidden mx-4 md:mx-6 lg:mx-[40px] mb-6 lg:mb-[40px] h-[260px] sm:h-[320px] md:h-[420px] lg:h-[600px] ipadpro:mt-auto"
                  style={IMAGE_WRAPPER_STYLE}
                >
                  <Image
                    src={article.image}
                    alt={article.headline}
                    fill
                    className="object-cover object-center"
                    sizes={IMAGE_SIZES}
                    style={imageStyle}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {seeMore && (
          <div className="flex justify-center mt-12 md:mt-16 lg:mt-20">
            <IconicCtaLink
              label={seeMore.label}
              onClick={handleSeeMore}
              disabled={!isSeeMoreActive}
            />
          </div>
        )}
      </div>
    </section>
  );
}