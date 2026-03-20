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

type ProjectLink = {
  label: string;
  href: string;
  /** Path to a local SVG in /public, OR a remote URL for the icon. */
  icon: string;
  /** If true, the icon is a remote URL and needs `unoptimized`. */
  remote?: boolean;
  /** Render a white circle behind the icon (for logos with transparent bg). */
  bgWhite?: boolean;
};

type Screenshot = {
  src: string;
  caption: string;
};

type FeaturedProject = {
  id: string;
  title: string;
  tagline: string;
  cardBlurb: string;
  role: string;
  highlights: string[];
  stack: string;
  links: ProjectLink[];
  screenshots?: Screenshot[];
  paperThumbnail?: { src: string; href: string };
};

const FEATURED_PROJECTS: FeaturedProject[] = [
  {
    id: "skimgpt",
    title: "SKiM-GPT",
    tagline: "LLM-powered biomedical hypothesis evaluation",
    cardBlurb:
      "RAG system combining literature-based discovery with LLM reasoning to evaluate biomedical hypotheses at scale. Published in BMC Bioinformatics.",
    role:
      "Co-developed the SKiM-GPT pipeline and web interface at the Morgridge Institute for Research, integrating co-occurrence search with LLM-based hypothesis scoring across 38M+ PubMed abstracts.",
    highlights: [
      "KinderMiner (KM): Rank B-terms by co-occurrence with an A-term in PubMed abstracts to prioritize the strongest A-B associations",
      "Serial KinderMiner (SKiM): Chain A-B and B-C co-occurrences to surface indirect A-C connections across disparate literature domains",
      "Hypothesis evaluation with LLMs: Score A-B and A-B-C relationships using configurable hypothesis templates and frontier LLMs with literature-backed reasoning",
      "Fine-tuned Phi-3 relevance filter removes irrelevant abstracts before LLM evaluation (F1 = 0.90)",
      "97% faster and 97% cheaper than manual expert review on a 14-hypothesis benchmark (Cohen's kappa = 0.84)",
    ],
    stack:
      "Python, OpenAI API, Phi-3 (fine-tuned), Firebase, Docker, HTCondor, React",
    links: [
      { label: "GitHub", href: "https://github.com/stewart-lab/skimgpt", icon: "/github.svg" },
      { label: "Web App", href: "https://skim.morgridge.org/", icon: "/skim-logo.svg", bgWhite: true },
    ],
    paperThumbnail: {
      src: "/skimgpt-paper.jpg",
      href: "https://link.springer.com/article/10.1186/s12859-025-06350-7",
    },
  },
  {
    id: "rydr",
    title: "Rydr",
    tagline: "Schedule-aware student carpooling",
    cardBlurb:
      "Match riders and drivers by class schedules and destinations. Built at MadHacks 2025.",
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
    links: [
      { label: "GitHub", href: "https://github.com/madhacks-2025/rydr", icon: "/github.svg" },
      { label: "Devpost", href: "https://devpost.com/software/rydr-5rfit4", icon: "https://cdn.simpleicons.org/devpost", remote: true },
    ],
    screenshots: [
      { src: "/rydr/01-signin.jpg", caption: "Sign In" },
      { src: "/rydr/02-signup.jpg", caption: "Sign Up" },
      { src: "/rydr/03-home.jpg", caption: "Home" },
      { src: "/rydr/04-find-ride.jpg", caption: "Find a Ride" },
      { src: "/rydr/05-chat.jpg", caption: "Chat" },
      { src: "/rydr/06-confirm.jpg", caption: "Confirm Booking" },
      { src: "/rydr/07-my-rides.jpg", caption: "My Rides" },
      { src: "/rydr/08-profile.jpg", caption: "Profile" },
      { src: "/rydr/09-leaderboard.jpg", caption: "Leaderboard" },
      { src: "/rydr/10-offer-ride.jpg", caption: "Offer a Ride" },
    ],
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
    links: [
      { label: "GitHub", href: "https://github.com/kevinsgeo/langtranslator_dl", icon: "/github.svg" },
    ],
  },
  {
    id: "nextchapter",
    title: "NextChapter",
    tagline: "Local book-swapping for readers",
    cardBlurb:
      "Swap books with readers nearby. Scan a barcode, find matches by location, chat, and trade.",
    role:
      "Built a mobile-first Android app with Jetpack Compose, Firebase, and Google Maps to connect book lovers for sustainable, local book swaps.",
    highlights: [
      "CameraX barcode scanning to instantly look up books via Google Books API",
      "Geolocation matching with Google Maps API to surface nearby swaps",
      "Real-time in-app chat powered by Stream API for coordinating trades",
      "Wishlist notifications alert users when a desired book is listed nearby",
      "Firebase Realtime Database for profiles, listings, reviews, and swap history",
    ],
    stack: "Kotlin, Jetpack Compose, Firebase, Google Maps API, Google Books API, Stream API, CameraX",
    links: [
      { label: "GitHub", href: "https://github.com/kevinsgeo/next_chapter", icon: "/github.svg" },
    ],
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

function ScreenshotCarousel({ screenshots }: { screenshots: Screenshot[] }) {
  const [idx, setIdx] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  const go = (dir: 1 | -1) => {
    setIdx((prev) => {
      const next = prev + dir;
      if (next < 0) return screenshots.length - 1;
      if (next >= screenshots.length) return 0;
      return next;
    });
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const child = track.children[idx] as HTMLElement | undefined;
    if (child) {
      track.scrollTo({ left: child.offsetLeft - track.offsetLeft, behavior: "smooth" });
    }
  }, [idx]);

  return (
    <div className="mt-5 border-t border-[#006633] pt-4">
      <p
        className="mb-3 text-center text-[10px] uppercase tracking-[0.15em] sm:text-xs"
        style={{ color: "#00cc33" }}
      >
        Take a look!
      </p>
      <div className="relative flex items-center gap-2">
        <button
          type="button"
          onClick={() => go(-1)}
          className="shrink-0 text-lg leading-none"
          style={{ color: "#00ff41" }}
          aria-label="Previous screenshot"
        >
          &#x25C0;
        </button>
        <div
          ref={trackRef}
          className="flex flex-1 snap-x snap-mandatory gap-3 overflow-hidden scroll-smooth scrollbar-hide"
        >
          {screenshots.map((s, i) => (
            <div
              key={i}
              className="flex w-full shrink-0 snap-center flex-col items-center gap-2"
            >
              <div className="relative h-64 w-full sm:h-80">
                <Image
                  src={s.src}
                  alt={s.caption}
                  fill
                  className="rounded object-contain"
                  sizes="(min-width: 640px) 580px, 90vw"
                />
              </div>
              <span
                className="text-[10px] tracking-wider"
                style={{ color: "#00993d" }}
              >
                {s.caption}
              </span>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => go(1)}
          className="shrink-0 text-lg leading-none"
          style={{ color: "#00ff41" }}
          aria-label="Next screenshot"
        >
          &#x25B6;
        </button>
      </div>
      <div className="mt-2 flex justify-center gap-1.5">
        {screenshots.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIdx(i)}
            className="h-1.5 rounded-full transition-all duration-200"
            style={{
              width: i === idx ? "1rem" : "0.375rem",
              backgroundColor: i === idx ? "#00ff41" : "#006633",
            }}
            aria-label={`Go to screenshot ${i + 1}`}
          />
        ))}
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
        className={`modal-panel relative z-[1] max-h-[90vh] w-full max-w-2xl overflow-y-auto scrollbar-hide ${
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

          {project.screenshots && project.screenshots.length > 0 && (
            <ScreenshotCarousel screenshots={project.screenshots} />
          )}

          {project.paperThumbnail && (
            <div className="mt-5 border-t border-[#006633] pt-4">
              <p
                className="mb-3 text-center text-[10px] uppercase tracking-[0.15em] sm:text-xs"
                style={{ color: "#00cc33" }}
              >
                Published Paper
              </p>
              <a
                href={project.paperThumbnail.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group mx-auto block w-fit"
              >
                <div className="overflow-hidden rounded border border-[#006633] transition-all duration-300 group-hover:border-[#00ff41] group-hover:shadow-[0_0_16px_rgba(0,255,65,0.25)]">
                  <Image
                    src={project.paperThumbnail.src}
                    alt="Paper first page"
                    width={280}
                    height={374}
                    className="object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                </div>
              </a>
            </div>
          )}

          <div className="mt-5 flex items-start justify-center gap-10">
            {project.links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="connect-link group inline-flex flex-col items-center gap-2"
                aria-label={`Open on ${link.label}`}
                title={link.label}
              >
                {link.bgWhite ? (
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white">
                    <Image
                      src={link.icon}
                      alt={link.label}
                      width={28}
                      height={28}
                      className="object-contain"
                      {...(link.remote ? { unoptimized: true } : {})}
                    />
                  </span>
                ) : (
                  <Image
                    src={link.icon}
                    alt={link.label}
                    width={32}
                    height={32}
                    className="object-contain"
                    {...(link.remote ? { unoptimized: true } : {})}
                  />
                )}
                <span
                  className="text-[10px] tracking-[0.15em] opacity-70 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ color: "#ffffff" }}
                >
                  {link.label}
                </span>
              </a>
            ))}
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
          <div className="mt-14 flex w-full max-w-4xl flex-col items-center gap-6">
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
