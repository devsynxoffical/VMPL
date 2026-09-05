"use client";

import { useState } from "react";
import Image from "next/image";
import { navItems, navSectionIds, site, hero, sidebarClientLogos } from "@/content";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { useHeroScroll } from "@/context/HeroScrollContext";
import { BrandLogo } from "@/components/BrandLogo";
import { FacebookIcon, LinkedInIcon } from "@/components/SocialIcons";

function NavIcon({ name }: { name: string }) {
  const common = "h-4 w-4 shrink-0";
  switch (name) {
    case "Home":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z"
            stroke="currentColor"
            strokeWidth="1.85"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "About":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="8" r="3.25" stroke="currentColor" strokeWidth="1.85" />
          <path
            d="M5.2 19.2c.9-3.2 3.4-5 6.8-5s5.9 1.8 6.8 5"
            stroke="currentColor"
            strokeWidth="1.85"
            strokeLinecap="round"
          />
        </svg>
      );
    case "Projects":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
          <rect x="3.5" y="4.5" width="17" height="4" rx="1.2" stroke="currentColor" strokeWidth="1.85" />
          <rect x="3.5" y="10" width="17" height="4" rx="1.2" stroke="currentColor" strokeWidth="1.85" />
          <rect x="3.5" y="15.5" width="17" height="4" rx="1.2" stroke="currentColor" strokeWidth="1.85" />
        </svg>
      );
    case "What You Get":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M12 3.5 4.5 8v8L12 20.5 19.5 16V8L12 3.5Z"
            stroke="currentColor"
            strokeWidth="1.85"
            strokeLinejoin="round"
          />
          <path d="M4.5 8 12 12.5 19.5 8M12 12.5V20.5" stroke="currentColor" strokeWidth="1.85" />
        </svg>
      );
    case "Clients":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.85" />
          <path
            d="M5.5 19c.8-3 3.3-4.8 6.5-4.8s5.7 1.8 6.5 4.8"
            stroke="currentColor"
            strokeWidth="1.85"
            strokeLinecap="round"
          />
        </svg>
      );
    case "Solutions":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M13 3 5 14h7l-1 7 8-11h-7l1-7Z"
            stroke="currentColor"
            strokeWidth="1.85"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "Team":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="9" cy="8" r="2.6" stroke="currentColor" strokeWidth="1.85" />
          <circle cx="16" cy="9" r="2.2" stroke="currentColor" strokeWidth="1.85" />
          <path
            d="M4.5 19c.7-2.6 2.8-4 5.5-4s4.8 1.4 5.5 4M14 15c1.8.2 3.4 1.2 4.2 3.2"
            stroke="currentColor"
            strokeWidth="1.85"
            strokeLinecap="round"
          />
        </svg>
      );
    case "Connect":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M5 6.5A2.5 2.5 0 0 1 7.5 4h9A2.5 2.5 0 0 1 19 6.5v7a2.5 2.5 0 0 1-2.5 2.5H11l-4 3.5V16H7.5A2.5 2.5 0 0 1 5 13.5v-7Z"
            stroke="currentColor"
            strokeWidth="1.85"
            strokeLinejoin="round"
          />
        </svg>
      );
    default:
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.85" />
          <path
            d="M12 16.5v.5M12 8c1.4 0 2.3.8 2.3 2s-.9 1.7-2.1 2.1c-.7.2-1.2.6-1.2 1.4V14"
            stroke="currentColor"
            strokeWidth="1.85"
            strokeLinecap="round"
          />
        </svg>
      );
  }
}

function CopyIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="8" y="8" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n));
}

export function SideNav() {
  const activeId = useScrollSpy(navSectionIds);
  const { progress } = useHeroScroll();
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    await navigator.clipboard.writeText(site.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  // Reference-style staged reveal synced to hero scrub:
  // 1) shell fades while wordmark docks  2) panels rise  3) header brand locks in
  const shell = clamp01((progress - 0.3) / 0.22);
  const docked = clamp01((progress - 0.48) / 0.22);
  const headerReady = clamp01((progress - 0.62) / 0.12);
  const interactive = shell > 0.55 && docked > 0.4;

  return (
    <aside
      className="fixed z-[70] hidden flex-col gap-2 rounded-[26px] bg-[#f3eef4] p-2.5 lg:flex"
      style={{
        left: "var(--sidebar-left)",
        top: "1.25vw",
        bottom: "1.25vw",
        width: "var(--sidebar-width)",
        opacity: shell,
        // Keep at final X so Flip/dock math can measure [data-dock=header] accurately
        pointerEvents: interactive ? "auto" : "none",
      }}
      aria-hidden={shell < 0.2}
    >
      <div className="rounded-[22px] bg-white px-3 py-3">
        <div className="mb-2.5 flex items-start justify-between gap-2">
          <button
            data-dock="header"
            onClick={() => scrollTo("hero")}
            className="focus-ring flex items-center rounded-xl bg-accent px-2.5 py-1.5"
            style={{ opacity: headerReady }}
            aria-label="Go to home"
          >
            <span className="text-[13px] font-extrabold tracking-tight text-white">
              {hero.bgText}
              <sup className="text-[8px]">®</sup>
            </span>
          </button>
          <div
            className="flex gap-1"
            style={{ opacity: docked }}
          >
            <a
              href={site.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring flex h-8 w-8 items-center justify-center rounded-xl bg-white"
              aria-label="LinkedIn"
            >
              <LinkedInIcon className="h-3.5 w-3.5" />
            </a>
            <a
              href={site.socials.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring flex h-8 w-8 items-center justify-center rounded-xl bg-white"
              aria-label="Facebook"
            >
              <FacebookIcon className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
        <p
          className="text-[10px] font-medium leading-relaxed text-foreground/80"
          style={{ opacity: docked }}
        >
          {hero.positioning}
        </p>
      </div>

      <div
        data-dock-panel
        className="flex min-h-0 flex-1 flex-col gap-2"
        style={{
          opacity: docked,
          transform: `translateY(${(1 - docked) * 18}px)`,
          pointerEvents: interactive ? "auto" : "none",
        }}
      >
        <div
          className="glass-hero grid grid-cols-2 divide-x divide-foreground/10 rounded-[22px] px-3 py-3"
          data-dock="stats"
        >
          <div className="pr-3">
            <BrandLogo variant="mark" className="mb-1 h-7 w-7" />
            <div className="text-display text-lg font-extrabold leading-none text-foreground">
              {hero.stats[0].value}
              {hero.stats[0].suffix}
            </div>
            <div className="mt-0.5 text-[10px] font-bold leading-tight text-foreground">
              {hero.stats[0].label}
            </div>
          </div>
          <div className="pl-3">
            <div className="text-display text-[1.65rem] font-extrabold leading-none text-accent">
              {hero.stats[1].value}
              {hero.stats[1].suffix}
            </div>
            <div className="mt-1 text-[10px] font-bold leading-tight text-foreground">
              Years of
              <br />
              experience
            </div>
          </div>
        </div>

        <nav
          className="min-h-0 flex-1 overflow-y-auto rounded-[22px] bg-white/70 px-2.5 py-2.5"
          aria-label="Main"
          data-dock="nav"
        >
          <div className="flex flex-col items-start gap-2">
            {navItems.map((item) => {
              const active = activeId === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  data-dock-nav={item.id}
                  onClick={() => scrollTo(item.id)}
                  className={`sidebar-nav-link focus-ring ${active ? "is-active" : ""}`}
                  aria-current={active ? "page" : undefined}
                >
                  <span className="sidebar-nav-bg" aria-hidden />
                  <span className="sidebar-nav-icon">
                    <NavIcon name={item.label} />
                  </span>
                  <span className="sidebar-nav-label">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        <div className="overflow-hidden rounded-[18px] bg-white/70 px-1 py-1.5">
          <div className="marquee-track items-center">
            {[...sidebarClientLogos, ...sidebarClientLogos].map((src, i) => (
              <div
                key={`${src}-${i}`}
                className="relative -mx-0.5 h-16 w-[4.25rem] shrink-0 sm:h-[4.25rem] sm:w-[4.75rem]"
                aria-hidden={i >= sidebarClientLogos.length}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  className="scale-110 object-contain object-center"
                  sizes="76px"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 rounded-[18px] bg-white/70 px-3 py-2">
          <span className="min-w-0 break-all text-[9px] font-medium leading-snug text-foreground/80 sm:text-[10px]">
            {site.email}
          </span>
          <button
            onClick={copyEmail}
            className="focus-ring ml-2 shrink-0 text-foreground"
            aria-label="Copy email"
          >
            {copied ? (
              <span className="text-[9px] font-bold uppercase">Copied</span>
            ) : (
              <CopyIcon />
            )}
          </button>
        </div>

        <a
          href={site.bookingLink}
          data-dock="cta"
          className="rounded-[18px] bg-accent py-3 text-center text-[13px] font-extrabold uppercase tracking-[0.04em] text-white"
        >
          Find My Solution
        </a>
      </div>
    </aside>
  );
}
