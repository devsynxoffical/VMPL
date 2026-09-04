"use client";

import { useEffect, useRef, useState } from "react";
import { projectsSection } from "@/content";
import { gsap, registerGsap, ScrollTrigger, debouncedScrollRefresh } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[42%] w-[42%]"
      fill="none"
      aria-hidden
    >
      <path
        d="M7 17 17 7M10 7h7v7"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const reducedMotion = useReducedMotion();

  const sectionInViewRef = useRef(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const getVideos = () =>
      Array.from(
        section.querySelectorAll<HTMLVideoElement>("video[data-project-video]"),
      ).filter((video) => {
        const style = window.getComputedStyle(video);
        // Skip the hidden breakpoint set (desktop vs mobile duplicate)
        return style.display !== "none" && style.visibility !== "hidden";
      });

    const forcePlay = (video: HTMLVideoElement) => {
      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;
      video.loop = true;
      if (video.preload !== "auto") video.preload = "auto";

      const run = () => {
        if (!sectionInViewRef.current) return;
        const play = video.play();
        if (play && typeof play.catch === "function") {
          play.catch(() => {
            // Recover from intermittent autoplay / decode stalls
            window.setTimeout(() => {
              if (!sectionInViewRef.current) return;
              video.play().catch(() => {});
            }, 250);
          });
        }
      };

      if (video.readyState >= 2) {
        run();
      } else {
        const onReady = () => run();
        video.addEventListener("loadeddata", onReady, { once: true });
        video.addEventListener("canplay", onReady, { once: true });
      }
    };

    const playAll = () => {
      getVideos().forEach(forcePlay);
    };

    const pauseAll = () => {
      getVideos().forEach((video) => {
        video.pause();
      });
    };

    const onStall = (e: Event) => {
      const video = e.currentTarget as HTMLVideoElement;
      if (!sectionInViewRef.current) return;
      forcePlay(video);
    };

    registerGsap();

    const bindStallHandlers = () => {
      getVideos().forEach((video) => {
        video.addEventListener("stalled", onStall);
        video.addEventListener("error", onStall);
      });
    };

    const unbindStallHandlers = () => {
      section
        .querySelectorAll<HTMLVideoElement>("video[data-project-video]")
        .forEach((video) => {
          video.removeEventListener("stalled", onStall);
          video.removeEventListener("error", onStall);
        });
    };

    bindStallHandlers();

    const st = ScrollTrigger.create({
      trigger: section,
      start: "top 85%",
      end: "bottom top",
      onToggle: (self) => {
        sectionInViewRef.current = self.isActive;
        if (self.isActive) playAll();
        else pauseAll();
      },
      onRefresh: (self) => {
        sectionInViewRef.current = self.isActive;
        if (self.isActive) playAll();
      },
    });

    sectionInViewRef.current = st.isActive;
    if (st.isActive) playAll();

    // Keep every card alive while pinned — recover any that drop out
    const watchdog = window.setInterval(() => {
      if (!sectionInViewRef.current) return;
      getVideos().forEach((video) => {
        if (video.paused || video.ended) forcePlay(video);
      });
    }, 900);

    const t1 = window.setTimeout(playAll, 200);
    const t2 = window.setTimeout(playAll, 800);

    return () => {
      window.clearInterval(watchdog);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      unbindStallHandlers();
      st.kill();
      pauseAll();
    };
  }, []);

  useEffect(() => {
    registerGsap();
    const section = sectionRef.current;
    const pin = pinRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!section || !pin || !viewport || !track) return;

    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      const lines = headingRef.current?.querySelectorAll("[data-line]");
      if (lines?.length) {
        gsap.fromTo(
          lines,
          { yPercent: 100 },
          {
            yPercent: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              toggleActions: "restart none restart none",
            },
          },
        );
      }

      if (descRef.current) {
        gsap.fromTo(
          descRef.current,
          { y: 18, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            delay: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 78%",
              toggleActions: "restart none restart none",
            },
          },
        );
      }

      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const getDistance = () => {
          const cards = cardRefs.current.filter(Boolean) as HTMLAnchorElement[];
          if (!cards.length) {
            return Math.max(0, track.scrollWidth - viewport.clientWidth);
          }
          const style = window.getComputedStyle(track);
          const padRight = parseFloat(style.paddingRight) || 0;
          const last = cards[cards.length - 1];
          // Prefer offset math — scrollWidth can under-report with transformed tracks
          const contentEnd = last.offsetLeft + last.offsetWidth + padRight;
          return Math.max(0, contentEnd - viewport.clientWidth);
        };

        const syncActive = () => {
          const cards = cardRefs.current.filter(Boolean) as HTMLAnchorElement[];
          if (!cards.length) return;
          const mid =
            viewport.getBoundingClientRect().left + viewport.clientWidth / 2;
          let best = 0;
          let bestDist = Infinity;
          cards.forEach((card, i) => {
            const rect = card.getBoundingClientRect();
            const center = rect.left + rect.width / 2;
            const dist = Math.abs(center - mid);
            if (dist < bestDist) {
              bestDist = dist;
              best = i;
            }
          });
          setActiveIndex((prev) => (prev === best ? prev : best));
        };

        gsap.set(track, { x: 0, force3D: true });
        syncActive();

        // Scroll distance must cover the full track; pin stays until last card.
        const tween = gsap.to(track, {
          x: () => -getDistance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => {
              const dist = getDistance();
              // Full track travel + brief settle at start/end
              return `+=${Math.max(dist * 1.15, dist + window.innerHeight * 0.55)}`;
            },
            pin: pin,
            pinSpacing: true,
            scrub: 0.55,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: syncActive,
            onRefresh: syncActive,
          },
        });

        const refresh = () => {
          ScrollTrigger.refresh();
          syncActive();
        };

        requestAnimationFrame(refresh);
        const lateRefresh = window.setTimeout(refresh, 250);

        const onResize = debouncedScrollRefresh(120);
        window.addEventListener("resize", onResize);

        return () => {
          window.clearTimeout(lateRefresh);
          window.removeEventListener("resize", onResize);
          tween.scrollTrigger?.kill();
          tween.kill();
        };
      });

      mm.add("(max-width: 767px)", () => {
        const mobileCards = section.querySelectorAll<HTMLElement>(
          "[data-mobile-project]",
        );
        mobileCards.forEach((card) => {
          gsap.fromTo(
            card,
            { y: 40, opacity: 0, scale: 0.96 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.7,
              ease: "power3.out",
              scrollTrigger: {
                trigger: card,
                start: "top 88%",
                toggleActions: "restart none restart none",
              },
            },
          );
        });
      });

      return () => mm.revert();
    }, section);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative z-[2] -mt-2 bg-[#050505] text-white"
    >
      <div
        ref={pinRef}
        className="flex flex-col justify-center py-8 md:min-h-[100svh] lg:py-10"
      >
        <div className="mx-auto w-full max-w-[92rem] px-4 lg:px-[2vw]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
            <h2
              ref={headingRef}
              className="text-display max-w-[16ch] text-[clamp(2rem,4.4vw,3.6rem)] font-extrabold leading-[0.98] tracking-[-0.04em] text-white"
            >
              {projectsSection.headingLines.map((line) => (
                <span key={line} className="block overflow-hidden">
                  <span data-line className="block">
                    {line}
                  </span>
                </span>
              ))}
            </h2>
            <p
              ref={descRef}
              className="max-w-[36ch] text-[14px] leading-relaxed text-white/55 lg:mb-1 lg:text-[15px] lg:text-right"
            >
              {projectsSection.description}
            </p>
          </div>
        </div>

        {/* Desktop: pinned horizontal scrub — wider cards for landscape video */}
        <div
          ref={viewportRef}
          className="relative mt-7 hidden overflow-hidden md:block lg:mt-9"
        >
          <div
            ref={trackRef}
            className="flex w-max gap-5 will-change-transform pl-[clamp(1.25rem,10vw,8rem)] pr-[clamp(1.25rem,16vw,12rem)] lg:gap-6 lg:pl-[clamp(2rem,12vw,10rem)] lg:pr-[clamp(2rem,18vw,14rem)]"
          >
            {projectsSection.projects.map((project, index) => (
              <a
                key={project.name}
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                className="project-card focus-ring group relative isolate flex h-[min(46vh,440px)] w-[min(62vw,740px)] shrink-0 flex-col overflow-hidden rounded-[1.5rem] bg-[#111] lg:h-[min(48vh,480px)] lg:w-[min(56vw,780px)] lg:rounded-[1.75rem]"
              >
                <div className="project-screen absolute inset-0 overflow-hidden">
                  <video
                    ref={(el) => {
                      videoRefs.current[index] = el;
                    }}
                    data-project-video
                    src={project.video}
                    poster={project.image}
                    className="pointer-events-none absolute left-1/2 top-1/2 h-full min-h-full w-full min-w-full -translate-x-1/2 -translate-y-1/2 object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    muted
                    loop
                    playsInline
                    preload="auto"
                    controls={false}
                    disablePictureInPicture
                    disableRemotePlayback
                    controlsList="nodownload nofullscreen noremoteplayback"
                    aria-hidden
                    tabIndex={-1}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/15 to-black/85" />
                  <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-black via-black/70 to-transparent" />
                </div>

                <div className="relative z-10 flex items-start justify-between gap-3 p-4 lg:p-5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/35 text-[12px] font-bold tracking-wide text-white backdrop-blur-sm lg:h-11 lg:w-11 lg:text-[13px]">
                    {project.index}
                  </span>
                  <div className="flex max-w-[70%] flex-wrap justify-end gap-1.5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-black/55 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-white/90 backdrop-blur-sm lg:text-[11px]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="relative z-10 mt-auto flex items-end justify-between gap-4 p-4 lg:p-5">
                  <div className="min-w-0 max-w-[78%]">
                    <h3 className="text-display text-[clamp(1.35rem,2.1vw,1.85rem)] font-extrabold leading-tight tracking-tight text-white">
                      {project.name}
                    </h3>
                    <p className="mt-1.5 line-clamp-2 text-[12px] leading-relaxed text-white/70 lg:text-[13px]">
                      {project.description}
                    </p>
                  </div>

                  <span
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-colors duration-300 lg:h-14 lg:w-14 ${
                      activeIndex === index
                        ? "bg-accent text-white"
                        : "bg-white/15 text-white group-hover:bg-accent"
                    }`}
                    aria-hidden
                  >
                    <ArrowIcon />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Mobile: vertical stack */}
        <div className="mt-10 flex flex-col gap-5 px-4 md:hidden lg:px-[2vw]">
          {projectsSection.projects.map((project, index) => (
            <a
              key={`m-${project.name}`}
              data-mobile-project
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className="project-card focus-ring group relative isolate flex aspect-[16/10] min-h-0 w-full flex-col overflow-hidden rounded-[1.5rem] bg-[#111]"
            >
              <div className="project-screen absolute inset-0 overflow-hidden">
                <video
                  data-project-video
                  src={project.video}
                  poster={project.image}
                  className="pointer-events-none absolute left-1/2 top-1/2 h-full min-h-full w-full min-w-full -translate-x-1/2 -translate-y-1/2 object-cover object-center"
                  muted
                  loop
                  playsInline
                  preload="auto"
                  controls={false}
                  disablePictureInPicture
                  aria-hidden
                  tabIndex={-1}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/15 to-black/85" />
                <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-black via-black/70 to-transparent" />
              </div>

              <div className="relative z-10 flex items-start justify-between gap-3 p-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/35 text-[12px] font-bold text-white backdrop-blur-sm">
                  {project.index}
                </span>
                <div className="flex flex-wrap justify-end gap-1.5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-black/55 px-2.5 py-1 text-[10px] font-semibold text-white/90 backdrop-blur-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="relative z-10 mt-auto flex items-end justify-between gap-4 p-5">
                <div className="min-w-0 max-w-[75%]">
                  <h3 className="text-display text-[1.55rem] font-extrabold leading-tight text-white">
                    {project.name}
                  </h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-white/70">
                    {project.description}
                  </p>
                </div>
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent text-white">
                  <ArrowIcon />
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
