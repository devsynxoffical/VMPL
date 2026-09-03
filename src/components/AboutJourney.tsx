"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { about } from "@/content";
import { gsap, registerGsap, ScrollTrigger, debouncedScrollRefresh } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { BrandLogo } from "@/components/BrandLogo";

type Anchor = { x: number; y: number; len: number };

function yearNumber(fullYear: string) {
  return Number(fullYear.slice(2));
}

function formatYear(n: number) {
  return `'${String(Math.round(n)).padStart(2, "0")}`;
}

const CARD_OFFSETS = [
  "",
  "md:translate-y-24",
  "md:translate-y-8",
  "md:translate-y-28",
  "md:translate-y-4",
  "md:translate-y-20",
  "md:translate-y-12",
];

export function AboutJourney() {
  const sectionRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<SVGPathElement>(null);
  const tailRef = useRef<SVGPathElement>(null);
  const dotsRef = useRef<SVGGElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const animRefs = useRef<(HTMLElement | null)[]>([]);
  const blobRef = useRef<HTMLDivElement>(null);
  const anchorsRef = useRef<Anchor[]>([]);
  const pathLengthRef = useRef(0);
  const drawTweenRef = useRef<gsap.core.Tween | null>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const reducedMotion = useReducedMotion();

  const syncCards = useCallback((drawn: number) => {
    const pathLength = pathLengthRef.current;
    if (!pathLength) return;

    animRefs.current.forEach((shell, index) => {
      if (!shell) return;
      const anchor = anchorsRef.current[index];
      if (!anchor) return;

      const yearEl = shell.querySelector<HTMLElement>('[data-anim="year"]');
      const entry = about.timeline[index];
      const targetYear = yearNumber(entry.fullYear);

      const prevLen = index === 0 ? 0 : (anchorsRef.current[index - 1]?.len ?? 0);
      const segmentLen = Math.max(64, anchor.len - prevLen);
      const segmentStart = anchor.len - segmentLen;

      // Full card once the line reaches its dot; reveal during the approach segment
      const dotReached = drawn >= anchor.len - 6;
      const cardProgress = dotReached
        ? 1
        : Math.min(1, Math.max(0, (drawn - segmentStart) / segmentLen));

      gsap.set(shell, {
        opacity: cardProgress,
        y: 48 * (1 - cardProgress),
      });

      if (yearEl && yearEl.dataset.expanded !== "true") {
        yearEl.textContent =
          cardProgress >= 0.99
            ? entry.year
            : formatYear(targetYear * cardProgress);
      }
    });
  }, []);

  const updateDots = useCallback(
    (progress: number) => {
      const line = lineRef.current;
      const tail = tailRef.current;
      const dotsG = dotsRef.current;
      const pathLength = pathLengthRef.current;
      if (!pathLength) return;

      const p = Math.min(1, Math.max(0, progress));
      const drawn = pathLength * p;

      if (line) {
        line.style.strokeDasharray = `${pathLength}`;
        line.style.strokeDashoffset = `${pathLength - drawn}`;
      }

      const dots = dotsG ? [...dotsG.querySelectorAll(".journey-dot")] : [];
      anchorsRef.current.forEach((a, i) => {
        dots[i]?.classList.toggle("lit", drawn >= a.len - 4);
      });

      if (tail) {
        const lastLen = anchorsRef.current.at(-1)?.len ?? pathLength;
        tail.style.opacity = drawn >= lastLen - 6 ? "0.55" : "0";
      }

      syncCards(drawn);
    },
    [syncCards],
  );

  const buildPath = useCallback(() => {
    const timeline = timelineRef.current;
    const svg = svgRef.current;
    const line = lineRef.current;
    const tail = tailRef.current;
    const dotsG = dotsRef.current;
    if (!timeline || !svg || !line || !tail || !dotsG) return;

    const cards = cardRefs.current.filter(Boolean) as HTMLElement[];
    if (!cards.length) return;

    const tRect = timeline.getBoundingClientRect();
    const w = tRect.width;
    svg.setAttribute("viewBox", `0 0 ${w} ${tRect.height}`);

    const isDesktop = window.innerWidth >= 768;
    const midX = w * 0.5;

    const anchors: Anchor[] = cards.map((card) => {
      const r = card.getBoundingClientRect();
      const isRight = card.dataset.side === "right";
      const y = r.top + r.height * 0.38 - tRect.top;
      const x = isDesktop
        ? isRight
          ? r.left - tRect.left - 24
          : r.right - tRect.left + 24
        : midX;
      return { x, y, len: 0 };
    });

    const first = anchors[0];
    const leadStart = { x: midX, y: 8 };

    // Drop-in from top center so the first segment is visible above card 1
    let d = `M ${leadStart.x} ${leadStart.y}`;
    d += ` C ${leadStart.x} ${leadStart.y + Math.max(32, first.y * 0.28)}, ${first.x} ${first.y - Math.max(40, first.y * 0.2)}, ${first.x} ${first.y}`;

    for (let i = 1; i < anchors.length; i++) {
      const a = anchors[i - 1];
      const b = anchors[i];
      const midY = (a.y + b.y) / 2;
      const amp = w * 0.16 * (b.x >= a.x ? 1 : -1);

      d += ` C ${a.x} ${a.y + (midY - a.y) * 0.4}, ${midX + amp} ${midY - 24}, ${midX} ${midY}`;
      d += ` C ${midX - amp} ${midY + 24}, ${b.x} ${b.y - (b.y - midY) * 0.4}, ${b.x} ${b.y}`;
    }
    line.setAttribute("d", d);

    const last = anchors[anchors.length - 1];
    const prev = anchors[anchors.length - 2] ?? last;
    const dir = last.x >= prev.x ? 1 : -1;
    tail.setAttribute(
      "d",
      `M ${last.x} ${last.y} c ${dir * 55} 40, ${dir * 120} 78, ${dir * 170} 120`,
    );
    tail.style.opacity = "0";

    dotsG.innerHTML = anchors
      .map(
        (a) =>
          `<circle class="journey-dot" cx="${a.x}" cy="${a.y}" r="6.5"></circle>`,
      )
      .join("");

    const pathLength = line.getTotalLength();
    pathLengthRef.current = pathLength;
    gsap.set(line, {
      strokeDasharray: pathLength,
      strokeDashoffset: pathLength,
    });

    const samples = 600;
    anchors.forEach((a) => {
      let best = Infinity;
      let bestLen = 0;
      for (let s = 0; s <= samples; s++) {
        const len = (s / samples) * pathLength;
        const p = line.getPointAtLength(len);
        const dist = Math.hypot(p.x - a.x, p.y - a.y);
        if (dist < best) {
          best = dist;
          bestLen = len;
        }
      }
      a.len = bestLen;
    });

    anchorsRef.current = anchors;
  }, []);

  const setupDraw = useCallback(() => {
    const timeline = timelineRef.current;
    const line = lineRef.current;
    if (!timeline || !line) return;

    drawTweenRef.current?.scrollTrigger?.kill();
    drawTweenRef.current?.kill();
    drawTweenRef.current = null;

    const pathLength = pathLengthRef.current;
    if (!pathLength) return;

    if (reducedMotion) {
      gsap.set(line, { strokeDashoffset: 0 });
      updateDots(1);
      animRefs.current.forEach((shell) => {
        if (shell) gsap.set(shell, { opacity: 1, y: 0 });
      });
      return;
    }

    gsap.set(line, {
      strokeDasharray: pathLength,
      strokeDashoffset: pathLength,
    });

    const cards = cardRefs.current.filter(Boolean) as HTMLElement[];
    const lastCard = cards.at(-1);

    drawTweenRef.current = gsap.to(line, {
      strokeDashoffset: 0,
      ease: "none",
      scrollTrigger: {
        trigger: timeline,
        start: "top 78%",
        endTrigger: lastCard ?? timeline,
        end: lastCard ? "bottom 72%" : "bottom 15%",
        scrub: 0.5,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const lastLen =
            anchorsRef.current.at(-1)?.len ?? pathLengthRef.current;
          // Map scroll progress so 1 = line fully at the last card dot
          const normalized = self.progress * (lastLen / pathLength);
          updateDots(normalized);
        },
        onRefresh: (self) => {
          const lastLen =
            anchorsRef.current.at(-1)?.len ?? pathLengthRef.current;
          updateDots(self.progress * (lastLen / pathLength));
        },
      },
    });

    const st = drawTweenRef.current.scrollTrigger;
    if (st) {
      const lastLen = anchorsRef.current.at(-1)?.len ?? pathLength;
      updateDots(st.progress * (lastLen / pathLength));
    }
  }, [reducedMotion, updateDots]);

  const rebuild = useCallback(() => {
    buildPath();
    setupDraw();
    debouncedScrollRefresh(120)();
    const st = drawTweenRef.current?.scrollTrigger;
    if (st) {
      const lastLen =
        anchorsRef.current.at(-1)?.len ?? pathLengthRef.current;
      updateDots(st.progress * (lastLen / pathLengthRef.current));
    }
  }, [buildPath, setupDraw, updateDots]);

  useEffect(() => {
    registerGsap();
    const section = sectionRef.current;
    if (!section) return;

    const onGlobalRefresh = () => {
      const st = drawTweenRef.current?.scrollTrigger;
      if (st) {
        const lastLen =
          anchorsRef.current.at(-1)?.len ?? pathLengthRef.current;
        updateDots(st.progress * (lastLen / pathLengthRef.current));
      }
    };

    const ctx = gsap.context(() => {
      requestAnimationFrame(() => rebuild());
      setTimeout(() => rebuild(), 600);

      ScrollTrigger.addEventListener("refresh", onGlobalRefresh);

      animRefs.current.forEach((shell) => {
        if (!shell) return;

        if (reducedMotion) {
          gsap.set(shell, { opacity: 1, y: 0 });
          return;
        }

        gsap.set(shell, { opacity: 0, y: 48 });
        const yearEl = shell.querySelector<HTMLElement>('[data-anim="year"]');
        if (yearEl) yearEl.textContent = "'00";
      });

      if (!reducedMotion && blobRef.current) {
        gsap.to(blobRef.current, {
          y: -180,
          x: 90,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.55,
          },
        });
      }
    }, section);

    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(rebuild, 120);
    };
    window.addEventListener("resize", onResize);

    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      ScrollTrigger.removeEventListener("refresh", onGlobalRefresh);
      drawTweenRef.current?.scrollTrigger?.kill();
      drawTweenRef.current?.kill();
      drawTweenRef.current = null;
      ctx.revert();
    };
  }, [rebuild, reducedMotion, updateDots]);

  useEffect(() => {
    const timer = setTimeout(rebuild, 420);
    return () => clearTimeout(timer);
  }, [openIndex, rebuild]);

  const toggleCard = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative overflow-hidden bg-background"
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

      <div className="relative z-10 px-5 pb-4 pt-16 lg:px-10 lg:pt-24">
        <div className="max-w-3xl">
          <span className="section-label">{about.label}</span>
          <h2 className="text-display mt-5 text-[clamp(2.25rem,5.5vw,4rem)] font-extrabold leading-[0.96] tracking-tight">
            About Us (&) Our Journey
          </h2>
          <p className="mt-4 max-w-[40ch] text-[15px] leading-relaxed text-muted lg:text-base">
            {about.intro}
          </p>
        </div>
      </div>

      <div
        ref={timelineRef}
        className="journey-timeline relative z-10 mx-auto grid max-w-5xl grid-cols-1 gap-y-20 px-5 pb-32 pt-12 md:grid-cols-2 md:gap-x-28 md:gap-y-32 md:px-10 lg:gap-x-32 lg:gap-y-40"
      >
        <svg
          ref={svgRef}
          className="pointer-events-none absolute inset-0 z-[1] h-full w-full overflow-visible"
          aria-hidden
        >
          <path ref={lineRef} className="journey-line" />
          <path ref={tailRef} className="journey-tail" />
          <g ref={dotsRef} />
        </svg>

        {about.timeline.map((entry, i) => {
          const isOpen = openIndex === i;
          const isRight = entry.side === "right";
          return (
            <article
              key={entry.year}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              data-side={entry.side}
              className={`relative z-[2] w-full max-w-[360px] ${
                isRight
                  ? "md:col-start-2 md:justify-self-end"
                  : "md:col-start-1 md:justify-self-start"
              } ${CARD_OFFSETS[i] ?? ""}`}
            >
              <div
                ref={(el) => {
                  animRefs.current[i] = el;
                }}
                className="journey-card journey-card-anim rounded-[22px] border border-foreground/[0.05] bg-white/80 p-5 shadow-[0_10px_36px_rgba(0,0,0,0.05)] backdrop-blur-md md:p-6"
              >
                <div className="overflow-hidden pb-1">
                  <div
                    data-anim="year"
                    data-expanded={isOpen ? "true" : "false"}
                    className="text-display text-[clamp(2.75rem,5vw,4.25rem)] font-extrabold leading-none tracking-[-0.04em] text-accent"
                  >
                    {isOpen ? entry.fullYear : entry.year}
                  </div>
                </div>

                <h3 className="text-display mt-3 text-[1.15rem] font-bold leading-snug tracking-tight md:text-[1.25rem]">
                  {entry.title}
                </h3>

                <p className="mt-2 text-[13px] leading-relaxed text-muted md:text-sm">
                  {entry.teaser}
                </p>

                <div
                  className="overflow-hidden transition-[max-height] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{ maxHeight: isOpen ? 280 : 0 }}
                >
                  <p className="mt-3 text-[13px] leading-relaxed text-muted md:text-sm">
                    {entry.full}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between gap-2 border-t border-foreground/8 pt-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <BrandLogo variant="mark" className="h-6 w-6 shrink-0" />
                    <p className="truncate text-[11px] text-muted">
                      <span className="font-semibold text-foreground">
                        {entry.attribution}
                      </span>{" "}
                      {entry.timeAgo}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleCard(i)}
                    className="focus-ring shrink-0 rounded-full bg-foreground/[0.05] px-3.5 py-1.5 text-[11px] font-medium transition-colors hover:brand-gradient hover:text-white"
                    aria-expanded={isOpen}
                  >
                    {isOpen ? "Read less" : "Read more"}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
