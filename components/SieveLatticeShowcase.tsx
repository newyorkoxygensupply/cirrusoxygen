"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

const SieveLattice3D = dynamic(() => import("@/components/SieveLattice3D"), {
  ssr: false,
  loading: () => null,
});

export function SieveLatticeShowcase() {
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
      aria-label="Diagram of a molecular sieve lattice structure — decorative, not required to understand this page."
      className="relative aspect-square w-full max-w-[480px] overflow-hidden rounded-full sm:aspect-4/3 sm:max-w-none sm:rounded-[3px]"
      style={{
        background: "radial-gradient(circle at 50% 42%, #1c211f 0%, #0a0c0b 70%, #060706 100%)",
      }}
    >
      {shouldMount ? (
        <div aria-hidden="true" className="absolute inset-0">
          <SieveLattice3D paused={reduced} />
        </div>
      ) : (
        <div className="absolute inset-0 grid grid-cols-2 gap-6 place-items-center p-16" aria-hidden="true">
          <div className="h-3 w-3 rounded-full bg-white/10" />
          <div className="h-3 w-3 rounded-full bg-white/10" />
          <div className="h-3 w-3 rounded-full bg-white/10" />
          <div className="h-3 w-3 rounded-full bg-white/10" />
        </div>
      )}
    </div>
  );
}
