"use client";

import Image from "next/image";
import { solutions } from "@/content";
import { RevealOnScroll } from "@/components/SmoothScroll";

export function Solutions() {
  return (
    <section
      id="solutions"
      className="relative overflow-hidden px-4 py-[8vw] lg:px-[2vw] lg:py-[6vw]"
    >
      <div
        className="pointer-events-none absolute -left-[10%] top-[8%] h-[420px] w-[420px] rounded-full opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(123,34,141,0.12) 0%, rgba(230,43,118,0.05) 45%, transparent 70%)",
        }}
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-5xl">
        <RevealOnScroll>
          <div className="mx-auto max-w-2xl text-center">
            <span className="section-label">{solutions.label}</span>
            <h2 className="text-display mt-5 text-[clamp(1.85rem,3.8vw,3rem)] font-extrabold leading-tight tracking-tight">
              {solutions.heading}
            </h2>
            <p className="mx-auto mt-4 max-w-[42ch] text-[15px] leading-relaxed text-muted">
              {solutions.description}
            </p>
          </div>
        </RevealOnScroll>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:mt-12 lg:grid-cols-4 lg:gap-5">
          {solutions.items.map((item, i) => (
            <RevealOnScroll key={item.title} delay={i * 0.05}>
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring group relative flex h-full flex-col items-center overflow-hidden rounded-[1.35rem] border border-foreground/[0.06] bg-white px-3 pb-4 pt-5 text-center shadow-[0_10px_32px_rgba(123,34,141,0.06)] transition-[transform,box-shadow,border-color] duration-400 hover:-translate-y-1 hover:border-accent/25 hover:shadow-[0_18px_44px_rgba(230,43,118,0.14)] sm:px-4 sm:pb-5 sm:pt-6"
              >
                <span className="absolute left-3 top-3 text-[10px] font-bold tabular-nums tracking-wider text-foreground/25">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div className="relative mb-4 flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-[1.25rem] bg-[#f6f0f8] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] ring-1 ring-foreground/[0.06] transition-transform duration-400 group-hover:scale-105 group-hover:bg-white group-hover:ring-accent/20 sm:h-[5.25rem] sm:w-[5.25rem] sm:rounded-[1.4rem]">
                  <div className="relative h-9 w-9 sm:h-11 sm:w-11">
                    <Image
                      src={item.logo}
                      alt={item.brand}
                      fill
                      className="object-contain"
                      sizes="44px"
                    />
                  </div>
                </div>

                <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-accent sm:text-[10px]">
                  {item.brand}
                </p>
                <h3 className="text-display mt-1.5 text-[0.95rem] font-extrabold leading-snug tracking-tight sm:text-[1.05rem]">
                  {item.title}
                </h3>

                <span className="mt-auto flex items-center gap-1.5 pt-4 text-[10px] font-bold uppercase tracking-wider text-foreground/45 transition-colors group-hover:text-accent">
                  Explore
                  <span
                    className="inline-block transition-transform duration-300 group-hover:translate-x-0.5"
                    aria-hidden
                  >
                    →
                  </span>
                </span>
              </a>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
