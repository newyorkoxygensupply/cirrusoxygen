"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

const OxygenMolecule3D = dynamic(() => import("@/components/OxygenMolecule3D"), {
  ssr: false,
  loading: () => null,
});

/**
 * Lazy-mounts the WebGL scene only once this section nears the viewport, so
 * the Three.js bundle never costs anything on first load for a visitor who
 * doesn't scroll this far — the same "don't pay for what you don't see"
 * discipline as the rest of the site's scroll-gated motion.
 */
export function OxygenMoleculeShowcase() {
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
      aria-label="Stylized diagram of an oxygen (O2) molecule — decorative, not required to understand this page."
      className="relative aspect-square w-full max-w-[520px] overflow-hidden rounded-full sm:aspect-4/3 sm:max-w-none sm:rounded-[3px]"
      style={{
        background: "radial-gradient(circle at 50% 42%, #1c211f 0%, #0a0c0b 70%, #060706 100%)",
      }}
    >
      {shouldMount ? (
        <div aria-hidden="true" className="absolute inset-0">
          <OxygenMolecule3D paused={reduced} />
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center gap-4" aria-hidden="true">
          <div className="h-[85px] w-[85px] rounded-full bg-white/10" />
          <div className="h-[85px] w-[85px] rounded-full bg-white/10" />
        </div>
      )}
    </div>
  );
}
