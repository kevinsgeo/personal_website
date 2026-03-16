"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Particles from "@/components/Particles";
import ScrollReveal from "@/components/ScrollReveal";

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

          {/* Tech Stack */}
          <section className="w-full max-w-2xl">
            <h3
              className="text-center text-sm uppercase tracking-[0.15em] sm:text-base"
              style={{ color: "#00cc33" }}
            >
              Tech Stack
            </h3>
            <div
              className="mb-3 min-h-[1.5rem] text-center text-xs transition-opacity duration-150 text-glow pt-12 sm:pt-16"
              style={{ color: "#00ff41" }}
            >
              {hoveredName ?? "\u00A0"}
            </div>
            <div className="flex flex-col gap-5">
              {TECH_STACK.map((group) => (
                <div key={group.title}>
                  <h4
                    className="mb-2 text-[10px] uppercase tracking-wider"
                    style={{ color: "#00993d" }}
                  >
                    {group.title}
                  </h4>
                  <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
                    {group.items.map((item) => (
                      <TechIcon
                        key={item.slug + item.name}
                        item={item}
                        onHover={setHoveredName}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </ScrollReveal>
      </div>

      <Particles count={60} />
    </div>
  );
}
