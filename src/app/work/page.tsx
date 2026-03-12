"use client";

import PageHeader from "@/components/PageHeader";
import Particles from "@/components/Particles";

const EXPERIENCE = [
  {
    title: "Position Title",
    company: "Company Name",
    period: "Start — Present",
    description: "Description of your role and accomplishments.",
  },
  {
    title: "Position Title",
    company: "Company Name",
    period: "Start — End",
    description: "Description of your role and accomplishments.",
  },
];

export default function WorkPage() {
  return (
    <div className="relative z-10 min-h-screen px-6">
      <PageHeader />

      <div
        className="mx-auto flex max-w-2xl flex-col items-center pb-16 pt-8"
        style={{ animation: "fadeInUp 0.8s ease-out both" }}
      >
        {/* Resume download */}
        <div className="mt-12 flex flex-col items-center gap-4">
          <h2
            className="text-glow text-lg uppercase tracking-[0.2em] sm:text-xl"
            style={{ color: "#00ff41" }}
          >
            My Work
          </h2>
          <p
            className="text-center text-xs tracking-wider sm:text-sm"
            style={{ color: "#00993d" }}
          >
            Grab a copy of my resume.
          </p>
          <a
            href="/Kevin_Shine_George_Resume.pdf"
            download="Kevin_Shine_George_Resume.pdf"
            className="nes-btn is-success"
          >
            Download Resume
          </a>
        </div>

        {/* Work experience */}
        <div className="mt-16 w-full">
          <h3
            className="mb-8 text-center text-sm uppercase tracking-[0.2em] sm:text-base"
            style={{ color: "#00cc33" }}
          >
            Experience
          </h3>

          <div className="flex flex-col gap-6">
            {EXPERIENCE.map((job, i) => (
              <section
                key={i}
                className="nes-container is-dark is-rounded"
                style={{
                  animation: `fadeInUp 0.5s ease-out ${0.2 + i * 0.15}s both`,
                }}
              >
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                  <h4
                    className="text-xs sm:text-sm"
                    style={{ color: "#00ff41" }}
                  >
                    {job.title}
                  </h4>
                  <span
                    className="text-[10px] tracking-wider"
                    style={{ color: "#00663a" }}
                  >
                    {job.period}
                  </span>
                </div>
                <p
                  className="mt-1 text-[10px] tracking-wider sm:text-xs"
                  style={{ color: "#00cc33" }}
                >
                  {job.company}
                </p>
                <p
                  className="mt-3 text-[10px] leading-relaxed tracking-wider sm:text-xs"
                  style={{ color: "#00993d" }}
                >
                  {job.description}
                </p>
              </section>
            ))}
          </div>

          <p
            className="mt-8 text-center text-[10px] tracking-wider"
            style={{ color: "#00663a" }}
          >
            Update the EXPERIENCE array in work/page.tsx with your details.
          </p>
        </div>
      </div>

      <Particles count={60} />
    </div>
  );
}
