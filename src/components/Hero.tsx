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
  const { setProgress, progress } = useHeroScroll();
  const reducedMotion = useReducedMotion();
  // Fixed hero chrome must not leak onto later sections (Team, etc.)
  const showHeroOverlay = progress < 0.2;

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
      gsap.set(bgTextRef.current, { opacity: 1, clearProps: "transform" });
      gsap.set(portraitRef.current, { opacity: 1, visibility: "visible" });
      return;
    }

    const mm = gsap.matchMedia();

    const runIntro = (isDesktop: boolean) => {
      const wordmark = bgTextRef.current;
      const glassEls = (
        isDesktop ? [statsRef.current, traitsRef.current] : []
      ).filter(Boolean);
      const motionEls = [
        ...(isDesktop ? [navRef.current] : []),
        headlineRef.current,
        primaryCtaRef.current,
        secondaryCtaRef.current,
        bottomLeftRef.current,
        bottomRightRef.current,
      ].filter(Boolean);

      // Phase 1: only VAISHALI. Portrait + chrome stay fully hidden.
      gsap.set(portraitRef.current, {
        opacity: 0,
        y: 28,
        scale: 1,
        visibility: "hidden",
        filter: "blur(0px)",
      });
      gsap.set(portraitBlurRef.current, { opacity: 0 });
      // Glass cards: opacity only — transforms kill backdrop-filter
      gsap.set(glassEls, { opacity: 0, visibility: "hidden", clearProps: "transform" });
      gsap.set(motionEls, { opacity: 0, y: 28, visibility: "hidden" });
      gsap.set(wordmark, {
        opacity: 0,
        scale: 1.04,
        x: 0,
        y: 0,
        xPercent: 0,
        force3D: true,
      });

      const intro = gsap.timeline({ defaults: { ease: "power3.out" } });

      // 1) VAISHALI appears in place (no slide)
      intro.to(
        wordmark,
        {
          opacity: 1,
          scale: 1,
          duration: 0.9,
          ease: "power2.out",
        },
        0.15,
      );

      // 2) Portrait + UI — glass cards fade only so frosted blur keeps working
      const heroContent = [portraitRef.current, ...motionEls].filter(Boolean);
      intro.set([...heroContent, ...glassEls], { visibility: "visible" }, "+=0.4");
      intro.to(
        heroContent,
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.05,
          ease: "power2.out",
        },
        "<",
      );
      intro.to(
        glassEls,
        {
          opacity: 1,
          duration: 1,
          stagger: 0.05,
          ease: "power2.out",
          onComplete: () => {
            gsap.set(glassEls, { clearProps: "transform" });
          },
        },
        "<",
      );

      return intro;
    };

    mm.add("(min-width: 1024px)", () => {
      const intro = runIntro(true);

      let headerMove = { x: -420, y: -80, scale: 0.08 };

      const cacheHeaderMove = () => {
        const el = bgTextRef.current;
        const target = document.querySelector<HTMLElement>("[data-dock='header']");
        if (!el || !target) return;

        // Measure dock at settled transform (ignore intro offset)
        const prevX = Number(gsap.getProperty(el, "x")) || 0;
        const prevY = Number(gsap.getProperty(el, "y")) || 0;
        const prevScale = Number(gsap.getProperty(el, "scale")) || 1;
        gsap.set(el, {
          x: 0,
          y: 0,
          scale: 1,
          clearProps: "visibility",
        });
        const a = el.getBoundingClientRect();
        const b = target.getBoundingClientRect();
        headerMove = {
          x: b.left + b.width / 2 - (a.left + a.width / 2),
          y: b.top + b.height / 2 - (a.top + a.height / 2),
          scale: Math.max(0.045, (b.width / a.width) * 0.95),
        };
        gsap.set(el, {
          x: prevX,
          y: prevY,
          scale: prevScale,
        });
      };

      // Dock target exists immediately; measure after layout
      cacheHeaderMove();

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          // Keep pin tight so About enters as soon as home UI clears
          end: "+=105%",
          pin: pin,
          pinSpacing: true,
          scrub: 0.7,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefresh: cacheHeaderMove,
          onUpdate: (self) => setProgress(self.progress),
        },
      });

      // Phase 1 — UI rises out first (Heynesh: text + buttons leave before logo)
      // Explicit fromTo so scrub progress 0 always shows the portrait
      tl.fromTo(
        portraitRef.current,
        {
          y: 0,
          scale: 1,
          opacity: 1,
          filter: "blur(0px)",
        },
        {
          y: -160,
          scale: 1.05,
          opacity: 0,
          filter: "blur(16px)",
          duration: 0.42,
          ease: "power2.inOut",
          immediateRender: false,
        },
        0,
      );
      tl.fromTo(
        portraitBlurRef.current,
        { opacity: 0, y: 0, scale: 1 },
        {
          opacity: 0.75,
          y: -50,
          scale: 1.08,
          filter: "blur(28px)",
          duration: 0.35,
          ease: "power2.inOut",
        },
        0.02,
      );
      tl.to(
        headlineRef.current,
        { y: -180, opacity: 0, duration: 0.35, ease: "power2.in" },
        0.03,
      );
      tl.to(
        [primaryCtaRef.current, secondaryCtaRef.current],
        { y: -100, opacity: 0, duration: 0.32, ease: "power2.in" },
        0.05,
      );
      tl.to(
        navRef.current,
        { y: -90, opacity: 0, duration: 0.32, ease: "power2.in" },
        0.06,
      );
      tl.to(
        [statsRef.current, traitsRef.current],
        { opacity: 0, duration: 0.3, ease: "power2.in" },
        0.05,
      );
      tl.to(
        [bottomLeftRef.current, bottomRightRef.current],
        { y: -55, opacity: 0, duration: 0.28, ease: "power2.in" },
        0.07,
      );

      // Phase 2 — giant VAISHALI docks into sidebar header (Flip-style delta)
      gsap.set(bgTextRef.current, { transformOrigin: "50% 50%" });
      tl.to(
        bgTextRef.current,
        {
          x: () => headerMove.x,
          y: () => headerMove.y,
          scale: () => headerMove.scale,
          duration: 0.5,
          ease: "power2.inOut",
        },
        0.22,
      );
      tl.to(
        bgTextRef.current,
        { opacity: 0, duration: 0.08, ease: "none" },
        0.62,
      );
      tl.set(bgTextRef.current, { visibility: "hidden" }, 0.68);

      // Fully clear residual blur so the handoff isn't an empty portrait frame
      tl.to(
        portraitBlurRef.current,
        { opacity: 0, y: -120, duration: 0.28, ease: "power2.in" },
        0.4,
      );
      tl.set(portraitRef.current, { visibility: "hidden" }, 0.72);
      tl.set(portraitBlurRef.current, { visibility: "hidden" }, 0.72);

      requestAnimationFrame(() => {
        cacheHeaderMove();
        ScrollTrigger.refresh();
      });

      return () => {
        intro.kill();
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    });

    mm.add("(max-width: 1023px)", () => {
      const intro = runIntro(false);
      const mobileUi = [
        headlineRef.current,
        primaryCtaRef.current,
        secondaryCtaRef.current,
        bottomLeftRef.current,
        bottomRightRef.current,
      ].filter(Boolean);

      // Soft parallax exit — no pin (keeps native mobile scroll smooth)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "bottom top",
          scrub: 0.7,
          onUpdate: (self) => setProgress(self.progress),
        },
      });

      tl.to(
        portraitRef.current,
        { yPercent: 12, opacity: 0.55, ease: "none" },
        0,
      );
      tl.to(bgTextRef.current, { yPercent: -18, opacity: 0.35, ease: "none" }, 0);
      tl.to(mobileUi, { y: -36, opacity: 0, ease: "none" }, 0);

      return () => {
        intro.kill();
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    });

    return () => {
      mm.revert();
      setProgress(0);
    };
  }, [reducedMotion, setProgress]);

  return (
    <div ref={containerRef} className="relative">
      <div
        ref={pinRef}
        id="hero"
        className="relative flex h-screen w-full flex-col overflow-visible bg-background"
      >
        {/* VAISHALI — clip wrapper so overflow doesn't kill card backdrop-filter */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-[42%] overflow-hidden">
          <div
            ref={bgTextRef}
            className="text-display brand-gradient-text absolute inset-x-0 top-[5%] select-none px-[0.5%] text-center text-[clamp(4.5rem,20vw,20rem)] font-extrabold leading-none tracking-[-0.04em] will-change-transform"
            style={{ opacity: 0 }}
            aria-hidden
          >
            {hero.bgText}
            <sup className="ml-1 inline-block align-super text-[0.12em] font-bold leading-none">
              ®
            </sup>
          </div>
        </div>

        <div
          ref={portraitBlurRef}
          className="pointer-events-none absolute bottom-0 left-1/2 top-[8%] z-[2] w-[min(92vw,780px)] -translate-x-1/2 opacity-0 will-change-transform sm:top-[5%] lg:top-[3%] lg:w-[min(58vw,780px)]"
          aria-hidden
        >
          <div className="relative h-full w-full">
            <Image
              src="/vaishali-kapoor.png"
              alt=""
              fill
              className="object-contain object-[center_top] blur-2xl"
              sizes="780px"
            />
          </div>
        </div>

        {/* Nav BELOW VAISHALI */}
        <nav
          ref={navRef}
          className="pointer-events-auto absolute inset-x-0 top-[calc(2%+clamp(4.5rem,20vw,20rem)+0.35rem)] z-[50] hidden lg:block"
          aria-label="Hero navigation"
        >
          <div className="mx-auto flex w-full max-w-[96rem] items-center justify-between gap-8 px-[5%]">
            <div className="flex items-center whitespace-nowrap">
              {navItems.slice(0, 4).map((item, i) => (
                <span key={item.id} className="flex items-center">
                  {i > 0 && (
                    <span
                      ref={(el) => {
                        sepRefs.current[i - 1] = el;
                      }}
                      className="mx-3 text-[14px] font-bold leading-none text-foreground/35 xl:mx-3.5"
                      aria-hidden
                    >
                      |
                    </span>
                  )}
                  <button
                    type="button"
                    ref={(el) => {
                      navBtnRefs.current[i] = el;
                    }}
                    onClick={() => scrollTo(item.id)}
                    className="hero-nav-link focus-ring text-[13px] font-bold uppercase tracking-[0.12em] will-change-transform xl:text-[14px]"
                  >
                    <span className="hero-nav-label">{item.label}</span>
                    <span className="hero-nav-label-clone" aria-hidden>
                      {item.label}
                    </span>
                  </button>
                </span>
              ))}
            </div>

            <div className="flex items-center whitespace-nowrap">
              {navItems.slice(4).map((item, i) => {
                const idx = i + 4;
                return (
                  <span key={item.id} className="flex items-center">
                    {i > 0 && (
                      <span
                        ref={(el) => {
                          sepRefs.current[idx - 1] = el;
                        }}
                        className="mx-3 text-[14px] font-bold leading-none text-foreground/35 xl:mx-3.5"
                        aria-hidden
                      >
                        |
                      </span>
                    )}
                    <button
                      type="button"
                      ref={(el) => {
                        navBtnRefs.current[idx] = el;
                      }}
                      onClick={() => scrollTo(item.id)}
                      className="hero-nav-link focus-ring text-[13px] font-bold uppercase tracking-[0.12em] will-change-transform xl:text-[14px]"
                    >
                      <span className="hero-nav-label">{item.label}</span>
                      <span className="hero-nav-label-clone" aria-hidden>
                        {item.label}
                      </span>
                    </button>
                  </span>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Portrait */}
        <div
          ref={portraitRef}
          className="pointer-events-none absolute bottom-0 left-1/2 top-[8%] z-20 w-[min(92vw,780px)] -translate-x-1/2 opacity-0 will-change-transform sm:top-[5%] lg:top-[3%] lg:w-[min(58vw,780px)]"
          style={{ visibility: "hidden" }}
        >
          <div className="relative h-full w-full">
            <Image
              src="/vaishali-kapoor.png"
              alt="Vaishali Media Productions"
              fill
              priority
              className="object-contain object-[center_top]"
              sizes="(max-width: 768px) 95vw, 780px"
            />
            <div className="absolute inset-x-0 bottom-0 h-[12%] bg-gradient-to-t from-background via-background/40 to-transparent" />
          </div>
        </div>

        {/* Headline + CTAs */}
        <div className="absolute inset-x-0 bottom-[max(5.5rem,14%)] z-40 flex justify-center px-4 sm:bottom-[12%] lg:bottom-[9%]">
          <div className="w-full max-w-[min(100%,36rem)] text-center">
            <div ref={headlineRef} className="will-change-transform">
              <h1 className="text-display text-[clamp(2rem,7.5vw,4.25rem)] font-extrabold leading-[0.98] tracking-[-0.045em] text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.35)]">
                {hero.headlineLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </h1>
            </div>

            {/* Mobile stats — SideNav is hidden below lg */}
            <div className="mt-4 flex items-center justify-center gap-2 lg:hidden">
              {hero.stats.map((stat) => (
                <div
                  key={stat.label}
                  className="glass-overlay rounded-2xl px-3 py-2 text-left"
                >
                  <div className="text-display text-sm font-extrabold leading-none text-accent">
                    {stat.value}
                    {stat.suffix}
                  </div>
                  <div className="mt-0.5 max-w-[9ch] text-[9px] font-semibold leading-tight text-foreground/80">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5 sm:mt-6 sm:gap-3.5">
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
                className="btn-secondary focus-ring will-change-transform"
              >
                {hero.secondaryCta.label}
              </button>
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-30 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 lg:px-10 lg:pb-6">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 lg:flex-row lg:items-end lg:justify-between lg:gap-3">
            <p
              ref={bottomLeftRef}
              className="max-w-xs text-[11px] font-semibold leading-snug text-foreground will-change-transform sm:text-xs lg:text-sm"
            >
              {hero.eyebrow}
            </p>
            <p
              ref={bottomRightRef}
              className="hidden max-w-sm text-xs leading-relaxed text-muted will-change-transform sm:block lg:text-right lg:text-sm"
            >
              {hero.positioning}
            </p>
          </div>
        </div>
      </div>

      {/*
        Glass cards OUTSIDE the GSAP pin for backdrop-filter.
        Hidden once hero scroll progresses so they never float over Team/etc.
      */}
      <div
        ref={statsRef}
        className={`pointer-events-none fixed left-[8%] top-[56%] z-[35] hidden flex-col gap-3.5 xl:left-[10%] ${
          showHeroOverlay ? "lg:flex" : "!hidden"
        }`}
        aria-hidden={!showHeroOverlay}
      >
        <div className="glass-hero flex items-center gap-3 rounded-[22px] px-4 py-3.5">
          <BrandLogo variant="mark" className="h-9 w-9 shrink-0" />
          <div className="leading-tight">
            <div className="text-display text-xl font-extrabold tracking-tight text-accent">
              {hero.stats[0].value}
              {hero.stats[0].suffix}
            </div>
            <div className="text-[12px] font-bold text-foreground/90">
              {hero.stats[0].label}
            </div>
          </div>
        </div>
        <div className="glass-hero ml-5 rounded-[22px] px-5 py-4">
          <div className="text-display text-[2.65rem] font-extrabold leading-none tracking-tight text-accent">
            {hero.stats[1].value}
            {hero.stats[1].suffix}
          </div>
          <div className="mt-1 text-[12px] font-bold leading-snug text-foreground/90">
            Years of
            <br />
            experience
          </div>
        </div>
      </div>

      <div
        ref={traitsRef}
        className={`pointer-events-none fixed right-[8%] top-[56%] z-[35] hidden xl:right-[10%] ${
          showHeroOverlay ? "lg:block" : "!hidden"
        }`}
        aria-hidden={!showHeroOverlay}
      >
        <div className="glass-overlay rounded-[26px] px-5 py-4">
          <ul className="space-y-3">
            {hero.traits.map((trait) => (
              <li
                key={trait}
                className="flex items-center gap-3 text-sm font-bold text-foreground/95"
              >
                <span className="h-2 w-2 shrink-0 rounded-full bg-accent" />
                {trait}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
