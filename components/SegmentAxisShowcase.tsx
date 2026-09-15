"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { VentilatorSegmentsDiagram } from "@/components/PillarDiagrams";

const SegmentAxis3D = dynamic(() => import("@/components/SegmentAxis3D"), {
  ssr: false,
  loading: () => null,
});

export function SegmentAxisShowcase() {
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
          aria-label="Diagram of a ventilator breath segment axis — decorative, not required to understand this page."
          className="aspect-4/3 w-full overflow-hidden rounded-[3px]"
          style={{
            background: "radial-gradient(circle at 50% 42%, #1c211f 0%, #0a0c0b 70%, #060706 100%)",
          }}
        >
          <div aria-hidden="true">
            <SegmentAxis3D paused={reduced} />
          </div>
        </div>
      ) : (
        <VentilatorSegmentsDiagram />
      )}
    </div>
  );
}
