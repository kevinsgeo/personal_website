"use client";

import { useRef, useState, useEffect, type ReactNode } from "react";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  rootMargin?: string;
};

export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
  rootMargin = "0px 0px -40px 0px",
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { rootMargin, threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

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
