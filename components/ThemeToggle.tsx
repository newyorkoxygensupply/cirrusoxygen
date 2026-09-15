"use client";

import { useEffect, useState } from "react";

/** Makes the [data-theme] CSS in globals.css actually reachable — until this
 * existed, those selectors had no code path that ever set the attribute. */
export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);

  useEffect(() => {
    const stored = document.documentElement.getAttribute("data-theme");
    setTheme(stored === "dark" ? "dark" : stored === "light" ? "light" : null);
  }, []);

  function toggle() {
    const next =
      theme === "dark" ? "light" : theme === "light" ? "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("cirrus-theme", next);
    setTheme(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      className="flex h-11 w-11 cursor-pointer items-center justify-center text-muted transition-colors hover:text-text"
    >
      {theme === "dark" ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <circle cx="12" cy="12" r="4.5" />
          <path d="M12 2.5v2M12 19.5v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2.5 12h2M19.5 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" strokeLinecap="round" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );
}
