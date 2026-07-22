"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

interface FooterProps {
  logo: string;
  followUs: {
    title: string;
    links: Array<{ label: string; href: string }>;
  };
  emailUs: {
    title: string;
    links: Array<{ label: string; href: string }>;
  };
  newsletter: {
    text: string;
    placeholder: string;
  };
  navLinks: Array<{ label: string; href: string; hoverSpacing?: number }>;
  copyright: string;
}

// Default spacing per nav link index — keep co-located with component
const DEFAULT_HOVER_SPACINGS = [500, 450, 419, 413] as const;

type SubmitStatus = "idle" | "loading" | "success" | "error";

// ─────────────────────────────────────────────────────────────────────────
// 🚧 NEWSLETTER FEATURE FLAG
// Set to `true` when the newsletter backend (Resend / ConvertKit / etc.)
// is fully wired up. When `false`, the newsletter signup form is hidden
// from the footer while keeping all its code intact for easy re-enabling.
// ─────────────────────────────────────────────────────────────────────────
const NEWSLETTER_ENABLED = false;

// Toast auto-dismiss delay
const TOAST_DURATION_MS = 2500;

// Extract the raw email address from a "mailto:foo@bar.com" href
const extractEmailFromMailto = (href: string): string | null => {
  if (!href.startsWith("mailto:")) return null;
  // Strip "mailto:" prefix and any query string (e.g. ?subject=...)
  return href.slice(7).split("?")[0];
};

export default function Footer({
  logo,
  followUs,
  emailUs,
  newsletter,
  navLinks,
  copyright,
}: FooterProps) {
  const [email, setEmail] = useState("");
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus("loading");

    try {
      // Replace with your actual newsletter API call
      await new Promise((resolve) => setTimeout(resolve, 800)); // simulate request
      setSubmitStatus("success");
      setEmail("");
    } catch {
      setSubmitStatus("error");
    } finally {
      // Reset status after 3 seconds
      setTimeout(() => setSubmitStatus("idle"), 3000);
    }
  };

  // Handler for email link clicks — copies to clipboard AND allows mailto: to fire
  const handleEmailClick = useCallback(
    (href: string) => async () => {
      const emailAddress = extractEmailFromMailto(href);
      if (!emailAddress) return;

      // Try to copy to clipboard. Don't block the mailto: navigation if this fails.
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(emailAddress);
          setCopiedEmail(emailAddress);

          window.setTimeout(() => {
            setCopiedEmail((current) =>
              current === emailAddress ? null : current
            );
          }, TOAST_DURATION_MS);
        }
      } catch {
        // Silently ignore clipboard errors — mailto: still fires
      }
      // Do NOT preventDefault — let mailto: open the user's mail client
    },
    []
  );

  return (
    <footer
      id="footer-section"
      className="w-full bg-black pt-6 pb-4 relative overflow-hidden"
    >
      <div className="w-full max-w-[1920px] mx-auto px-4 md:px-8 overflow-visible">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 sm:gap-4 lg:gap-16 sm:items-end lg:items-start">

          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-6 mt-0 min-w-0">
            <div className="flex flex-col gap-6">

              {/* FOLLOW US */}
              <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 lg:gap-12">
                <h3 className="font-lato text-[16px] sm:text-[18px] md:text-[21px] font-black text-vorlyx-text-gray uppercase whitespace-nowrap">
                  {followUs.title}
                </h3>
                <div className="flex flex-wrap lg:flex-nowrap items-center gap-4 md:gap-4 lg:gap-8">
                  {followUs.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-lato text-[18px] sm:text-[20px] md:text-[20px] lg:text-[25px] text-[#d8d8d8] hover:opacity-80 transition-opacity"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* EMAIL US */}
              <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 lg:gap-12">
                <h3 className="font-lato text-[16px] sm:text-[18px] md:text-[21px] font-black text-vorlyx-text-gray uppercase whitespace-nowrap">
                  {emailUs.title}
                </h3>
                <div className="flex flex-wrap lg:flex-nowrap items-center gap-4 md:gap-4 lg:gap-8">
                  {emailUs.links.map((link) => {
                    const emailAddress = extractEmailFromMailto(link.href);
                    const isCopied =
                      emailAddress !== null && copiedEmail === emailAddress;

                    return (
                      <span
                        key={link.href}
                        className="relative inline-block"
                      >
                        <a
                          href={link.href}
                          onClick={handleEmailClick(link.href)}
                          className="font-lato text-[18px] sm:text-[20px] md:text-[20px] lg:text-[25px] text-[#d8d8d8] hover:opacity-80 transition-opacity"
                        >
                          {link.label}
                        </a>

                        {isCopied && (
                          <span
                            role="status"
                            aria-live="polite"
                            className="absolute -top-6 left-0 font-lato text-[12px] text-green-400 whitespace-nowrap"
                          >
                            ✓ Copied
                          </span>
                        )}
                      </span>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* ─────────────────────────────────────────────────────────
                NEWSLETTER — hidden while NEWSLETTER_ENABLED === false
                See flag definition near top of file for how to re-enable
                ───────────────────────────────────────────────────────── */}
            {NEWSLETTER_ENABLED && (
              <div className="flex flex-row md:flex-row md:items-center gap-4 lg:gap-6 mt-2 md:mt-[40px] lg:mt-14">
                <p className="font-lato text-[20px] sm:text-[22px] md:text-[20px] lg:text-[25px] text-[#d8d8d8] leading-tight shrink-0">
                  Sign up for <br />
                  new stories
                </p>

                <form
                  onSubmit={handleSubmit}
                  className="relative w-[220px] sm:w-[300px] md:w-[240px] lg:w-[420px] max-w-full"
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={newsletter.placeholder}
                    required
                    disabled={submitStatus === "loading"}
                    aria-label="Email address for newsletter"
                    className="
                      w-full rounded-full outline-none font-lato
                      bg-[#333333] pl-4 pr-[45px] py-2.5 text-[14px] text-white placeholder-gray-400
                      sm:bg-[#4A4A4A] sm:pl-6 md:pl-6 sm:pr-[60px] sm:py-3 md:py-3 lg:py-3
                      sm:text-[20px] md:text-[18px] lg:text-[24px]
                      sm:text-[#c3c3c3] sm:placeholder-[#c3c3c3]
                      disabled:opacity-60 transition-opacity
                    "
                  />

                  <button
                    type="submit"
                    disabled={submitStatus === "loading"}
                    aria-label="Subscribe to newsletter"
                    className="
                      absolute top-1/2 -translate-y-1/2 rounded-full flex items-center justify-center
                      right-[8px] w-8 h-8 bg-[#666666] -translate-y-[65%]
                      sm:right-[16px] sm:w-10 sm:h-10 sm:bg-[#666666] sm:-translate-y-1/2
                      disabled:opacity-60 transition-opacity
                    "
                  >
                    {submitStatus === "loading" ? (
                      // Simple spinner
                      <svg
                        className="w-4 h-4 sm:w-6 sm:h-6 animate-spin text-white"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8z"
                        />
                      </svg>
                    ) : (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="w-4 h-4 sm:w-6 sm:h-6 text-white sm:text-[#acacac]"
                      >
                        <path
                          d="M5 12H19M19 12L12 5M19 12L12 19"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </button>

                  {/* Submission feedback */}
                  {submitStatus === "success" && (
                    <p className="absolute -bottom-6 left-2 text-green-400 text-xs font-lato">
                      Thank you for subscribing!
                    </p>
                  )}
                  {submitStatus === "error" && (
                    <p className="absolute -bottom-6 left-2 text-red-400 text-xs font-lato">
                      Something went wrong. Please try again.
                    </p>
                  )}
                </form>
              </div>
            )}
          </div>

          {/* RIGHT NAV */}
          <div className="hidden sm:flex flex-col items-end w-full shrink-0 min-w-[200px] lg:min-w-0">
            {navLinks.map((link, index) => {
              const spacing =
                link.hoverSpacing ??
                DEFAULT_HOVER_SPACINGS[index] ??
                500;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative font-lato font-extrabold text-white uppercase leading-tight text-[45px] md:text-[45px] lg:text-[60px] group"
                >
                  {/* Desktop hover background */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-y-0 bg-white rounded opacity-0 group-hover:opacity-100 transition-all duration-300 hidden lg:block"
                    style={{ left: `-${spacing}px`, right: "-32px" }}
                  />

                  {/* Desktop "View" label */}
                  <span
                    aria-hidden="true"
                    className="absolute left-0 text-white group-hover:text-black transition-colors duration-300 opacity-0 hidden lg:block"
                    style={{ transform: `translateX(-${spacing}px)` }}
                  >
                    View
                  </span>

                  {/* Link text */}
                  <span className="relative z-10 lg:group-hover:text-black transition-colors duration-300">
                    {link.label}
                  </span>
                </Link>
              );
            })}
          </div>

        </div>

        {/* LOGO */}
        <div className="flex justify-center mt-12 md:mt-8 lg:mt-12">
          <Image
            src={logo}
            alt="Vorlyx"
            width={1989}
            height={465}
            className="w-full max-w-full h-auto"
          />
        </div>

        {/* COPYRIGHT */}
        <div className="mt-4 ml-0 md:ml-[90px] lg:ml-[230px]">
          <p className="font-lato text-[14px] sm:text-[16px] text-[#717171]">
            {copyright}
          </p>
        </div>

      </div>
    </footer>
  );
}