"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Particles from "@/components/Particles";

const FULL_NAME = "Kevin Shine George";
const TYPE_SPEED = 90;
const START_DELAY = 600;
const SUBTITLE_DELAY = 100;
const SCROLL_UP_DELAY = 1800;

const MENU_ITEMS = [
  { label: "My Projects", href: "/projects" },
  { label: "My Work", href: "/work" },
  { label: "Let's Connect", href: "/connect" },
];

export default function Home() {
  const router = useRouter();
  const [displayedChars, setDisplayedChars] = useState(0);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [subtitleOpacity, setSubtitleOpacity] = useState(0);
  const [phase, setPhase] = useState<"center" | "scrolling" | "done">("center");
  const [activeIndex, setActiveIndex] = useState(0);
  const [showMenu, setShowMenu] = useState(false);

  const navigateSoundRef = useRef<HTMLAudioElement | null>(null);
  const selectSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    navigateSoundRef.current = new Audio("/sounds/navigate.wav");
    selectSoundRef.current = new Audio("/sounds/select.ogg");
    navigateSoundRef.current.volume = 0.3;
    selectSoundRef.current.volume = 0.4;
  }, []);

  const playNavigate = useCallback(() => {
    if (navigateSoundRef.current) {
      navigateSoundRef.current.currentTime = 0;
      navigateSoundRef.current.play().catch(() => {});
    }
  }, []);

  const playSelect = useCallback(() => {
    if (selectSoundRef.current) {
      selectSoundRef.current.currentTime = 0;
      selectSoundRef.current.play().catch(() => {});
    }
  }, []);

  // Typing animation
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

  // Subtitle fade-in
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

  // Scroll up trigger
  const triggerScrollUp = useCallback(() => {
    setPhase("scrolling");
    setTimeout(() => {
      setPhase("done");
      setTimeout(() => setShowMenu(true), 300);
    }, 1400);
  }, []);

  useEffect(() => {
    if (subtitleOpacity === 1) {
      const timeout = setTimeout(triggerScrollUp, SCROLL_UP_DELAY);
      return () => clearTimeout(timeout);
    }
  }, [subtitleOpacity, triggerScrollUp]);

  // Keyboard navigation
  useEffect(() => {
    if (!showMenu) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          setActiveIndex((prev) => {
            const next = prev > 0 ? prev - 1 : MENU_ITEMS.length - 1;
            playNavigate();
            return next;
          });
          break;
        case "ArrowDown":
          e.preventDefault();
          setActiveIndex((prev) => {
            const next = prev < MENU_ITEMS.length - 1 ? prev + 1 : 0;
            playNavigate();
            return next;
          });
          break;
        case "Enter":
          e.preventDefault();
          playSelect();
          setTimeout(() => router.push(MENU_ITEMS[activeIndex].href), 200);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showMenu, activeIndex, router, playNavigate, playSelect]);

  const typed = FULL_NAME.slice(0, displayedChars);
  const isTyping = displayedChars < FULL_NAME.length;
  const scrolledUp = phase === "scrolling" || phase === "done";

  return (
    <div className="relative z-10 min-h-screen px-6">
      {/* Header */}
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
              <span style={{ color: "#00ff41" }}>{typed}</span>
              <span
                className={`cursor-blink text-glow inline-block w-[0.55em] text-center ${
                  isTyping || displayedChars === FULL_NAME.length
                    ? "visible"
                    : "invisible"
                }`}
                style={{ color: "#00ff41" }}
              >
                _
              </span>
            </h1>

            {showSubtitle && (
              <p
                className="text-sm tracking-wide sm:text-base"
                style={{
                  color: "#00cc33",
                  opacity: subtitleOpacity,
                  transition: "opacity 1.2s ease-in-out",
                }}
              >
                Software Developer.
                <span style={{ marginLeft: "0.5em" }}> </span>
                Undergraduate Researcher.
                <span style={{ marginLeft: "0.5em" }}> </span>
                Film Enthusiast.
              </p>
            )}
          </div>

          <div
            className="mt-6 h-px"
            style={{
              width: "42rem",
              maxWidth: "90vw",
              background:
                "linear-gradient(to right, transparent, rgba(0,255,65,0.25), #00ff41, rgba(0,255,65,0.25), transparent)",
              opacity: phase === "done" ? 1 : 0,
              transition: "opacity 0.8s ease-in-out",
            }}
          />
        </div>
      </div>

      {/* Intro + Retro game menu — NES.css (nostalgic-css) */}
      {showMenu && (
        <div
          className="flex flex-col items-center justify-center"
          style={{
            paddingTop: "13rem",
            minHeight: "100vh",
          }}
        >
          <p
            className="mx-auto max-w-lg px-4 text-center text-sm leading-relaxed sm:text-base"
            style={{
              color: "#00cc33",
              animation: "fadeInUp 0.5s ease-out 0.1s both",
              marginBottom: "2rem",
            }}
          >
            I&apos;m Kevin, a computer science and data science double major at UW-Madison. I love films, football, F1, and tech. Look around to learn more!
          </p>
          <div style={{ animation: "fadeInUp 0.5s ease-out 0.2s both", width: "520px", maxWidth: "92vw" }}>
            <section className="nes-container with-title is-centered is-dark is-rounded">
              <p className="title">SELECT</p>
              <div className="flex flex-col gap-4">
                {MENU_ITEMS.map((item, i) => (
                  <button
                    key={item.href}
                    type="button"
                    className="nes-btn is-success"
                    onClick={() => {
                      playSelect();
                      setTimeout(() => router.push(item.href), 200);
                    }}
                    onMouseEnter={() => {
                      if (activeIndex !== i) {
                        setActiveIndex(i);
                        playNavigate();
                      }
                    }}
                    style={{
                      width: "100%",
                      textShadow:
                        activeIndex === i
                          ? "0 0 8px rgba(0,255,65,0.9)"
                          : "none",
                    }}
                  >
                    {activeIndex === i && (
                      <span className="cursor-blink" style={{ marginRight: "0.5rem" }}>
                        &gt;
                      </span>
                    )}
                    {item.label}
                  </button>
                ))}
              </div>
              <p
                className="text-center text-[9px] tracking-[0.2em] uppercase"
                style={{ color: "#00663a", marginTop: "2.5rem", marginBottom: 0 }}
              >
                Use arrow keys &amp; enter
              </p>
            </section>
          </div>
        </div>
      )}

      <Particles count={80} />
    </div>
  );
}
