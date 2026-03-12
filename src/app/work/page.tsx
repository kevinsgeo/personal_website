"use client";

import Image from "next/image";
import Link from "next/link";
import Particles from "@/components/Particles";
import ScrollReveal from "@/components/ScrollReveal";

type ExperienceItem = {
  title: string;
  company: string;
  location: string;
  period: string;
  image: string;
  imagePosition: "left" | "right";
  imageClass?: string;
  bullets: string[];
};

const EXPERIENCE: ExperienceItem[] = [
  {
    title: "Undergraduate Research Intern",
    company: "Stewart Computational Group, Morgridge Institute for Research",
    location: "Madison, WI",
    period: "Feb 2025 - Present",
    image: "/work/morgridge.png",
    imagePosition: "right" as const,
    bullets: [
      "Built and maintained a large-scale PubMed text ingestion and retrieval pipeline in Python across 30M+ abstracts, combining co-occurrence scoring with LLM ranking to improve result discoverability.",
      "Shipped production features for the SKiM web app (React, FastAPI, MariaDB) by wiring API endpoints and defining response schemas and export flows.",
      "Co-authored and published a peer-reviewed paper in BMC Bioinformatics, documenting the system and results for the biomedical community.",
    ],
  },
  {
    title: "AI Engineer",
    company: "Strudel",
    location: "Madison, WI",
    period: "Sep 2025 - Dec 2025",
    image: "/work/strudel.jpg",
    imagePosition: "left" as const,
    bullets: [
      "Built an AI demo automation platform (React, FastAPI, LLM agents) to turn manual B2B sales demo customization into reusable multi-step workflows, cutting setup time from hours to minutes.",
      "Implemented LLM generation and editing pipelines using OpenRouter, strict prompt templates, and LangChain/LangGraph tool-calling agents.",
      "Built SQL scripts and schemas to store and query demo workflow state, generated outputs, and integration mappings.",
    ],
  },
  {
    title: "DevOps Intern",
    company: "Care Access",
    location: "Boston, MA",
    period: "Jun 2025 - Sep 2025",
    image: "/work/care-access.png",
    imagePosition: "right" as const,
    bullets: [
      "Managed Azure infrastructure for Cal.com and Strapi with App Service, PostgreSQL Flexible Server, private endpoints, and Terraform for repeatable deployments.",
      "Built and maintained CI/CD pipelines in Azure DevOps to automate build and release workflows and promote configurations across environments.",
      "Collaborated with the DevOps team in an Agile environment to diagnose build/runtime issues and tune Azure settings, improving deployment success.",
    ],
  },
  {
    title: "Undergraduate Research Assistant",
    company: "Lang Lab, Centre for Human Genomics and Precision Medicine, UW-Madison",
    location: "Madison, WI",
    period: "Jun 2024 - Feb 2025",
    image: "/work/lang-lab.jpg",
    imagePosition: "left" as const,
    bullets: [
      "Optimized NextFlow pipelines for 50+ cell-line experiments with custom Python scripts, reducing runtime by 25% and improving data quality.",
      "Analyzed and visualized large-scale datasets on remote Linux servers using R and matplotlib, enabling a team of eight researchers to extract insights faster.",
      "Automated transcription factor identification and motif analysis across 300+ datasets with Python and Bash, leveraging HOMER and MAGIC.",
    ],
  },
];

export default function WorkPage() {
  return (
    <div className="relative z-10 min-h-screen px-6">
      <div className="mx-auto max-w-4xl pb-16 pt-8">
        <Link
          href="/"
          className="mb-8 inline-block text-xs tracking-[0.15em] text-green-dim transition-colors hover:text-green"
        >
          &lt; Back
        </Link>

        {/* Title + resume button */}
        <ScrollReveal className="mb-16 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2
            className="text-glow text-lg uppercase tracking-[0.2em] sm:text-xl"
            style={{ color: "#00ff41" }}
          >
            My Work
          </h2>
          <a
            href="/Kevin_Shine_George_Resume.pdf"
            download="Kevin_Shine_George_Resume.pdf"
            className="nes-btn is-success w-fit"
          >
            Download Resume
          </a>
        </ScrollReveal>

        {/* Work experience */}
        <div className="mt-16 w-full">
          <div className="flex flex-col gap-10">
            {EXPERIENCE.map((job, i) => (
              <ScrollReveal key={i} delay={i * 80}>
              <div
                className={`flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-6 ${
                  job.imagePosition === "left" ? "sm:flex-row" : "sm:flex-row-reverse"
                }`}
              >
                <div
                  className={`work-experience-image relative flex h-28 w-full shrink-0 items-center justify-center overflow-hidden rounded sm:h-40 sm:w-44 ${job.imageClass ?? ""}`}
                  style={{ opacity: 0.9 }}
                >
                  <Image
                    src={job.image}
                    alt=""
                    width={352}
                    height={320}
                    className="h-full w-full object-contain object-center"
                    sizes="(min-width: 640px) 176px, 100vw"
                  />
                </div>
                <section
                  className="nes-container is-dark is-rounded min-w-0 flex-1"
                  style={{ padding: "1.5rem 1.75rem" }}
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
                    <h4
                      className="text-sm sm:text-base"
                      style={{ color: "#00ff41" }}
                    >
                      {job.title}
                    </h4>
                    <span
                      className="text-[10px] tracking-wider sm:text-xs"
                      style={{ color: "#00663a" }}
                    >
                      {job.period}
                    </span>
                  </div>
                  <div
                    className="mt-1 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-[10px] tracking-wider sm:text-xs"
                    style={{ color: "#00cc33" }}
                  >
                    <span>{job.company}</span>
                    <span className="shrink-0">{job.location}</span>
                  </div>
                  <ul
                    className="list-none space-y-4 pl-0"
                    style={{ color: "#00993d", marginTop: "1.25rem" }}
                  >
                    {job.bullets.map((bullet, j) => (
                      <li
                        key={j}
                        className="flex gap-3 text-[10px] tracking-wider sm:text-xs"
                        style={{ lineHeight: 1.6 }}
                      >
                        <span
                          className="mt-2 h-1 w-1 shrink-0 rounded-full"
                          style={{ backgroundColor: "#00ff41" }}
                          aria-hidden
                        />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
              </ScrollReveal>
            ))}
          </div>

        </div>
      </div>

      <Particles count={60} />
    </div>
  );
}
