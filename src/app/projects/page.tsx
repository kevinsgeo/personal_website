"use client";

import Link from "next/link";
import Particles from "@/components/Particles";
import ScrollReveal from "@/components/ScrollReveal";

export default function ProjectsPage() {
  return (
    <div className="relative z-10 min-h-screen px-6">
      <div className="flex flex-col items-center pb-16 pt-8">
        <Link
          href="/"
          className="mb-8 self-start pl-0 text-xs tracking-[0.15em] text-green-dim transition-colors hover:text-green sm:pl-6"
        >
          &lt; Back
        </Link>
        <ScrollReveal className="flex w-full max-w-4xl flex-col items-center gap-6">
          <h2
            className="text-glow text-lg uppercase tracking-[0.2em] sm:text-xl"
            style={{ color: "#00ff41" }}
          >
            My Projects
          </h2>

          <section
            className="nes-container is-dark is-rounded is-centered"
            style={{ minWidth: "320px" }}
          >
            <p
              className="text-xs tracking-wider sm:text-sm"
              style={{ color: "#00993d" }}
            >
              Coming soon...
            </p>
            <p
              className="mt-4 text-[10px] tracking-wider"
              style={{ color: "#00663a" }}
            >
              Projects are being loaded into memory.
            </p>
          </section>
        </ScrollReveal>
      </div>

      <Particles count={60} />
    </div>
  );
}
