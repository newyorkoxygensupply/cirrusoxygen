"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { OxygenProcessDiagram } from "@/components/PillarDiagrams";

const SieveBedCutaway3D = dynamic(() => import("@/components/SieveBedCutaway3D"), {
  ssr: false,
  loading: () => null,
});

/**
 * The accurate 2D schematic is the real fallback here, not a placeholder —
 * no-JS visitors and anyone before the WebGL scene mounts get the same
 * correct explanation of the process, just without the staged 3D upgrade.
 */
export function SieveBedCutawayShowcase() {
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
    <div ref={ref}>
      {shouldMount ? (
        <div
          role="img"
          aria-label="Cutaway diagram of a PSA sieve-bed oxygen concentrator — decorative, not required to understand this page."
          className="aspect-4/3 w-full overflow-hidden rounded-[3px]"
          style={{
            background: "radial-gradient(circle at 50% 42%, #1c211f 0%, #0a0c0b 70%, #060706 100%)",
          }}
        >
          <div aria-hidden="true">
            <SieveBedCutaway3D paused={reduced} />
          </div>
        </div>
      ) : (
        <OxygenProcessDiagram />
      )}
    </div>
  );
}
