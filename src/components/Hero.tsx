"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { hero, navItems } from "@/content";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";
import { useHeroScroll } from "@/context/HeroScrollContext";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { BrandLogo } from "@/components/BrandLogo";

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const bgTextRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const navBtnRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const sepRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const statsRef = useRef<HTMLDivElement>(null);
  const traitsRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const portraitBlurRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const primaryCtaRef = useRef<HTMLButtonElement>(null);
  const secondaryCtaRef = useRef<HTMLButtonElement>(null);
  const bottomLeftRef = useRef<HTMLParagraphElement>(null);
  const bottomRightRef = useRef<HTMLParagraphElement>(null);
  const { setProgress } = useHeroScroll();
  const reducedMotion = useReducedMotion();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    registerGsap();
    const container = containerRef.current;
    const pin = pinRef.current;
    if (!container || !pin) return;

    if (reducedMotion) {
      setProgress(1);
      return;
    }

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "+=150%",
          pin: pin,
          scrub: 0.45,
          anticipatePin: 1,
          onUpdate: (self) => setProgress(self.progress),
        },
      });

      // Center stays center
      tl.to(
        portraitRef.current,
        {
          y: -90,
          scale: 1.06,
          opacity: 0,
          filter: "blur(10px)",
          duration: 0.55,
          ease: "power2.inOut",
        },
        0,
      );
      tl.fromTo(
        portraitBlurRef.current,
        { opacity: 0, y: 0, scale: 1 },
        {
          opacity: 0.9,
          y: -30,
          scale: 1.1,
          filter: "blur(30px)",
          duration: 0.55,
          ease: "power2.inOut",
        },
        0.04,
      );
      tl.to(
        bgTextRef.current,
        { y: -70, opacity: 0.35, duration: 0.5, ease: "power2.out" },
        0.08,
      );
      tl.to(
        headlineRef.current,
        { y: -110, opacity: 0, duration: 0.45, ease: "power2.in" },
        0.18,
      );
      tl.to(
        secondaryCtaRef.current,
        { y: -40, opacity: 0, duration: 0.35, ease: "power2.in" },
        0.22,
      );
      tl.to(bottomLeftRef.current, { y: -30, opacity: 0, duration: 0.3 }, 0.2);

      // Hero nav buttons fly into sidebar — stay visible until they dock, then fade
      const sidebarLeft = 36;
      const stackTop = 268;
      const stackGap = 34;

      navBtnRefs.current.forEach((btn, i) => {
        if (!btn) return;
        const rect = btn.getBoundingClientRect();
        const targetX = sidebarLeft - rect.left;
        const targetY = stackTop + i * stackGap - rect.top;

        tl.to(
          btn,
          {
            x: targetX,
            y: targetY,
            scale: 0.9,
            duration: 0.55,
            ease: "power2.inOut",
          },
          0.06 + i * 0.03,
        );
        // fade only at the end of the flight (when sidebar takes over)
        tl.to(
          btn,
          { opacity: 0, duration: 0.12, ease: "power1.in" },
          0.55 + i * 0.03,
        );
      });

      sepRefs.current.forEach((sep, i) => {
        if (!sep) return;
        tl.to(
          sep,
          { opacity: 0, duration: 0.15, ease: "power1.in" },
          0.04 + i * 0.02,
        );
      });

      // Stats fly to sidebar, fade only when docking
      tl.to(
        statsRef.current,
        {
          x: -200,
          y: -40,
          scale: 0.7,
          duration: 0.55,
          ease: "power2.inOut",
        },
        0.1,
      );
      tl.to(
        statsRef.current,
        { opacity: 0, duration: 0.12, ease: "power1.in" },
        0.58,
      );

      // Bio flies to sidebar
      tl.to(
        bottomRightRef.current,
        {
          x: -520,
          y: -140,
          scale: 0.85,
          duration: 0.55,
          ease: "power2.inOut",
        },
        0.12,
      );
      tl.to(
        bottomRightRef.current,
        { opacity: 0, duration: 0.12, ease: "power1.in" },
        0.6,
      );

      // Primary CTA flies to sidebar button slot
      tl.to(
        primaryCtaRef.current,
        {
          x: () => {
            const el = primaryCtaRef.current;
            if (!el) return -300;
            return 48 - el.getBoundingClientRect().left;
          },
          y: 110,
          scale: 0.88,
          duration: 0.55,
          ease: "power2.inOut",
        },
        0.16,
      );
      tl.to(
        primaryCtaRef.current,
        { opacity: 0, duration: 0.12, ease: "power1.in" },
        0.62,
      );

      tl.to(
        traitsRef.current,
        { opacity: 0, y: -20, duration: 0.35, ease: "power2.in" },
        0.1,
      );

      tl.to(
        portraitBlurRef.current,
        { opacity: 0.4, y: -80, duration: 0.35 },
        0.55,
      );

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    });

    mm.add("(max-width: 1023px)", () => {
      const st = ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: "bottom top",
        onUpdate: (self) => setProgress(self.progress),
      });
      return () => st.kill();
    });

    return () => {
      mm.revert();
      setProgress(0);
    };
  }, [reducedMotion, setProgress]);

  return (
    <div ref={containerRef} id="hero" className="relative">
      <div
        ref={pinRef}
        className="relative flex h-screen w-full flex-col overflow-hidden bg-background"
      >
        <div
          ref={bgTextRef}
          className="text-display brand-gradient-text pointer-events-none absolute inset-x-0 top-[5%] z-[1] select-none text-center text-[clamp(4.5rem,20vw,16rem)] font-extrabold leading-none tracking-[-0.06em] will-change-transform"
          aria-hidden
        >
          {hero.bgText}
          <sup className="text-[0.12em] font-bold">®</sup>
        </div>

        <div
          ref={portraitBlurRef}
          className="pointer-events-none absolute left-1/2 top-[5%] z-[2] h-[min(58vh,520px)] w-[min(380px,46vw)] -translate-x-1/2 opacity-0 will-change-transform"
          aria-hidden
        >
          <div className="relative h-full w-full overflow-hidden">
            <Image
              src="/hero.png"
              alt=""
              fill
              className="scale-110 object-cover object-[center_12%] blur-2xl"
              sizes="420px"
            />
          </div>
        </div>

        {/* Same nav items as sidebar — these fly into the sidebar */}
        <nav
          ref={navRef}
          className="absolute inset-x-0 top-[21%] z-[60] hidden lg:block"
          aria-label="Hero navigation"
        >
          <div className="relative mx-auto flex max-w-6xl items-center justify-between px-[4%]">
            <div className="flex items-center">
              {navItems.slice(0, 4).map((item, i) => (
                <span key={item.id} className="flex items-center">
                  {i > 0 && (
                    <span
                      ref={(el) => {
                        sepRefs.current[i - 1] = el;
                      }}
                      className="mx-3 text-foreground/25"
                      aria-hidden
                    >
                      |
                    </span>
                  )}
                  <button
                    ref={(el) => {
                      navBtnRefs.current[i] = el;
                    }}
                    onClick={() => scrollTo(item.id)}
                    className="focus-ring whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.18em] text-foreground will-change-transform lg:text-[11px]"
                  >
                    {item.label}
                  </button>
                </span>
              ))}
            </div>
            <div className="flex items-center">
              {navItems.slice(4).map((item, i) => {
                const idx = i + 4;
                return (
                  <span key={item.id} className="flex items-center">
                    {i > 0 && (
                      <span
                        ref={(el) => {
                          sepRefs.current[idx - 1] = el;
                        }}
                        className="mx-3 text-foreground/25"
                        aria-hidden
                      >
                        |
                      </span>
                    )}
                    <button
                      ref={(el) => {
                        navBtnRefs.current[idx] = el;
                      }}
                      onClick={() => scrollTo(item.id)}
                      className="focus-ring whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.18em] text-foreground will-change-transform lg:text-[11px]"
                    >
                      {item.label}
                    </button>
                  </span>
                );
              })}
            </div>
          </div>
        </nav>

        <div
          ref={statsRef}
          className="absolute left-[5%] top-[34%] z-[55] hidden flex-col gap-3 will-change-transform lg:flex"
        >
          <div className="glass-card rounded-2xl px-4 py-3">
            <div className="flex items-center gap-2">
              <BrandLogo variant="mark" className="h-8 w-8" />
              <span className="text-sm font-bold">
                {hero.stats[0].value}
                {hero.stats[0].suffix} {hero.stats[0].label}
              </span>
            </div>
          </div>
          <div className="glass-card rounded-2xl px-4 py-3">
            <div className="text-display text-2xl font-bold text-accent">
              {hero.stats[1].value}
              {hero.stats[1].suffix}
            </div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted">
              {hero.stats[1].label}
            </div>
          </div>
        </div>

        <div
          ref={traitsRef}
          className="absolute right-[5%] top-[34%] z-30 hidden will-change-transform lg:block"
        >
          <div className="glass-card rounded-3xl px-5 py-4">
            <ul className="space-y-3">
              {hero.traits.map((trait) => (
                <li
                  key={trait}
                  className="flex items-center gap-3 text-sm font-semibold"
                >
                  <span className="h-2 w-2 shrink-0 rounded-full bg-accent" />
                  {trait}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          ref={portraitRef}
          className="pointer-events-none absolute left-1/2 top-[5%] z-20 h-[min(58vh,520px)] w-[min(380px,46vw)] -translate-x-1/2 will-change-transform"
        >
          <div className="relative h-full w-full">
            <Image
              src="/hero.png"
              alt="Vaishali Media Productions"
              fill
              priority
              className="object-cover object-[center_10%]"
              sizes="(max-width: 768px) 70vw, 380px"
            />
            <div className="absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-t from-background via-background/85 to-transparent" />
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-30">
          <div className="bg-gradient-to-t from-background from-[38%] via-background/98 to-transparent px-4 pb-8 pt-20 sm:pt-24 lg:pb-10 lg:pt-28">
            <div
              ref={headlineRef}
              className="mx-auto w-full max-w-3xl text-center will-change-transform"
            >
              <h1 className="text-display text-[clamp(1.75rem,3.6vw,2.85rem)] font-extrabold leading-[1.08] tracking-[-0.03em] text-foreground">
                {hero.headlineLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </h1>
            </div>

            <div className="mx-auto mt-6 flex max-w-xl flex-wrap items-center justify-center gap-3 sm:gap-4">
              <button
                ref={primaryCtaRef}
                onClick={() => scrollTo("solutions")}
                className="btn-primary focus-ring will-change-transform"
              >
                {hero.primaryCta.label}
              </button>
              <button
                ref={secondaryCtaRef}
                onClick={() => scrollTo("projects")}
                className="btn-secondary focus-ring will-change-transform shadow-[0_4px_20px_rgba(123,34,141,0.1)]"
              >
                {hero.secondaryCta.label}
              </button>
            </div>

            <div className="mx-auto mt-7 flex w-full max-w-6xl flex-col gap-3 lg:mt-8 lg:flex-row lg:items-end lg:justify-between lg:px-4">
              <p
                ref={bottomLeftRef}
                className="max-w-xs text-xs font-medium text-foreground will-change-transform lg:text-sm"
              >
                {hero.eyebrow}
              </p>
              <p
                ref={bottomRightRef}
                className="max-w-sm text-xs leading-relaxed text-muted will-change-transform lg:text-right lg:text-sm"
              >
                {hero.positioning}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
