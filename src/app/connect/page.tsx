"use client";

import Image from "next/image";
import Link from "next/link";
import Particles from "@/components/Particles";
import ScrollReveal from "@/components/ScrollReveal";

function EmailIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#F5B041"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

const LINKS = [
  {
    label: "GitHub",
    href: "https://github.com/kevinsgeo",
    color: "#ffffff",
    icon: <Image src="/github.svg" alt="GitHub" width={32} height={32} />,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/kevin-shine-george-99aa9027a/",
    color: "#0A66C2",
    icon: <Image src="/linkedin.svg" alt="LinkedIn" width={32} height={32} />,
  },
  {
    label: "Email",
    href: "mailto:shinegeorge@wisc.edu",
    color: "#F5B041",
    icon: <EmailIcon />,
  },
];

export default function ConnectPage() {
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
            Let&apos;s Connect!
          </h2>

          <div className="flex items-center gap-10 sm:gap-14">
            {LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("mailto") ? undefined : "_blank"}
                rel={
                  link.href.startsWith("mailto")
                    ? undefined
                    : "noopener noreferrer"
                }
                className="connect-link group flex flex-col items-center gap-3 transition-all duration-300"
                title={link.label}
              >
                {link.icon}
                <span
                  className="text-[10px] tracking-[0.15em] opacity-70 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ color: link.color }}
                >
                  {link.label}
                </span>
              </a>
            ))}
          </div>

          <p
            className="mt-4 max-w-sm text-center text-[10px] leading-relaxed tracking-wider"
            style={{ color: "#00663a" }}
          >
            Feel free to reach out — always happy to chat.
          </p>
        </ScrollReveal>
      </div>

      <Particles count={60} />
    </div>
  );
}
