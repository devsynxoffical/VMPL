"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { about } from "@/content";
import { gsap, registerGsap, ScrollTrigger, debouncedScrollRefresh } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { BrandLogo } from "@/components/BrandLogo";
import { AboutTimelineSvg } from "@/components/AboutTimelineSvg";

const VB = { w: 1118, h: 2166 };

/** Dot positions on the winding path (viewBox coords) */
const NODES = [
  { x: 1111.09, y: 6.5, side: "right" as const },
  { x: 186.086, y: 341.5, side: "left" as const },
  { x: 105.086, y: 739.5, side: "left" as const },
  { x: 998.086, y: 1092.5, side: "right" as const },
  { x: 582.086, y: 1482.5, side: "left" as const },
  { x: 59.086, y: 1766.5, side: "left" as const },
  { x: 458.086, y: 2129.5, side: "left" as const },
];

const REVEAL_AT = [0.02, 0.14, 0.28, 0.42, 0.56, 0.7, 0.84];

const CARD_STARTS = [
  "-45% top",
  "-22% top",
  "-4% top",
  "11% top",
  "20% top",
  "36% top",
  "58% top",
] as const;

function splitCopy(text: string) {
  const words = text.split(" ");
  if (words.length < 6) return [text];
  const mid = Math.ceil(words.length * 0.55);
  return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
}

/** Pin each card beside its path node — container must match SVG aspect */
function nodeStyle(index: number): CSSProperties {
  const node = NODES[index];
  const top = `${(node.y / VB.h) * 100}%`;
  const x = (node.x / VB.w) * 100;
  const last = index === NODES.length - 1;

  if (node.side === "right") {
    return {
      top,
      right: `calc(${100 - x}% - 2px)`,
      transform: index === 0 ? "translateY(4px)" : "translateY(-18%)",
    };
  }

  return {
    top,
    left: `calc(${x}% - 2px)`,
    // Last card grows upward so it stays inside the path box
    transform: last ? "translateY(-92%)" : "translateY(-18%)",
  };
}

function yearNumber(fullYear: string) {
  return Number(fullYear.slice(2));
}

function formatYear(n: number) {
  return `'${String(Math.round(n)).padStart(2, "0")}`;
}

type CardProps = {
  index: number;
  open: boolean;
  onToggle: () => void;
  cardRef: (el: HTMLDivElement | null) => void;
  yearRef: (el: HTMLDivElement | null) => void;
  wrapRef: (el: HTMLElement | null) => void;
};

function JourneyCard({
  index,
  open,
  onToggle,
  cardRef,
  yearRef,
  wrapRef,
}: CardProps) {
  const entry = about.timeline[index];
  const isRight = NODES[index].side === "right";

  return (
    <article
      ref={wrapRef}
      data-side={isRight ? "right" : "left"}
      className="about-card-wrap z-[6] flex w-max max-w-[min(100%,380px)] items-end gap-2.5 md:absolute md:gap-3"
      style={nodeStyle(index)}
    >
      {!isRight && (
        <div className="about-card-point-wrap relative hidden shrink-0 md:block">
          <div className="about-card-point-line" />
        </div>
      )}

      <div
        ref={cardRef}
        className={`journey-card-anim relative shrink-0 border p-4 shadow-[0_10px_30px_rgba(0,0,0,0.04)] backdrop-blur-[10px] transition-[background,border-color,box-shadow,color] duration-300 md:p-5 ${
          open
            ? "overflow-hidden rounded-[1.15rem] border-white/35 bg-[linear-gradient(201deg,#3b2a42_0%,#1a121e_48%,#2a1d30_98%)] text-white shadow-[0_35px_70px_rgba(0,0,0,0.45)]"
            : "rounded-[0.95rem] border-white/30 bg-[rgba(247,244,248,0.94)]"
        }`}
        style={{ width: "min(calc(100vw - 2.5rem), clamp(240px, 24vw, 360px))" }}
      >
        <div className="flex items-start justify-between gap-3">
          <div
            ref={yearRef}
            data-anim="year"
            data-expanded={open ? "true" : "false"}
            className={`text-display font-extrabold leading-none tracking-[-0.04em] ${
              open
                ? "bg-[linear-gradient(180deg,#ff8fbf,#e62b76)] bg-clip-text text-transparent"
                : "text-accent"
            }`}
            style={{ fontSize: "clamp(2.35rem, 4.2vw, 4.25rem)" }}
          >
            {open ? entry.fullYear : entry.year}
          </div>
          {open && (
            <button
              type="button"
              onClick={onToggle}
              className="focus-ring mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-white/15 text-white transition hover:bg-accent hover:text-white"
              aria-label="Close"
            >
              <span className="relative block h-3.5 w-3.5">
                <span className="absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 rotate-45 rounded bg-current" />
                <span className="absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 -rotate-45 rounded bg-current" />
              </span>
            </button>
          )}
        </div>

        <h3
          className={`text-display mt-2 font-bold leading-[1.1] tracking-tight ${
            open ? "text-white" : "text-foreground"
          }`}
          style={{ fontSize: "clamp(1.05rem, 1.67vw, 2.1rem)" }}
        >
          {splitCopy(entry.title).map((line) => (
            <span key={line} className="journey-split">
              <span data-anim="title-line" className="journey-split-line">
                {line}
              </span>
            </span>
          ))}
        </h3>

        {!open && (
          <p
            className="mt-2 leading-relaxed text-muted"
            style={{ fontSize: "clamp(0.8rem, 0.95vw, 1.05rem)" }}
          >
            {splitCopy(entry.teaser).map((line) => (
              <span key={line} className="journey-split">
                <span data-anim="teaser-line" className="journey-split-line">
                  {line}
                </span>
              </span>
            ))}
          </p>
        )}

        {open && (
          <p
            className="mt-4 max-w-[42ch] leading-relaxed text-white/80"
            style={{ fontSize: "clamp(0.9rem, 1.05vw, 1.2rem)" }}
          >
            {entry.full}
          </p>
        )}

        <div
          className={`mt-[clamp(0.9rem,1.39vw,1.5rem)] flex items-end justify-between gap-3 ${
            open ? "border-t border-white/15 pt-4" : "border-t border-foreground/8 pt-3"
          }`}
        >
          <div data-anim="meta" className="flex min-w-0 items-center gap-[clamp(0.5rem,0.97vw,0.85rem)] overflow-hidden">
            <span data-anim="logo" className="inline-flex origin-bottom">
              <BrandLogo variant="mark" className="h-[clamp(2rem,3vw,2.75rem)] w-[clamp(2rem,3vw,2.75rem)] shrink-0" />
            </span>
            <p
              className={`leading-snug ${open ? "text-white/65" : "text-muted"}`}
              style={{ fontSize: "clamp(0.7rem, 0.85vw, 0.95rem)" }}
            >
              <span className={`font-semibold ${open ? "text-white" : "text-foreground"}`}>
                {entry.attribution}
              </span>
              <br />
              {entry.timeAgo}
            </p>
          </div>
          {!open && (
            <button
              data-anim="cta"
              type="button"
              onClick={onToggle}
              className="focus-ring shrink-0 rounded-[clamp(0.5rem,0.83vw,0.85rem)] border border-foreground/15 bg-[#ebe4ef] px-[clamp(0.85rem,1.39vw,1.25rem)] py-[clamp(0.45rem,0.69vw,0.65rem)] text-[clamp(0.7rem,0.9vw,0.95rem)] font-medium transition-colors hover:bg-accent hover:text-white"
              aria-expanded={open}
            >
              Read more
            </button>
          )}
        </div>
      </div>

      {isRight && (
        <div className="about-card-point-wrap relative hidden shrink-0 md:block">
          <div className="about-card-point-line" />
        </div>
      )}
    </article>
  );
}

export function AboutJourney() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const overflowRef = useRef<HTMLDivElement>(null);
  const blobRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const introRef = useRef<HTMLParagraphElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const yearRefs = useRef<(HTMLDivElement | null)[]>([]);
  const wrapRefs = useRef<(HTMLElement | null)[]>([]);
  const revealedRef = useRef<boolean[]>(about.timeline.map(() => false));
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    registerGsap();
    const section = sectionRef.current;
    const container = containerRef.current;
    const overflow = overflowRef.current;
    if (!section || !container || !overflow) return;

    const showCardFinal = (index: number) => {
      const card = cardRefs.current[index];
      if (!card) return;
      const yearEl = yearRefs.current[index];
      const wrap = wrapRefs.current[index];
      const entry = about.timeline[index];
      const line = wrap?.querySelector<HTMLElement>(".about-card-point-line");
      const titleLines = card.querySelectorAll<HTMLElement>("[data-anim='title-line']");
      const teaserLines = card.querySelectorAll<HTMLElement>("[data-anim='teaser-line']");
      const meta = card.querySelector<HTMLElement>("[data-anim='meta']");
      const logo = card.querySelector<HTMLElement>("[data-anim='logo']");
      const cta = card.querySelector<HTMLElement>("[data-anim='cta']");

      gsap.set(card, { yPercent: 0, opacity: 1, scale: 1, clearProps: "filter" });
      gsap.set(titleLines, { yPercent: 0, clearProps: "transform" });
      gsap.set(teaserLines, { yPercent: 0, clearProps: "transform" });
      if (meta) gsap.set(meta, { yPercent: 0, clearProps: "transform" });
      if (logo) gsap.set(logo, { yPercent: 0, opacity: 1, scale: 1 });
      if (cta) gsap.set(cta, { opacity: 1 });
      if (line) gsap.set(line, { clipPath: "inset(0% 0% 0% 0%)" });
      if (yearEl && yearEl.dataset.expanded !== "true") {
        yearEl.textContent = entry.year;
      }
      revealedRef.current[index] = true;
    };

    const playCard = (index: number, reversed = false) => {
      const card = cardRefs.current[index];
      if (!card) return;
      if (!reversed && revealedRef.current[index]) return;
      if (reversed && !revealedRef.current[index]) return;
      if (reversed) revealedRef.current[index] = false;
      else revealedRef.current[index] = true;

      const yearEl = yearRefs.current[index];
      const wrap = wrapRefs.current[index];
      const entry = about.timeline[index];
      const target = yearNumber(entry.fullYear);
      const line = wrap?.querySelector<HTMLElement>(".about-card-point-line");
      const titleLines = card.querySelectorAll<HTMLElement>("[data-anim='title-line']");
      const teaserLines = card.querySelectorAll<HTMLElement>("[data-anim='teaser-line']");
      const meta = card.querySelector<HTMLElement>("[data-anim='meta']");
      const logo = card.querySelector<HTMLElement>("[data-anim='logo']");
      const cta = card.querySelector<HTMLElement>("[data-anim='cta']");

      if (reversed) {
        gsap.set(card, { yPercent: 10, opacity: 0, scale: 0.6, transformOrigin: "50% 100%" });
        gsap.set(titleLines, { yPercent: 100 });
        gsap.set(teaserLines, { yPercent: 100 });
        if (meta) gsap.set(meta, { yPercent: 100 });
        if (logo) gsap.set(logo, { yPercent: 10, opacity: 0, scale: 0.6 });
        if (cta) gsap.set(cta, { opacity: 0 });
        if (line) gsap.set(line, { clipPath: "inset(100% 0% 0% 0%)" });
        return;
      }

      const tl = gsap.timeline({
        onComplete: () => showCardFinal(index),
      });

      tl.to(
        card,
        {
          yPercent: 0,
          opacity: 1,
          scale: 1,
          duration: 1.1,
          delay: 0.3,
          ease: "expo.out",
          transformOrigin: "50% 100%",
        },
        0,
      );

      if (line) {
        tl.to(
          line,
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.5,
            delay: 0.2,
            ease: "expo.out",
          },
          0,
        );
      }

      if (yearEl && yearEl.dataset.expanded !== "true") {
        const counter = { n: 0 };
        yearEl.textContent = "'00";
        tl.to(
          counter,
          {
            n: target,
            duration: 1.5,
            delay: 0.2,
            ease: "expo.out",
            overwrite: false,
            onUpdate: () => {
              if (yearEl.dataset.expanded === "true") return;
              yearEl.textContent = formatYear(counter.n);
            },
            onComplete: () => {
              if (yearEl.dataset.expanded === "true") return;
              yearEl.textContent = entry.year;
            },
          },
          0,
        );
      }

      if (titleLines.length) {
        tl.to(
          titleLines,
          {
            yPercent: 0,
            duration: 0.6,
            stagger: 0.1,
            delay: 0.3,
            ease: "expo.out",
          },
          0,
        );
      }

      if (teaserLines.length) {
        tl.to(
          teaserLines,
          {
            yPercent: 0,
            duration: 0.6,
            stagger: 0.1,
            delay: 0.4,
            ease: "expo.out",
          },
          0,
        );
      }

      if (logo) {
        tl.to(
          logo,
          {
            yPercent: 0,
            opacity: 1,
            scale: 1,
            duration: 0.5,
            delay: 0.45,
            ease: "power3.inOut",
          },
          0,
        );
      }

      if (meta) {
        tl.to(
          meta,
          {
            yPercent: 0,
            duration: 0.4,
            delay: 0.6,
            ease: "expo.out",
          },
          0,
        );
      }

      if (cta) {
        tl.to(
          cta,
          {
            opacity: 1,
            duration: 1.4,
            delay: 0.8,
            ease: "expo.out",
          },
          0,
        );
      }
    };

    const ctx = gsap.context(() => {
      // Header entrance — label width + line rises (reference data-tl pattern)
      if (!reducedMotion) {
        if (labelRef.current) {
          gsap.fromTo(
            labelRef.current,
            { clipPath: "inset(0 100% 0 0)", opacity: 0 },
            {
              clipPath: "inset(0 0% 0 0)",
              opacity: 1,
              duration: 0.7,
              ease: "expo.inOut",
              scrollTrigger: {
                trigger: section,
                start: "top 90%",
                toggleActions: "restart none restart none",
              },
            },
          );
        }

        const headingLines = headingRef.current?.querySelectorAll("[data-line]");
        if (headingLines?.length) {
          gsap.fromTo(
            headingLines,
            { yPercent: 100 },
            {
              yPercent: 0,
              duration: 0.6,
              stagger: 0.1,
              delay: 0.15,
              ease: "power2.out",
              scrollTrigger: {
                trigger: section,
                start: "top 90%",
                toggleActions: "restart none restart none",
              },
            },
          );
        }

        if (introRef.current) {
          gsap.fromTo(
            introRef.current,
            { y: 24, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.65,
              delay: 0.25,
              ease: "power2.out",
              scrollTrigger: {
                trigger: section,
                start: "top 88%",
                toggleActions: "restart none restart none",
              },
            },
          );
        }
      }

      gsap.to(blobRef.current, {
        y: 80,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      const isDesktop = window.matchMedia("(min-width: 768px)").matches;

      cardRefs.current.forEach((card, index) => {
        if (!card) return;
        const titleLines = card.querySelectorAll("[data-anim='title-line']");
        const teaserLines = card.querySelectorAll("[data-anim='teaser-line']");
        const meta = card.querySelector("[data-anim='meta']");
        const logo = card.querySelector("[data-anim='logo']");
        const cta = card.querySelector("[data-anim='cta']");
        const line = wrapRefs.current[index]?.querySelector(".about-card-point-line");

        if (reducedMotion) {
          gsap.set(card, { opacity: 1, yPercent: 0, scale: 1 });
          gsap.set([titleLines, teaserLines, meta], { yPercent: 0 });
          if (logo) gsap.set(logo, { opacity: 1, scale: 1, yPercent: 0 });
          if (cta) gsap.set(cta, { opacity: 1 });
          if (line) gsap.set(line, { clipPath: "inset(0% 0% 0% 0%)" });
          return;
        }

        gsap.set(card, {
          yPercent: 10,
          opacity: 0,
          scale: 0.6,
          transformOrigin: "50% 100%",
        });
        gsap.set(titleLines, { yPercent: 100 });
        gsap.set(teaserLines, { yPercent: 100 });
        if (meta) gsap.set(meta, { yPercent: 100 });
        if (logo) gsap.set(logo, { yPercent: 10, opacity: 0, scale: 0.6 });
        if (cta) gsap.set(cta, { opacity: 0 });
        if (line) gsap.set(line, { clipPath: "inset(100% 0% 0% 0%)" });
      });

      if (reducedMotion) {
        gsap.set(overflow, { height: "100%" });
        return;
      }

      revealedRef.current = about.timeline.map(() => false);

      if (isDesktop) {
        gsap.set(overflow, { height: "0%" });

        // Reference: height unveil keyframes scrubbed to container scroll
        gsap.to(overflow, {
          ease: "none",
          keyframes: [
            { height: "14%", duration: 2 },
            { height: "28%", duration: 1 },
            { height: "42%", duration: 1.5 },
            { height: "56%", duration: 2 },
            { height: "70%", duration: 1 },
            { height: "84%", duration: 1.5 },
            { height: "100%", duration: 2 },
          ],
          scrollTrigger: {
            trigger: container,
            start: "top 90%",
            end: "bottom 80%",
            scrub: true,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              REVEAL_AT.forEach((at, i) => {
                if (self.progress >= at) playCard(i);
                else playCard(i, true);
              });
            },
            onRefresh: (self) => {
              REVEAL_AT.forEach((at, i) => {
                if (self.progress >= at) showCardFinal(i);
                else playCard(i, true);
              });
            },
          },
        });
      } else {
        gsap.set(overflow, { height: "100%" });
      }

      wrapRefs.current.forEach((wrap, index) => {
        if (!wrap) return;
        ScrollTrigger.create({
          trigger: isDesktop ? container : wrap,
          start: isDesktop ? CARD_STARTS[index] : "top 88%",
          end: "bottom top",
          onEnter: () => playCard(index),
          onEnterBack: () => playCard(index),
          onLeave: () => playCard(index, true),
          onLeaveBack: () => playCard(index, true),
          onRefresh: (self) => {
            if (self.isActive || self.progress > 0) showCardFinal(index);
          },
        });
      });

      requestAnimationFrame(() => ScrollTrigger.refresh());
      setTimeout(() => debouncedScrollRefresh(80)(), 400);
    }, section);

    const onResize = () => debouncedScrollRefresh(120)();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      ctx.revert();
    };
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative z-[1] overflow-x-hidden bg-background pb-[10vw] pt-[3vw] lg:pb-[8vw] lg:pt-[2.5vw]"
    >
      <div
        ref={blobRef}
        className="pointer-events-none absolute left-[28%] top-[12%] z-0 h-[55vw] w-[55vw] max-h-[620px] max-w-[620px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(123,34,141,0.18) 0%, rgba(230,43,118,0.07) 42%, transparent 68%)",
          filter: "blur(48px)",
        }}
        aria-hidden
      />

      <div className="relative z-10 px-5 lg:px-[2vw] lg:pr-[2vw]">
        <div className="max-w-3xl">
          <span
            ref={labelRef}
            className="section-label inline-block overflow-hidden whitespace-nowrap"
          >
            {about.label}
          </span>
          <h2
            ref={headingRef}
            className="text-display mt-5 text-[clamp(2.25rem,5.5vw,4rem)] font-extrabold leading-[0.96] tracking-tight"
          >
            <span className="journey-split">
              <span data-line className="journey-split-line block">
                About Us (&)
              </span>
            </span>
            <span className="journey-split">
              <span data-line className="journey-split-line block">
                Our Journey
              </span>
            </span>
          </h2>
          <p
            ref={introRef}
            className="mt-4 max-w-[40ch] text-[15px] leading-relaxed text-muted lg:text-base"
          >
            {about.intro}
          </p>
        </div>

        <div
          ref={containerRef}
          className="about-card-container relative mt-[clamp(2rem,2.78vw,3.5rem)] w-full overflow-visible md:aspect-[1118/2166]"
        >
          <div className="pointer-events-none absolute inset-0 z-0 hidden text-foreground md:block">
            <div
              ref={overflowRef}
              className="about-timeline-overflow absolute inset-x-0 top-0 overflow-hidden"
              style={{ height: "0%" }}
            >
              <AboutTimelineSvg className="block w-full" />
            </div>
          </div>

          <div className="relative z-[6] flex flex-col gap-10 md:contents">
            {about.timeline.map((entry, index) => (
              <JourneyCard
                key={entry.year}
                index={index}
                open={openIndex === index}
                onToggle={() =>
                  setOpenIndex((prev) => (prev === index ? null : index))
                }
                cardRef={(el) => {
                  cardRefs.current[index] = el;
                }}
                yearRef={(el) => {
                  yearRefs.current[index] = el;
                }}
                wrapRef={(el) => {
                  wrapRefs.current[index] = el;
                }}
              />
            ))}
          </div>
        </div>

        <div
          className="pointer-events-none hidden h-[min(10vw,120px)] md:block"
          aria-hidden
        />
      </div>
    </section>
  );
}
