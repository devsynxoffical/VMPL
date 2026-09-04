"use client";

import { useEffect, useState } from "react";
import { registerGsap, ScrollTrigger } from "@/lib/gsap";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    __vmplLenis?: any;
  }
}

/**
 * Sidebar active section: last nav section whose top edge has crossed
 * a probe line (~32% down the viewport). Works with GSAP pins because
 * hero/projects ids sit on the pinned panel (not the tall spacer).
 */
export function useScrollSpy(sectionIds: readonly string[]) {
  const [activeId, setActiveId] = useState(sectionIds[0] ?? "");
  // Stable primitive — avoids HMR / array-identity effect breakage
  const idsKey = sectionIds.join("|");

  useEffect(() => {
    if (!idsKey || typeof window === "undefined") return;
    const ids = idsKey.split("|").filter(Boolean);
    if (!ids.length) return;

    registerGsap();

    let cancelled = false;
    let ticking = false;
    let lenis: { on?: Function; off?: Function; scroll?: number } | null =
      null;

    const resolveActive = () => {
      if (cancelled) return;

      const probe = window.innerHeight * 0.32;
      let current = ids[0];

      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        // Last section whose top has crossed the probe wins
        if (el.getBoundingClientRect().top <= probe) {
          current = id;
        }
      }

      const scrollY =
        lenis?.scroll ??
        window.__vmplLenis?.scroll ??
        window.scrollY ??
        document.documentElement.scrollTop ??
        0;
      const docH = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight,
      );
      if (scrollY + window.innerHeight >= docH - 48) {
        current = ids[ids.length - 1];
      }

      setActiveId((prev) => (prev === current ? prev : current));
    };

    const requestUpdate = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        resolveActive();
      });
    };

    // Whole-page ScrollTrigger stays in sync with Lenis scrollerProxy
    const pageTrigger = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: requestUpdate,
      onRefresh: requestUpdate,
    });

    document.addEventListener("lenisScroll", requestUpdate);
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    const bindLenis = () => {
      const instance = window.__vmplLenis;
      if (!instance?.on || instance === lenis) return Boolean(instance?.on);
      if (lenis?.off) lenis.off("scroll", requestUpdate);
      lenis = instance;
      instance.on("scroll", requestUpdate);
      return true;
    };

    bindLenis();
    const lenisPoll = window.setInterval(() => {
      if (bindLenis()) window.clearInterval(lenisPoll);
    }, 100);
    window.setTimeout(() => window.clearInterval(lenisPoll), 3000);

    resolveActive();
    const t1 = window.setTimeout(requestUpdate, 120);
    const t2 = window.setTimeout(requestUpdate, 500);
    const t3 = window.setTimeout(requestUpdate, 1200);

    return () => {
      cancelled = true;
      pageTrigger.kill();
      document.removeEventListener("lenisScroll", requestUpdate);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (lenis?.off) lenis.off("scroll", requestUpdate);
      window.clearInterval(lenisPoll);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, [idsKey]);

  return activeId;
}
