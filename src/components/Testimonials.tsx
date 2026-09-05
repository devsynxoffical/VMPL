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

function partitionItems(items: readonly Item[]) {
  const portraits: Item[] = [];
  const landscapes: Item[] = [];
  const squares: Item[] = [];
  for (const item of items) {
    if (item.height > item.width) portraits.push(item);
    else if (item.width === item.height) squares.push(item);
    else landscapes.push(item);
  }
  return { portraits, landscapes, squares };
}

function PlayIcon({ playing }: { playing: boolean }) {
  if (playing) {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
        <rect x="6" y="5" width="4" height="14" rx="1" />
        <rect x="14" y="5" width="4" height="14" rx="1" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
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
  className = "",
}: {
  item: Item;
  index: number;
  activeId: string | null;
  onActivate: (id: string) => void;
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
        setInView(entry.isIntersecting && entry.intersectionRatio > 0.28),
      { threshold: [0, 0.28, 0.55] },
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

  const toggleMute = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      if (isActive) onActivate("");
      else onActivate(item.id);
    },
    [isActive, item.id, onActivate],
  );

  return (
    <article
      ref={cardRef}
      data-card
      className={`reveal-hidden group relative w-full overflow-hidden rounded-[1.25rem] border border-foreground/[0.06] bg-[#0b0b0d] shadow-[0_12px_40px_rgba(0,0,0,0.06)] transition-[transform,box-shadow,border-color] duration-500 hover:-translate-y-0.5 hover:border-accent/20 hover:shadow-[0_22px_50px_rgba(230,43,118,0.12)] lg:rounded-[1.4rem] ${className}`}
      style={{
        aspectRatio: `${item.width} / ${item.height}`,
        transitionDelay: `${index * 0.05}s`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
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
        width={item.width}
        height={item.height}
        className={`absolute inset-0 h-full w-full ${
          isPortrait ? "object-cover object-top" : "object-cover object-center"
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

      <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-t from-black/55 via-transparent to-black/15" />

      <div className="absolute left-3 top-3 z-[3] sm:left-3.5 sm:top-3.5">
        <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-black/45 px-2 text-[10px] font-bold tracking-[0.08em] text-white/90 backdrop-blur-md">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <div
        className={`absolute bottom-3 right-3 z-[3] flex items-center gap-2 transition-opacity duration-300 sm:bottom-3.5 sm:right-3.5 ${
          hovered || isActive || !playing ? "opacity-100" : "opacity-0 sm:opacity-80"
        }`}
      >
        <button
          type="button"
          onClick={toggleMute}
          className="focus-ring flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md transition hover:bg-white/25"
          aria-label={muted ? "Unmute video" : "Mute video"}
        >
          <SoundIcon muted={muted} />
        </button>
        <button
          type="button"
          onClick={togglePlay}
          className="focus-ring flex h-10 w-10 items-center justify-center rounded-full brand-gradient text-white shadow-[0_8px_24px_rgba(230,43,118,0.35)] transition hover:scale-[1.05]"
          aria-label={playing ? "Pause video" : "Play video"}
        >
          <PlayIcon playing={playing && inView} />
        </button>
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
      className={`flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-start lg:gap-5 ${
        reverse ? "lg:flex-row-reverse" : ""
      }`}
    >
      {/* ~38% keeps portrait height close to two stacked wides */}
      <div className="min-w-0 w-full lg:w-[38%] lg:shrink-0">{tall}</div>
      <div className="flex min-w-0 w-full flex-1 flex-col gap-3 sm:gap-4 lg:gap-5">
        {stack}
      </div>
    </div>
  );
}

export function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const reducedMotion = useReducedMotion();

  const layout = useMemo(() => {
    const { portraits, landscapes, squares } = partitionItems(testimonials.items);
    return {
      // Tall left, two wides stacked right — fills the portrait’s height
      row1Tall: portraits[0],
      row1Stack: [landscapes[0], landscapes[1]].filter(Boolean),
      // Zigzag flip: wide + square left, tall right
      row2Stack: [landscapes[2], squares[0]].filter(Boolean),
      row2Tall: portraits[1],
      // Anything unexpected still renders
      rest: [
        ...portraits.slice(2),
        ...landscapes.slice(3),
        ...squares.slice(1),
      ],
    };
  }, []);

  const indexById = useMemo(() => {
    const map = new Map<string, number>();
    let i = 0;
    const order = [
      layout.row1Tall,
      ...layout.row1Stack,
      ...layout.row2Stack,
      layout.row2Tall,
      ...layout.rest,
    ].filter(Boolean) as Item[];
    for (const item of order) map.set(item.id, i++);
    return map;
  }, [layout]);

  const onActivate = useCallback((id: string) => {
    setActiveId(id || null);
  }, []);

  const renderCard = (item: Item | undefined) => {
    if (!item) return null;
    return (
      <TestimonialVideoCard
        key={item.id}
        item={item}
        index={indexById.get(item.id) ?? 0}
        activeId={activeId}
        onActivate={onActivate}
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
  }, [reducedMotion, layout]);

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className="relative overflow-hidden py-[8vw] lg:py-[6vw]"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[45%] bg-[radial-gradient(ellipse_at_top,rgba(230,43,118,0.09),transparent_62%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-[10%] top-[30%] h-[28rem] w-[28rem] rounded-full opacity-50 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(123,34,141,0.12), transparent 70%)",
        }}
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-[90rem] px-4 lg:px-[2vw]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <span className="section-label">{testimonials.label}</span>
            <h2 className="text-display mt-5 text-[clamp(2rem,4vw,3.25rem)] font-extrabold leading-tight tracking-tight">
              {testimonials.heading}
            </h2>
            <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted lg:text-base">
              {testimonials.description}
            </p>
          </div>
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-foreground/35 lg:pb-1">
            {testimonials.items.length} client stories
          </p>
        </div>

        <div className="mt-8 lg:mt-10">
          <ClientCircleScroller />
        </div>

        <div
          className="mt-10 flex flex-col gap-3 sm:gap-4 lg:mt-12 lg:gap-5"
          role="region"
          aria-label="Client testimonial videos"
        >
          {layout.row1Tall && layout.row1Stack.length > 0 && (
            <BentoRow
              tall={renderCard(layout.row1Tall)}
              stack={<>{layout.row1Stack.map((item) => renderCard(item))}</>}
            />
          )}

          {layout.row2Tall && layout.row2Stack.length > 0 && (
            <BentoRow
              reverse
              tall={renderCard(layout.row2Tall)}
              stack={<>{layout.row2Stack.map((item) => renderCard(item))}</>}
            />
          )}

          {layout.rest.length > 0 && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-5">
              {layout.rest.map((item) => renderCard(item))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
