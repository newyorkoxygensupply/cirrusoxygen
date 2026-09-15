import Link from "next/link";
import { FOOTER_NAV, SUPPORT_PHONE, SUPPORT_PHONE_HREF } from "@/lib/nav";
import { PRODUCTS } from "@/lib/products";
import { Logo } from "@/components/Logo";
import { VitalsWaveform } from "@/components/VitalsWaveform";

// Real manufacturer names, derived from the live catalog — the strip can never
// drift from what CIRRUS actually carries.
const BRANDS = Array.from(new Set(PRODUCTS.map((p) => p.brand))).sort();

export function Footer() {
  return (
    <footer className="border-t border-border">
      <VitalsWaveform className="w-full text-border-strong opacity-60" height={20} />
      {/* ── Pre-footer contact band ─────────────────────────────────── */}
      <section className="border-b border-border bg-surface-2 px-8 py-14">
        <div className="mx-auto flex max-w-[1240px] flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <p className="font-mono text-[11px] tracking-[0.1em] text-accent uppercase">
              Concierge
            </p>
            <h2 className="font-display mt-2 max-w-[24ch] text-[clamp(20px,2.6vw,28px)] font-semibold text-balance">
              One specialist, start to finish — prescription to doorstep.
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-3.5">
            <Link
              href="/concierge"
              className="inline-flex cursor-pointer items-center gap-2 rounded-[3px] bg-accent px-7 py-3.5 text-[13px] font-semibold text-accent-ink transition-transform hover:-translate-y-px"
            >
              Talk to Concierge
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <a
              href={SUPPORT_PHONE_HREF}
              className="inline-flex cursor-pointer items-center rounded-[3px] border border-border-strong px-7 py-3.5 font-mono text-[13px] font-semibold transition-colors hover:border-text"
            >
              {SUPPORT_PHONE}
            </a>
          </div>
        </div>
      </section>

      {/* ── Main columns ────────────────────────────────────────────── */}
      <div className="px-8 py-16">
        <div className="mx-auto max-w-[1240px]">
          <div className="grid grid-cols-2 gap-10 md:grid-cols-[1.1fr_1fr_1fr_1fr_1fr_1fr]">
            <div className="col-span-2 md:col-span-1">
              <Logo className="text-lg" iconSize={22} />
              <p className="mt-3.5 max-w-[32ch] text-[13px] leading-relaxed text-muted">
                Precision respiratory equipment for self-pay buyers who&rsquo;d rather own the
                decision than route it through a claims department.
              </p>
              <p className="mt-5 font-mono text-[11px] tracking-[0.02em] text-muted-2">
                Concierge line
                <a href={SUPPORT_PHONE_HREF} className="mt-1 block cursor-pointer text-[13px] font-medium text-text transition-colors hover:text-accent">
                  {SUPPORT_PHONE}
                </a>
              </p>
            </div>

            {Object.entries(FOOTER_NAV).map(([heading, links]) => (
              <div key={heading}>
                <h3 className="font-mono text-[11px] tracking-[0.08em] text-muted-2 uppercase">
                  {heading}
                </h3>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="cursor-pointer text-[13px] text-muted transition-colors hover:text-text"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* ── Manufacturer strip — every brand actually in the catalog ── */}
          <div className="mt-14 border-t border-border pt-8">
            <p className="font-mono text-[10px] tracking-[0.1em] text-muted-2 uppercase">
              Authorized inventory from
            </p>
            <p className="mt-3 flex flex-wrap gap-x-7 gap-y-2 font-mono text-[12px] tracking-[0.03em] text-muted">
              {BRANDS.map((b) => (
                <span key={b}>{b}</span>
              ))}
            </p>
          </div>

          {/* ── Compliance ─────────────────────────────────────────────── */}
          <div className="mt-10 border-t border-border pt-6 text-[12px] leading-relaxed text-muted-2">
            <p className="mb-2 font-medium text-text">
              Currently we don&rsquo;t accept Insurance, Medicaid, or Medicare. All purchases are
              self-pay.
            </p>
            <p>
              Oxygen concentrators and CPAP/BiPAP devices are prescription-required medical devices
              under FDA regulation. A valid prescription is verified prior to fulfillment regardless
              of payment method. Content on this site is general health information, not medical
              advice — see our{" "}
              <Link href="/editorial-policy" className="cursor-pointer text-muted underline decoration-border-strong underline-offset-2 transition-colors hover:text-text">
                editorial policy
              </Link>
              .
            </p>
          </div>

          {/* ── Legal bar ──────────────────────────────────────────────── */}
          <div className="mt-8 flex flex-col justify-between gap-4 border-t border-border pt-6 sm:flex-row sm:items-center">
            <p className="font-mono text-[11px] text-muted-2">
              © {new Date().getFullYear()} CIRRUS. All rights reserved.
            </p>
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px]">
              {[
                { label: "Privacy", href: "/privacy" },
                { label: "Terms", href: "/terms" },
                { label: "Returns", href: "/returns" },
                { label: "Editorial Policy", href: "/editorial-policy" },
                { label: "Sitemap", href: "/sitemap.xml" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="cursor-pointer text-muted-2 transition-colors hover:text-text">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
