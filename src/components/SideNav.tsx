"use client";

import { useState } from "react";
import { navItems, site, hero, projectLogos } from "@/content";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { useHeroScroll } from "@/context/HeroScrollContext";
import { BrandLogo } from "@/components/BrandLogo";
import { BrandMark } from "@/components/BrandMark";
import { FacebookIcon, LinkedInIcon } from "@/components/SocialIcons";

function NavIcon({ name }: { name: string }) {
  const icons: Record<string, string> = {
    Home: "⌂",
    About: "◷",
    Solutions: "◎",
    Projects: "▣",
    "What You Get": "◆",
    Clients: "✦",
    Team: "◉",
    FAQ: "?",
  };
  return <span className="text-[10px] opacity-70">{icons[name] ?? "•"}</span>;
}

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n));
}

export function SideNav() {
  const activeId = useScrollSpy(navItems.map((n) => n.id));
  const { progress, sidebarVisible } = useHeroScroll();
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    await navigator.clipboard.writeText(site.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  // Shell only: logo + socials + short tagline (already in sidebar)
  const shell = clamp01(progress / 0.1);

  // Docked content appears ONLY after hero pieces finish flying in —
  // so you never see duplicates mid-scroll.
  const docked = clamp01((progress - 0.72) / 0.18);

  const opacity = sidebarVisible ? Math.max(shell, 0.98) : shell;
  const translateX = sidebarVisible ? 0 : (1 - shell) * -24;
  const interactive = opacity > 0.4 && docked > 0.4;

  return (
    <aside
      className="fixed left-3 top-3 bottom-3 z-40 hidden w-[var(--sidebar-width)] flex-col rounded-[22px] glass-card p-3.5 lg:flex"
      style={{
        opacity,
        transform: `translateX(${translateX}px)`,
        pointerEvents: opacity > 0.35 ? "auto" : "none",
      }}
    >
      <div className="mb-3 flex items-start justify-between gap-1">
        <button
          onClick={() => scrollTo("hero")}
          className="focus-ring rounded-lg"
          aria-label="Go to home"
        >
          <BrandLogo variant="full" className="w-[118px]" priority />
        </button>
        <div className="flex gap-1.5 pt-0.5">
          <a
            href={site.socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring flex h-7 w-7 items-center justify-center rounded-md bg-white/60 transition-colors hover:bg-white"
            aria-label="LinkedIn"
          >
            <LinkedInIcon className="h-[15px] w-[15px]" />
          </a>
          <a
            href={site.socials.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring flex h-7 w-7 items-center justify-center rounded-md bg-white/60 transition-colors hover:bg-white"
            aria-label="Facebook"
          >
            <FacebookIcon className="h-[15px] w-[15px]" />
          </a>
        </div>
      </div>

      <p className="mb-3 text-[10px] font-medium leading-relaxed text-foreground/80">
        {hero.eyebrow}
      </p>

      <div
        className={`flex flex-col ${docked > 0.02 ? "min-h-0 flex-1" : ""}`}
        style={{
          opacity: docked,
          visibility: docked < 0.02 ? "hidden" : "visible",
          pointerEvents: interactive ? "auto" : "none",
        }}
      >
        <p className="mb-3 text-[10px] leading-relaxed text-muted">
          {hero.positioning.slice(0, 90)}…
        </p>

        <div className="mb-3 grid grid-cols-2 gap-1.5">
          {hero.stats.map((stat) => (
            <div key={stat.label} className="rounded-xl bg-white/50 p-2">
              <div className="text-display text-base font-bold text-accent">
                {stat.value}
                {stat.suffix}
              </div>
              <div className="text-[8px] font-semibold uppercase tracking-wider text-muted">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto" aria-label="Main">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`focus-ring flex w-full items-center gap-2 rounded-full px-2.5 py-2 text-left text-[10px] font-semibold uppercase tracking-wider transition-all ${
                activeId === item.id
                  ? "brand-gradient text-white"
                  : "text-foreground/70 hover:bg-white/50"
              }`}
            >
              <NavIcon name={item.label} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="my-2 overflow-hidden rounded-lg">
          <div className="marquee-track items-center py-2">
            {[...projectLogos, ...projectLogos].map((logo, i) => (
              <a
                key={`${logo.src}-${i}`}
                href={logo.href}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring mx-2 shrink-0 transition-opacity hover:opacity-80"
                aria-label={logo.alt}
              >
                <BrandMark src={logo.src} alt={logo.alt} size="sm" />
              </a>
            ))}
          </div>
        </div>

        <div className="mb-2 flex items-center justify-between rounded-full bg-white/50 px-2.5 py-1.5">
          <span className="truncate text-[10px] text-muted">{site.email}</span>
          <button
            onClick={copyEmail}
            className="focus-ring ml-1 shrink-0 rounded-md bg-foreground/5 px-1.5 py-0.5 text-[9px] font-semibold uppercase"
            aria-label="Copy email"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>

        <a
          href={site.bookingLink}
          className="btn-primary w-full py-2.5 text-center text-xs"
        >
          Find My Solution
        </a>
      </div>
    </aside>
  );
}
