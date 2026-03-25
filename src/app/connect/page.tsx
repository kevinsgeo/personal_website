"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Particles from "@/components/Particles";
import ScrollReveal from "@/components/ScrollReveal";

const YOUR_EMAIL = "shinegeorge@wisc.edu";

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
  {
    label: "Letterboxd",
    href: "https://letterboxd.com/DoughnutDaddy/",
    color: "#00e054",
    icon: <Image src="/letterboxd.svg" alt="Letterboxd" width={32} height={32} />,
  },
  {
    label: "Spotify",
    href: "https://open.spotify.com/user/472fmmye4sqey8a3twk1w1q2t?si=8516e297736a412e",
    color: "#1DB954",
    icon: <Image src="/spotify.svg" alt="Spotify" width={32} height={32} />,
  },
];

type SubmitStatus = "idle" | "sending" | "success" | "error";

export default function ConnectPage() {
  const [senderEmail, setSenderEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const submittedRef = useRef(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submittedRef.current || status === "sending") return;
    submittedRef.current = true;
    setStatus("sending");
    setErrorMessage("");

    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senderEmail, message }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus("error");
        setErrorMessage(data.error ?? "Something went wrong.");
        submittedRef.current = false;
        return;
      }
      setStatus("success");
      setMessage("");
      setSenderEmail("");
      submittedRef.current = false;
    } catch {
      setStatus("error");
      setErrorMessage("Network error. Try again.");
      submittedRef.current = false;
    }
  };

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

          {/* Chat box: send email directly */}
          <section
            className="nes-container with-title is-dark is-rounded w-full max-w-md"
            style={{ marginTop: "0.5rem" }}
          >
            <p className="title" style={{ color: "#00ff41" }}>
              Send a message
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label
                  htmlFor="sender-email"
                  className="mb-1 block text-xs tracking-wider"
                  style={{ color: "#00cc33" }}
                >
                  Your email
                </label>
                <input
                  id="sender-email"
                  type="email"
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="nes-input is-dark w-full text-xs"
                  style={{
                    color: "#00ff41",
                    borderColor: "rgba(0,255,65,0.4)",
                  }}
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="mb-1 block text-xs tracking-wider"
                  style={{ color: "#00cc33" }}
                >
                  Message
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  required
                  rows={4}
                  className="nes-textarea is-dark w-full resize-y text-xs"
                  style={{
                    color: "#00ff41",
                    borderColor: "rgba(0,255,65,0.4)",
                  }}
                />
              </div>
              {status === "success" && (
                <p className="text-sm" style={{ color: "#00ff41" }}>
                  Sent. I&apos;ll reply to your email.
                </p>
              )}
              {status === "error" && (
                <p className="text-sm" style={{ color: "#f5b041" }}>
                  {errorMessage}
                </p>
              )}
              <button
                type="submit"
                className="nes-btn is-success self-end"
                disabled={status === "sending"}
              >
                {status === "sending" ? "Sending…" : "Send"}
              </button>
            </form>
          </section>

          <p
            className="mt-4 max-w-sm text-center text-[10px] leading-relaxed tracking-wider"
            style={{ color: "#00663a" }}
          >
            Feel free to reach out - always happy to chat.
          </p>
        </ScrollReveal>
      </div>

      <Particles count={60} />
    </div>
  );
}
