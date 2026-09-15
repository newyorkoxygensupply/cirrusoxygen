"use client";

import { useRef, type ReactNode } from "react";

/**
 * Wraps a card so a soft radial highlight tracks the pointer across it — the
 * "instrument under glass" moment on the hero flagship. Pure pointer-move +
 * CSS custom properties (no React re-render per frame). Silently inert on
 * touch / reduced-motion / keyboard: the glow only appears while a fine
 * pointer is actually hovering, and the card is fully usable without it.
 */
export function Spotlight({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  function onMove(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
    el.style.setProperty("--spot", "1");
  }
  function onLeave() {
    ref.current?.style.setProperty("--spot", "0");
  }

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`group/spot relative ${className}`}
      style={{ "--spot": "0" } as React.CSSProperties}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] opacity-[var(--spot)] transition-opacity duration-300 motion-reduce:hidden"
        style={{
          background:
            "radial-gradient(340px circle at var(--mx) var(--my), color-mix(in srgb, var(--accent) 22%, transparent), transparent 60%)",
        }}
      />
      {children}
    </div>
  );
}
