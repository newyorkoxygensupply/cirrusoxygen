"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

const BreathCycle3D = dynamic(() => import("@/components/BreathCycle3D"), {
  ssr: false,
  loading: () => null,
});

export function BreathCycleShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const [shouldMount, setShouldMount] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries, obs) => {
        if (entries[0].isIntersecting) {
          setShouldMount(true);
          obs.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Animated diagram of a ventilator breath cycle — decorative, not required to understand this page."
      className="aspect-4/3 w-full overflow-hidden rounded-[3px]"
      style={{
        background: "radial-gradient(circle at 50% 42%, #1c211f 0%, #0a0c0b 70%, #060706 100%)",
      }}
    >
      {shouldMount ? (
        <div aria-hidden="true">
          <BreathCycle3D paused={reduced} />
        </div>
      ) : (
        <div className="flex h-full items-center justify-center" aria-hidden="true">
          <div className="h-20 w-20 rounded-full bg-white/10" />
        </div>
      )}
    </div>
  );
}
