"use client";

import { useEffect, useRef, useState } from "react";
import { CountUp } from "@/components/CountUp";

/**
 * A real instrument dial — tick-marked bezel, a swept arc, a metallic
 * marker at the arc's tip, and a live numeral at the center. The sweep is
 * deliberately a fixed decorative flourish (always draws to the same ~78%
 * arc), not a proportional "X out of Y" reading — the same way a car's
 * instrument cluster or a watch chronograph sub-dial sweeps once on
 * power-on as a flourish, not as a claim about the number's magnitude. That
 * keeps this purely a design device: the real, honest figure is the
 * numeral itself, never implied by how far the needle travels.
 *
 * Built on SVG `pathLength="100"` so the stroke-dash math is plain
 * percentages regardless of the actual circle radius.
 */
const SWEEP = 78; // fixed percentage of the circle the arc draws to
const TICKS = 40;

// Rounded to 3dp: Math.cos/Math.sin can differ in the last float64 digits
// between Node's server-side V8 and the browser's, which otherwise trips a
// React hydration mismatch on these SVG coordinate attributes.
function round3(n: number) {
  return Math.round(n * 1000) / 1000;
}

function polar(cx: number, cy: number, r: number, fractionClockwiseFromTop: number) {
  const angle = (-90 + fractionClockwiseFromTop * 360) * (Math.PI / 180);
  return { x: round3(cx + r * Math.cos(angle)), y: round3(cy + r * Math.sin(angle)) };
}

export function GaugeDial({
  value,
  decimals = 0,
  numeralSuffix = "",
  unit,
  size = 84,
}: {
  value: number;
  decimals?: number;
  /** Appended directly to the counting numeral itself, e.g. "10" → "10K". */
  numeralSuffix?: string;
  /** Small caption under the numeral, e.g. "ft", "dB". */
  unit: string;
  size?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [swept, setSwept] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setSwept(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries, obs) => {
        if (entries[0].isIntersecting) {
          setSwept(true);
          obs.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const cx = 60;
  const cy = 60;
  const tip = polar(cx, cy, 50, SWEEP / 100);

  return (
    <div ref={ref} className="relative shrink-0" style={{ width: size, height: size }} aria-hidden="true">
      <svg viewBox="0 0 120 120" width={size} height={size}>
        {/* tick marks — a real chronograph minute track */}
        {Array.from({ length: TICKS }).map((_, i) => {
          const bold = i % 5 === 0;
          const a = polar(cx, cy, bold ? 42 : 45, i / TICKS);
          const b = polar(cx, cy, 49, i / TICKS);
          return (
            <line
              key={i}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke="var(--border-strong)"
              strokeWidth={bold ? 1.6 : 0.9}
              strokeLinecap="round"
            />
          );
        })}
        {/* background track (the "unlit" full dial) */}
        <circle cx={cx} cy={cy} r="50" fill="none" stroke="var(--border)" strokeWidth="2.5" />
        {/* swept arc — the power-on flourish */}
        <circle
          cx={cx}
          cy={cy}
          r="50"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="3"
          strokeLinecap="round"
          pathLength={100}
          strokeDasharray="100 100"
          style={{
            strokeDashoffset: swept ? 100 - SWEEP : 100,
            transition: "stroke-dashoffset 1.4s var(--ease-mechanical)",
          }}
          transform={`rotate(-90 ${cx} ${cy})`}
        />
        {/* metallic marker at the sweep's tip */}
        <circle
          cx={tip.x}
          cy={tip.y}
          r="3.2"
          fill="var(--accent-warm)"
          style={{
            opacity: swept ? 1 : 0,
            transition: "opacity 0.3s var(--ease-mechanical) 1.1s",
          }}
        />
        {/* outer bezel */}
        <circle cx={cx} cy={cy} r="58" fill="none" stroke="var(--border-strong)" strokeWidth="1" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="font-mono text-[15px] font-semibold tabular-nums">
          <CountUp value={value} decimals={decimals} suffix={numeralSuffix} />
        </div>
        <div className="font-mono text-[8px] tracking-[0.04em] text-muted-2 uppercase">{unit}</div>
      </div>
    </div>
  );
}
