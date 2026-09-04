"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { testimonials } from "@/content";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const reducedMotion = useReducedMotion();

  const syncProgress = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const maxScroll = track.scrollWidth - track.clientWidth;
    if (maxScroll <= 0) {
      setActiveIndex(0);
      return;
    }
    const ratio = track.scrollLeft / maxScroll;
    const index = Math.round(ratio * (testimonials.items.length - 1));
    setActiveIndex(Math.max(0, Math.min(testimonials.items.length - 1, index)));
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
          const el = card as HTMLElement;
          el.style.transitionDelay = entry.isIntersecting
            ? `${i * 0.06}s`
            : "0s";
          el.classList.toggle("reveal-visible", entry.isIntersecting);
        });
      },
      { threshold: 0.12 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [reducedMotion]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let isDown = false;
    let moved = false;
    let startX = 0;
    let scrollLeft = 0;
    let velocity = 0;
    let lastX = 0;
    let lastTime = 0;
    let momentumId = 0;

    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      isDown = true;
      moved = false;
      setIsDragging(true);
      startX = e.clientX;
      scrollLeft = track.scrollLeft;
      lastX = e.clientX;
      lastTime = performance.now();
      velocity = 0;
      cancelAnimationFrame(momentumId);
      track.setPointerCapture(e.pointerId);
    };

    const onMove = (e: PointerEvent) => {
      if (!isDown) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 3) moved = true;
      e.preventDefault();
      track.scrollLeft = scrollLeft - dx * 1.35;
      const now = performance.now();
      const dt = now - lastTime;
      if (dt > 0) velocity = (e.clientX - lastX) / dt;
      lastX = e.clientX;
      lastTime = now;
      syncProgress();
    };

    const onUp = (e: PointerEvent) => {
      if (!isDown) return;
      isDown = false;
      setIsDragging(false);
      try {
        track.releasePointerCapture(e.pointerId);
      } catch {
        /* already released */
      }

      const applyMomentum = () => {
        if (Math.abs(velocity) < 0.02) return;
        track.scrollLeft -= velocity * 14;
        velocity *= 0.93;
        syncProgress();
        momentumId = requestAnimationFrame(applyMomentum);
      };
      momentumId = requestAnimationFrame(applyMomentum);
    };

    // Keep vertical page scroll; convert horizontal trackpad / shift+wheel to x
    const onWheel = (e: WheelEvent) => {
      const mostlyHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
      const shiftVertical = e.shiftKey && e.deltaY !== 0;
      if (!mostlyHorizontal && !shiftVertical) return;
      e.preventDefault();
      track.scrollLeft += mostlyHorizontal ? e.deltaX : e.deltaY;
      syncProgress();
    };

    // Don't navigate links when the gesture was a drag
    const onClickCapture = (e: MouseEvent) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
        moved = false;
      }
    };

    track.addEventListener("pointerdown", onDown);
    track.addEventListener("pointermove", onMove);
    track.addEventListener("pointerup", onUp);
    track.addEventListener("pointercancel", onUp);
    track.addEventListener("wheel", onWheel, { passive: false });
    track.addEventListener("click", onClickCapture, true);
    track.addEventListener("scroll", syncProgress, { passive: true });

    syncProgress();

    return () => {
      track.removeEventListener("pointerdown", onDown);
      track.removeEventListener("pointermove", onMove);
      track.removeEventListener("pointerup", onUp);
      track.removeEventListener("pointercancel", onUp);
      track.removeEventListener("wheel", onWheel);
      track.removeEventListener("click", onClickCapture, true);
      track.removeEventListener("scroll", syncProgress);
      cancelAnimationFrame(momentumId);
    };
  }, [syncProgress]);

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className="relative overflow-hidden py-[8vw] lg:py-[6vw]"
    >
      <div className="relative z-10 px-4 lg:px-[2vw]">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-3xl">
            <span className="section-label">{testimonials.label}</span>
            <h2 className="text-display mt-5 text-[clamp(2rem,4vw,3.25rem)] font-extrabold leading-tight tracking-tight">
              {testimonials.heading}
            </h2>
          </div>

          <div className="flex items-center gap-3 sm:pb-1">
            <div className="flex items-center gap-1.5" aria-hidden>
              {testimonials.items.map((_, i) => (
                <span
                  key={i}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    i === activeIndex
                      ? "w-8 bg-accent"
                      : "w-4 bg-foreground/15"
                  }`}
                />
              ))}
            </div>
            <span
              className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition-colors ${
                isDragging
                  ? "brand-gradient text-white"
                  : "bg-foreground text-background"
              }`}
            >
              {isDragging ? "Dragging" : "Drag →"}
            </span>
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-10 lg:mt-12">
        <div
          ref={trackRef}
          data-lenis-prevent
          className="drag-cursor flex touch-pan-x gap-5 overflow-x-auto scroll-smooth pb-4 pl-4 pr-8 lg:gap-6 lg:pl-[2vw] lg:pr-[2vw]"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          tabIndex={0}
          role="region"
          aria-label="Client testimonials"
        >
          {testimonials.items.map((item) => (
            <article
              key={item.name}
              data-card
              className="reveal-hidden relative flex w-[min(88vw,400px)] shrink-0 flex-col rounded-[26px] border border-foreground/[0.06] bg-white/65 p-6 shadow-[0_12px_40px_rgba(0,0,0,0.04)] backdrop-blur-sm lg:w-[380px] lg:p-7"
            >
              <div
                className="brand-gradient absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-xl text-lg font-bold text-white"
                aria-hidden
              >
                “
              </div>

              <h3 className="text-display pr-12 text-xl font-bold leading-snug tracking-tight lg:text-[1.35rem]">
                {item.headline}
              </h3>

              <p className="mt-4 flex-1 text-[15px] leading-relaxed text-muted lg:text-base">
                {item.quote}
              </p>

              <div className="mt-6 flex items-center gap-3 border-t border-foreground/8 pt-5">
                <div className="brand-gradient flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white">
                  {item.initials}
                </div>
                <div className="min-w-0">
                  <p className="text-display truncate text-sm font-bold">
                    {item.name}
                  </p>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="focus-ring mt-0.5 block truncate text-xs text-muted underline-offset-2 hover:text-accent hover:underline"
                  >
                    {item.role}
                  </a>
                </div>
              </div>
            </article>
          ))}
          {/* End spacer so the last card can clear the right edge */}
          <div className="w-2 shrink-0 lg:w-4" aria-hidden />
        </div>
      </div>
    </section>
  );
}
