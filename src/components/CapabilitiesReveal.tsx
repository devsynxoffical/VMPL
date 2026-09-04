"use client";

import { useEffect, useRef } from "react";
import { capabilities } from "@/content";
import { gsap, registerGsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function CapabilitiesReveal() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    registerGsap();
    const section = sectionRef.current;
    if (!section || reducedMotion) return;

    const ctx = gsap.context(() => {
      const lines = headingRef.current?.querySelectorAll("[data-line]");
      if (lines?.length) {
        gsap.fromTo(
          lines,
          { yPercent: 100 },
          {
            yPercent: 0,
            duration: 0.7,
            stagger: 0.08,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 78%",
              toggleActions: "restart none restart none",
            },
          },
        );
      }

      if (descRef.current) {
        gsap.fromTo(
          descRef.current,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.65,
            delay: 0.12,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 76%",
              toggleActions: "restart none restart none",
            },
          },
        );
      }

      const items = listRef.current?.querySelectorAll("[data-cap]");
      if (items?.length) {
        gsap.fromTo(
          items,
          { y: 36, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: listRef.current,
              start: "top 85%",
              toggleActions: "restart none restart none",
            },
          },
        );
      }
    }, section);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="capabilities"
      className="relative z-10 overflow-hidden bg-background px-4 py-[8vw] lg:px-[2vw] lg:py-[6vw]"
    >
      <div
        className="pointer-events-none absolute -right-[8%] top-[10%] h-[50vw] w-[50vw] max-h-[520px] max-w-[520px] rounded-full opacity-70"
        style={{
          background:
            "radial-gradient(circle, rgba(230,43,118,0.14) 0%, rgba(123,34,141,0.06) 42%, transparent 70%)",
          filter: "blur(40px)",
        }}
        aria-hidden
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <span className="section-label">{capabilities.label}</span>

        <h2
          ref={headingRef}
          className="text-display mt-5 text-[clamp(2.5rem,6vw,5rem)] font-extrabold leading-[0.95] tracking-tight"
        >
          <span className="block overflow-hidden">
            <span data-line className="block">
              {capabilities.heading}
            </span>
          </span>
        </h2>

        <p
          ref={descRef}
          className="mt-6 max-w-[36ch] text-[15px] leading-relaxed text-muted lg:mt-7 lg:max-w-[42ch] lg:text-base"
        >
          {capabilities.description}
        </p>

        <ul
          ref={listRef}
          className="mt-14 grid grid-cols-1 gap-0 border-t border-foreground/10 md:mt-16 md:grid-cols-3"
        >
          {capabilities.items.map((item) => (
            <li
              key={item.title}
              data-cap
              className="group border-b border-foreground/10 py-8 md:border-b-0 md:border-r md:px-7 md:py-10 md:first:pl-0 md:last:border-r-0 md:last:pr-0"
            >
              <span className="text-display text-[13px] font-bold tracking-[0.14em] text-accent">
                {item.icon}
              </span>
              <h3 className="text-display mt-4 text-[clamp(1.65rem,2.8vw,2.35rem)] font-extrabold tracking-tight text-foreground">
                {item.title}
              </h3>
              <p className="mt-3 max-w-[28ch] text-[14px] leading-relaxed text-muted lg:text-[15px]">
                {item.copy}
              </p>
              <div className="mt-6 h-[2px] w-10 origin-left bg-accent transition-transform duration-500 group-hover:scale-x-150" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
