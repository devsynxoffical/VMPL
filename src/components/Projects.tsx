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

type ProjectItem = (typeof projectsSection.projects)[number];

function ProjectCardMedia({
  project,
  videoRef,
  autoPlay,
}: {
  project: ProjectItem;
  videoRef?: (el: HTMLVideoElement | null) => void;
  autoPlay?: boolean;
}) {
  return (
    <>
      {/* Full-bleed atmospheric background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={project.bg}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/85" />
      </div>

      {/* Device screen fills the mid card; copy overlays the bottom */}
      <div className="project-screen pointer-events-none absolute inset-x-[5%] top-[13%] bottom-[20%] z-[5]">
        <div className="relative h-full w-full overflow-hidden rounded-[1.1rem] border border-white/30 bg-[#0b0b0b] shadow-[0_24px_60px_rgba(0,0,0,0.55)] ring-1 ring-black/40 transition-transform duration-700 ease-out group-hover:scale-[1.02] lg:rounded-[1.25rem]">
          <video
            ref={videoRef}
            data-project-video
            src={project.video}
            poster={project.image}
            className="absolute inset-0 h-full w-full object-cover object-top"
            muted
            loop
            playsInline
            autoPlay={autoPlay}
            preload="metadata"
            controls={false}
            disablePictureInPicture
            disableRemotePlayback
            controlsList="nodownload nofullscreen noremoteplayback"
            aria-hidden
            tabIndex={-1}
          />
        </div>
      </div>
    </>
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
          const last = cards[cards.length - 1];
          // Stop when the last card's right edge meets the viewport's right edge
          // (small breathing room). Do not overscroll into empty black.
          const target =
            last.offsetLeft + last.offsetWidth - viewport.clientWidth + 16;
          return Math.max(0, target);
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

        // Hold on card 01 first, then scrub — so early scroll still shows the first card
        const tween = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () =>
              `+=${getDistance() + Math.round(window.innerHeight * 0.55)}`,
            pin: pin,
            pinSpacing: true,
            scrub: 0.55,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: syncActive,
            onRefresh: () => {
              syncActive();
            },
            onEnter: () => {
              if (tween.scrollTrigger && tween.scrollTrigger.progress < 0.02) {
                gsap.set(track, { x: 0 });
              }
            },
          },
        });

        tween.to({}, { duration: 0.4 });
        tween.to(track, {
          x: () => -getDistance(),
          duration: 1,
          ease: "none",
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
      className="relative z-[2] -mt-2 bg-[#050505] text-white"
    >
      <div
        ref={pinRef}
        id="projects"
        className="flex flex-col justify-start gap-6 py-8 md:min-h-[100svh] md:gap-8 md:py-10 lg:gap-9 lg:py-11"
      >
        <div className="w-full shrink-0 px-4 lg:px-[2vw]">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between lg:gap-8 xl:gap-10">
            <h2
              ref={headingRef}
              className="text-display max-w-[18ch] text-[clamp(2rem,4.4vw,3.6rem)] font-extrabold leading-[0.98] tracking-[-0.04em] text-white"
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
              className="max-w-[44ch] text-[14px] leading-relaxed text-white/55 lg:mb-0.5 lg:max-w-[38ch] lg:text-[15px] lg:text-right"
            >
              {projectsSection.description}
            </p>
          </div>
        </div>

        {/* Desktop: pinned horizontal scrub — wide enough that ~2 cards fill the view */}
        <div
          ref={viewportRef}
          className="relative mt-1 hidden w-full overflow-hidden md:block"
        >
          <div
            ref={trackRef}
            className="flex w-max gap-4 will-change-transform pl-4 pr-10 lg:gap-5 lg:pl-[2vw] lg:pr-[4vw]"
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
                className="project-card focus-ring group relative isolate flex h-[min(58vh,560px)] w-[clamp(320px,46vw,560px)] shrink-0 flex-col overflow-hidden rounded-[1.75rem] bg-[#161616] lg:h-[min(60vh,600px)] lg:w-[clamp(360px,44vw,580px)] lg:rounded-[2rem]"
              >
                <ProjectCardMedia
                  project={project}
                  videoRef={(el) => {
                    videoRefs.current[index] = el;
                  }}
                />

                <div className="relative z-10 flex items-start justify-between gap-3 px-4 pt-4 lg:px-5 lg:pt-5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/40 text-[12px] font-bold tracking-wide text-white backdrop-blur-sm lg:h-11 lg:w-11 lg:text-[13px]">
                    {project.index}
                  </span>
                  <div className="flex max-w-[75%] flex-wrap justify-end gap-1.5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/25 bg-black/35 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-white/95 backdrop-blur-sm lg:text-[11px]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Copy sits on a bottom scrim — no empty purple band */}
                <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black via-black/80 to-transparent px-4 pb-4 pt-14 lg:px-5 lg:pb-5 lg:pt-16">
                  <div className="flex items-end gap-3 lg:gap-4">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-display text-[clamp(1.35rem,2.1vw,1.85rem)] font-extrabold leading-tight tracking-tight text-white">
                        {project.name}
                      </h3>
                      <p className="mt-1 text-[12px] leading-snug text-white/75 lg:text-[13px] lg:leading-relaxed">
                        {project.description}
                      </p>
                    </div>
                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors duration-300 lg:h-12 lg:w-12 ${
                        activeIndex === index
                          ? "bg-accent text-white"
                          : "bg-white/15 text-white group-hover:bg-accent"
                      }`}
                      aria-hidden
                    >
                      <ArrowIcon />
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Mobile: vertical stack — same card language */}
        <div className="mt-10 flex flex-col gap-5 px-4 md:hidden lg:px-[2vw]">
          {projectsSection.projects.map((project) => (
            <a
              key={`m-${project.name}`}
              data-mobile-project
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className="project-card focus-ring group relative isolate flex min-h-[72vh] w-full flex-col overflow-hidden rounded-[1.75rem] bg-[#111]"
            >
              <ProjectCardMedia project={project} />

              <div className="relative z-10 flex items-start justify-between gap-3 p-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/40 text-[12px] font-bold text-white backdrop-blur-sm">
                  {project.index}
                </span>
                <div className="flex flex-wrap justify-end gap-1.5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/25 bg-black/35 px-2.5 py-1 text-[10px] font-semibold text-white/95 backdrop-blur-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="relative z-10 mt-auto flex items-end gap-3 p-4 pt-2">
                <div className="min-w-0 flex-1">
                  <h3 className="text-display text-[1.55rem] font-extrabold leading-tight text-white">
                    {project.name}
                  </h3>
                  <p className="mt-1 text-[13px] leading-snug text-white/70">
                    {project.description}
                  </p>
                </div>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent text-white">
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
