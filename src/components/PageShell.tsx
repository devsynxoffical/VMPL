"use client";

import { HeroScrollProvider } from "@/context/HeroScrollContext";
import { SideNav } from "@/components/SideNav";
import { MobileNav } from "@/components/MobileNav";
import { Hero } from "@/components/Hero";
import { AboutJourney } from "@/components/AboutJourney";
import { Solutions } from "@/components/Solutions";
import { Projects } from "@/components/Projects";
import { CapabilitiesReveal } from "@/components/CapabilitiesReveal";
import { Testimonials } from "@/components/Testimonials";
import { Team } from "@/components/Team";
import { Faq } from "@/components/Faq";
import { StatementSection } from "@/components/StatementSection";
import { SmoothScroll } from "@/components/SmoothScroll";
import { MainContent } from "@/components/MainContent";

export function PageShell() {
  return (
    <HeroScrollProvider>
      <SmoothScroll>
        <MobileNav />
        <SideNav />
        <main>
          <Hero />
          <MainContent>
            <AboutJourney />
            <Projects />
            <CapabilitiesReveal />
            <Testimonials />
            <Solutions />
            <Team />
            <StatementSection />
            <Faq />
          </MainContent>
        </main>
      </SmoothScroll>
    </HeroScrollProvider>
  );
}
