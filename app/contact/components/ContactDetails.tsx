"use client";

import { useState, useCallback } from "react";

interface ContactDetailsProps {
  businessEmail: string;
  jobsEmail: string;
}

/* ─── Module-level constants ────────────────────────────────────────────── */

// Static section style — matches Footer section height exactly
const SECTION_STYLE: React.CSSProperties = { height: "884px" };

// Toast auto-dismiss delay
const TOAST_DURATION_MS = 2500;

/**
 * Contact Details Section component
 * Displays "NEW BUSINESS" and "JOIN US" with email links
 * Background: Black (#171717)
 * Matches Footer section height exactly (884px)
 *
 * Clicking an email address:
 *  1. Copies the address to the clipboard (works everywhere)
 *  2. Opens the user's default mail client via mailto: (works if one is set up)
 *  3. Shows a small "Copied!" toast so users without a mail client get feedback
 */
export default function ContactDetails({
  businessEmail,
  jobsEmail,
}: ContactDetailsProps) {
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  const handleEmailClick = useCallback(
  (email: string) => async () => {
      // Try to copy to clipboard. Don't block the mailto: navigation if this fails.
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(email);
          setCopiedEmail(email);

          // Clear the toast after a delay
          window.setTimeout(() => {
            setCopiedEmail((current) => (current === email ? null : current));
          }, TOAST_DURATION_MS);
        }
      } catch {
        // Silently ignore clipboard errors — mailto: still fires below
      }

      // Let the default <a href="mailto:..."> behavior continue (do NOT preventDefault)
      // If the user has a mail client, it opens.
      // If not, at least the address is now on their clipboard.
    },
    []
  );

  return (
    <section
      id="contact-details-section"
      className="w-full bg-black"
      style={SECTION_STYLE}
    >
      <div className="w-full max-w-[1920px] mx-auto px-8 md:px-16 lg:px-24 h-full flex items-center">
        <div className="space-y-0 w-full">
          {/* New Business Row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-0 pb-8 md:pb-10 lg:pb-12">
            <div className="mb-4 sm:mb-0">
              <h3 className="font-lato text-[28px] sm:text-[32px] md:text-[38px] lg:text-[47px] font-bold text-white/90 leading-[1.1] tracking-tight">
                NEW BUSINESS
              </h3>
            </div>
            <div className="relative">
              <a
                href={`mailto:${businessEmail}`}
                onClick={handleEmailClick(businessEmail)}
                className="font-lato text-[28px] sm:text-[32px] md:text-[38px] lg:text-[35px] font-normal text-white/90 leading-[1.1] tracking-tight hover:opacity-80 transition-opacity"
              >
                {businessEmail}
              </a>
              <div className="absolute bottom-[-32px] md:bottom-[-40px] lg:bottom-[-48px] left-0 right-0 w-full md:left-auto md:right-0 md:w-[300px] lg:w-[400px] h-px bg-white/50"></div>

              {copiedEmail === businessEmail && (
                <span
                  role="status"
                  aria-live="polite"
                  className="absolute -top-8 right-0 font-lato text-[14px] text-white/70 whitespace-nowrap"
                >
                  ✓ Copied to clipboard
                </span>
              )}
            </div>
          </div>

          {/* Join Us Row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-8 md:py-10 lg:py-12">
            <div className="mb-4 sm:mb-0">
              <h3 className="font-lato text-[28px] sm:text-[32px] md:text-[38px] lg:text-[47px] font-bold text-white/90 leading-[1.1] tracking-tight">
                JOIN US
              </h3>
            </div>
            <div className="relative">
              <a
                href={`mailto:${jobsEmail}`}
                onClick={handleEmailClick(jobsEmail)}
                className="font-lato text-[28px] sm:text-[32px] md:text-[38px] lg:text-[35px] font-normal text-white/90 leading-[1.1] tracking-tight hover:opacity-80 transition-opacity"
              >
                {jobsEmail}
              </a>

              {copiedEmail === jobsEmail && (
                <span
                  role="status"
                  aria-live="polite"
                  className="absolute -top-8 right-0 font-lato text-[14px] text-white/70 whitespace-nowrap"
                >
                  ✓ Copied to clipboard
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}