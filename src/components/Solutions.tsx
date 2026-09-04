"use client";

import { solutions } from "@/content";
import { BrandMark } from "@/components/BrandMark";
import { RevealOnScroll } from "@/components/SmoothScroll";

const colSpan = (index: number) => {
  if (index < 3) return "lg:col-span-2";
  return "lg:col-span-3";
};

export function Solutions() {
  return (
    <section id="solutions" className="relative overflow-hidden px-4 py-[8vw] lg:px-[2vw] lg:py-[6vw]">
      <div
        className="pointer-events-none absolute -left-[10%] top-[8%] h-[480px] w-[480px] rounded-full opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(123,34,141,0.14) 0%, rgba(230,43,118,0.06) 45%, transparent 70%)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-[5%] bottom-[5%] h-[360px] w-[360px] rounded-full opacity-50 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(230,43,118,0.1) 0%, transparent 68%)",
        }}
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-6xl">
        <RevealOnScroll>
          <span className="section-label">{solutions.label}</span>
          <h2 className="text-display mt-6 max-w-3xl text-[clamp(2rem,4.5vw,3.75rem)] font-extrabold leading-[1.02] tracking-tight">
            {solutions.heading}
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted lg:text-lg">
            {solutions.description}
          </p>
        </RevealOnScroll>

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6 lg:gap-5">
          {solutions.items.map((item, i) => (
            <RevealOnScroll
              key={item.title}
              delay={i * 0.06}
              className={colSpan(i)}
            >
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring group relative flex h-full min-h-[220px] flex-col overflow-hidden rounded-[26px] border border-white/70 bg-white/65 p-6 shadow-[0_10px_44px_rgba(123,34,141,0.07)] backdrop-blur-xl transition-[transform,box-shadow,border-color] duration-500 hover:-translate-y-1.5 hover:border-accent/25 hover:shadow-[0_28px_70px_rgba(230,43,118,0.14)] lg:p-7"
              >
                <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-accent/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="flex items-start justify-between gap-4">
                  <span className="text-display text-xs font-bold tabular-nums tracking-wider text-foreground/25">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <BrandMark
                    src={item.logo}
                    alt={item.brand}
                    className="transition-transform duration-500 group-hover:scale-105 group-hover:ring-accent/20"
                  />
                </div>

                <div className="mt-5 flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-accent">
                    {item.brand}
                  </p>
                  <h3 className="text-display mt-2 text-xl font-bold leading-snug tracking-tight lg:text-[1.35rem]">
                    {item.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between gap-3 border-t border-foreground/[0.06] pt-5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-foreground/80 transition-colors group-hover:text-accent">
                    {item.cta}
                  </span>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-foreground/10 bg-white text-sm font-medium text-foreground/70 transition-all duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-white">
                    →
                  </span>
                </div>
              </a>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
