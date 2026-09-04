"use client";

import Image from "next/image";
import { team } from "@/content";
import { RevealOnScroll } from "@/components/SmoothScroll";

export function Team() {
  return (
    <section id="team" className="noise-bg px-4 py-[8vw] lg:px-[2vw] lg:py-[6vw]">
      <div className="relative z-10 mx-auto max-w-5xl">
        <RevealOnScroll>
          <span className="section-label">{team.label}</span>
          <h2 className="text-display mt-6 text-[clamp(2rem,4vw,3.5rem)] font-extrabold leading-tight tracking-tight">
            {team.heading}
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
            {team.description}
          </p>
        </RevealOnScroll>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {team.members.map((member, i) => (
            <RevealOnScroll key={member.name} delay={i * 0.08}>
              <div className="flex h-full flex-col rounded-3xl glass-card p-6">
                <div className="relative mb-5 h-24 w-24 overflow-hidden rounded-full ring-2 ring-foreground/[0.06]">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover object-top"
                    sizes="96px"
                  />
                </div>
                <h3 className="text-display text-lg font-bold">{member.name}</h3>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-accent">
                  {member.role}
                </p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
                  {member.bio}
                </p>
              </div>
            </RevealOnScroll>
          ))}
        </div>

        <RevealOnScroll className="mt-8">
          <button className="btn-primary focus-ring">{team.cta.label}</button>
        </RevealOnScroll>
      </div>
    </section>
  );
}
