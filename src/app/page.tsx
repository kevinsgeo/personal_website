"use client";

import { useState, useEffect } from "react";

const FULL_NAME = "Kevin Shine George";
const TYPE_SPEED = 90;
const START_DELAY = 600;
const SUBTITLE_DELAY = 500;

export default function Home() {
  const [displayedChars, setDisplayedChars] = useState(0);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [subtitleOpacity, setSubtitleOpacity] = useState(0);

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
          requestAnimationFrame(() => {
            setSubtitleOpacity(1);
          });
        });
      }, SUBTITLE_DELAY);
      return () => clearTimeout(timeout);
    }
  }, [displayedChars]);

  const typed = FULL_NAME.slice(0, displayedChars);
  const isTyping = displayedChars < FULL_NAME.length;

  return (
    <div className="relative z-10 flex min-h-screen items-center justify-center px-6">
      <main className="flex flex-col items-center gap-8">
        <div className="relative">
          <h1 className="text-glow text-2xl tracking-wider sm:text-3xl md:text-4xl lg:text-5xl">
            <span style={{ color: "#00ff41" }}>{typed}</span>
            <span
              className="cursor-blink text-glow inline-block w-[0.55em] text-center"
              style={{
                color: "#00ff41",
                visibility:
                  isTyping || displayedChars === FULL_NAME.length
                    ? "visible"
                    : "hidden",
              }}
            >
              _
            </span>
          </h1>
        </div>

        {showSubtitle && (
          <p
            className="text-sm tracking-[0.3em] uppercase sm:text-base"
            style={{
              color: "#00cc33",
              opacity: subtitleOpacity,
              transition: "opacity 1.2s ease-in-out",
            }}
          >
            Welcome to my corner of the internet
          </p>
        )}
      </main>

      {/* Ambient floating particles */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {Array.from({ length: 30 }).map((_, i) => (
          <Particle key={i} index={i} />
        ))}
      </div>
    </div>
  );
}

function Particle({ index }: { index: number }) {
  const size = 1 + (index % 3);
  const left = ((index * 37 + 13) % 100);
  const duration = 8 + (index % 12);
  const delay = (index * 0.7) % 10;
  const startY = 100 + (index % 20);

  return (
    <div
      className="absolute rounded-full"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        left: `${left}%`,
        bottom: `-${size}px`,
        backgroundColor: `rgba(0, 255, 65, ${0.1 + (index % 5) * 0.06})`,
        animation: `floatUp ${duration}s ${delay}s linear infinite`,
      }}
    >
      <style jsx>{`
        @keyframes floatUp {
          0% {
            transform: translateY(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-${startY}vh);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
