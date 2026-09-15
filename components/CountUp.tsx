"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Meters a number up from zero the first time it scrolls into view — the
 * gauge-needle flourish that makes a spec sheet feel like live instrumentation.
 * Renders the final value immediately (no animation) under reduced-motion or
 * before hydration, so the real figure is always the SSR/no-JS output and there
 * is never layout shift. `tabular-nums` on the caller keeps the width stable
 * while digits tick.
 */
export function CountUp({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 1100,
  className,
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);
  const [popped, setPopped] = useState(false);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || done.current) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setDisplay(value);
      return;
    }

    const io = new IntersectionObserver(
      (entries, obs) => {
        if (!entries[0].isIntersecting || done.current) return;
        done.current = true;
        obs.disconnect();

        const start = performance.now();
        // easeOutCubic — quick off the line, gentle settle onto the final value.
        const ease = (t: number) => 1 - Math.pow(1 - t, 3);
        const tick = (now: number) => {
          // If the tab is hidden mid-count, rAF pauses; snap to the final value
          // so a backgrounded page never freezes on a partial number.
          if (document.hidden) {
            setDisplay(value);
            return;
          }
          const t = Math.min(1, (now - start) / duration);
          setDisplay(value * ease(t));
          if (t < 1) requestAnimationFrame(tick);
          else {
            setDisplay(value);
            setPopped(true);
          }
        };
        setDisplay(0);
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value, duration]);

  return (
    <span ref={ref} className={`${className ?? ""} ${popped ? "count-pop" : ""}`}>
      {prefix}
      {display.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}
