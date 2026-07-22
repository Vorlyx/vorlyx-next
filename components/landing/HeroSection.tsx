"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface HeroSectionProps {
  vorlyxText: string;
  video: string;
}

export default function HeroSection({ vorlyxText, video }: HeroSectionProps) {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayVideoRef = useRef<HTMLVideoElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  /* ---------------- Smooth cursor animation (Lerp) ---------------- */
  useEffect(() => {
    let animationFrameId: number;

    const updateCursorPosition = () => {
      setCursorPos((prev) => {
        const ease = 0.15;
        const dx = mousePos.x - prev.x;
        const dy = mousePos.y - prev.y;

        return {
          x: prev.x + dx * ease,
          y: prev.y + dy * ease,
        };
      });

      animationFrameId = requestAnimationFrame(updateCursorPosition);
    };

    animationFrameId = requestAnimationFrame(updateCursorPosition);
    return () => cancelAnimationFrame(animationFrameId);
  }, [mousePos]);

  /* ---------------- Track mouse coordinates ---------------- */
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  /* ---------------- Escape key + scroll lock ---------------- */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeOverlay();
      }
    };

    if (isOverlayOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOverlayOpen]);

  /* ---------------- Background video load ---------------- */
  useEffect(() => {
    const currentVideo = videoRef.current;
    if (currentVideo && video && !video.includes(".gif")) {
      const handleLoadedData = () => setVideoLoaded(true);
      currentVideo.addEventListener("loadeddata", handleLoadedData);

      if (currentVideo.readyState >= 2) setVideoLoaded(true);

      return () => {
        if (currentVideo) {
          currentVideo.removeEventListener("loadeddata", handleLoadedData);
        }
      };
    } else if (video && video.includes(".gif")) {
      setTimeout(() => setVideoLoaded(true), 0);
    }
  }, [video]);

  /* ---------------- Open / Close overlay ---------------- */
  const openOverlay = () => {
    setIsOverlayOpen(true);
    setTimeout(() => {
      if (overlayVideoRef.current) {
        overlayVideoRef.current.muted = false;
        overlayVideoRef.current.currentTime = 0;
        overlayVideoRef.current.play().catch((err) => {
          console.warn("Autoplay with sound requires user interaction:", err);
        });
      }
    }, 100);
  };

  const closeOverlay = () => {
    if (overlayVideoRef.current) {
      overlayVideoRef.current.pause();
    }
    setIsOverlayOpen(false);
  };

  return (
    <>
      <section
        ref={heroRef}
        id="hero-section"
        className="relative w-full max-w-[1920px] mx-auto min-h-screen bg-[#171717] overflow-hidden select-none md:cursor-none"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={openOverlay}
      >
        {/* Background looping muted video / GIF */}
        {video && (
          <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
            {video.includes(".gif") ? (
              <Image
                src={video}
                alt="Hero background"
                fill
                className="object-cover"
                unoptimized
                priority
              />
            ) : (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover opacity-0 transition-opacity duration-700 ease-out"
                  style={{ opacity: videoLoaded ? 1 : 0 }}
                >
                  <source src={video} type="video/mp4" />
                </video>
                {!videoLoaded && (
                  <div className="absolute inset-0 bg-[#171717]" />
                )}
              </>
            )}
          </div>
        )}

        {/* Custom Play Reel cursor — glassmorphism rounded rectangle (desktop only) */}
{isHovered && !isOverlayOpen && (
  <div
    className="hidden md:flex pointer-events-none absolute z-30 items-center justify-center font-lato font-semibold uppercase tracking-[0.15em] text-white select-none"
    style={{
      width: "170px",
      height: "70px",
      left: `${cursorPos.x}px`,
      top: `${cursorPos.y}px`,
      transform: "translate(-50%, -50%)",
      borderRadius: "9999px",
      background: "rgba(255, 255, 255, 0.15)",
      backdropFilter: "blur(20px) saturate(180%)",
      WebkitBackdropFilter: "blur(20px) saturate(180%)",
      border: "1px solid rgba(255, 255, 255, 0.25)",
      boxShadow:
        "0 8px 32px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
      fontSize: "14px",
      willChange: "transform, left, top",
      transition: "opacity 0.3s ease",
    }}
  >
    Play Reel
  </div>
)}

        {/* Mobile fallback static Play Reel badge — glass style */}
<div
  className="md:hidden absolute z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center font-lato font-semibold uppercase tracking-[0.15em] text-white text-xs active:scale-95 transition-transform"
  style={{
    width: "150px",
    height: "60px",
    borderRadius: "9999px",
    background: "rgba(255, 255, 255, 0.15)",
    backdropFilter: "blur(20px) saturate(180%)",
    WebkitBackdropFilter: "blur(20px) saturate(180%)",
    border: "1px solid rgba(255, 255, 255, 0.25)",
    boxShadow:
      "0 8px 32px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
  }}
>
  Play Reel
</div>

        {/* Large VORLYX Wordmark */}
        <div className="absolute bottom-0 left-0 right-0 z-10 w-full max-w-[1920px] overflow-hidden pointer-events-none">
          <div className="relative w-full" style={{ paddingTop: "27%" }}>
            <Image
              src={vorlyxText}
              alt="Vorlyx"
              width={1989}
              height={465}
              className="absolute bottom-0 left-0 w-full h-auto opacity-100 max-w-[1920px]"
              style={{ transform: "translateY(25%)" }}
              priority
            />
          </div>
        </div>
      </section>

      {/* Fullscreen showreel overlay */}
      {isOverlayOpen && (
        <div className="fixed inset-0 w-screen h-screen bg-[#111111] z-[9999] flex items-center justify-center overflow-hidden animate-fade-in">
          {/* Close button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeOverlay();
            }}
            className="absolute top-6 right-6 md:top-10 md:right-10 z-[10000] flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/10 hover:bg-white text-white hover:text-black transition-all duration-300 group shadow-lg"
            aria-label="Close Showreel"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-6 h-6 md:w-8 md:h-8 transform group-hover:rotate-90 transition-transform duration-300"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          {/* Overlay showreel video */}
          <div className="relative w-full h-full max-w-[90%] max-h-[80%] aspect-video rounded-2xl overflow-hidden shadow-2xl">
            <video
              ref={overlayVideoRef}
              controls
              autoPlay
              playsInline
              className="w-full h-full object-cover bg-black"
            >
              <source src={video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}
    </>
  );
}