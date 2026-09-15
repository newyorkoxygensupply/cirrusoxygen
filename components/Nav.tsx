"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PRIMARY_NAV, NAV_DROPDOWNS } from "@/lib/nav";
import { useCart } from "@/lib/cart-context";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Logo } from "@/components/Logo";

export function Nav() {
  const { count } = useCart();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // Which dropdown panel (parent href) is open, if any. One at a time.
  const [openPanel, setOpenPanel] = useState<string | null>(null);
  const closeTimer = useRef<number | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  // Small close delay so the pointer can travel from trigger to panel without
  // the panel vanishing — the classic hover-intent guard.
  function scheduleClose() {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpenPanel(null), 140);
  }
  function cancelClose() {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
  }

  // Dropdowns close on navigation and on Escape.
  useEffect(() => setOpenPanel(null), [pathname]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenPanel(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      firstLinkRef.current?.focus();
    }
  }, [mobileOpen]);

  // Condense + solidify the bar once the page leaves the very top — the header
  // reads as weightless over the hero, then settles into a defined edge.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  function closeMenu() {
    setMobileOpen(false);
    menuButtonRef.current?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") closeMenu();
  }

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-surface/90 backdrop-blur transition-[border-color,box-shadow,background-color] duration-300 ${
        scrolled ? "border-border-strong bg-surface/95 shadow-[0_6px_24px_-16px_rgba(0,0,0,0.5)]" : "border-border"
      }`}
    >
      <nav
        className={`mx-auto flex max-w-[1240px] items-center justify-between px-8 transition-[padding] duration-300 ${
          scrolled ? "py-3.5" : "py-5"
        }`}
      >
        <Link href="/" aria-label="CIRRUS home" className="cursor-pointer">
          <Logo className="text-xl" iconSize={26} />
        </Link>

        <ul className="hidden items-center gap-9 text-[13px] font-medium md:flex">
          {PRIMARY_NAV.map((item) => {
            const active = isActive(item.href);
            const dropdown = NAV_DROPDOWNS[item.href];
            const open = openPanel === item.href;
            return (
              <li
                key={item.href}
                className="relative"
                onMouseEnter={
                  dropdown
                    ? () => {
                        cancelClose();
                        setOpenPanel(item.href);
                      }
                    : undefined
                }
                onMouseLeave={dropdown ? scheduleClose : undefined}
              >
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  aria-expanded={dropdown ? open : undefined}
                  aria-haspopup={dropdown ? "menu" : undefined}
                  onFocus={dropdown ? () => setOpenPanel(item.href) : undefined}
                  className={`group relative flex cursor-pointer items-center gap-1 transition-colors ${
                    active ? "text-text" : "text-muted hover:text-text"
                  }`}
                >
                  {item.label}
                  {dropdown && (
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.2}
                      aria-hidden="true"
                      className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                    >
                      <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                  {/* Underline draws in from the left on hover; sits full-width
                      for the active section. */}
                  <span
                    aria-hidden="true"
                    className={`absolute -bottom-1.5 left-0 h-px bg-accent transition-[width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      active ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>

                {dropdown && open && (
                  <div
                    onMouseEnter={cancelClose}
                    onMouseLeave={scheduleClose}
                    className="absolute top-full left-1/2 z-50 w-[300px] -translate-x-1/2 pt-4"
                  >
                    <div className="animate-fold-down overflow-hidden rounded-[3px] border border-border bg-surface shadow-[0_18px_48px_-20px_rgba(0,0,0,0.45)]">
                      <ul className="py-1.5">
                        {dropdown.map((d) => (
                          <li key={d.href}>
                            <Link
                              href={d.href}
                              onBlur={(e) => {
                                // Close once focus leaves the whole panel —
                                // keeps keyboard tabbing tidy without trapping.
                                if (!e.currentTarget.closest("li[class*=relative]")?.contains(e.relatedTarget as Node)) {
                                  scheduleClose();
                                }
                              }}
                              className="block cursor-pointer px-5 py-3 transition-colors hover:bg-surface-2"
                            >
                              <span className="block text-[13px] font-semibold text-text">{d.label}</span>
                              <span className="mt-0.5 block text-[12px] font-normal text-muted">{d.desc}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <Link
                        href={item.href}
                        className="flex cursor-pointer items-center justify-between border-t border-border bg-surface-2 px-5 py-3 text-[12px] font-semibold text-accent transition-colors hover:text-text"
                      >
                        View all {item.label}
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                          <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        {/* 44px boxes on the icon controls — WCAG tap-target size; gap shrinks
            to compensate so the visual rhythm matches the old 18px icons. */}
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Link
            href="/search"
            aria-label="Search"
            className="flex h-11 w-11 cursor-pointer items-center justify-center text-muted transition-colors hover:text-text"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.35-4.35" strokeLinecap="round" />
            </svg>
          </Link>
          <Link
            href="/cart"
            aria-label={`Cart, ${count} item${count === 1 ? "" : "s"}`}
            className="relative flex h-11 w-11 cursor-pointer items-center justify-center text-muted transition-colors hover:text-text"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path d="M6 6h15l-1.5 9h-12L6 6Zm0 0L5 3H2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="9" cy="20" r="1" />
              <circle cx="17" cy="20" r="1" />
            </svg>
            {count > 0 && (
              <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 font-mono text-[9px] font-semibold text-accent-ink tabular-nums">
                {count}
              </span>
            )}
          </Link>
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-panel"
            className="flex h-11 w-11 cursor-pointer items-center justify-center text-muted transition-colors hover:text-text md:hidden"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
              {mobileOpen ? (
                <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
              ) : (
                <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div
          id="mobile-nav-panel"
          onKeyDown={handleKeyDown}
          className="border-t border-border bg-surface px-8 py-4 md:hidden"
        >
          <ul className="flex flex-col">
            {PRIMARY_NAV.map((item, i) => {
              const dropdown = NAV_DROPDOWNS[item.href];
              return (
                <li key={item.href} className="border-b border-border last:border-b-0">
                  <Link
                    ref={i === 0 ? firstLinkRef : undefined}
                    href={item.href}
                    onClick={closeMenu}
                    className="flex min-h-12 cursor-pointer items-center text-[15px] font-medium text-text"
                  >
                    {item.label}
                  </Link>
                  {dropdown && (
                    <ul className="mb-3 flex flex-col border-l border-border-strong pl-4">
                      {dropdown.map((d) => (
                        <li key={d.href}>
                          <Link
                            href={d.href}
                            onClick={closeMenu}
                            className="flex min-h-10 cursor-pointer items-center text-[13px] text-muted"
                          >
                            {d.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </header>
  );
}
