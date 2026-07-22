"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { useNavbarState } from "@/app/context/NavbarStateContext";

interface HeaderProps {
  logo: string;
  links: Array<{ label: string; href: string }>;
}

// Derives the hero section element ID from the current pathname
function getHeroSection(pathname: string): HTMLElement | null {
  const candidates: string[] = [];

  if (pathname === "/") {
    candidates.push("hero-section");
  } else {
    const segment = pathname.split("/")[1];
    if (segment) candidates.push(`${segment}-hero-section`);
  }

  // Universal fallbacks
  candidates.push(
    "hero-section",
    "work-hero-section",
    "services-hero-section",
    "news-hero-section",
    "contact-hero-section",
    "agency-hero-section"
  );

  for (const id of candidates) {
    const el = document.getElementById(id);
    if (el) return el;
  }

  return null;
}

export default function Header({ logo, links }: HeaderProps) {
  const pathname = usePathname();
  const { activeSection } = useAppSelector((state) => state.navigation);

  const [bgOpacity, setBgOpacity] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { isNavbarHidden, setIsNavbarHidden } = useNavbarState();

  const prevPathnameRef = useRef<string | null>(null);

  /* ── Derived page flags ────────────────────────────────────────────────── */

  // Any /work/[slug] route — scales automatically with new projects
  const isProjectDetailPage = /^\/work\/.+/.test(pathname);

  const isLightPage =
    !isProjectDetailPage &&
    ["/work", "/agency", "/services", "/contact", "/news"].includes(pathname);

  /* ── Lock body scroll when mobile menu is open ─────────────────────────── */
  useEffect(() => {
    const locked = mobileOpen;
    document.body.style.overflow = locked ? "hidden" : "";
    document.documentElement.style.overflow = locked ? "hidden" : "";
    document.body.style.touchAction = locked ? "none" : "";

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [mobileOpen]);

  /* ── Close mobile menu on route change ─────────────────────────────────── */
  useEffect(() => {
    if (
      prevPathnameRef.current !== null &&
      prevPathnameRef.current !== pathname
    ) {
      setMobileOpen(false);
    }
    prevPathnameRef.current = pathname;
  }, [pathname]);

  /* ── Scroll-based background opacity ───────────────────────────────────── */
  useEffect(() => {
    const getThreshold = () => window.innerHeight * 0.8;

    const handleScroll = () => {
      const threshold = getThreshold();
      const ratio = Math.min(window.scrollY / threshold, 1);
      setBgOpacity(ratio);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  /* ── Hero IntersectionObserver (hide/show navbar) ──────────────────────── */
  const handleNavbarVisibility = useCallback(
    (hidden: boolean) => {
      const navbar = document.getElementById("navbar");
      if (!navbar) return;
      navbar.classList.toggle("navbar-hidden", hidden);
      setIsNavbarHidden(hidden);
    },
    [setIsNavbarHidden]
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    let observer: IntersectionObserver | null = null;
    let rafId = 0;
    let cancelled = false;
    let attempts = 0;
    const MAX_ATTEMPTS = 120;

    const setupObserver = () => {
      if (cancelled) return;

      const section = getHeroSection(pathname);

      if (!section) {
        if (++attempts < MAX_ATTEMPTS) {
          rafId = requestAnimationFrame(setupObserver);
        }
        return;
      }

      observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry) return;
          requestAnimationFrame(() => {
            // Always show navbar on mobile
            if (window.innerWidth < 768) {
              handleNavbarVisibility(false);
              return;
            }
            handleNavbarVisibility(!entry.isIntersecting);
          });
        },
        { root: null, rootMargin: "-1px 0px 0px 0px", threshold: 0.01 }
      );

      observer.observe(section);
    };

    setupObserver();

    const handleResize = () => {
      if (window.innerWidth < 768) handleNavbarVisibility(false);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelled = true;
      if (rafId) cancelAnimationFrame(rafId);
      observer?.disconnect();
      window.removeEventListener("resize", handleResize);
      handleNavbarVisibility(false);
    };
  }, [pathname, handleNavbarVisibility]);

  /* ── Derived styles ────────────────────────────────────────────────────── */
  const backgroundColor = isLightPage
    ? "#EDEDED"
    : `rgba(0,0,0,${bgOpacity})`;

  const linkTextColor = isLightPage ? "text-black" : "text-white";

  return (
    <>
      <header
        id="navbar"
        className="navbar fixed top-0 left-0 right-0 z-50"
        style={{
          backgroundColor,
          pointerEvents: isNavbarHidden ? "none" : "auto",
        }}
      >
        <div className="w-full max-w-[1920px] mx-auto px-4 md:px-8 py-4 md:py-6 flex items-center justify-between">
          {/* LOGO */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src={logo}
              alt="Vorlyx Logo"
              width={298}
              height={74}
              className={`h-9 sm:h-12 ipadpro:h-12 lg:h-16 xl:h-16 w-auto ${
                !isLightPage ? "brightness-0 invert" : ""
              }`}
              priority
            />
          </Link>

          {/* RIGHT SIDE: NAV + HAMBURGER */}
          <div className="flex items-center gap-4 lg:gap-6">
            {/* DESKTOP NAV */}
            <nav className="hidden lg:flex items-center gap-4 lg:gap-8">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    font-lato text-sm lg:text-[25px] xl:text-[25px] font-bold
                    ${linkTextColor} uppercase tracking-wide
                    hover:opacity-80 transition-opacity
                    ${activeSection === link.label.toLowerCase() ? "opacity-100" : ""}
                  `}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* MOBILE HAMBURGER */}
            <button
              className="lg:hidden z-50"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  isLightPage
                    ? "/assets/Icon/Hamburger.svg"
                    : "/assets/Icon/Hamburger_White.svg"
                }
                alt=""
                aria-hidden="true"
                className="h-6 w-6 sm:h-9 sm:w-9 ipadpro:h-9 ipadpro:w-9"
              />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE OVERLAY */}
      <div
        role="presentation"
        onClick={() => setMobileOpen(false)}
        className={`
          fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 lg:hidden
          ${mobileOpen ? "opacity-100 visible" : "opacity-0 invisible"}
        `}
      />

      {/* MOBILE SLIDE MENU */}
      <div
        className={`
          fixed top-0 right-0 h-full w-[85%] max-w-[380px] bg-black z-50
          transform transition-transform duration-500 lg:hidden
          ${mobileOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-8 right-8 z-50"
          aria-label="Close navigation menu"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/Icon/Cross_White.svg"
            alt=""
            aria-hidden="true"
            className="h-5 w-5 sm:h-7 sm:w-7 ipadpro:h-7 ipadpro:w-7"
          />
        </button>

        <nav className="flex flex-col px-10 pt-32 gap-12 overflow-visible">
          {links.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              style={{ transitionDelay: `${i * 80}ms` }}
              className={`
                group relative inline-block text-3xl font-bold uppercase tracking-wide
                transform transition-all duration-500 overflow-visible
                ${mobileOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6"}
              `}
            >
              {/* Hover background pill */}
              <span
                aria-hidden="true"
                className="
                  absolute inset-y-0 bg-white rounded-full
                  opacity-0 group-hover:opacity-100
                  transition-all duration-300 z-0
                "
                style={{ left: "-50px", right: "-50px" }}
              />
              <span className="relative z-10 text-white transition-colors duration-300 group-hover:text-black">
                {link.label}
              </span>
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}