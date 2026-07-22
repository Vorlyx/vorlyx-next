"use client";

import { useState, useEffect, useRef } from "react";
import { useLetsTalk } from "@/app/context/LetsTalkContext";

const HELP_OPTIONS = ["Web App", "App", "E-commerce", "Website", "Branding", "Other"];
const BUDGET_OPTIONS = ["Up to 20K", "20K - 50K", "50K - 100K", "Over 100K"];
const MEET_OPTIONS = ["Social media", "Google", "Colleagues", "Friends", "Other"];

// Desktop peek styling
const PEEK_TOP_OFFSET = 140;
const PEEK_SIDE_INSET = 50;
const PEEK_RADIUS = 50;

// Mobile-specific peek styling — smaller radius + tighter side inset for phone screens
const PEEK_TOP_OFFSET_MOBILE = 100;
const PEEK_SIDE_INSET_MOBILE = 16;
const PEEK_RADIUS_MOBILE = 24;

const EXPAND_SCROLL_RANGE = 300;

export default function LetsTalkModal() {
  const { isOpen, closeModal } = useLetsTalk();

  const [helpSelections, setHelpSelections] = useState<string[]>([]);
  const [budgetSelection, setBudgetSelection] = useState<string>("");
  const [meetSelections, setMeetSelections] = useState<string[]>([]);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  /* ---------------- Detect mobile viewport ---------------- */
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const mql = window.matchMedia("(max-width: 767px)");
    const detect = () => setIsMobile(mql.matches);

    detect();
    mql.addEventListener("change", detect);
    return () => mql.removeEventListener("change", detect);
  }, []);

  /* ---------------- Body scroll lock ---------------- */
  useEffect(() => {
    if (!isOpen) return;

    const scrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      const restoredY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.overflow = "";
      window.scrollTo(0, parseInt(restoredY || "0") * -1);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeModal]);

  /* ---------------- Reset when closed ---------------- */
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setHelpSelections([]);
        setBudgetSelection("");
        setMeetSelections([]);
        setFullName("");
        setEmail("");
        setCompany("");
        setMessage("");
        setSubmitStatus("idle");
        setScrollProgress(0);
        if (scrollRef.current) scrollRef.current.scrollTop = 0;
      }, 500);
    }
  }, [isOpen]);

  /* ---------------- Scroll-linked expansion ---------------- */
  useEffect(() => {
    const scrollEl = scrollRef.current;
    if (!scrollEl || !isOpen) return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollTop = scrollEl.scrollTop;
          const progress = Math.min(1, Math.max(0, scrollTop / EXPAND_SCROLL_RANGE));
          setScrollProgress(progress);
          ticking = false;
        });
        ticking = true;
      }
    };

    scrollEl.addEventListener("scroll", handleScroll, { passive: true });
    return () => scrollEl.removeEventListener("scroll", handleScroll);
  }, [isOpen]);

  /* ---------------- Multi-select ---------------- */
  const toggleMulti = (
    value: string,
    list: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  };

  /* ---------------- Submit ---------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !email.trim()) {
      alert("Please fill in your name and email.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        helpNeeds: helpSelections,
        budget: budgetSelection,
        howMet: meetSelections,
        fullName,
        email,
        company,
        message,
      };

      let apiSuccess = false;
      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        apiSuccess = res.ok;
      } catch {
        apiSuccess = false;
      }

      if (!apiSuccess) {
        const mailtoBody = encodeURIComponent(
          `How can we help: ${payload.helpNeeds.join(", ")}\n` +
            `Budget: ${payload.budget}\n` +
            `How met: ${payload.howMet.join(", ")}\n\n` +
            `Name: ${payload.fullName}\n` +
            `Email: ${payload.email}\n` +
            `Company: ${payload.company}\n\n` +
            `Message:\n${payload.message}`
        );
        window.location.href = `mailto:hello@vorlyx.com?subject=New Project Inquiry&body=${mailtoBody}`;
      }

      setSubmitStatus("success");
      setTimeout(() => closeModal(), 1500);
    } catch (err) {
      console.error("Submit error:", err);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Tag chip style — now uses white bg to stand out on light gray modal
  const tagClass = (active: boolean) =>
    `px-6 py-2.5 rounded-full font-lato text-[15px] md:text-[16px] transition-all duration-200 border ${
      active
        ? "bg-black text-white border-black"
        : "bg-white text-black border-transparent hover:bg-[#E5E5E5]"
    }`;

  const easing = "cubic-bezier(0.32, 0.72, 0, 1)";

  // Pick base values based on viewport, then interpolate against scroll progress
  const topOffsetBase = isMobile ? PEEK_TOP_OFFSET_MOBILE : PEEK_TOP_OFFSET;
  const sideInsetBase = isMobile ? PEEK_SIDE_INSET_MOBILE : PEEK_SIDE_INSET;
  const radiusBase = isMobile ? PEEK_RADIUS_MOBILE : PEEK_RADIUS;

  const currentTopOffset = topOffsetBase * (1 - scrollProgress);
  const currentSideInset = sideInsetBase * (1 - scrollProgress);
  const currentRadius = radiusBase * (1 - scrollProgress);

  return (
    <>
      {/* Hide scrollbar */}
      <style jsx global>{`
        .letstalk-scroll {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .letstalk-scroll::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
        }
      `}</style>

      {/* Backdrop */}
      <div
        onClick={closeModal}
        className={`fixed inset-0 z-[9998] transition-opacity duration-[600ms] ${
          isOpen
            ? "opacity-100 visible backdrop-blur-md bg-black/40"
            : "opacity-0 invisible"
        }`}
        style={{ transitionTimingFunction: easing }}
      />

      {/* Modal container */}
      <div
        className="fixed inset-0 z-[9999] flex items-end justify-center pointer-events-none"
        style={{
          paddingTop: `${currentTopOffset}px`,
          paddingLeft: `${currentSideInset}px`,
          paddingRight: `${currentSideInset}px`,
          paddingBottom: "0px",
        }}
      >
        {/* Modal panel — now uses vorlyx-light-gray background */}
        <div
          className="relative w-full h-full bg-vorlyx-light-gray overflow-hidden pointer-events-auto"
          style={{
            borderTopLeftRadius: `${currentRadius}px`,
            borderTopRightRadius: `${currentRadius}px`,
            transform: isOpen ? "translateY(0)" : "translateY(100%)",
            transition: `transform 700ms ${easing}`,
            willChange: "transform",
          }}
        >
          {/* Close button */}
          <button
            onClick={closeModal}
            className="absolute top-6 right-6 md:top-8 md:right-8 z-[10001] w-12 h-12 flex items-center justify-center text-black hover:opacity-60 transition-opacity duration-300"
            aria-label="Close"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="w-7 h-7 md:w-8 md:h-8"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Scrollable container */}
          <div
            ref={scrollRef}
            className="letstalk-scroll w-full h-full overflow-y-auto overflow-x-hidden overscroll-contain"
          >
            <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 pt-6 md:pt-36 lg:pt-60 pb-16 md:pb-24 lg:pb-28">
              {/* Title */}
              <h2 className="font-lato font-regular text-black leading-[1.05] tracking-tight text-[42px] sm:text-[56px] md:text-[80px] lg:text-[100px] mb-16 md:mb-24 lg:mb-32 pr-16">
                Let&apos;s Build Something
                <br />
                Extraordinary Together
              </h2>

              <form onSubmit={handleSubmit} className="space-y-12 md:space-y-16">
                {/* How can we help */}
                <div>
                  <h3 className="font-lato text-black text-[18px] md:text-[22px] mb-5">
                    How can we help?{" "}
                    <span className="text-black/40 font-normal">Multiple selection</span>
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {HELP_OPTIONS.map((opt) => (
                      <button
                        type="button"
                        key={opt}
                        onClick={() => toggleMulti(opt, helpSelections, setHelpSelections)}
                        className={tagClass(helpSelections.includes(opt))}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Budget */}
                <div>
                  <h3 className="font-lato text-black text-[18px] md:text-[22px] mb-5">
                    What is your budget?
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {BUDGET_OPTIONS.map((opt) => (
                      <button
                        type="button"
                        key={opt}
                        onClick={() =>
                          setBudgetSelection(budgetSelection === opt ? "" : opt)
                        }
                        className={tagClass(budgetSelection === opt)}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* How did you meet us */}
                <div>
                  <h3 className="font-lato text-black text-[18px] md:text-[22px] mb-5">
                    How did you meet us?{" "}
                    <span className="text-black/40 font-normal">Multiple selection</span>
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {MEET_OPTIONS.map((opt) => (
                      <button
                        type="button"
                        key={opt}
                        onClick={() => toggleMulti(opt, meetSelections, setMeetSelections)}
                        className={tagClass(meetSelections.includes(opt))}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Personal fields */}
                <div>
                  <h3 className="font-lato text-black text-[18px] md:text-[22px] mb-8">
                    Tell us more about you and your project
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                    <div>
                      <input
                        type="text"
                        placeholder="Full name*"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        className="w-full bg-transparent border-b border-black/30 focus:border-black outline-none py-3 font-lato text-[16px] md:text-[18px] text-black placeholder:text-black/50 transition-colors"
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        placeholder="Email*"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full bg-transparent border-b border-black/30 focus:border-black outline-none py-3 font-lato text-[16px] md:text-[18px] text-black placeholder:text-black/50 transition-colors"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Company"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        className="w-full bg-transparent border-b border-black/30 focus:border-black outline-none py-3 font-lato text-[16px] md:text-[18px] text-black placeholder:text-black/50 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <p className="font-lato text-black text-[18px] md:text-[22px] mb-4">
                    Dear Vorlyx,
                  </p>
                  <textarea
                    placeholder="Tell us more"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    className="w-full bg-transparent border-b border-black/30 focus:border-black outline-none py-3 font-lato text-[16px] md:text-[18px] text-black placeholder:text-black/50 resize-y transition-colors"
                  />
                </div>

                {/* Submit Button — styled like the Agency button */}
                <div className="flex justify-end pt-8 pb-8">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group bg-white rounded-full pl-12 pr-[40px] py-4 flex items-center gap-10 w-fit hover:bg-vorlyx-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <span className="font-lato text-[32px] sm:text-[40px] md:text-[50px] font-light text-vorlyx-black group-hover:text-white transition-colors">
                      {isSubmitting
                        ? "Sending..."
                        : submitStatus === "success"
                        ? "Sent"
                        : "Submit"}
                    </span>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-vorlyx-black rounded-full flex items-center justify-center ml-auto mr-[5px] group-hover:bg-white transition-colors">
                      {submitStatus === "success" ? (
                        // Checkmark icon for success state
                        <svg
                          width="30"
                          height="30"
                          viewBox="0 0 24 24"
                          fill="none"
                          className="w-5 h-5 sm:w-6 sm:h-6 md:w-[30px] md:h-[30px] text-white group-hover:text-vorlyx-black transition-colors"
                        >
                          <path
                            d="M5 12l5 5L20 7"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      ) : (
                        // Arrow icon
                        <svg
                          width="30"
                          height="30"
                          viewBox="0 0 24 24"
                          fill="none"
                          className="w-5 h-5 sm:w-6 sm:h-6 md:w-[30px] md:h-[30px] text-white group-hover:text-vorlyx-black transition-colors"
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
                    </div>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}