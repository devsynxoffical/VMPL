"use client";

import { useEffect, useId, useRef } from "react";
import { faq } from "@/content";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/** Tilted photo cards inside the letter spotlight (viewBox 0 0 1200 360) */
const PHOTO_LAYOUT = [
  { x: 40, y: 20, w: 280, h: 340, r: -12 },
  { x: 220, y: -10, w: 300, h: 360, r: 8 },
  { x: 450, y: 15, w: 290, h: 350, r: -7 },
  { x: 680, y: -5, w: 310, h: 355, r: 11 },
  { x: 900, y: 25, w: 280, h: 340, r: -9 },
  { x: 120, y: 160, w: 270, h: 320, r: 10 },
  { x: 380, y: 150, w: 300, h: 330, r: -8 },
  { x: 640, y: 170, w: 280, h: 320, r: 6 },
  { x: 880, y: 155, w: 290, h: 330, r: -11 },
  { x: 50, y: 80, w: 240, h: 290, r: 4 },
] as const;

const SPOT_RADIUS = 88; // px — only the cursor point, not the whole word

function VmplSvg({
  maskId,
  gradientId,
  photos,
  showPhotos,
}: {
  maskId: string;
  gradientId: string;
  photos: readonly string[];
  showPhotos: boolean;
}) {
  return (
    <svg
      className="vmpl-client-mark-svg"
      viewBox="0 0 1200 360"
      role="presentation"
      focusable="false"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7b228d" />
          <stop offset="50%" stopColor="#c0267a" />
          <stop offset="100%" stopColor="#e62b76" />
        </linearGradient>
        <mask
          id={maskId}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="1200"
          height="360"
        >
          <rect width="1200" height="360" fill="black" />
          <text
            x="600"
            y="285"
            textAnchor="middle"
            fill="white"
            fontSize="340"
            fontWeight="800"
            letterSpacing="-20"
            fontFamily="var(--font-jakarta), 'Plus Jakarta Sans', system-ui, sans-serif"
          >
            {faq.displayText}
          </text>
        </mask>
      </defs>

      <g mask={`url(#${maskId})`}>
        {showPhotos ? (
          <>
            <rect width="1200" height="360" fill={`url(#${gradientId})`} />
            {photos.map((src, i) => {
              const layout = PHOTO_LAYOUT[i];
              if (!layout) return null;
              const cx = layout.x + layout.w / 2;
              const cy = layout.y + layout.h / 2;
              return (
                <image
                  key={src}
                  href={src}
                  x={layout.x}
                  y={layout.y}
                  width={layout.w}
                  height={layout.h}
                  preserveAspectRatio="xMidYMid slice"
                  transform={`rotate(${layout.r} ${cx} ${cy})`}
                />
              );
            })}
          </>
        ) : (
          <rect width="1200" height="360" fill={`url(#${gradientId})`} />
        )}
      </g>
    </svg>
  );
}

/**
 * Solid brand letters by default. On hover, a small circle at the cursor
 * reveals client images clipped inside the letterforms (heynesh-style).
 */
export function VmplClientMark() {
  const rawId = useId();
  const uid = rawId.replace(/:/g, "");
  const baseMaskId = `vmpl-base-${uid}`;
  const revealMaskId = `vmpl-reveal-${uid}`;
  const baseGradId = `vmpl-base-grad-${uid}`;
  const revealGradId = `vmpl-reveal-grad-${uid}`;
  const photos = faq.clientImages.slice(0, PHOTO_LAYOUT.length);

  const rootRef = useRef<HTMLDivElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const pos = useRef({ x: 0, y: 0, r: 0 });

  useEffect(() => {
    const root = rootRef.current;
    const spot = spotRef.current;
    if (!root || !spot || reducedMotion) return;

    const applyClip = () => {
      const { x, y, r } = pos.current;
      const value = `circle(${r}px at ${x}px ${y}px)`;
      spot.style.clipPath = value;
      spot.style.setProperty("-webkit-clip-path", value);
    };

    // Hidden until hover
    pos.current = { x: 0, y: 0, r: 0 };
    applyClip();

    const onEnter = (e: PointerEvent) => {
      const rect = root.getBoundingClientRect();
      pos.current.x = e.clientX - rect.left;
      pos.current.y = e.clientY - rect.top;
      gsap.to(pos.current, {
        r: SPOT_RADIUS,
        duration: 0.35,
        ease: "power2.out",
        onUpdate: applyClip,
      });
    };

    const onLeave = () => {
      gsap.to(pos.current, {
        r: 0,
        duration: 0.28,
        ease: "power2.in",
        onUpdate: applyClip,
      });
    };

    const onMove = (e: PointerEvent) => {
      const rect = root.getBoundingClientRect();
      gsap.to(pos.current, {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        duration: 0.22,
        ease: "power3.out",
        overwrite: "auto",
        onUpdate: applyClip,
      });
    };

    root.addEventListener("pointerenter", onEnter);
    root.addEventListener("pointerleave", onLeave);
    root.addEventListener("pointermove", onMove);

    return () => {
      root.removeEventListener("pointerenter", onEnter);
      root.removeEventListener("pointerleave", onLeave);
      root.removeEventListener("pointermove", onMove);
    };
  }, [reducedMotion]);

  return (
    <div
      ref={rootRef}
      className="vmpl-client-mark"
      aria-label={faq.displayText}
    >
      <div className="vmpl-client-base">
        <VmplSvg
          maskId={baseMaskId}
          gradientId={baseGradId}
          photos={photos}
          showPhotos={false}
        />
      </div>

      <div ref={spotRef} className="vmpl-client-spot" aria-hidden>
        <VmplSvg
          maskId={revealMaskId}
          gradientId={revealGradId}
          photos={photos}
          showPhotos
        />
      </div>
    </div>
  );
}
