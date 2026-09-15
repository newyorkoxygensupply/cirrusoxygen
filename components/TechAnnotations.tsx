"use client";

import { useEffect, useRef, useState } from "react";

export type Callout = {
  /** Marker position as a % of the photo box — a framing anchor, not a
   *  claim about what part of the device physically sits at that pixel. */
  x: number;
  y: number;
  side: "left" | "right";
  label: string;
  value: string;
};

/**
 * Richard Mille / Bugatti exhibition-shot spec callouts: a marker on the
 * product photo, a leader line drawing outward, and a chip stating the real,
 * disclosed catalog spec. The marker and line are a decorative framing
 * device only — they never assert that a specific internal part sits at
 * that exact point, only the disclosed figure itself is ever stated.
 */
export function TechAnnotations({ callouts }: { callouts: Callout[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setLive(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries, obs) => {
        if (entries[0].isIntersecting) {
          setLive(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 z-10 hidden lg:block" aria-hidden="true">
      {callouts.map((c, i) => (
        <div
          key={c.label}
          className="absolute flex items-center gap-2"
          style={{
            top: `${c.y}%`,
            [c.side === "left" ? "right" : "left"]: `${c.side === "left" ? 100 - c.x : c.x}%`,
            transform: "translateY(-50%)",
            flexDirection: c.side === "left" ? "row-reverse" : "row",
          }}
        >
          <span
            className="h-[5px] w-[5px] shrink-0 rounded-full"
            style={{
              background: "var(--accent-warm)",
              opacity: live ? 1 : 0,
              transition: `opacity 0.4s var(--ease-mechanical) ${i * 0.15}s`,
            }}
          />
          <span
            className="h-px w-7 shrink-0 bg-border-strong"
            style={{
              transformOrigin: c.side === "left" ? "right" : "left",
              transform: live ? "scaleX(1)" : "scaleX(0)",
              transition: `transform 0.5s var(--ease-mechanical) ${i * 0.15 + 0.1}s`,
            }}
          />
          <div
            className={c.side === "left" ? "text-right" : "text-left"}
            style={{
              opacity: live ? 1 : 0,
              transform: live ? "translateX(0)" : `translateX(${c.side === "left" ? 6 : -6}px)`,
              transition: `opacity 0.5s var(--ease-mechanical) ${i * 0.15 + 0.3}s, transform 0.5s var(--ease-mechanical) ${i * 0.15 + 0.3}s`,
            }}
          >
            <div className="font-mono text-[9px] whitespace-nowrap uppercase tracking-[0.08em] text-muted-2">
              {c.label}
            </div>
            <div className="font-mono text-[11px] font-semibold whitespace-nowrap tabular-nums">
              {c.value}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
