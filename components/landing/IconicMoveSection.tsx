"use client";

import { useMemo } from "react";
import IconicCtaLink from "@/components/IconicCtaLink";
import homeData from "@/data/home.json";

interface IconicMoveSectionProps {
  headline?: string;
  button?: {
    label: string;
    href: string;
  };
}

/* ─── Module-level fallback data (parsed once at load) ──────────────────── */
const FALLBACK_HEADLINE = homeData.section4.iconicMove.headline;
const FALLBACK_BUTTON = homeData.section4.iconicMove.button;

export default function IconicMoveSection({
  headline,
  button,
}: IconicMoveSectionProps) {
  // Only recompute when the specific props change
  const finalHeadline = useMemo(
    () => headline ?? FALLBACK_HEADLINE,
    [headline]
  );

  const finalButton = useMemo(
    () => button ?? FALLBACK_BUTTON,
    [button]
  );

  return (
    <section className="w-full bg-vorlyx-light-gray pt-[180px] pb-[200px]">

      <div className="max-w-[1920px] mx-auto px-6 md:px-16 lg:px-24 flex flex-col items-center text-center gap-16">

        <h2
          className="
          font-lato
          font-extrabold
          uppercase
          text-vorlyx-black
          leading-[0.95]
          text-[55px]
          sm:text-[90px]
          md:text-[120px]
          lg:text-[200px]
          max-w-[1400px]
        "
        >
          {finalHeadline}
        </h2>

        <IconicCtaLink
          label={finalButton.label}
          href={finalButton.href}
        />

      </div>
    </section>
  );
}