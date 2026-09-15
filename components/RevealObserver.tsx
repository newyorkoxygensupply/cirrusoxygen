"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Drives the site-wide scroll-reveal system. Every element tagged
 * `data-reveal` starts hidden (see globals.css, gated by `.reveal-ready`) and
 * is faded/risen into place the first time it scrolls near the viewport.
 *
 * One IntersectionObserver for the whole page; each element is unobserved the
 * moment it reveals, so this stays cheap even on long catalog pages. Re-scans
 * on route change because the App Router swaps `children` under this component
 * without remounting it. Fully reduced-motion-safe (the CSS no-ops the
 * transition) and progressive-enhancement-safe (no JS ⇒ content just shows).
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const els = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-visible)")
    );
    if (els.length === 0) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Safety net: if motion is off, or IntersectionObserver is unavailable,
    // reveal everything immediately. Content must never be able to get stuck
    // invisible behind a feature that didn't run.
    if (reduce || typeof IntersectionObserver === "undefined") {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const io = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        }
      },
      // Start the reveal a little before the element's top edge reaches the
      // fold, so it's settling as it enters rather than popping in late.
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
