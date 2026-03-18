"use client";

import { useRef, useState, useEffect, type ReactNode } from "react";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  rootMargin?: string;
  /** Stay visible after first reveal (dependency slot kept for stable hook deps / HMR). */
  once?: boolean;
};

export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
  rootMargin = "0px 0px -40px 0px",
  once = false,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (once) {
          if (entry.isIntersecting) setInView(true);
        } else {
          setInView(entry.isIntersecting);
        }
      },
      { rootMargin, threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin, once]);

  return (
    <div
      ref={ref}
      className={`scroll-reveal ${inView ? "scroll-reveal-in-view" : ""} ${className}`}
      style={delay > 0 && inView ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
