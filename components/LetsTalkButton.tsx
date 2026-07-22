"use client";

import { useState } from "react";
import Image from "next/image";
import { useLetsTalk } from "@/app/context/LetsTalkContext";
import { useNavbarState } from "@/app/context/NavbarStateContext";

export default function LetsTalkButton() {
  const [isHovered, setIsHovered] = useState(false);
  const { openModal } = useLetsTalk();
  const { isNavbarHidden } = useNavbarState();

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════
          MOBILE / TABLET VERSION (< 1024px)
          Sits under the hamburger button in the top-right corner.
          Always visible, tap-friendly, no hover-expand.
      ═══════════════════════════════════════════════════════════════ */}
      <div
        className="fixed right-4 sm:right-6 z-[60] block lg:hidden"
        style={{
          // Positioned below the hamburger button which lives inside the navbar.
          // Navbar padding-top is 16px (mobile) / 24px (sm+), hamburger is ~24-36px tall,
          // so ~70px puts us cleanly below it with a small gap.
          top: "70px",
        }}
      >
        <button
  onClick={openModal}
  className="flex items-center justify-center bg-[#24B444] active:bg-[#1FA23C] transition-colors duration-200 cursor-pointer shadow-lg"
  style={{
    width: "48px",
    height: "48px",
    borderRadius: "10px",  // ← subtler curve for mobile
  }}
  aria-label="Let's talk"
>
          <Image
            src="/assets/Icon/hand-shake.svg"
            alt=""
            aria-hidden="true"
            width={24}
            height={24}
            className="brightness-0 invert"
          />
        </button>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          DESKTOP VERSION (>= 1024px) — original, untouched
          Hover-to-expand rectangular button.
      ═══════════════════════════════════════════════════════════════ */}
      <div
        className="fixed right-4 md:right-6 lg:right-8 z-[60] hidden lg:block"
        style={{
          // When navbar is visible → button sits BELOW navbar
          // When navbar is hidden → button moves UP into navbar's position
          top: isNavbarHidden ? "24px" : "110px",
          transition: "top 0.5s cubic-bezier(0.65, 0, 0.35, 1)",
        }}
      >
        <button
          onClick={openModal}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative flex items-center justify-end overflow-hidden bg-[#24B444] hover:bg-[#1FA23C] transition-colors duration-300 group cursor-pointer shadow-lg"
          style={{
            height: "56px",
            width: isHovered ? "170px" : "56px",
            borderRadius: "16px",
            transition:
              "width 0.5s cubic-bezier(0.65, 0, 0.35, 1), background-color 0.3s ease",
          }}
          aria-label="Let's talk"
        >
          {/* "Let's talk" text (slides in from left) */}
          <span
            className="font-lato font-light text-white text-[20px] whitespace-nowrap pl-5 pr-2"
            style={{
              opacity: isHovered ? 1 : 0,
              transform: isHovered ? "translateX(0)" : "translateX(15px)",
              transition:
                "opacity 0.3s ease 0.15s, transform 0.4s cubic-bezier(0.65, 0, 0.35, 1) 0.1s",
            }}
          >
            Let&apos;s talk
          </span>

          {/* Hand-shake SVG icon */}
          <span
            className="flex-shrink-0 flex items-center justify-center"
            style={{
              width: "56px",
              height: "56px",
            }}
          >
            <Image
              src="/assets/Icon/hand-shake.svg"
              alt="Hand shake"
              width={30}
              height={30}
              className="brightness-0 invert"
            />
          </span>
        </button>
      </div>
    </>
  );
}