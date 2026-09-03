"use client";

import { useEffect, useState } from "react";
import { registerGsap, ScrollTrigger } from "@/lib/gsap";

export function useScrollSpy(
  sectionIds: readonly string[],
  offsetRatio = 0.28,
) {
  const [activeId, setActiveId] = useState(sectionIds[0]);

  useEffect(() => {
    registerGsap();

    const sections = sectionIds
      .map((id) => {
        const el = document.getElementById(id);
        return el ? { id, el } : null;
      })
      .filter((entry): entry is { id: string; el: HTMLElement } => !!entry);

    if (!sections.length) return;

    let raf = 0;

    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const marker = window.innerHeight * offsetRatio;
        let current = sections[0].id;

        for (const { id, el } of sections) {
          if (el.getBoundingClientRect().top <= marker) {
            current = id;
          }
        }

        setActiveId((prev) => (prev === current ? prev : current));
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    ScrollTrigger.addEventListener("scroll", update);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      ScrollTrigger.removeEventListener("scroll", update);
    };
  }, [sectionIds, offsetRatio]);

  return activeId;
}
