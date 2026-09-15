import type { Metadata } from "next";
import Link from "next/link";
import { GUIDES } from "@/lib/guides";
import { Tilt } from "@/components/Tilt";

export const metadata: Metadata = {
  alternates: { canonical: "/guides" },
  title: "Buying Guides",
  description: "Practical, use-case buying guides for oxygen concentrators, CPAP machines, and masks — built around real catalog products.",
};

export default function Page() {
  return (
    <div>
      <section className="border-b border-border px-8 py-20">
        <div className="mx-auto max-w-[720px] text-center">
          <p className="font-mono text-[11px] tracking-[0.14em] text-accent uppercase">Guides</p>
          <h1 className="font-display mt-4 text-[clamp(28px,4vw,42px)] font-semibold text-balance">
            Buying Guides
          </h1>
          <p className="mx-auto mt-5 max-w-[54ch] text-[15px] leading-relaxed text-muted">
            Practical starting points organized by use case, not just by category — each guide
            points to specific real products and explains why.
          </p>
        </div>
      </section>

      <section className="px-8 py-16">
        <div className="mx-auto grid max-w-[1000px] grid-cols-1 gap-6 sm:grid-cols-2">
          {GUIDES.map((g) => (
            <Tilt key={g.slug} className="rounded-[3px]">
              <Link
                href={`/guides/${g.slug}`}
                className="group flex h-full cursor-pointer flex-col rounded-[3px] border border-border p-6 transition-colors hover:bg-surface-2"
              >
                <h2 className="text-[16px] font-semibold text-balance">{g.title}</h2>
                <p className="mt-2 text-[13px] text-muted">{g.dek}</p>
                <span className="mt-4 flex items-center gap-1.5 text-[12px] font-semibold text-accent">
                  Read guide
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="transition-transform group-hover:translate-x-1">
                    <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </Link>
            </Tilt>
          ))}
        </div>
      </section>
    </div>
  );
}
