"use client";

import { useEffect, useId, useRef, useState } from "react";
import { capabilities } from "@/content";
import { gsap, registerGsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type Chip = (typeof capabilities.chips)[number];

function ChipIcon({ id, large }: { id: Chip["id"]; large?: boolean }) {
  const size = large ? "h-5 w-5" : "h-3.5 w-3.5";
  switch (id) {
    case "systems":
      return (
        <svg className={size} viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="6.5" cy="7" r="2.2" stroke="currentColor" strokeWidth="1.9" />
          <circle cx="17.5" cy="7" r="2.2" stroke="currentColor" strokeWidth="1.9" />
          <circle cx="12" cy="17" r="2.2" stroke="currentColor" strokeWidth="1.9" />
          <path
            d="M8.3 8.4 10.4 15.2M15.7 8.4 13.6 15.2M8.7 7h6.6"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
          />
        </svg>
      );
    case "strategy":
      return (
        <svg className={size} viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.9" />
          <circle cx="12" cy="12" r="2.1" fill="currentColor" />
          <path
            d="M12 4v2.2M12 17.8V20M4 12h2.2M17.8 12H20"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
          />
        </svg>
      );
    case "creative":
      return (
        <svg className={size} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M8.5 15.5c-1.8-1.8-2.8-3.7-2.8-5.4A4.3 4.3 0 0 1 10 5.8c1.4 0 2.5.6 3.2 1.6.7-1 1.8-1.6 3.2-1.6a4.3 4.3 0 0 1 4.3 4.3c0 1.7-1 3.6-2.8 5.4L12 20.2l-3.5-4.7Z"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "media":
      return (
        <svg className={size} viewBox="0 0 24 24" fill="none" aria-hidden>
          <rect x="3.5" y="6" width="17" height="12" rx="2.2" stroke="currentColor" strokeWidth="1.9" />
          <path d="M10 9.5v5l5-2.5-5-2.5Z" fill="currentColor" />
        </svg>
      );
    case "scale":
      return (
        <svg className={size} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M4.5 16.5 10 11l3.2 3.2L19.5 7.5"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14.5 7.5h5v5"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    default:
      return null;
  }
}

function ChipGlyph({ id, large }: { id: Chip["id"]; large?: boolean }) {
  return (
    <span className={`capa-chip-mark${large ? " is-large" : ""}`} aria-hidden>
      <ChipIcon id={id} large={large} />
    </span>
  );
}

function CapabilityChip({
  chip,
  open,
  onOpen,
  onClose,
}: {
  chip: Chip;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const panelId = useId();
  const closeTimer = useRef<number | null>(null);

  const clearClose = () => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const scheduleClose = () => {
    clearClose();
    closeTimer.current = window.setTimeout(() => onClose(), 140);
  };

  useEffect(() => () => clearClose(), []);

  return (
    <span
      className={`capa-chip${open ? " is-open" : ""}`}
      onMouseEnter={() => {
        clearClose();
        onOpen();
      }}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        className="capa-chip-trigger focus-ring"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={chip.title}
        onFocus={() => {
          clearClose();
          onOpen();
        }}
        onBlur={scheduleClose}
        onClick={() => {
          clearClose();
          if (open) onClose();
          else onOpen();
        }}
      >
        <ChipGlyph id={chip.id} />
        <span className="capa-chip-label">{chip.label}</span>
        <span className="capa-chip-chevron" aria-hidden>
          <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="none">
            <path
              d="M2.5 4.5 6 8l3.5-3.5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      <span
        id={panelId}
        role="tooltip"
        className="capa-chip-panel"
        aria-hidden={!open}
        onMouseEnter={clearClose}
        onMouseLeave={scheduleClose}
      >
        <span className="capa-chip-panel-inner">
          <ChipGlyph id={chip.id} large />
          <span className="capa-chip-panel-title">{chip.title}</span>
          <p className="capa-chip-panel-copy">{chip.copy}</p>
        </span>
      </span>
    </span>
  );
}

function LeadWords({ text }: { text: string }) {
  const parts = text.split(/(\s+)/);
  return (
    <>
      {parts.map((part, i) => {
        if (!part) return null;
        if (/^\s+$/.test(part)) {
          return <span key={`s-${i}`}>{part}</span>;
        }
        return (
          <span key={`w-${i}`} data-capa-unit className="capa-word inline">
            {part}
          </span>
        );
      })}
    </>
  );
}

export function CapabilitiesReveal() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const leadRef = useRef<HTMLParagraphElement>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const reducedMotion = useReducedMotion();

  const chipById = Object.fromEntries(
    capabilities.chips.map((chip) => [chip.id, chip]),
  ) as Record<string, Chip>;

  useEffect(() => {
    registerGsap();
    const section = sectionRef.current;
    const lead = leadRef.current;
    if (!section || !lead) return;

    const units = lead.querySelectorAll<HTMLElement>("[data-capa-unit]");

    if (reducedMotion) {
      gsap.set(units, { opacity: 1 });
      return;
    }

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

      // One-shot word reveal — don't leave half the sentence faded mid-scroll
      gsap.set(units, { opacity: 0.22, y: 10 });
      gsap.to(units, {
        opacity: 1,
        y: 0,
        duration: 0.55,
        stagger: 0.035,
        ease: "power2.out",
        scrollTrigger: {
          trigger: lead,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });
    }, section);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="capabilities"
      className="relative z-10 overflow-visible bg-background px-4 py-[12vw] lg:px-[2vw] lg:py-[9vw]"
    >
      <div
        className="pointer-events-none absolute -right-[8%] top-[8%] h-[50vw] w-[50vw] max-h-[520px] max-w-[520px] rounded-full opacity-70"
        style={{
          background:
            "radial-gradient(circle, rgba(230,43,118,0.12) 0%, rgba(123,34,141,0.05) 42%, transparent 70%)",
          filter: "blur(40px)",
        }}
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex w-full max-w-[72rem] flex-col items-center text-center">
        <h2
          ref={headingRef}
          className="text-display text-[clamp(3rem,8.5vw,7.5rem)] font-extrabold leading-[0.9] tracking-[-0.045em]"
        >
          {capabilities.headingLines.map((line) => (
            <span key={line} className="block overflow-hidden">
              <span data-line className="block">
                {line}
              </span>
            </span>
          ))}
        </h2>

        <div className="mt-6 lg:mt-8">
          <span className="section-label">{capabilities.label}</span>
        </div>

        <p
          ref={leadRef}
          className="capa-lead text-display mt-8 max-w-[36ch] text-center text-[clamp(1.45rem,3.2vw,2.85rem)] font-extrabold leading-[1.28] tracking-[-0.03em] text-foreground sm:max-w-[42ch] lg:mt-10 lg:max-w-[40ch]"
        >
          {capabilities.lead.map((part, i) => {
            if (part.type === "text") {
              return <LeadWords key={`t-${i}`} text={part.value} />;
            }
            const chip = chipById[part.id];
            if (!chip) return null;
            return (
              <span key={chip.id} data-capa-unit className="inline-flex align-middle">
                <CapabilityChip
                  chip={chip}
                  open={openId === chip.id}
                  onOpen={() => setOpenId(chip.id)}
                  onClose={() =>
                    setOpenId((curr) => (curr === chip.id ? null : curr))
                  }
                />
              </span>
            );
          })}
        </p>
      </div>
    </section>
  );
}
