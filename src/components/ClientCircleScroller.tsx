"use client";

import Image from "next/image";
import { featuredClients } from "@/content";

type Props = {
  /** Reverse marquee direction */
  reverse?: boolean;
  className?: string;
};

/** Client portraits + names in a sidebar-logo-style infinite scroller. */
export function ClientCircleScroller({ reverse = false, className = "" }: Props) {
  const loop = [...featuredClients, ...featuredClients];

  return (
    <div
      className={`client-circle-scroller rounded-[18px] bg-white/70 px-1 py-2.5 ${className}`}
      aria-label="Clients we've worked with"
    >
      <div
        className={
          reverse ? "marquee-track items-end" : "marquee-track items-end"
        }
      >
        {loop.map((client, i) => (
          <div
            key={`${client.image}-${i}`}
            className="client-circle-item"
            aria-hidden={i >= featuredClients.length}
          >
            <div className="client-circle-avatar">
              <Image
                src={client.image}
                alt={i < featuredClients.length ? client.name : ""}
                width={64}
                height={64}
                className="h-full w-full object-cover object-top"
                sizes="64px"
              />
            </div>
            <p className="client-circle-name">{client.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
