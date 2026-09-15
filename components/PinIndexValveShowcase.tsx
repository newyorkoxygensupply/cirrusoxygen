"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

const PinIndexValve3D = dynamic(() => import("@/components/PinIndexValve3D"), {
  ssr: false,
  loading: () => null,
});

export function PinIndexValveShowcase() {
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
      aria-label="Diagram of a pin-index safety system oxygen tank valve — decorative, not required to understand this page."
      className="relative aspect-square w-full max-w-[480px] overflow-hidden rounded-full sm:aspect-4/3 sm:max-w-none sm:rounded-[3px]"
      style={{
        background: "radial-gradient(circle at 50% 42%, #1c211f 0%, #0a0c0b 70%, #060706 100%)",
      }}
    >
      {shouldMount ? (
        <div aria-hidden="true">
          <PinIndexValve3D paused={reduced} />
        </div>
      ) : (
        <div className="flex h-full items-center justify-center" aria-hidden="true">
          <div className="h-16 w-16 rounded-full bg-white/10" />
        </div>
      )}
    </div>
  );
}
