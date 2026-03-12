"use client";

import PageHeader from "@/components/PageHeader";
import Particles from "@/components/Particles";

export default function ProjectsPage() {
  return (
    <div className="relative z-10 min-h-screen px-6">
      <PageHeader />

      <div
        className="flex flex-col items-center pb-16 pt-8"
        style={{ animation: "fadeInUp 0.8s ease-out both" }}
      >
        <div className="mt-12 flex flex-col items-center gap-6">
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
        </div>
      </div>

      <Particles count={60} />
    </div>
  );
}
