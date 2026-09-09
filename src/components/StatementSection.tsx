"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { statementSection, site, solutions } from "@/content";
import { gsap, registerGsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useContactModal } from "@/context/ContactModalContext";

export function StatementSection() {
  const { openModal } = useContactModal();
  const sectionRef = useRef<HTMLElement>(null);
  const solidRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const blobRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    registerGsap();
    const section = sectionRef.current;
    if (!section) return;

    const solidLines = solidRef.current?.querySelectorAll<HTMLElement>("[data-line]");
    const ghostLines = ghostRef.current?.querySelectorAll<HTMLElement>("[data-line]");
    const descWords = descRef.current?.querySelectorAll<HTMLElement>("[data-word]");
    const chips = section.querySelectorAll<HTMLElement>("[data-chip]");

    if (reducedMotion) {
      gsap.set([solidLines, ghostLines, descWords, chips, panelRef.current], {
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
      gsap.set(chips, { y: 18, opacity: 0, scale: 0.94 });
      gsap.set(panelRef.current, { y: 40, opacity: 0, scale: 0.97 });
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
          { yPercent: 0, opacity: 1, duration: 0.95, stagger: 0.12 },
          0.08,
        );
      }

      if (ghostLines?.length) {
        tl.to(
          ghostLines,
          { yPercent: 0, opacity: 1, duration: 1, stagger: 0.12 },
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

      tl.to(
        chips,
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.55,
          stagger: 0.06,
          ease: "power2.out",
        },
        0.7,
      );

      if (panelRef.current) {
        tl.to(
          panelRef.current,
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.85,
            ease: "power3.out",
          },
          0.75,
        );
      }

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

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  };

  const descParts = statementSection.description.split(/(\s+)/);

  return (
    <section
      ref={sectionRef}
      id={statementSection.id}
      className="relative overflow-hidden bg-background px-4 pb-[10vw] pt-[max(6rem,12vw)] text-foreground sm:pt-[9vw] lg:px-[2vw] lg:pb-[8vw] lg:pt-[6vw]"
    >
      <div
        ref={blobRef}
        className="pointer-events-none absolute inset-0 opacity-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 15% 40%, rgba(230,43,118,0.12) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 90% 65%, rgba(123,34,141,0.09) 0%, transparent 55%)",
        }}
        aria-hidden
      />

      {/* Soft interactive grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(123,34,141,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(123,34,141,0.06) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage:
            "radial-gradient(ellipse 80% 70% at 50% 40%, #000 20%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 70% at 50% 40%, #000 20%, transparent 75%)",
        }}
        aria-hidden
      />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-12 xl:gap-16">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-3 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-accent">
              Open for new projects
            </span>
          </div>

          <h2 className="text-display font-extrabold leading-[0.92] tracking-[-0.045em]">
            <div ref={solidRef} className="space-y-0">
              {statementSection.solidLines.map((line) => (
                <span key={line} className="block overflow-hidden">
                  <span
                    data-line
                    className="block text-[clamp(2.5rem,7.2vw,5.75rem)] text-foreground will-change-transform"
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
                    className="statement-ghost block text-[clamp(2.5rem,7.2vw,5.75rem)] will-change-transform"
                  >
                    {line}
                  </span>
                </span>
              ))}
            </div>
          </h2>

          <p
            ref={descRef}
            className="mt-7 max-w-[40ch] text-[15px] leading-relaxed text-muted lg:mt-8 lg:text-[17px]"
          >
            {descParts.map((part, i) =>
              /^\s+$/.test(part) ? (
                <span key={`s-${i}`}>{part}</span>
              ) : (
                <span
                  key={`w-${i}`}
                  data-word
                  className="inline-block will-change-transform"
                >
                  {part}
                </span>
              ),
            )}
          </p>

          <div className="mt-7 flex flex-wrap gap-2">
            {solutions.items.map((item) => (
              <a
                key={item.brand}
                data-chip
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring rounded-full border border-foreground/10 bg-white/80 px-3.5 py-2 text-[11px] font-bold tracking-wide text-foreground/70 shadow-[0_4px_16px_rgba(0,0,0,0.03)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/35 hover:text-accent hover:shadow-[0_10px_24px_rgba(230,43,118,0.12)]"
              >
                {item.brand}
              </a>
            ))}
          </div>
        </div>

        {/* Interactive contact panel */}
        <div
          ref={panelRef}
          className="connect-panel relative overflow-hidden rounded-[1.85rem] border border-foreground/[0.07] bg-white/85 p-5 shadow-[0_24px_70px_rgba(123,34,141,0.1)] backdrop-blur-xl will-change-transform lg:p-6"
        >
          <div
            className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-70 blur-2xl"
            style={{
              background:
                "radial-gradient(circle, rgba(230,43,118,0.22), transparent 70%)",
            }}
            aria-hidden
          />

          <div className="relative flex items-center gap-4">
            <div className="relative h-16 w-16 overflow-hidden rounded-2xl ring-2 ring-accent/20 lg:h-[4.5rem] lg:w-[4.5rem]">
              <Image
                src={statementSection.portrait}
                alt={statementSection.portraitAlt}
                fill
                className="object-cover object-top"
                sizes="72px"
                unoptimized
                loading="lazy"
              />
            </div>
            <div className="min-w-0">
              <p className="text-display text-lg font-extrabold tracking-tight">
                {statementSection.portraitAlt}
              </p>
              <p className="mt-0.5 text-[12px] font-medium text-muted">
                Founder · Vaishali Media
              </p>
              <p className="mt-2 text-[13px] font-semibold text-foreground/80">
                {statementSection.prompt}
              </p>
            </div>
          </div>

          <div className="relative mt-6 grid gap-2.5">
            <button
              type="button"
              onClick={() => openModal()}
              className="focus-ring brand-gradient group flex items-center justify-between rounded-2xl px-5 py-4 text-white shadow-[0_12px_32px_rgba(230,43,118,0.28)] transition-transform duration-300 hover:scale-[1.015]"
            >
              <span className="text-[14px] font-extrabold tracking-wide">
                {statementSection.cta.label}
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-lg transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                →
              </span>
            </button>

            <button
              type="button"
              onClick={copyEmail}
              className="focus-ring flex items-center justify-between rounded-2xl border border-foreground/10 bg-[#faf7fb] px-5 py-4 text-left transition-colors hover:border-accent/25 hover:bg-white"
            >
              <span className="min-w-0">
                <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
                  Email
                </span>
                <span className="mt-0.5 block truncate text-[13px] font-semibold text-foreground">
                  {site.email}
                </span>
              </span>
              <span className="shrink-0 rounded-full bg-foreground px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-background">
                {copied ? "Copied" : "Copy"}
              </span>
            </button>

            <div className="grid grid-cols-2 gap-2.5">
              <a
                href={site.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring flex items-center justify-center gap-2 rounded-2xl border border-foreground/10 bg-white px-4 py-3.5 text-[12px] font-bold tracking-wide text-foreground/80 transition-all hover:-translate-y-0.5 hover:border-[#0A66C2]/35 hover:text-[#0A66C2]"
              >
                LinkedIn
              </a>
              <a
                href={site.socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring flex items-center justify-center gap-2 rounded-2xl border border-foreground/10 bg-white px-4 py-3.5 text-[12px] font-bold tracking-wide text-foreground/80 transition-all hover:-translate-y-0.5 hover:border-[#1877F2]/35 hover:text-[#1877F2]"
              >
                Facebook
              </a>
            </div>
          </div>

          <p className="relative mt-5 text-center text-[11px] leading-relaxed text-muted">
            Pick a path above — or jump straight into a conversation.
          </p>
        </div>
      </div>
    </section>
  );
}
