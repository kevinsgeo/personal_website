"use client";

import {
  useState,
  useEffect,
  useRef,
  useId,
  useCallback,
  useLayoutEffect,
} from "react";
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

function ProjectModal({
  project,
  onClose,
}: {
  project: FeaturedProject;
  onClose: () => void;
}) {
  const titleId = useId();
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useLayoutEffect(() => {
    const prevOverflow = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") requestClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPaddingRight;
      window.removeEventListener("keydown", onKey);
    };
  }, [project.id]);

  useEffect(() => {
    // Trigger transitions on the next frame so we don't flicker on mount.
    const raf = window.requestAnimationFrame(() => setIsOpen(true));
    return () => window.cancelAnimationFrame(raf);
  }, [project.id]);

  useEffect(() => {
    if (isOpen) closeBtnRef.current?.focus();
  }, [isOpen, project.id]);

  const requestClose = () => {
    if (isClosing) return;
    setIsClosing(true);
    // Wait for backdrop + panel close transitions (see `globals.css`).
    window.setTimeout(() => onClose(), 520); /* 500ms transitions + frame */
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <button
        type="button"
        className={`modal-backdrop absolute inset-0 cursor-default bg-black/80 ${
          isOpen && !isClosing ? "modal-backdrop-in" : "modal-backdrop-out"
        }`}
        aria-label="Close project details"
        onClick={requestClose}
      />
      <div
        className={`modal-panel relative z-[1] max-h-[90vh] w-full max-w-2xl overflow-y-auto ${
          isOpen && !isClosing ? "modal-panel-in" : "modal-panel-out"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <section className="nes-container with-title is-dark is-rounded relative">
          <button
            ref={closeBtnRef}
            type="button"
            className="nes-btn is-error"
            aria-label="Close"
            onClick={requestClose}
            style={{
              position: "absolute",
              top: "0.75rem",
              right: "0.75rem",
              padding: "0.25rem 0.5rem",
              lineHeight: 1,
              zIndex: 2,
            }}
          >
            X
          </button>

          <p className="title" id={titleId} style={{ color: "#00ff41" }}>
            {project.title}
          </p>
          <p
            className="mb-3 text-xs uppercase tracking-wider sm:text-sm"
            style={{ color: "#00cc33" }}
          >
            {project.tagline}
          </p>
          <p
            className="mb-4 text-[11px] leading-relaxed sm:text-xs"
            style={{ color: "#00993d" }}
          >
            {project.role}
          </p>
          <ul
            className="mb-4 list-none space-y-2.5 pl-0 text-[10px] leading-relaxed sm:text-xs"
            style={{ color: "#00cc33" }}
          >
            {project.highlights.map((line, j) => (
              <li key={j} className="flex gap-2">
                <span
                  className="mt-1.5 h-1 w-1 shrink-0 rounded-full"
                  style={{ backgroundColor: "#00ff41" }}
                  aria-hidden
                />
                <span>{line}</span>
              </li>
            ))}
          </ul>
          <p
            className="mb-2 border-t border-[#006633] pt-3 text-[10px] tracking-wide sm:text-xs"
            style={{ color: "#00663a" }}
          >
            <span className="font-semibold" style={{ color: "#00cc33" }}>
              Stack:{" "}
            </span>
            {project.stack}
          </p>

          <div className="mt-5 flex justify-center">
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="connect-link group inline-flex flex-col items-center gap-2"
              aria-label="Open on GitHub"
              title="GitHub"
            >
              <Image
                src="/github.svg"
                alt="GitHub"
                width={32}
                height={32}
                className="object-contain"
              />
              <span
                className="text-[10px] tracking-[0.15em] opacity-70 transition-opacity duration-300 group-hover:opacity-100"
                style={{ color: "#ffffff" }}
              >
                GitHub
              </span>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const [hoveredName, setHoveredName] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const closeModal = useCallback(() => setSelectedId(null), []);
  const selectedProject =
    selectedId == null
      ? null
      : FEATURED_PROJECTS.find((p) => p.id === selectedId) ?? null;

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

          {/* Featured projects */}
          <div className="mt-14 flex w-full max-w-2xl flex-col items-center gap-6">
            <h3
              className="text-center text-sm uppercase tracking-[0.15em] sm:text-base"
              style={{ color: "#00cc33" }}
            >
              Featured Projects
            </h3>
            <div className="grid w-full gap-6 sm:grid-cols-2">
              {FEATURED_PROJECTS.map((project, i) => (
                <ScrollReveal key={project.id} delay={i * 80} className="h-full">
                  <button
                    type="button"
                    onClick={() => setSelectedId(project.id)}
                    className="nes-container with-title is-dark is-rounded is-centered flex h-full w-full cursor-pointer flex-col text-left transition-[box-shadow] hover:brightness-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00ff41] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]"
                  >
                    <p className="title" style={{ color: "#00ff41" }}>
                      {project.title}
                    </p>
                    <p
                      className="mb-1 text-[10px] uppercase tracking-wider sm:text-xs"
                      style={{ color: "#00cc33" }}
                    >
                      {project.tagline}
                    </p>
                    <p
                      className="text-[10px] leading-relaxed sm:text-xs"
                      style={{ color: "#00993d" }}
                    >
                      {project.cardBlurb}
                    </p>
                    <p
                      className="mt-auto pt-3 text-[9px] uppercase tracking-[0.2em]"
                      style={{ color: "#00663a" }}
                    >
                      Click for details
                    </p>
                  </button>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>

      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={closeModal} />
      )}

      <Particles count={60} />
    </div>
  );
}
