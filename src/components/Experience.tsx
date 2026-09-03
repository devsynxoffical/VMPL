"use client";

import { useState } from "react";
import { experience } from "@/content";
import { RevealOnScroll } from "@/components/SmoothScroll";

export function Experience() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const firstEntry = experience.timeline[0];

  return (
    <section
      id="experience"
      className="relative min-h-screen overflow-hidden"
    >
      <div
        className="pointer-events-none absolute inset-0 z-0"
        aria-hidden
      >
        <div className="absolute left-1/2 top-0 h-[80vh] w-[60vw] max-w-2xl -translate-x-1/2 bg-gradient-to-b from-foreground/25 via-foreground/15 to-transparent blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_60%,rgba(90,90,82,0.35)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(229,228,215,0.8)_0%,transparent_50%)]" />
      </div>

      <div className="relative z-10 px-4 py-16 lg:pr-8">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_380px] lg:items-start">
          <div>
            <RevealOnScroll>
              <span className="section-label">{experience.label}</span>
              <h2 className="text-display mt-6 text-[clamp(2rem,4vw,3.5rem)] font-extrabold leading-tight tracking-tight">
                {experience.heading}
              </h2>
              <p className="text-display mt-2 text-2xl font-bold text-accent">
                {experience.founded}
              </p>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">
                {experience.intro}
              </p>
            </RevealOnScroll>

            <RevealOnScroll className="mt-10">
              <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted">
                We&apos;ve had the opportunity to work alongside:
              </p>
              <div className="flex flex-wrap gap-2">
                {experience.workedWith.map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-white/50 px-4 py-2 text-xs font-semibold"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </RevealOnScroll>
          </div>

          {firstEntry && (
            <RevealOnScroll delay={0.15}>
              <article className="glass-card sticky top-8 rounded-3xl p-6 lg:top-24">
                <span className="text-display text-6xl font-extrabold text-accent">
                  {firstEntry.year}
                </span>
                <h3 className="text-display mt-3 text-xl font-bold">
                  {firstEntry.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {firstEntry.teaser}
                </p>
                <div className="mt-5 flex items-center justify-between border-t border-foreground/10 pt-4">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-accent/30" />
                    <span className="text-xs text-muted">
                      {firstEntry.attribution}
                    </span>
                  </div>
                  <button
                    onClick={() => setExpanded(expanded === 0 ? null : 0)}
                    className="focus-ring rounded-full bg-white/60 px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider hover:brand-gradient hover:text-white"
                  >
                    {expanded === 0 ? "Read less" : "Read more"}
                  </button>
                </div>
                {expanded === 0 && (
                  <p className="mt-4 text-sm leading-relaxed text-muted">
                    {firstEntry.full}
                  </p>
                )}
              </article>
            </RevealOnScroll>
          )}
        </div>

        <div className="relative mx-auto mt-20 max-w-5xl pl-10">
          <div className="timeline-line" aria-hidden />
          {experience.timeline.slice(1).map((entry, i) => {
            const idx = i + 1;
            const isOpen = expanded === idx;
            return (
              <RevealOnScroll key={entry.year} delay={i * 0.08}>
                <article className="relative mb-8">
                  <div
                    className={`overflow-hidden rounded-3xl glass-card transition-all ${
                      isOpen ? "p-8" : "p-6"
                    }`}
                    style={{ transitionDuration: "400ms" }}
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="flex-1">
                        <span className="text-display text-5xl font-extrabold text-accent lg:text-7xl">
                          {isOpen ? entry.fullYear : entry.year}
                        </span>
                        <h3 className="text-display mt-2 text-xl font-bold lg:text-2xl">
                          {entry.title}
                        </h3>
                        <p className="mt-3 text-sm leading-relaxed text-muted">
                          {isOpen ? entry.full : entry.teaser}
                        </p>
                        <p className="mt-3 text-xs text-muted/70">
                          {entry.attribution}
                        </p>
                      </div>
                      {!isOpen && (
                        <div className="hidden h-24 w-32 shrink-0 rounded-2xl bg-gradient-to-br from-accent/30 to-foreground/10 lg:block" />
                      )}
                    </div>

                    <button
                      onClick={() => setExpanded(isOpen ? null : idx)}
                      className="focus-ring mt-4 rounded-full bg-white/60 px-5 py-2 text-xs font-bold uppercase tracking-wider transition-colors hover:brand-gradient hover:text-white"
                      aria-expanded={isOpen}
                    >
                      {isOpen ? "Read less" : "Read more"}
                    </button>
                  </div>
                </article>
              </RevealOnScroll>
            );
          })}
        </div>

        <div
          className="pointer-events-none absolute right-4 top-1/4 hidden h-48 w-px bg-foreground/15 lg:block"
          aria-hidden
        >
          <div className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 rounded-full bg-accent" />
        </div>
      </div>
    </section>
  );
}
