"use client";

import Image from "next/image";
import { featuredClients } from "@/content";

type Props = {
  /** Reverse marquee direction */
  reverse?: boolean;
  className?: string;
};

/** MDM-style square client cards in an infinite horizontal scroller. */
export function ClientCircleScroller({ reverse = false, className = "" }: Props) {
  const loop = [...featuredClients, ...featuredClients];

  return (
    <div
      className={`client-circle-scroller ${className}`}
      aria-label="Clients we've worked with"
    >
      <div
        className={
          reverse
            ? "marquee-track items-stretch"
            : "marquee-track items-stretch"
        }
      >
        {loop.map((client, i) => {
          const isClone = i >= featuredClients.length;
          // First strip: load eagerly; clone strip reuses browser cache
          const eager = !isClone && i < 8;

          return (
            <article
              key={`${client.image}-${i}`}
              className="client-card"
              aria-hidden={isClone}
            >
              <div className="client-card-media">
                <Image
                  src={client.image}
                  alt={isClone ? "" : client.name}
                  fill
                  className="object-cover object-top"
                  sizes="184px"
                  // Pre-sized webps — skip optimizer queue (was causing black cards)
                  unoptimized
                  {...(eager && i < 4
                    ? { priority: true as const }
                    : { loading: (eager ? "eager" : "lazy") as "eager" | "lazy" })}
                  decoding="async"
                />
              </div>
              <div className="client-card-body">
                <h3 className="client-card-name">{client.name}</h3>
                <p className="client-card-role">{client.role}</p>
                <p className="client-card-meta">{client.meta}</p>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
