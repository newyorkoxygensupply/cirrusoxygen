"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Wraps a card so it tilts in 3D toward the pointer, with a glare that
 * follows it — the tactile "physical object" moment for product and article
 * grids. Pure CSS custom properties written from pointer events (see .tilt /
 * .tilt-inner / .tilt-glare in globals.css): no per-frame React state, no
 * layout thrash.
 *
 * Pointer-tracked tilt only exists for mouse users — a touch screen has no
 * hover, so on a phone this card would otherwise never visibly do anything.
 * To fix that, every card also gets a one-time "showcase" tilt-and-settle
 * (a quick rotateY/rotateX wobble) the moment it scrolls into view, via
 * IntersectionObserver — seen by every visitor regardless of input device.
 * Both effects are fully off under reduced-motion.
 */
export function Tilt({
  children,
  className = "",
  max = 13,
}: {
  children: ReactNode;
  className?: string;
  /** Max rotation in degrees at the card's edge. */
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (typeof IntersectionObserver === "undefined") return;

    const io = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("tilt-showcase");
            obs.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  function onMove(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    const ry = (px - 0.5) * max * 2;
    const rx = (0.5 - py) * max * 2;
    el.style.setProperty("--rx", `${rx}deg`);
    el.style.setProperty("--ry", `${ry}deg`);
    el.style.setProperty("--gx", `${px * 100}%`);
    el.style.setProperty("--gy", `${py * 100}%`);
    el.style.setProperty("--tilt-active", "1");
  }
  function onLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--tilt-active", "0");
  }

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`tilt ${className}`}
    >
      <div className="tilt-inner">{children}</div>
      <div className="tilt-glare" aria-hidden="true" />
    </div>
  );
}
