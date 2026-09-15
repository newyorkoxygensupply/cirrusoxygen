"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

const PulseDose3D = dynamic(() => import("@/components/PulseDose3D"), {
  ssr: false,
  loading: () => null,
});

export function PulseDoseShowcase() {
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
      aria-label="Diagram of pulse-dose oxygen delivery timing — decorative, not required to understand this page."
      className="aspect-4/3 w-full overflow-hidden rounded-[3px]"
      style={{
        background: "radial-gradient(circle at 50% 42%, #1c211f 0%, #0a0c0b 70%, #060706 100%)",
      }}
    >
      {shouldMount ? (
        <div aria-hidden="true">
          <PulseDose3D paused={reduced} />
        </div>
      ) : (
        <div className="flex h-full items-center justify-center" aria-hidden="true">
          <div className="h-16 w-16 rounded-full bg-white/10" />
        </div>
      )}
    </div>
  );
}
