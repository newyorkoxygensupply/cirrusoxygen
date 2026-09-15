"use client";

import { useEffect, useRef } from "react";

/**
 * A glowing chronograph sweep pinned to the very top of the viewport: its
 * width tracks how far down the document you've scrolled. rAF-throttled so
 * scroll stays smooth, and it simply sits at 0 width under reduced-motion
 * (the line is decorative, not informational). Transform-only — never
 * triggers layout.
 */
export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, doc.scrollTop / max)) : 0;
      bar.style.transform = `scaleX(${p})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div aria-hidden="true" className="fixed inset-x-0 top-0 z-[60] h-[3px]">
      <div
        ref={barRef}
        className="h-full origin-left bg-accent shadow-[0_0_10px_1px_var(--accent)]"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}
