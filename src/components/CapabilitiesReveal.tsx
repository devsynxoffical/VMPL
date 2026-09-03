"use client";

import { useEffect, useMemo, useRef } from "react";
import { capabilities } from "@/content";
import {
  gsap,
  registerGsap,
  ScrollTrigger,
  debouncedScrollRefresh,
} from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type Token =
  | { kind: "word"; text: string }
  | { kind: "pill"; icon: string; label: string };

function buildTokens(): Token[] {
  const tokens: Token[] = [];

  capabilities.parts.forEach((part, partIndex) => {
    if (part.type === "pill") {
      tokens.push({ kind: "pill", icon: part.icon, label: part.label });
      return;
    }

    const words = part.content.split(/\s+/).filter(Boolean);
    const prevPart = capabilities.parts[partIndex - 1];
    const needsLeadingSpace = prevPart?.type === "pill";

    words.forEach((word, wordIndex) => {
      const prefix = wordIndex === 0 && needsLeadingSpace ? "\u00a0" : "";
      const suffix = wordIndex < words.length - 1 ? " " : "";
      tokens.push({ kind: "word", text: prefix + word + suffix });
    });
  });

  return tokens;
}

export function CapabilitiesReveal() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const reducedMotion = useReducedMotion();
  const tokens = useMemo(() => buildTokens(), []);

  useEffect(() => {
    registerGsap();
    const text = textRef.current;
    if (!text) return;

    const els = [...text.querySelectorAll<HTMLElement>("[data-token]")];

    if (reducedMotion) {
      gsap.set(els, { opacity: 1 });
      return;
    }

    gsap.set(els, { opacity: 0.12 });
    const setOpacity = els.map((el) => gsap.quickSetter(el, "opacity"));
    let lastStep = -1;

    const paint = (progress: number) => {
      const step = Math.round(progress * 100);
      if (step === lastStep) return;
      lastStep = step;

      const total = els.length;
      const spread = total + 0.5;
      els.forEach((_, i) => {
        const t = progress * spread - i;
        setOpacity[i](gsap.utils.clamp(0.12, 1, t));
      });
    };

    const st = ScrollTrigger.create({
      trigger: text,
      start: "top 85%",
      end: "top 25%",
      scrub: true,
      invalidateOnRefresh: true,
      onUpdate: (self) => paint(self.progress),
      onRefresh: (self) => paint(self.progress),
    });

    paint(st.progress);

    const onResize = debouncedScrollRefresh();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      st.kill();
    };
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="capabilities"
      className="relative z-10 bg-background px-4 py-24 lg:py-32 lg:pr-8"
    >
      <div className="pointer-events-none absolute left-[18%] top-[20%] h-[420px] w-[420px] rounded-full bg-gradient-to-br from-accent/10 to-transparent blur-3xl" />

      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <h2 className="text-display text-[clamp(2.5rem,6vw,5rem)] font-extrabold leading-[0.95] tracking-tight">
          {capabilities.label}
        </h2>

        <span className="section-label mt-8 w-fit">
          {capabilities.eyebrow}
        </span>

        <p
          ref={textRef}
          className="text-display mt-10 max-w-5xl text-[clamp(1.75rem,4.2vw,3.75rem)] font-extrabold leading-[1.22] tracking-[-0.03em]"
        >
          {tokens.map((token, i) => {
            if (token.kind === "pill") {
              return (
                <span
                  key={`pill-${i}`}
                  data-token
                  className="mx-0.5 inline-flex translate-y-[0.1em] items-center gap-1.5 whitespace-nowrap rounded-xl border border-foreground/10 bg-white/70 px-2.5 py-1 align-baseline shadow-sm backdrop-blur-sm lg:mx-1 lg:gap-2 lg:px-3 lg:py-1.5"
                  style={{ opacity: 0.12 }}
                >
                  <span className="brand-gradient flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white lg:h-8 lg:w-8">
                    {token.icon}
                  </span>
                  <span className="text-[0.88em]">{token.label}</span>
                </span>
              );
            }

            return (
              <span
                key={`word-${i}`}
                data-token
                className="inline"
                style={{ opacity: 0.12 }}
              >
                {token.text}
              </span>
            );
          })}
        </p>
      </div>
    </section>
  );
}
