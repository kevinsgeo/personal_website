"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

const FULL_NAME = "Kevin Shine George";
const TYPE_SPEED = 90;
const START_DELAY = 600;
const SUBTITLE_DELAY = 100;
const SCROLL_UP_DELAY = 1800;

export default function Home() {
  const [displayedChars, setDisplayedChars] = useState(0);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [subtitleOpacity, setSubtitleOpacity] = useState(0);
  const [phase, setPhase] = useState<"center" | "scrolling" | "done">("center");

  useEffect(() => {
    const startTimeout = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayedChars((prev) => {
          if (prev >= FULL_NAME.length) {
            clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, TYPE_SPEED);
      return () => clearInterval(interval);
    }, START_DELAY);
    return () => clearTimeout(startTimeout);
  }, []);

  useEffect(() => {
    if (displayedChars >= FULL_NAME.length) {
      const timeout = setTimeout(() => {
        setShowSubtitle(true);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => setSubtitleOpacity(1));
        });
      }, SUBTITLE_DELAY);
      return () => clearTimeout(timeout);
    }
  }, [displayedChars]);

  const triggerScrollUp = useCallback(() => {
    setPhase("scrolling");
    setTimeout(() => setPhase("done"), 1400);
  }, []);

  useEffect(() => {
    if (subtitleOpacity === 1) {
      const timeout = setTimeout(triggerScrollUp, SCROLL_UP_DELAY);
      return () => clearTimeout(timeout);
    }
  }, [subtitleOpacity, triggerScrollUp]);

  const typed = FULL_NAME.slice(0, displayedChars);
  const isTyping = displayedChars < FULL_NAME.length;
  const scrolledUp = phase === "scrolling" || phase === "done";

  return (
    <div className="relative z-10 min-h-screen px-6">
      {/*
        Header container: always pinned to top.
        Inner wrapper uses transform to center vertically, then animates to top.
      */}
      <div className="fixed inset-x-0 top-0 z-20 flex justify-center pt-12">
        <div
          className="flex flex-col items-center"
          style={{
            transform: scrolledUp
              ? "translateY(0)"
              : "translateY(calc(50vh - 50% - 3rem))",
            transition: "transform 1.2s cubic-bezier(0.25, 0.1, 0.25, 1)",
          }}
        >
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-glow text-2xl tracking-wider sm:text-3xl md:text-4xl lg:text-5xl">
              <span className="text-green">{typed}</span>
              <span
                className={`cursor-blink text-glow inline-block w-[0.55em] text-center text-green ${
                  isTyping || displayedChars === FULL_NAME.length
                    ? "visible"
                    : "invisible"
                }`}
              >
                _
              </span>
            </h1>

            {showSubtitle && (
              <p
                className="text-xs tracking-[0.3em] uppercase text-green-dim sm:text-sm"
                style={{
                  opacity: subtitleOpacity,
                  transition: "opacity 1.2s ease-in-out",
                }}
              >
                Welcome to my corner of the internet
              </p>
            )}
          </div>

          <div
            className="mt-6 h-px"
            style={{
              width: "42rem",
              maxWidth: "90vw",
              background: "linear-gradient(to right, transparent, rgba(0,255,65,0.25), #00ff41, rgba(0,255,65,0.25), transparent)",
              opacity: phase === "done" ? 1 : 0,
              transition: "opacity 0.8s ease-in-out",
            }}
          />
        </div>
      </div>

      {/* Main content — fades in after header reaches top */}
      <div
        className="flex flex-col items-center pb-16 pt-44"
        style={{
          opacity: phase === "done" ? 1 : 0,
          transform: phase === "done" ? "translateY(0)" : "translateY(24px)",
          transition:
            "opacity 0.8s ease-out, transform 0.8s ease-out",
        }}
      >
        <div className="mt-8 flex flex-col items-center gap-6 sm:mt-12">
          <p className="max-w-lg text-center text-xs leading-relaxed text-green-dim sm:text-sm">
            Software developer.&nbsp; Grab my resume below.
          </p>

            <a
              href="/Kevin_Shine_George_Resume.pdf"
              download="Kevin_Shine_George_Resume.pdf"
              className="resume-btn group relative inline-flex items-center justify-center gap-3 border border-green px-6 text-xs uppercase tracking-[0.2em] text-green transition-all duration-300 sm:text-sm"
              style={{ paddingTop: "0.9rem", paddingBottom: "0.65rem" }}
            >
              <DownloadIcon />
              <span style={{ position: "relative", top: "3px" }}>Download Resume</span>
            </a>
        </div>

        <div className="mt-16 flex flex-col items-center gap-6 sm:mt-20">
          <p className="text-glow text-base uppercase tracking-[0.2em] text-green sm:text-lg">
            Let&apos;s Connect!
          </p>

          <div className="flex items-center gap-8">
            <a
              href="https://github.com/kevinsgeo"
              target="_blank"
              rel="noopener noreferrer"
              className="connect-link group flex flex-col items-center gap-2 transition-all duration-300"
              title="GitHub"
            >
              <Image src="/github.svg" alt="GitHub" width={32} height={32} />
              <span className="text-[10px] tracking-[0.15em] opacity-70 transition-opacity duration-300 group-hover:opacity-100" style={{ color: "#ffffff" }}>
                  GitHub
                </span>
            </a>

            <a
              href="https://www.linkedin.com/in/kevin-shine-george-99aa9027a/"
              target="_blank"
              rel="noopener noreferrer"
              className="connect-link group flex flex-col items-center gap-2 transition-all duration-300"
              title="LinkedIn"
            >
              <Image src="/linkedin.svg" alt="LinkedIn" width={32} height={32} />
              <span className="text-[10px] tracking-[0.15em] opacity-70 transition-opacity duration-300 group-hover:opacity-100" style={{ color: "#0A66C2" }}>
                  LinkedIn
                </span>
            </a>

            <a
              href="mailto:shinegeorge@wisc.edu"
              className="connect-link group flex flex-col items-center gap-2 transition-all duration-300"
              title="Email"
            >
              <EmailIcon />
              <span className="text-[10px] tracking-[0.15em] opacity-70 transition-opacity duration-300 group-hover:opacity-100" style={{ color: "#F5B041" }}>
                  Email
                </span>
            </a>
          </div>
        </div>
      </div>

      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {Array.from({ length: 80 }).map((_, i) => (
          <Particle key={i} index={i} />
        ))}
      </div>
    </div>
  );
}

function DownloadIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 2v9M4.5 7.5 8 11l3.5-3.5M3 13h10" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#F5B041"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function Particle({ index }: { index: number }) {
  const size = 1 + (index % 3);
  const left = (index * 13 + 7) % 100;
  const duration = 6 + (index % 14);
  const delay = (index * 0.4) % 12;
  const startY = 100 + (index % 30);
  const brightness = 0.15 + (index % 6) * 0.07;
  const drift = (index % 2 === 0 ? 1 : -1) * (5 + (index % 10));

  return (
    <div
      className="absolute rounded-full"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        left: `${left}%`,
        bottom: `-${size}px`,
        backgroundColor: `rgba(0, 255, 65, ${brightness})`,
        animation: `floatUp${index} ${duration}s ${delay}s linear infinite`,
      }}
    >
      <style jsx>{`
        @keyframes floatUp${index} {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-${startY}vh) translateX(${drift}px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
