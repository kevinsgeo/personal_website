"use client";

import { useState, useEffect, useRef, useId } from "react";
import Link from "next/link";
import Image from "next/image";
import Particles from "@/components/Particles";
import ScrollReveal from "@/components/ScrollReveal";

type FeaturedProject = {
  id: string;
  title: string;
  tagline: string;
  cardBlurb: string;
  role: string;
  highlights: string[];
  stack: string;
  githubUrl: string;
};

const FEATURED_PROJECTS: FeaturedProject[] = [
  {
    id: "rydr",
    title: "Rydr",
    tagline: "Schedule-aware student carpooling",
    cardBlurb:
      "Match riders and drivers by class schedules and destinations—built at MadHacks 2025.",
    role:
      "Full-stack mobile app: Expo Router UI, Firebase Auth & Firestore, real-time chat, and an Express backend for PDF schedule parsing.",
    highlights: [
      "Upload a course schedule (PDF) and surface rides aligned with your classes and times",
      "Offer and discover rides with Google Maps autocomplete, filters (time, price, recurring MWF/TTh), and .edu-only signup",
      "In-app messaging and one-tap booking with live seat counts (Firebase)",
      "Profile impact: miles carpooled and savings tracking",
    ],
    stack:
      "React Native (Expo), Node.js / Express, Firebase, Google Maps APIs, TypeScript",
    githubUrl: "https://github.com/madhacks-2025/rydr",
  },
  {
    id: "translator",
    title: "Deep Learning Translation API",
    tagline: "T5-powered async translation service",
    cardBlurb:
      "FastAPI + T5 transformer with background jobs, SQLite, Docker, and Azure deployment.",
    role:
      "Designed and shipped a production-style REST API for multi-language translation with polling-based async results.",
    highlights: [
      "POST /translate queues work; GET /results returns completed T5 translations",
      "Languages: English, French, German, and Romanian",
      "Peewee + SQLite persistence; Docker image for portable deploys",
      "Hosted on Azure App Service with container-based scaling",
    ],
    stack: "FastAPI, PyTorch / T5, SQLite, Docker, Azure",
    githubUrl: "https://github.com/kevinsgeo/langtranslator_dl",
  },
];

type TechItem = {
  name: string;
  slug: string;
  color?: string;
  /** Use devicon CDN when simpleicons fails. Path like "java/java-original". */
  devicon?: string;
  /** Use skill-icons.dev when others fail. e.g. "aws". */
  skillicon?: string;
};

const DEVICON_BASE = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons";

const TECH_STACK: { title: string; items: TechItem[] }[] = [
  {
    title: "Languages",
    items: [
      { name: "Java", slug: "openjdk", devicon: "java/java-original" },
      { name: "Kotlin", slug: "kotlin", color: "7F52FF" },
      { name: "Python", slug: "python" },
      { name: "R", slug: "r" },
      { name: "SQL", slug: "postgresql" },
      { name: "JavaScript", slug: "javascript" },
      { name: "TypeScript", slug: "typescript" },
      { name: "Terraform", slug: "terraform" },
      { name: "HTML", slug: "html5" },
      { name: "CSS", slug: "css3", devicon: "css3/css3-original" },
      { name: "C", slug: "c" },
      { name: "C++", slug: "cplusplus" },
      { name: "Bash", slug: "gnubash" },
    ],
  },
  {
    title: "Frameworks",
    items: [
      { name: "Flask", slug: "flask" },
      { name: "FastAPI", slug: "fastapi" },
      { name: "Spring", slug: "spring" },
      { name: "React", slug: "react" },
      { name: "Next.js", slug: "nextdotjs", color: "ffffff" },
      { name: "Tailwind", slug: "tailwindcss" },
    ],
  },
  {
    title: "Developer Tools",
    items: [
      { name: "Git", slug: "git" },
      { name: "Docker", slug: "docker" },
      { name: "VS Code", slug: "vscode", devicon: "vscode/vscode-original" },
      { name: "Azure DevOps", slug: "azuredevops", devicon: "azure/azure-original" },
    ],
  },
  {
    title: "Libraries",
    items: [
      { name: "Pandas", slug: "pandas" },
      { name: "NumPy", slug: "numpy" },
      { name: "PyTorch", slug: "pytorch" },
      { name: "scikit-learn", slug: "scikitlearn" },
      { name: "MongoDB", slug: "mongodb" },
      { name: "transformers", slug: "huggingface" },
      { name: "TensorFlow", slug: "tensorflow" },
    ],
  },
  {
    title: "Cloud Platforms",
    items: [
      { name: "MS Azure", slug: "azure", devicon: "azure/azure-original" },
      { name: "AWS", slug: "amazonaws", skillicon: "aws" },
      { name: "GCP", slug: "googlecloud" },
    ],
  },
];

const ICON_SIZE = 32;

function TechIcon({
  item,
  onHover,
}: {
  item: TechItem;
  onHover: (name: string | null) => void;
}) {
  const { name, slug, color, devicon, skillicon } = item;
  const src = skillicon
    ? `https://skillicons.dev/icons?i=${skillicon}&theme=dark`
    : devicon
      ? `${DEVICON_BASE}/${devicon}.svg`
      : color
        ? `https://cdn.simpleicons.org/${slug}/${color}`
        : `https://cdn.simpleicons.org/${slug}`;
  return (
    <div
      className="group flex items-center justify-center transition-all duration-200"
      onMouseEnter={() => onHover(name)}
      onMouseLeave={() => onHover(null)}
    >
      <div className="flex h-8 w-8 items-center justify-center transition-all duration-200 group-hover:scale-110">
        <Image
          src={src}
          alt={name}
          width={ICON_SIZE}
          height={ICON_SIZE}
          className="object-contain opacity-70 saturate-[0.75] transition-all duration-200 group-hover:opacity-100 group-hover:saturate-100"
          unoptimized
        />
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const [hoveredName, setHoveredName] = useState<string | null>(null);

  return (
    <div className="relative z-10 min-h-screen px-6">
      <div className="flex flex-col items-center pb-16 pt-8">
        <Link
          href="/"
          className="mb-8 self-start pl-0 text-xs tracking-[0.15em] text-green-dim transition-colors hover:text-green sm:pl-6"
        >
          &lt; Back
        </Link>
        <ScrollReveal className="flex w-full max-w-4xl flex-col items-center gap-8">
          <h2
            className="text-glow text-lg uppercase tracking-[0.2em] sm:text-xl"
            style={{ color: "#00ff41" }}
          >
            My Projects
          </h2>

          {/* Tech Stack — NES boxes like Let&apos;s Connect */}
          <div className="flex w-full max-w-2xl flex-col items-center gap-6">
            <h3
              className="text-center text-sm uppercase tracking-[0.15em] sm:text-base"
              style={{ color: "#00cc33" }}
            >
              Tech Stack
            </h3>
            <div
              className="mb-1 min-h-[1.5rem] w-full text-center text-xs transition-opacity duration-150 text-glow pt-5 sm:pt-6"
              style={{ color: "#00ff41" }}
            >
              {hoveredName ?? "\u00A0"}
            </div>
            <div className="flex w-full flex-col gap-6">
              {TECH_STACK.map((group, i) => (
                <ScrollReveal key={i} delay={i * 80}>
                  <section className="nes-container with-title is-dark is-rounded is-centered w-full">
                    <p className="title" style={{ color: "#00ff41" }}>
                      {group.title}
                    </p>
                    <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
                      {group.items.map((item) => (
                        <TechIcon
                          key={item.slug + item.name}
                          item={item}
                          onHover={setHoveredName}
                        />
                      ))}
                    </div>
                  </section>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>

      <Particles count={60} />
    </div>
  );
}
