"use client";

import { useState } from "react";
import { navItems, site } from "@/content";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { BrandLogo } from "@/components/BrandLogo";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const activeId = useScrollSpy(navItems.map((n) => n.id));

  const scrollTo = (id: string) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-4 py-3 glass lg:hidden">
        <button
          onClick={() => scrollTo("hero")}
          className="focus-ring rounded-lg"
          aria-label="Go to home"
        >
          <BrandLogo variant="mark" className="h-9 w-9" priority />
        </button>
        <button
          onClick={() => setOpen(!open)}
          className="focus-ring rounded-xl bg-foreground px-4 py-2 text-xs font-bold uppercase tracking-wider text-background"
          aria-expanded={open}
          aria-label="Toggle menu"
        >
          {open ? "Close" : "Menu"}
        </button>
      </header>

      {open && (
        <div className="fixed inset-0 z-40 flex flex-col bg-background pt-20 lg:hidden">
          <nav className="flex flex-1 flex-col gap-2 px-6 py-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`focus-ring rounded-2xl px-4 py-4 text-left text-sm font-bold uppercase tracking-wider ${
                  activeId === item.id ? "brand-gradient text-white" : "bg-white/40"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
          <div className="border-t border-foreground/10 p-6">
            <a href={site.bookingLink} className="btn-primary w-full text-center">
              Find My Solution
            </a>
          </div>
        </div>
      )}
    </>
  );
}

export function HeroNav() {
  const activeId = useScrollSpy(navItems.map((n) => n.id));
  const leftNav = navItems.slice(0, 4);
  const rightNav = navItems.slice(4);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className="absolute left-0 right-0 top-[18%] z-30 hidden px-8 md:flex md:justify-between lg:px-16 xl:px-24"
      aria-label="Hero navigation"
    >
      <div className="flex gap-6 lg:gap-10">
        {leftNav.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollTo(item.id)}
            className={`focus-ring text-[10px] font-bold uppercase tracking-[0.2em] transition-opacity lg:text-xs ${
              activeId === item.id ? "opacity-100" : "opacity-50 hover:opacity-80"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="flex gap-6 lg:gap-10">
        {rightNav.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollTo(item.id)}
            className={`focus-ring text-[10px] font-bold uppercase tracking-[0.2em] transition-opacity lg:text-xs ${
              activeId === item.id ? "opacity-100" : "opacity-50 hover:opacity-80"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
