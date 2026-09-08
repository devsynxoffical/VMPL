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
  showVideo = true,
}: {
  project: ProjectItem;
  videoRef?: (el: HTMLVideoElement | null) => void;
  showVideo?: boolean;
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
          {showVideo ? (
            <video
              ref={videoRef}
              data-project-video
              src={project.video}
              poster={project.image}
              className="absolute inset-0 h-full w-full object-cover object-top"
              muted
              loop
              playsInline
              preload="metadata"
              controls={false}
              disablePictureInPicture
              disableRemotePlayback
              controlsList="nodownload nofullscreen noremoteplayback"
              aria-hidden
              tabIndex={-1}
              onPlay={(e) => {
                e.currentTarget.playbackRate = 2.2;
              }}
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={project.image}
              alt=""
              className="absolute inset-0 h-full w-full object-cover object-top"
            />
          )}
        </div>
      </div>
    </>
  );
}

function playProjectVideo(video: HTMLVideoElement | null) {
  if (!video) return;
  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  video.loop = true;
  video.defaultPlaybackRate = 2.2;
  video.playbackRate = 2.2;
  const run = () => {
    video.playbackRate = 2.2;
    video.play().catch(() => {});
  };
  if (video.readyState >= 2) run();
  else video.addEventListener("canplay", run, { once: true });
}

function stopProjectVideo(video: HTMLVideoElement | null) {
  if (!video) return;
  video.pause();
  try {
    video.currentTime = 0;
  } catch {
    /* ignore seek before ready */
  }
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
  const mobileVideoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(true);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setIsDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Ensure videos start paused on the first frame (poster / frame 0)
  useEffect(() => {
    const videos = [
      ...videoRefs.current,
      ...mobileVideoRefs.current,
    ].filter(Boolean) as HTMLVideoElement[];

    videos.forEach((video) => {
      video.pause();
      const snap = () => {
        try {
          video.currentTime = 0;
        } catch {
          /* ignore */
        }
      };
      if (video.readyState >= 1) snap();
      else video.addEventListener("loadedmetadata", snap, { once: true });
    });
  }, [isDesktop]);

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

        // 1.5x faster horizontal scroll speed
        const tween = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () =>
              `+=${Math.round((getDistance() + Math.round(window.innerHeight * 0.2)) / 1.5)}`,
            pin: pin,
            pinSpacing: true,
            scrub: 0.5,
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

        tween.to({}, { duration: 0.15 });
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
                className="project-card focus-ring group relative isolate flex h-[min(48vh,440px)] w-[clamp(280px,33vw,440px)] shrink-0 flex-col overflow-hidden rounded-[1.4rem] bg-[#161616] lg:h-[min(50vh,470px)] lg:w-[clamp(300px,30vw,460px)] lg:rounded-[1.6rem]"
                onMouseEnter={() => playProjectVideo(videoRefs.current[index])}
                onMouseLeave={() => stopProjectVideo(videoRefs.current[index])}
                onFocus={() => playProjectVideo(videoRefs.current[index])}
                onBlur={() => stopProjectVideo(videoRefs.current[index])}
              >
                <ProjectCardMedia
                  project={project}
                  showVideo={isDesktop}
                  videoRef={(el) => {
                    videoRefs.current[index] = el;
                  }}
                />

                <div className="relative z-10 flex items-start justify-between gap-3 px-3.5 pt-3.5 lg:px-4 lg:pt-4">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/40 text-[11px] font-bold tracking-wide text-white backdrop-blur-sm lg:h-10 lg:w-10 lg:text-[12px]">
                    {project.index}
                  </span>
                  <div className="flex max-w-[75%] flex-wrap justify-end gap-1.5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/25 bg-black/35 px-2.5 py-0.5 text-[10px] font-semibold tracking-wide text-white/95 backdrop-blur-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Copy sits on a bottom scrim — no empty purple band */}
                <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black via-black/80 to-transparent px-3.5 pb-3.5 pt-10 lg:px-4 lg:pb-4 lg:pt-12">
                  <div className="flex items-end gap-3 lg:gap-3.5">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-display text-[clamp(1.15rem,1.7vw,1.45rem)] font-extrabold leading-tight tracking-tight text-white">
                        {project.name}
                      </h3>
                      <p className="mt-1 text-[11.5px] leading-snug text-white/75 lg:text-[12.5px] lg:leading-snug">
                        {project.description}
                      </p>
                    </div>
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors duration-300 lg:h-10 lg:w-10 ${
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
        <div className="mt-8 flex flex-col gap-4 px-4 md:hidden lg:px-[2vw]">
          {projectsSection.projects.map((project, index) => (
            <a
              key={`m-${project.name}`}
              data-mobile-project
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className="project-card focus-ring group relative isolate flex min-h-[50vh] max-h-[440px] w-full flex-col overflow-hidden rounded-[1.35rem] bg-[#111]"
              onTouchStart={() =>
                playProjectVideo(mobileVideoRefs.current[index])
              }
              onTouchEnd={() =>
                stopProjectVideo(mobileVideoRefs.current[index])
              }
              onTouchCancel={() =>
                stopProjectVideo(mobileVideoRefs.current[index])
              }
            >
              <ProjectCardMedia
                project={project}
                showVideo={!isDesktop}
                videoRef={(el) => {
                  mobileVideoRefs.current[index] = el;
                }}
              />

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
