"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { statementSection, site } from "@/content";
import { gsap, registerGsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function StatementSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const solidRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    registerGsap();
    const section = sectionRef.current;
    if (!section || reducedMotion) return;

    const ctx = gsap.context(() => {
      const solidLines = solidRef.current?.querySelectorAll("[data-line]");
      const ghostLines = ghostRef.current?.querySelectorAll("[data-line]");

      const replay = {
        toggleActions: "restart none restart none",
        start: "top 78%",
      } as const;

      if (solidLines?.length) {
        gsap.fromTo(
          solidLines,
          { yPercent: 110, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.85,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              ...replay,
            },
          },
        );
      }

      if (ghostLines?.length) {
        gsap.fromTo(
          ghostLines,
          { yPercent: 110, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.1,
            delay: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              ...replay,
            },
          },
        );
      }

      if (descRef.current) {
        gsap.fromTo(
          descRef.current,
          { y: 28, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            delay: 0.2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              ...replay,
            },
          },
        );
      }

      if (ctaRef.current) {
        gsap.fromTo(
          ctaRef.current,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.65,
            delay: 0.28,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              ...replay,
            },
          },
        );
      }
    }, section);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      id={statementSection.id}
      className="relative overflow-hidden bg-background px-4 pb-[10vw] pt-[10vw] text-foreground lg:px-[2vw] lg:pb-[8vw] lg:pt-[7vw]"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 15% 40%, rgba(230,43,118,0.08) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 85% 70%, rgba(123,34,141,0.06) 0%, transparent 55%)",
        }}
        aria-hidden
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <h2 className="text-display font-extrabold leading-[0.92] tracking-[-0.045em]">
          <div ref={solidRef} className="space-y-0">
            {statementSection.solidLines.map((line) => (
              <span key={line} className="block overflow-hidden">
                <span
                  data-line
                  className="block text-[clamp(2.6rem,8vw,6.5rem)] text-foreground"
                >
                  {line}
                </span>
              </span>
            ))}
          </div>
          <div ref={ghostRef} className="mt-1 space-y-0 lg:mt-2">
            {statementSection.ghostLines.map((line) => (
              <span key={line} className="block overflow-hidden">
                <span
                  data-line
                  className="statement-ghost block text-[clamp(2.6rem,8vw,6.5rem)]"
                >
                  {line}
                </span>
              </span>
            ))}
          </div>
        </h2>

        <p
          ref={descRef}
          className="mt-8 max-w-[38ch] text-[15px] leading-relaxed text-muted lg:mt-10 lg:text-[17px]"
        >
          {statementSection.description}
        </p>

        <div
          ref={ctaRef}
          className="mt-10 flex flex-wrap items-center gap-4 lg:mt-12"
        >
          <div className="flex items-center gap-3 rounded-full border border-foreground/10 bg-white/80 py-2 pl-2 pr-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur-sm">
            <div className="relative h-11 w-11 overflow-hidden rounded-full bg-accent/15">
              <Image
                src={statementSection.portrait}
                alt={statementSection.portraitAlt}
                fill
                className="object-cover object-top"
                sizes="44px"
              />
            </div>
            <p className="text-[13px] font-medium text-foreground/80">
              {statementSection.prompt}
            </p>
          </div>

          <a
            href={statementSection.cta.href}
            className="focus-ring brand-gradient inline-flex items-center justify-center rounded-full px-7 py-3.5 text-[13px] font-bold tracking-wide text-white shadow-[0_10px_28px_rgba(230,43,118,0.28)] transition-transform duration-300 hover:scale-[1.03]"
          >
            {statementSection.cta.label}
          </a>

          <a
            href={`mailto:${site.email}`}
            className="focus-ring text-[13px] font-medium text-muted underline-offset-4 hover:text-accent hover:underline"
          >
            {site.email}
          </a>
        </div>
      </div>
    </section>
  );
}
