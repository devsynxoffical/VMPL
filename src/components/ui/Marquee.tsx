"use client";

import { useEffect, useRef } from "react";
import { gsap, registerGsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function StatCounter({
  value,
  suffix = "",
  label,
}: {
  value: number;
  suffix?: string;
  label: string;
}) {
  const numRef = useRef<HTMLSpanElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    registerGsap();
    const el = numRef.current;
    if (!el) return;

    if (reducedMotion) {
      el.textContent = `${value}${suffix}`;
      return;
    }

    const obj = { val: 0 };
    gsap.to(obj, {
      val: value,
      duration: 1.2,
      ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 90%", once: true },
      onUpdate: () => {
        el.textContent = `${Math.round(obj.val)}${suffix}`;
      },
    });
  }, [value, suffix, reducedMotion]);

  return (
    <div className="glass-card rounded-2xl p-4">
      <div className="text-display text-2xl font-bold text-accent">
        <span ref={numRef}>0{suffix}</span>
      </div>
      <div className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-muted">
        {label}
      </div>
    </div>
  );
}

export function Marquee({
  items,
  reverse = false,
}: {
  items: readonly string[];
  reverse?: boolean;
}) {
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden">
      <div className={reverse ? "marquee-track-reverse" : "marquee-track"}>
        {doubled.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="mx-4 flex shrink-0 items-center gap-4 text-sm font-semibold uppercase tracking-wider"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export function LogoMarquee({ logos }: { logos: readonly string[] }) {
  const row1 = [...logos, ...logos];
  const row2 = [...logos.slice().reverse(), ...logos.slice().reverse()];
  return (
    <div className="space-y-3 opacity-50 transition-opacity hover:opacity-80">
      <div className="overflow-hidden">
        <div className="marquee-track py-2">
          {row1.map((logo, i) => (
            <span
              key={`r1-${logo}-${i}`}
              className="mx-6 shrink-0 text-xs font-bold uppercase tracking-widest text-muted grayscale transition-all hover:grayscale-0 hover:text-foreground"
            >
              {logo}
            </span>
          ))}
        </div>
      </div>
      <div className="overflow-hidden">
        <div className="marquee-track-reverse py-2">
          {row2.map((logo, i) => (
            <span
              key={`r2-${logo}-${i}`}
              className="mx-6 shrink-0 text-xs font-bold uppercase tracking-widest text-muted grayscale transition-all hover:grayscale-0 hover:text-foreground"
            >
              {logo}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
