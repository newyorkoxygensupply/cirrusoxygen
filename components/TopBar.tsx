import Link from "next/link";
import { SUPPORT_PHONE, SUPPORT_PHONE_HREF } from "@/lib/nav";

/**
 * Enterprise utility bar above the main nav. Deliberately not sticky — it
 * scrolls away so the primary nav keeps the viewport. Every statement here is
 * a fact already published elsewhere on the site (trust bar, footer, FAQ);
 * this bar just gives them the institutional placement.
 */
export function TopBar() {
  return (
    <div className="border-b border-border bg-surface-2">
      <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-4 px-8 py-2 font-mono text-[11px] tracking-[0.02em] text-muted">
        <p className="hidden items-center gap-2 sm:flex">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
          FDA-registered devices · Self-pay only · 48-hour continental dispatch
        </p>
        <p className="flex items-center gap-2 sm:hidden">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
          Self-pay · Rx verified
        </p>
        <div className="flex items-center gap-5">
          <Link href="/prescription" className="hidden cursor-pointer transition-colors hover:text-text md:inline">
            Prescription Verification
          </Link>
          <Link href="/shipping" className="hidden cursor-pointer transition-colors hover:text-text md:inline">
            Shipping
          </Link>
          <Link href="/faq" className="hidden cursor-pointer transition-colors hover:text-text lg:inline">
            FAQ
          </Link>
          <a href={SUPPORT_PHONE_HREF} className="cursor-pointer font-medium text-text transition-colors hover:text-accent">
            {SUPPORT_PHONE}
          </a>
        </div>
      </div>
    </div>
  );
}
