"use client";

import Image from "next/image";
import { faq } from "@/content";

type Props = {
  /** Reverse marquee direction */
  reverse?: boolean;
  className?: string;
};

/** Small circular client portraits in an infinite horizontal scroller. */
export function ClientCircleScroller({ reverse = false, className = "" }: Props) {
  const images = faq.clientImages;
  const loop = [...images, ...images];

  return (
    <div
      className={`client-circle-scroller ${className}`}
      aria-label="Clients"
    >
      <div
        className={
          reverse ? "marquee-track-reverse items-center" : "marquee-track items-center"
        }
      >
        {loop.map((src, i) => (
          <div key={`${src}-${i}`} className="client-circle-item">
            <Image
              src={src}
              alt=""
              width={56}
              height={56}
              className="h-full w-full object-cover object-top"
              sizes="56px"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
