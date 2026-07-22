"use client";

import Link from "next/link";
import { useCallback, useMemo } from "react";

type IconicCtaProps =
  | {
      label: string;
      href: string;
      onClick?: never;
      type?: never;
      disabled?: boolean;
    }
  | {
      label: string;
      onClick: () => void;
      href?: never;
      type?: "button" | "submit" | "reset";
      disabled?: boolean;
    };

/* ─── Module-level constants (never recreated) ──────────────────────────── */

// Arrow SVG path
const ARROW_PATH_D = "M5 12H19M19 12L12 5M19 12L12 19";

// Stable handler for disabled Link clicks (never recreated)
const preventDefaultHandler = (e: React.MouseEvent<HTMLAnchorElement>) =>
  e.preventDefault();

// Base className fragments — joined once at module load
const CLASS_ROOT_BASE =
  "group bg-white rounded-full flex items-center w-fit transition-colors relative z-10 " +
  "pl-6 pr-6 sm:pl-8 sm:pr-8 md:pl-12 md:pr-[40px] " +
  "py-3 sm:py-3 md:py-4 " +
  "gap-4 sm:gap-6 md:gap-10";

const CLASS_LABEL_BASE =
  "font-lato font-light text-vorlyx-black transition-colors " +
  "text-[28px] sm:text-[36px] md:text-[48px]";

const CLASS_ICON_WRAPPER_BASE =
  "flex items-center justify-center ml-auto mr-[5px] rounded-full bg-vorlyx-black transition-colors " +
  "w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12";

const CLASS_ICON_BASE =
  "transition-colors text-white " +
  "w-5 h-5 sm:w-6 sm:h-6 md:w-[30px] md:h-[30px]";

export default function IconicCtaLink(props: IconicCtaProps) {
  const isDisabled = Boolean(props.disabled);

  // Extract specific fields so useCallback deps are stable (previous version
  // used `[props]` which regenerated the callback on every render — bug fix)
  const onClickProp = "onClick" in props ? props.onClick : undefined;

  const handleClick = useCallback(() => {
    if (onClickProp && !isDisabled) onClickProp();
  }, [onClickProp, isDisabled]);

  // Memoized className strings — only rebuild when isDisabled changes
  const classNames = useMemo(() => {
    return {
      root:
        CLASS_ROOT_BASE +
        (isDisabled
          ? " opacity-50 cursor-not-allowed"
          : " hover:bg-vorlyx-black"),
      label:
        CLASS_LABEL_BASE + (isDisabled ? "" : " group-hover:text-white"),
      iconWrapper:
        CLASS_ICON_WRAPPER_BASE +
        (isDisabled ? "" : " group-hover:bg-white"),
      icon:
        CLASS_ICON_BASE +
        (isDisabled ? "" : " group-hover:text-vorlyx-black"),
    };
  }, [isDisabled]);

  // Memoized content JSX — only rebuild when label or classNames change
  const content = useMemo(
    () => (
      <>
        <span className={classNames.label}>{props.label}</span>

        <div className={classNames.iconWrapper}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className={classNames.icon}
          >
            <path
              d={ARROW_PATH_D}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </>
    ),
    [props.label, classNames]
  );

  return "href" in props ? (
    <Link
      href={props.href as string}
      className={classNames.root}
      aria-disabled={isDisabled}
      tabIndex={isDisabled ? -1 : undefined}
      onClick={isDisabled ? preventDefaultHandler : undefined}
    >
      {content}
    </Link>
  ) : (
    <button
      type={props.type ?? "button"}
      onClick={handleClick}
      className={classNames.root}
      disabled={isDisabled}
    >
      {content}
    </button>
  );
}