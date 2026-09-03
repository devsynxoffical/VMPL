"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { projectsSection } from "@/content";
import { gsap, registerGsap, ScrollTrigger, debouncedScrollRefresh } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const CARD_GAP = 20;

function projectDomain(href: string) {
  try {
    return new URL(href).hostname.replace(/^www\./, "");
  } catch {
    return href;
  }
}

export function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const reducedMotion = useReducedMotion();
  const projectCount = projectsSection.projects.length;

  const measure = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    setCardWidth(viewport.clientWidth);
  }, []);

  const getScrollAmount = useCallback(() => {
    const track = trackRef.current;
    if (!track || projectCount <= 1) return 0;

    const cards = track.querySelectorAll<HTMLElement>("[data-card]");
    const first = cards[0];
    if (!first) return 0;

    const w = first.offsetWidth || cardWidth;
    return (w + CARD_GAP) * (projectCount - 1);
  }, [cardWidth, projectCount]);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  useEffect(() => {
    registerGsap();
    const section = sectionRef.current;
    const pin = pinRef.current;
    const track = trackRef.current;
    if (!section || !pin || !track || !cardWidth) return;

    if (reducedMotion) {
      gsap.set(track, { clearProps: "x" });
      return;
    }

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      gsap.set(track, { x: 0 });
      gsap.set(pin, { autoAlpha: 1 });

      const setPinVisible = (visible: boolean) => {
        gsap.set(pin, { autoAlpha: visible ? 1 : 0 });
      };

      const scrollTriggerConfig: ScrollTrigger.Vars = {
        trigger: section,
        start: "top top",
        end: () => `+=${getScrollAmount() * 1.15}`,
        pin,
        pinSpacing: true,
        scrub: 0.45,
        invalidateOnRefresh: true,
        anticipatePin: 1,
        onEnter: () => setPinVisible(true),
        onEnterBack: () => setPinVisible(true),
        onLeave: () => setPinVisible(false),
        onLeaveBack: () => setPinVisible(false),
        onUpdate: (self) => {
          const idx = Math.round(
            self.progress * Math.max(projectCount - 1, 0),
          );
          setActiveIndex((prev) => (prev === idx ? prev : idx));
        },
      };

      if (projectCount > 1) {
        scrollTriggerConfig.snap = {
          snapTo: 1 / (projectCount - 1),
          duration: { min: 0.08, max: 0.18 },
          delay: 0,
          ease: "power1.out",
        };
      }

      const tween = gsap.to(track, {
        x: () => -getScrollAmount(),
        ease: "none",
        scrollTrigger: scrollTriggerConfig,
      });

      const refreshLayout = debouncedScrollRefresh();
      const onResize = () => {
        measure();
        refreshLayout();
      };
      window.addEventListener("resize", onResize);

      return () => {
        window.removeEventListener("resize", onResize);
        tween.scrollTrigger?.kill();
        tween.kill();
        gsap.set(track, { clearProps: "x" });
      };
    });

    mm.add("(max-width: 1023px)", () => {
      gsap.set(track, { clearProps: "x" });
    });

    return () => mm.revert();
  }, [cardWidth, getScrollAmount, measure, projectCount, reducedMotion]);

  return (
    <section ref={sectionRef} id="projects" className="relative isolate">
      <div
        ref={pinRef}
        className="relative z-[1] flex h-[100svh] flex-col overflow-hidden bg-background px-4 pb-5 pt-6 lg:px-8 lg:pb-6 lg:pt-8"
      >
        <div className="mx-auto flex w-full max-w-5xl shrink-0 items-end justify-between gap-4 lg:gap-8">
          <div className="min-w-0">
            <span className="section-label">{projectsSection.label}</span>
            <h2 className="text-display mt-3 text-[clamp(1.5rem,3vw,2.35rem)] font-extrabold leading-[1.05] tracking-tight">
              {projectsSection.heading}
            </h2>
          </div>
          <div className="hidden shrink-0 flex-col items-end gap-2 lg:flex">
            <p className="max-w-[220px] text-right text-xs leading-relaxed text-muted">
              {projectsSection.description}
            </p>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted">
              {String(activeIndex + 1).padStart(2, "0")} /{" "}
              {String(projectCount).padStart(2, "0")}
            </span>
          </div>
        </div>

        <div className="mx-auto flex min-h-0 w-full max-w-5xl flex-1 items-center py-4 lg:py-5">
          <div
            ref={viewportRef}
            className="h-full w-full overflow-hidden max-lg:overflow-x-auto max-lg:snap-x max-lg:snap-mandatory"
          >
            <div
              ref={trackRef}
              className="flex h-full will-change-transform"
              style={{ gap: CARD_GAP }}
              role="list"
              aria-label="Projects"
            >
              {projectsSection.projects.map((project) => (
                <a
                  key={project.index}
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  role="listitem"
                  data-card
                  style={cardWidth ? { width: cardWidth } : undefined}
                  className="focus-ring group relative flex h-full max-lg:w-[calc(100vw-2rem)] shrink-0 snap-center flex-col overflow-hidden rounded-[22px] border border-foreground/[0.08] bg-[#101010] shadow-[0_16px_48px_rgba(0,0,0,0.12)] transition-[border-color,box-shadow] hover:border-accent/35 hover:shadow-[0_20px_56px_rgba(123,34,141,0.12)]"
                >
                  <div className="relative min-h-0 flex-1 overflow-hidden bg-[#0a0a0a]">
                    <Image
                      src={project.image}
                      alt={`${project.name} project screenshot`}
                      fill
                      className="object-contain object-top transition-transform duration-700 group-hover:scale-[1.015]"
                      sizes="(max-width: 1024px) 92vw, 640px"
                      priority={project.index === "01"}
                      onLoad={measure}
                    />
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/50 to-transparent" />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#101010] to-transparent" />

                    <span className="text-display absolute left-4 top-4 text-2xl font-extrabold text-white/85 lg:text-3xl">
                      {project.index}
                    </span>

                    <div className="absolute right-4 top-4 flex flex-wrap justify-end gap-1">
                      {project.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-white/15 bg-black/40 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-white/90 backdrop-blur-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center justify-between gap-3 border-t border-white/[0.06] px-4 py-3 lg:px-5 lg:py-3.5">
                    <div className="min-w-0">
                      <h3 className="text-display truncate text-base font-bold text-white lg:text-lg">
                        {project.name}
                      </h3>
                      <p className="mt-0.5 truncate text-xs text-white/55">
                        {project.description}
                      </p>
                      <p className="mt-1 truncate text-[10px] font-medium text-accent/90">
                        {projectDomain(project.href)}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full border border-white/12 bg-white/[0.07] px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-white/90 transition-colors group-hover:border-accent/40 group-hover:bg-accent/15 group-hover:text-white">
                      Visit →
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mx-auto flex w-full max-w-5xl shrink-0 items-center justify-between gap-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
            Scroll to explore
          </p>
          <div className="flex items-center gap-1.5" aria-hidden>
            {projectsSection.projects.map((_, i) => (
              <span
                key={i}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === activeIndex ? "w-6 bg-accent" : "w-2 bg-foreground/15"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
