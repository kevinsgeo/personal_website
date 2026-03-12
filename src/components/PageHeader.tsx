"use client";

import Link from "next/link";

export default function PageHeader({ title = "Kevin Shine George" }: { title?: string }) {
  return (
    <div className="flex w-full flex-col items-center pt-12">
      <div className="flex flex-col items-center gap-4">
        <Link href="/" className="group">
          <h1 className="text-glow text-2xl tracking-wider text-green transition-all duration-300 sm:text-3xl md:text-4xl lg:text-5xl group-hover:brightness-125">
            {title}
          </h1>
        </Link>
        <p className="text-xs tracking-[0.3em] uppercase text-green-dim sm:text-sm">
          Welcome to my corner of the internet
        </p>
      </div>

      <div
        className="mt-6 h-px"
        style={{
          width: "42rem",
          maxWidth: "90vw",
          background:
            "linear-gradient(to right, transparent, rgba(0,255,65,0.25), #00ff41, rgba(0,255,65,0.25), transparent)",
        }}
      />

      <div className="mt-6 self-start pl-6 sm:pl-12">
        <Link href="/" className="nes-btn is-success" style={{ fontSize: "0.65rem" }}>
          &lt; Back
        </Link>
      </div>
    </div>
  );
}
