"use client";

import { useEffect, useState } from "react";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Sidebar active section.
 * Picks the last nav section that still crosses a viewport probe line —
 * and requires the section bottom to still be on-screen so tall GSAP
 * pin spacers (Projects / Hero) don't stay active forever.
 */
export function useScrollSpy(
  sectionIds: readonly string[],
  offsetRatio = 0.3,
) {
  const [activeId, setActiveId] = useState(sectionIds[0] ?? "");

  useEffect(() => {
    if (!sectionIds.length || typeof window === "undefined") return;
    registerGsap();

    let raf = 0;

    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const probe = window.innerHeight * offsetRatio;
        const minBottom = window.innerHeight * 0.12;
        let current = sectionIds[0];
        let found = false;

        for (const id of sectionIds) {
          const el = document.getElementById(id);
          if (!el) continue;
          const rect = el.getBoundingClientRect();
          // Must have crossed the probe AND still occupy the viewport
          if (rect.top <= probe && rect.bottom > minBottom) {
            current = id;
            found = true;
          }
        }

        const scrollY =
          window.scrollY ||
          document.documentElement.scrollTop ||
          0;
        const docH = Math.max(
          document.documentElement.scrollHeight,
          document.body.scrollHeight,
        );
        if (scrollY + window.innerHeight >= docH - 48) {
          current = sectionIds[sectionIds.length - 1];
          found = true;
        }

        if (!found) {
          const mid = window.innerHeight * 0.4;
          let bestDist = Infinity;
          for (const id of sectionIds) {
            const el = document.getElementById(id);
            if (!el) continue;
            const rect = el.getBoundingClientRect();
            const center = rect.top + rect.height / 2;
            const dist = Math.abs(center - mid);
            if (dist < bestDist) {
              bestDist = dist;
              current = id;
            }
          }
        }

        setActiveId((prev) => (prev === current ? prev : current));
      });
    };

    update();

    document.addEventListener("lenisScroll", update);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    gsap.ticker.add(update);
    ScrollTrigger.addEventListener("refresh", update);

    const t1 = window.setTimeout(update, 120);
    const t2 = window.setTimeout(update, 500);
    const t3 = window.setTimeout(update, 1200);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("lenisScroll", update);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      gsap.ticker.remove(update);
      ScrollTrigger.removeEventListener("refresh", update);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, [sectionIds, offsetRatio]);

  return activeId;
}
