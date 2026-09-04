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
  const promptRef = useRef<HTMLDivElement>(null);
  const ctaBtnRef = useRef<HTMLAnchorElement>(null);
  const emailRef = useRef<HTMLAnchorElement>(null);
  const blobRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    registerGsap();
    const section = sectionRef.current;
    if (!section) return;

    const solidLines = solidRef.current?.querySelectorAll<HTMLElement>("[data-line]");
    const ghostLines = ghostRef.current?.querySelectorAll<HTMLElement>("[data-line]");
    const descWords = descRef.current?.querySelectorAll<HTMLElement>("[data-word]");
    const ctaBits = [promptRef.current, ctaBtnRef.current, emailRef.current].filter(
      Boolean,
    );

    if (reducedMotion) {
      gsap.set([solidLines, ghostLines, descWords, ctaBits], {
        clearProps: "all",
        opacity: 1,
        y: 0,
        yPercent: 0,
      });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(solidLines ?? [], { yPercent: 115, opacity: 0 });
      gsap.set(ghostLines ?? [], { yPercent: 115, opacity: 0 });
      gsap.set(descWords ?? [], { y: 18, opacity: 0.15 });
      gsap.set(ctaBits, { y: 28, opacity: 0, scale: 0.96 });
      if (blobRef.current) gsap.set(blobRef.current, { opacity: 0, scale: 0.85 });

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: {
          trigger: section,
          start: "top 72%",
          toggleActions: "restart none restart none",
        },
      });

      if (blobRef.current) {
        tl.to(
          blobRef.current,
          { opacity: 1, scale: 1, duration: 1.1, ease: "power2.out" },
          0,
        );
      }

      if (solidLines?.length) {
        tl.to(
          solidLines,
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.95,
            stagger: 0.12,
          },
          0.08,
        );
      }

      if (ghostLines?.length) {
        tl.to(
          ghostLines,
          {
            yPercent: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.12,
          },
          0.28,
        );
      }

      if (descWords?.length) {
        tl.to(
          descWords,
          {
            y: 0,
            opacity: 1,
            duration: 0.55,
            stagger: 0.028,
            ease: "power2.out",
          },
          0.55,
        );
      }

      if (ctaBits.length) {
        tl.to(
          ctaBits,
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.7,
            stagger: 0.1,
            ease: "power2.out",
          },
          0.85,
        );
      }

      // Soft float after entrance
      if (ghostLines?.length) {
        gsap.to(ghostLines, {
          y: -6,
          duration: 3.2,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          stagger: 0.35,
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
            toggleActions: "play pause resume pause",
          },
        });
      }
    }, section);

    return () => ctx.revert();
  }, [reducedMotion]);

  const descParts = statementSection.description.split(/(\s+)/);

  return (
    <section
      ref={sectionRef}
      id={statementSection.id}
      className="relative overflow-hidden bg-background px-4 pb-[10vw] pt-[max(6rem,14vw)] text-foreground sm:pt-[10vw] lg:px-[2vw] lg:pb-[8vw] lg:pt-[7vw]"
    >
      <div
        ref={blobRef}
        className="pointer-events-none absolute inset-0 opacity-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 15% 40%, rgba(230,43,118,0.1) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 85% 70%, rgba(123,34,141,0.07) 0%, transparent 55%)",
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
                  className="block text-[clamp(2.6rem,8vw,6.5rem)] text-foreground will-change-transform"
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
                  className="statement-ghost block text-[clamp(2.6rem,8vw,6.5rem)] will-change-transform"
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
          {descParts.map((part, i) =>
            /^\s+$/.test(part) ? (
              <span key={`s-${i}`}>{part}</span>
            ) : (
              <span key={`w-${i}`} data-word className="inline-block will-change-transform">
                {part}
              </span>
            ),
          )}
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4 lg:mt-12">
          <div
            ref={promptRef}
            className="flex items-center gap-3 rounded-full border border-foreground/10 bg-white/80 py-2 pl-2 pr-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur-sm will-change-transform"
          >
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
            ref={ctaBtnRef}
            href={statementSection.cta.href}
            className="focus-ring brand-gradient inline-flex items-center justify-center rounded-full px-7 py-3.5 text-[13px] font-bold tracking-wide text-white shadow-[0_10px_28px_rgba(230,43,118,0.28)] transition-transform duration-300 will-change-transform hover:scale-[1.03]"
          >
            {statementSection.cta.label}
          </a>

          <a
            ref={emailRef}
            href={`mailto:${site.email}`}
            className="focus-ring text-[13px] font-medium text-muted underline-offset-4 will-change-transform hover:text-accent hover:underline"
          >
            {site.email}
          </a>
        </div>
      </div>
    </section>
  );
}
