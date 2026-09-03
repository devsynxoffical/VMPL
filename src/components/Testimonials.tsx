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
    setActiveIndex(index);
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
        if (entry.isIntersecting) {
          cards.forEach((card, i) => {
            const el = card as HTMLElement;
            el.style.transitionDelay = `${i * 0.06}s`;
            el.classList.add("reveal-visible");
          });
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [reducedMotion]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;
    let velocity = 0;
    let lastX = 0;
    let lastTime = 0;
    let momentumId = 0;

    const onDown = (e: PointerEvent) => {
      isDown = true;
      setIsDragging(true);
      startX = e.pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft;
      lastX = e.pageX;
      lastTime = Date.now();
      velocity = 0;
      cancelAnimationFrame(momentumId);
      track.setPointerCapture(e.pointerId);
    };

    const onMove = (e: PointerEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - track.offsetLeft;
      track.scrollLeft = scrollLeft - (x - startX) * 1.4;
      const now = Date.now();
      const dt = now - lastTime;
      if (dt > 0) velocity = (e.pageX - lastX) / dt;
      lastX = e.pageX;
      lastTime = now;
      syncProgress();
    };

    const onUp = (e: PointerEvent) => {
      if (!isDown) return;
      isDown = false;
      setIsDragging(false);
      track.releasePointerCapture(e.pointerId);

      const applyMomentum = () => {
        if (Math.abs(velocity) < 0.01) return;
        track.scrollLeft -= velocity * 16;
        velocity *= 0.94;
        syncProgress();
        momentumId = requestAnimationFrame(applyMomentum);
      };
      momentumId = requestAnimationFrame(applyMomentum);
    };

    track.addEventListener("pointerdown", onDown);
    track.addEventListener("pointermove", onMove);
    track.addEventListener("pointerup", onUp);
    track.addEventListener("pointerleave", onUp);
    track.addEventListener("scroll", syncProgress, { passive: true });

    syncProgress();

    return () => {
      track.removeEventListener("pointerdown", onDown);
      track.removeEventListener("pointermove", onMove);
      track.removeEventListener("pointerup", onUp);
      track.removeEventListener("pointerleave", onUp);
      track.removeEventListener("scroll", syncProgress);
      cancelAnimationFrame(momentumId);
    };
  }, [syncProgress]);

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className="relative overflow-hidden px-4 py-24 lg:pr-8"
    >
      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="section-label">{testimonials.label}</span>
            <h2 className="text-display mt-5 text-[clamp(2rem,4vw,3.25rem)] font-extrabold leading-tight tracking-tight">
              {testimonials.heading}
            </h2>
          </div>

          <div
            className="flex items-center gap-1.5 lg:pb-1"
            aria-hidden
          >
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
        </div>
      </div>

      <div className="relative z-10 mt-12">
        <div className="mb-4 flex items-center justify-end px-4 lg:px-8">
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

        <div
          ref={trackRef}
          className="drag-cursor flex gap-5 overflow-x-auto px-4 pb-4 lg:gap-6 lg:px-8 lg:pl-[calc(var(--sidebar-width)+1.25rem)]"
          style={{ scrollbarWidth: "none" }}
          tabIndex={0}
          role="region"
          aria-label="Client testimonials"
        >
          {testimonials.items.map((item) => (
            <article
              key={item.name}
              data-card
              className="reveal-hidden relative flex w-[min(88vw,420px)] shrink-0 flex-col rounded-[26px] border border-foreground/[0.06] bg-white/65 p-6 shadow-[0_12px_40px_rgba(0,0,0,0.04)] backdrop-blur-sm lg:w-[400px] lg:p-7"
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
        </div>
      </div>
    </section>
  );
}
