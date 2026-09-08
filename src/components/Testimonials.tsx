"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import { testimonials } from "@/content";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { ClientCircleScroller } from "@/components/ClientCircleScroller";

type Item = (typeof testimonials.items)[number];

function PlayIcon({ playing }: { playing: boolean }) {
  if (playing) {
    return (
      <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="currentColor" aria-hidden>
        <rect x="6" y="5" width="4" height="14" rx="1" />
        <rect x="14" y="5" width="4" height="14" rx="1" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="currentColor" aria-hidden>
      <path d="M8 5.5v13l11-6.5L8 5.5Z" />
    </svg>
  );
}

function SoundIcon({ muted }: { muted: boolean }) {
  if (muted) {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
        <path
          d="M4 10v4h3l4 3V7L7 10H4Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="m16 9 5 6M21 9l-5 6"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
      <path
        d="M4 10v4h3l4 3V7L7 10H4Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M15.5 8.5a4.5 4.5 0 0 1 0 7M18 6a8 8 0 0 1 0 12"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TestimonialVideoCard({
  item,
  index,
  activeId,
  onActivate,
  aspectRatio = "aspect-video",
  className = "",
}: {
  item: Item;
  index: number;
  activeId: string | null;
  onActivate: (id: string) => void;
  aspectRatio?: string;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [hovered, setHovered] = useState(false);
  const isActive = activeId === item.id;
  const muted = !isActive;
  const isPortrait = item.height > item.width;

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) =>
        setInView(entry.isIntersecting && entry.intersectionRatio > 0.25),
      { threshold: [0, 0.25, 0.5] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = muted;
    video.defaultMuted = muted;
    video.playsInline = true;
    video.loop = true;

    if (!inView) {
      video.pause();
      setPlaying(false);
      return;
    }

    const run = () => {
      const p = video.play();
      if (p && typeof p.catch === "function") {
        p.then(() => setPlaying(true)).catch(() => setPlaying(false));
      }
    };

    if (video.readyState >= 2) run();
    else {
      const onReady = () => run();
      video.addEventListener("loadeddata", onReady, { once: true });
      video.addEventListener("canplay", onReady, { once: true });
      return () => {
        video.removeEventListener("loadeddata", onReady);
        video.removeEventListener("canplay", onReady);
      };
    }
  }, [inView, muted]);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (!isActive) {
      onActivate(item.id);
      video.muted = false;
      try {
        video.currentTime = 0;
      } catch {
        /* ignore seek before loaded */
      }
      video
        .play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
      return;
    }

    if (video.paused) {
      video.play().then(() => setPlaying(true)).catch(() => {});
    } else {
      video.pause();
      setPlaying(false);
    }
  }, [isActive, item.id, onActivate]);

  const handleMouseEnter = useCallback(() => {
    setHovered(true);
    const video = videoRef.current;
    if (video) {
      try {
        video.currentTime = 0;
      } catch {
        /* ignore seek before loaded */
      }
      video.play().then(() => setPlaying(true)).catch(() => {});
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHovered(false);
  }, []);

  const toggleMute = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      if (isActive) {
        onActivate("");
      } else {
        onActivate(item.id);
        const video = videoRef.current;
        if (video) {
          try {
            video.currentTime = 0;
          } catch {}
          video.muted = false;
          video.play().then(() => setPlaying(true)).catch(() => {});
        }
      }
    },
    [isActive, item.id, onActivate],
  );

  return (
    <article
      ref={cardRef}
      data-card
      className={`reveal-hidden group relative w-full ${aspectRatio} overflow-hidden rounded-[1.25rem] border border-foreground/[0.08] bg-[#0b0b0d] shadow-[0_12px_36px_rgba(0,0,0,0.12)] transition-[transform,box-shadow,border-color] duration-500 hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-[0_20px_48px_rgba(230,43,118,0.16)] lg:rounded-[1.4rem] ${className}`}
      style={{
        transitionDelay: `${index * 0.05}s`,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={`pointer-events-none absolute inset-0 z-[1] transition-opacity duration-500 ${
          hovered || isActive ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden
      >
        <div className="absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/15" />
        <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(230,43,118,0.14),transparent_48%,rgba(123,34,141,0.12))]" />
      </div>

      <video
        ref={videoRef}
        data-testimonial-video
        src={item.src}
        className={`absolute inset-0 h-full w-full ${
          isPortrait
            ? "object-cover object-top"
            : item.id === "giulia"
            ? "object-cover object-center scale-[1.02]"
            : "object-cover object-center"
        }`}
        muted
        loop
        playsInline
        preload="metadata"
        controls={false}
        disablePictureInPicture
        disableRemotePlayback
        controlsList="nodownload nofullscreen noremoteplayback"
        onClick={togglePlay}
        aria-label={item.label}
      />

      {/* Gradient for clear, readable text */}
      <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-t from-black/90 via-black/35 to-black/25" />

      {/* Top badges */}
      <div className="absolute left-3 top-3 z-[3] flex items-center gap-2 sm:left-3.5 sm:top-3.5">
        <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-black/60 px-2.5 text-[11px] font-bold tracking-[0.08em] text-white/90 backdrop-blur-md ring-1 ring-white/10">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      {/* Top right quick controls */}
      <div
        className={`absolute right-3 top-3 z-[3] flex items-center gap-1.5 transition-opacity duration-300 sm:right-3.5 sm:top-3.5 ${
          hovered || isActive || !playing ? "opacity-100" : "opacity-0 sm:opacity-85"
        }`}
      >
        <button
          type="button"
          onClick={toggleMute}
          className="focus-ring flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md ring-1 ring-white/10 transition hover:bg-black/80 hover:scale-105 sm:h-8.5 sm:w-8.5"
          aria-label={muted ? "Unmute video" : "Mute video"}
        >
          <SoundIcon muted={muted} />
        </button>
        <button
          type="button"
          onClick={togglePlay}
          className="focus-ring flex h-8 w-8 items-center justify-center rounded-full brand-gradient text-white shadow-[0_4px_16px_rgba(230,43,118,0.35)] transition hover:scale-105 sm:h-8.5 sm:w-8.5"
          aria-label={playing ? "Pause video" : "Play video"}
        >
          <PlayIcon playing={playing && inView} />
        </button>
      </div>

      {/* Bottom overlay card with Name, Role, Result Headline and Metrics */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] p-3.5 sm:p-4 lg:p-4.5">
        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="text-[13.5px] font-extrabold tracking-tight text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.85)] sm:text-[14.5px]">
              {item.name}
            </span>
            <span className="inline-flex items-center rounded-md bg-white/15 px-2 py-0.5 text-[10px] font-semibold text-white/90 backdrop-blur-md ring-1 ring-white/15 sm:text-[10.5px]">
              {item.role}
            </span>
          </div>

          <p className="line-clamp-2 text-[11.5px] font-medium leading-snug text-white/90 drop-shadow-[0_1px_3px_rgba(0,0,0,0.85)] sm:text-[12.5px]">
            {item.headline}
          </p>

          {"metric" in item && Boolean(item.metric) && (
            <div className="mt-0.5 flex items-center gap-1.5">
              <span className="inline-flex items-center rounded bg-accent/30 px-1.5 py-0.5 text-[9.5px] font-bold tracking-wide text-white drop-shadow sm:text-[10px]">
                {item.metric}
              </span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

function BentoRow({
  reverse = false,
  tall,
  stack,
}: {
  reverse?: boolean;
  tall: ReactNode;
  stack: ReactNode;
}) {
  return (
    <div
      className={`flex flex-col gap-3.5 sm:gap-4 lg:flex-row lg:items-start lg:gap-4.5 ${
        reverse ? "lg:flex-row-reverse" : ""
      }`}
    >
      {/* 38.5% width perfectly matches the combined height of two stacked 16:9 landscape cards */}
      <div className="min-w-0 w-full lg:w-[38.5%] lg:shrink-0">{tall}</div>
      <div className="flex min-w-0 w-full flex-1 flex-col gap-3.5 sm:gap-4 lg:gap-4.5">
        {stack}
      </div>
    </div>
  );
}

export function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const reducedMotion = useReducedMotion();

  const onActivate = useCallback((id: string) => {
    setActiveId(id || null);
  }, []);

  const items = testimonials.items;

  // Visual layout mapping:
  // Row 1: Edgar (Portrait 1: #01) + Marie Grace Berg (#02) & Muhammad Ghattas (#03)
  // Row 2: Giulia (#04) & Edgar-Jeremi (#05) + Mohanded (Portrait 2: #06)
  const row1Tall = items.find((i) => i.id === "edgar") ?? items[0];
  const row1Stack = [
    items.find((i) => i.id === "marie-grace-berg"),
    items.find((i) => i.id === "muhammad-ghattas"),
  ].filter(Boolean) as Item[];

  const row2Stack = [
    items.find((i) => i.id === "giulia"),
    items.find((i) => i.id === "edgar-jeremi"),
  ].filter(Boolean) as Item[];
  const row2Tall = items.find((i) => i.id === "mohanded") ?? items[5];

  const visualOrder = [
    row1Tall,
    row1Stack[0],
    row1Stack[1],
    row2Stack[0],
    row2Stack[1],
    row2Tall,
  ].filter(Boolean) as Item[];

  const indexMap = useMemo(() => {
    const map = new Map<string, number>();
    visualOrder.forEach((item, idx) => map.set(item.id, idx));
    return map;
  }, [visualOrder]);

  const renderCard = (
    item: Item | undefined,
    aspectRatio: string = "aspect-video",
  ) => {
    if (!item) return null;
    return (
      <TestimonialVideoCard
        key={item.id}
        item={item}
        index={indexMap.get(item.id) ?? 0}
        activeId={activeId}
        onActivate={onActivate}
        aspectRatio={aspectRatio}
      />
    );
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const cards = section.querySelectorAll<HTMLElement>("[data-card]");
    if (reducedMotion) {
      cards.forEach((card) => card.classList.add("reveal-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        cards.forEach((card, i) => {
          card.style.transitionDelay = entry.isIntersecting
            ? `${i * 0.05}s`
            : "0s";
          card.classList.toggle("reveal-visible", entry.isIntersecting);
        });
      },
      { threshold: 0.08 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className="relative overflow-hidden py-10 sm:py-12 lg:py-16"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[45%] bg-[radial-gradient(ellipse_at_top,rgba(230,43,118,0.09),transparent_62%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-[10%] top-[30%] h-[26rem] w-[26rem] rounded-full opacity-45 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(123,34,141,0.12), transparent 70%)",
        }}
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-[90rem] px-4 lg:px-[2vw]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <span className="section-label">{testimonials.label}</span>
            <h2 className="text-display mt-3.5 text-[clamp(2rem,3.8vw,3.2rem)] font-extrabold leading-tight tracking-tight">
              {testimonials.heading}
            </h2>
            <p className="mt-2.5 max-w-xl text-[14.5px] leading-relaxed text-muted lg:text-[15.5px]">
              {testimonials.description}
            </p>
          </div>
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-foreground/35 lg:pb-1">
            {testimonials.items.length} client stories
          </p>
        </div>

        <div className="mt-7 lg:mt-8">
          <ClientCircleScroller />
        </div>

        {/* Bento Grid */}
        <div
          className="mx-auto mt-8 flex max-w-5xl flex-col gap-4 sm:gap-4.5 lg:mt-10 lg:gap-5"
          role="region"
          aria-label="Client testimonial videos"
        >
          {/* Bento Row 1: Tall Portrait Left + Two 16:9 Landscape Videos Right */}
          <BentoRow
            tall={renderCard(row1Tall, "aspect-[9/16]")}
            stack={
              <>
                {row1Stack.map((item) => renderCard(item, "aspect-video"))}
              </>
            }
          />

          {/* Bento Row 2 (Zigzag): Two 16:9 Landscape Videos Left + Tall Portrait Right */}
          <BentoRow
            reverse
            tall={renderCard(row2Tall, "aspect-[9/16]")}
            stack={
              <>
                {row2Stack.map((item) => renderCard(item, "aspect-video"))}
              </>
            }
          />
        </div>
      </div>
    </section>
  );
}
