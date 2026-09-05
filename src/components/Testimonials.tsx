"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import { testimonials } from "@/content";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { ClientCircleScroller } from "@/components/ClientCircleScroller";

type Item = (typeof testimonials.items)[number];

const objectPosition: Record<Item["id"], string> = {
  "portrait-1": "object-top",
  "landscape-1": "object-center",
  "square-1": "object-center",
  "portrait-2": "object-[center_50%]",
};

/** Bento placement: tall portrait left, landscape top-right, square + portrait bottom-right */
const gridClass: Record<Item["id"], string> = {
  "portrait-1":
    "col-span-1 aspect-[9/16] sm:col-span-6 lg:col-span-4 lg:row-span-2 lg:aspect-auto lg:min-h-[560px]",
  "landscape-1":
    "col-span-1 aspect-video sm:col-span-12 lg:col-span-8 lg:min-h-[270px] lg:aspect-auto",
  "square-1":
    "col-span-1 aspect-square sm:col-span-6 lg:col-span-4 lg:min-h-[270px] lg:aspect-auto",
  "portrait-2":
    "col-span-1 aspect-[9/16] sm:col-span-6 lg:col-span-4 lg:min-h-[270px] lg:aspect-auto",
};

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
}: {
  item: Item;
  index: number;
  activeId: string | null;
  onActivate: (id: string) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const [playing, setPlaying] = useState(false);
  const isActive = activeId === item.id;
  const muted = !isActive;

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting && entry.intersectionRatio > 0.35),
      { threshold: [0, 0.35, 0.6] },
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

    // First interaction always enables sound on this clip
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
      if (isActive) {
        onActivate("");
      } else {
        onActivate(item.id);
      }
    },
    [isActive, item.id, onActivate],
  );

  return (
    <article
      ref={cardRef}
      data-card
      data-orientation={item.orientation}
      className={`reveal-hidden group relative overflow-hidden rounded-[1.35rem] border border-foreground/[0.07] bg-[#0c0c0e] shadow-[0_18px_50px_rgba(0,0,0,0.08)] ${gridClass[item.id]}`}
      style={{ transitionDelay: `${index * 0.07}s` }}
    >
      <div
        className="pointer-events-none absolute inset-0 z-[1] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        aria-hidden
      >
        <div className="absolute inset-0 rounded-[1.35rem] ring-1 ring-inset ring-white/15" />
        <div className="absolute -inset-px rounded-[1.35rem] bg-[linear-gradient(135deg,rgba(230,43,118,0.35),transparent_40%,rgba(123,34,141,0.3))] opacity-70" />
      </div>

      <video
        ref={videoRef}
        data-testimonial-video
        src={item.src}
        className={`absolute inset-0 h-full w-full object-cover ${objectPosition[item.id]}`}
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

      <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-t from-black/55 via-transparent to-black/20" />

      <div className="absolute inset-x-0 bottom-0 z-[3] flex items-end justify-between gap-3 p-3.5 sm:p-4">
        <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white/90 backdrop-blur-md">
          Client
        </span>

        <div className="pointer-events-auto flex items-center gap-2">
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
            className="focus-ring flex h-10 w-10 items-center justify-center rounded-full brand-gradient text-white shadow-[0_8px_24px_rgba(230,43,118,0.35)] transition hover:scale-[1.04]"
            aria-label={playing ? "Pause video" : "Play video"}
          >
            <PlayIcon playing={playing && inView} />
          </button>
        </div>
      </div>
    </article>
  );
}

export function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const reducedMotion = useReducedMotion();

  const onActivate = useCallback((id: string) => {
    setActiveId(id || null);
  }, []);

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
          card.style.transitionDelay = entry.isIntersecting ? `${i * 0.07}s` : "0s";
          card.classList.toggle("reveal-visible", entry.isIntersecting);
        });
      },
      { threshold: 0.12 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className="relative overflow-hidden py-[8vw] lg:py-[6vw]"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[40%] bg-[radial-gradient(ellipse_at_top,rgba(230,43,118,0.08),transparent_60%)]"
        aria-hidden
      />

      <div className="relative z-10 px-4 lg:px-[2vw]">
        <div className="max-w-3xl">
          <span className="section-label">{testimonials.label}</span>
          <h2 className="text-display mt-5 text-[clamp(2rem,4vw,3.25rem)] font-extrabold leading-tight tracking-tight">
            {testimonials.heading}
          </h2>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted lg:text-base">
            Real conversations from clients — tap any clip for sound.
          </p>
        </div>
      </div>

      <div className="relative z-10 mt-8 w-full px-4 lg:mt-10 lg:px-[2vw]">
        <ClientCircleScroller />
      </div>

      <div className="relative z-10 mt-10 px-4 lg:mt-12 lg:px-[2vw]">
        <div
          className="grid grid-cols-1 gap-3 sm:grid-cols-12 sm:gap-4 lg:auto-rows-[minmax(0,1fr)] lg:gap-5"
          role="region"
          aria-label="Client testimonial videos"
        >
          {testimonials.items.map((item, index) => (
            <TestimonialVideoCard
              key={item.id}
              item={item}
              index={index}
              activeId={activeId}
              onActivate={onActivate}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
