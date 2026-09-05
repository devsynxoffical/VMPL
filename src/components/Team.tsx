"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { team } from "@/content";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type Member = (typeof team.levels)[number][number];

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function MemberAvatar({
  name,
  image,
  size = "md",
}: {
  name: string;
  image: string | null;
  size?: "sm" | "md" | "lg";
}) {
  const box =
    size === "lg"
      ? "h-20 w-20 lg:h-24 lg:w-24 text-base"
      : size === "sm"
        ? "h-14 w-14 lg:h-16 lg:w-16 text-xs"
        : "h-16 w-16 lg:h-[4.25rem] lg:w-[4.25rem] text-sm";

  if (image) {
    return (
      <div
        className={`relative mx-auto shrink-0 overflow-hidden rounded-full ring-2 ring-accent/20 ${box}`}
      >
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover object-top"
          sizes={size === "lg" ? "96px" : "72px"}
        />
      </div>
    );
  }

  return (
    <div
      className={`brand-gradient mx-auto flex shrink-0 items-center justify-center rounded-full font-extrabold tracking-wide text-white shadow-[0_8px_22px_rgba(230,43,118,0.25)] ${box}`}
      aria-hidden
    >
      {initials(name)}
    </div>
  );
}

function TeamCard({
  member,
  size,
}: {
  member: Member;
  size: "sm" | "md" | "lg";
}) {
  return (
    <article
      data-team-card
      className={`team-org-card flex h-full w-full flex-col items-center text-center ${
        size === "lg"
          ? "max-w-[17rem] rounded-[1.75rem] p-5 lg:p-6"
          : size === "md"
            ? "max-w-[14.5rem] rounded-[1.45rem] p-4 lg:p-5"
            : "max-w-[12rem] rounded-[1.25rem] p-3.5 lg:max-w-[13rem] lg:p-4"
      }`}
    >
      <MemberAvatar name={member.name} image={member.image} size={size} />
      <h3
        className={`text-display mt-3 font-bold leading-tight tracking-tight ${
          size === "lg" ? "text-lg lg:text-xl" : size === "md" ? "text-[0.95rem] lg:text-base" : "text-[0.85rem] lg:text-[0.95rem]"
        }`}
      >
        {member.name}
      </h3>
      <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.14em] text-accent lg:text-[10px]">
        {member.role}
      </p>
      <p
        className={`mt-2 leading-relaxed text-muted ${
          size === "lg" ? "text-[13px] lg:text-sm" : "text-[11px] lg:text-[12px]"
        }`}
      >
        {member.bio}
      </p>
    </article>
  );
}

/** Classic org-chart fork: stem down → horizontal bar → drops to each child */
function LevelConnector({ count }: { count: number }) {
  return (
    <div className="team-org-connector" aria-hidden data-team-connector>
      <div className="team-org-stem" />
      <div className="team-org-bar-wrap" style={{ ["--kids" as string]: count }}>
        <div className="team-org-bar" />
        <div className="team-org-drops">
          {Array.from({ length: count }, (_, i) => (
            <span key={i} className="team-org-drop" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function Team() {
  const sectionRef = useRef<HTMLElement>(null);
  const treeRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    const tree = treeRef.current;
    if (!section || !tree) return;

    registerGsap();

    const levels = tree.querySelectorAll<HTMLElement>("[data-team-level]");
    const connectors = tree.querySelectorAll<HTMLElement>("[data-team-connector]");
    const cards = tree.querySelectorAll<HTMLElement>("[data-team-card]");

    if (reducedMotion) {
      gsap.set([...levels, ...connectors, ...cards], {
        opacity: 1,
        clearProps: "transform,clipPath",
      });
      return;
    }

    const ctx = gsap.context(() => {
      levels.forEach((level) => {
        const levelCards = level.querySelectorAll<HTMLElement>("[data-team-card]");
        gsap.set(levelCards, { opacity: 0, y: 42, scale: 0.88 });
      });

      connectors.forEach((connector) => {
        const stem = connector.querySelector(".team-org-stem");
        const bar = connector.querySelector(".team-org-bar");
        const drops = connector.querySelectorAll(".team-org-drop");
        gsap.set(stem, { scaleY: 0, transformOrigin: "top center" });
        gsap.set(bar, { scaleX: 0 });
        gsap.set(drops, { scaleY: 0, transformOrigin: "top center" });
      });

      levels.forEach((level, index) => {
        const levelCards = level.querySelectorAll<HTMLElement>("[data-team-card]");
        const connector = connectors[index - 1];

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: level,
            start: "top 82%",
            toggleActions: "play none none reverse",
          },
        });

        if (connector) {
          const stem = connector.querySelector(".team-org-stem");
          const bar = connector.querySelector(".team-org-bar");
          const drops = connector.querySelectorAll(".team-org-drop");

          tl.to(stem, { scaleY: 1, duration: 0.35, ease: "power2.out" }, 0);
          tl.to(bar, { scaleX: 1, duration: 0.45, ease: "power2.out" }, 0.2);
          tl.to(
            drops,
            { scaleY: 1, duration: 0.35, stagger: 0.05, ease: "power2.out" },
            0.4,
          );
        }

        tl.to(
          levelCards,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.65,
            stagger: 0.1,
            ease: "power3.out",
          },
          connector ? 0.55 : 0,
        );
      });

      requestAnimationFrame(() => ScrollTrigger.refresh());
    }, section);

    return () => ctx.revert();
  }, [reducedMotion]);

  const sizeForLevel = (count: number): "sm" | "md" | "lg" => {
    if (count <= 2) return "lg";
    if (count <= 3) return "md";
    return "sm";
  };

  return (
    <section
      ref={sectionRef}
      id="team"
      className="noise-bg relative overflow-hidden px-4 py-[8vw] lg:px-[2vw] lg:py-[6vw]"
    >
      <div
        className="pointer-events-none absolute left-1/2 top-[12%] h-[40vw] w-[40vw] max-h-[480px] max-w-[480px] -translate-x-1/2 rounded-full opacity-70"
        style={{
          background:
            "radial-gradient(circle, rgba(230,43,118,0.12) 0%, rgba(123,34,141,0.05) 45%, transparent 70%)",
          filter: "blur(40px)",
        }}
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <span className="section-label">{team.label}</span>
          <h2 className="text-display mt-5 text-[clamp(2rem,4vw,3.5rem)] font-extrabold leading-tight tracking-tight">
            {team.heading}
          </h2>
          <p className="mx-auto mt-4 max-w-[42ch] text-base leading-relaxed text-muted">
            {team.description}
          </p>
        </div>

        <div ref={treeRef} className="team-org-tree mt-12 flex flex-col items-center lg:mt-16">
          {team.levels.map((level, levelIndex) => {
            const size = sizeForLevel(level.length);
            const nextCount = team.levels[levelIndex + 1]?.length;

            return (
              <div key={levelIndex} className="flex w-full flex-col items-center">
                <div
                  data-team-level
                  className="team-org-level flex w-full flex-wrap items-stretch justify-center gap-3 sm:gap-4 lg:gap-5"
                  style={{ ["--level" as string]: levelIndex + 1 }}
                >
                  {level.map((member) => (
                    <div
                      key={member.name}
                      className={`flex justify-center ${
                        level.length === 2
                          ? "w-[calc(50%-0.5rem)] min-w-[10rem] sm:w-auto"
                          : size === "lg"
                            ? "w-full sm:w-auto"
                            : size === "md"
                              ? "w-[calc(50%-0.5rem)] min-w-[10rem] sm:w-auto"
                              : "w-[calc(50%-0.5rem)] min-w-[9rem] sm:w-auto lg:w-auto"
                      }`}
                    >
                      <TeamCard member={member} size={size} />
                    </div>
                  ))}
                </div>

                {nextCount ? <LevelConnector count={nextCount} /> : null}
              </div>
            );
          })}
        </div>

        <div className="mt-12 flex justify-center md:mt-14">
          <a href={team.cta.href} className="btn-primary focus-ring">
            {team.cta.label}
          </a>
        </div>
      </div>
    </section>
  );
}
