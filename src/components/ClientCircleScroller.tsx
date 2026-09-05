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
        {loop.map((client, i) => (
          <article
            key={`${client.image}-${i}`}
            className="client-card"
            aria-hidden={i >= featuredClients.length}
          >
            <div className="client-card-media">
              <Image
                src={client.image}
                alt={i < featuredClients.length ? client.name : ""}
                fill
                className="object-cover object-top"
                sizes="180px"
              />
            </div>
            <div className="client-card-body">
              <h3 className="client-card-name">{client.name}</h3>
              <p className="client-card-role">{client.role}</p>
              <p className="client-card-meta">{client.meta}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
