"use client";

import { useId, useState } from "react";
import { faq } from "@/content";
import { RevealOnScroll } from "@/components/SmoothScroll";

function FaqItem({
  id,
  question,
  answer,
  isOpen,
  onToggle,
}: {
  id: string;
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const answerId = `${id}-answer`;

  return (
    <div
      className={`rounded-[20px] border bg-white/55 transition-colors ${
        isOpen
          ? "border-accent/25 shadow-[0_8px_32px_rgba(123,34,141,0.08)]"
          : "border-foreground/[0.06]"
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={answerId}
        className="focus-ring flex w-full items-center justify-between gap-4 rounded-[20px] px-5 py-4 text-left lg:px-6 lg:py-5"
      >
        <span className="text-display text-sm font-bold leading-snug tracking-tight lg:text-[15px]">
          {question}
        </span>
        <span
          aria-hidden
          className={`text-display shrink-0 text-2xl font-light leading-none text-foreground/70 transition-transform duration-300 ${
            isOpen ? "rotate-45" : ""
          }`}
        >
          +
        </span>
      </button>
      <div
        id={answerId}
        role="region"
        aria-labelledby={id}
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="px-5 pb-5 text-sm leading-relaxed text-muted lg:px-6 lg:pb-6">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export function Faq() {
  const baseId = useId();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const midpoint = Math.ceil(faq.items.length / 2);
  const columns = [faq.items.slice(0, midpoint), faq.items.slice(midpoint)];

  const toggle = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <section id="faq" className="relative overflow-hidden px-4 pb-24 pt-8 lg:pr-8 lg:pt-12">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 select-none overflow-hidden px-4 text-center lg:px-0"
        aria-hidden
      >
        <p className="text-display brand-gradient-text -mt-[0.08em] text-[clamp(4.5rem,19vw,13.5rem)] font-extrabold leading-[0.82] tracking-[-0.05em]">
          {faq.displayText}
        </p>
      </div>

      <div className="relative z-10 mx-auto max-w-5xl pt-[clamp(5rem,14vw,9rem)]">
        <RevealOnScroll>
          <span className="section-label">{faq.label}</span>
          <h2 className="text-display mt-6 text-[clamp(2rem,4vw,3.5rem)] font-extrabold leading-tight tracking-tight">
            {faq.heading}
          </h2>
        </RevealOnScroll>

        <div className="mt-10 grid gap-4 lg:grid-cols-2 lg:gap-x-5 lg:gap-y-4">
          {columns.map((column, columnIndex) => (
            <div key={columnIndex} className="flex flex-col gap-4">
              {column.map((item, itemIndex) => {
                const globalIndex =
                  columnIndex === 0 ? itemIndex : itemIndex + midpoint;

                return (
                  <RevealOnScroll key={item.question} delay={globalIndex * 0.04}>
                    <FaqItem
                      id={`${baseId}-${globalIndex}`}
                      question={item.question}
                      answer={item.answer}
                      isOpen={openIndex === globalIndex}
                      onToggle={() => toggle(globalIndex)}
                    />
                  </RevealOnScroll>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
