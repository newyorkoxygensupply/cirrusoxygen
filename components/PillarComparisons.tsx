import Link from "next/link";
import { comparisonsForGuide } from "@/lib/comparisons";
import { formatPrice } from "@/lib/products";
import { Tilt } from "@/components/Tilt";
import type { SERIES } from "@/lib/journal";

/** The satellite spokes of a pillar guide: every model-vs-model comparison
 * whose products belong to the guide's catalog categories. Rendered on the
 * pillar so head-to-head pages hang off the cluster instead of floating. */
export function PillarComparisons({ guideKey }: { guideKey: keyof typeof SERIES }) {
  const comparisons = comparisonsForGuide(guideKey);
  if (comparisons.length === 0) return null;

  return (
    <section className="border-t border-border px-8 py-16">
      <div className="mx-auto max-w-[1240px]">
        <div data-reveal className="mb-8 max-w-[52ch]">
          <p className="font-mono text-[11px] tracking-[0.1em] text-accent uppercase">
            Head to head
          </p>
          <h2 className="font-display mt-2 text-[clamp(20px,2.6vw,28px)] font-semibold">
            Compare the contenders
          </h2>
          <p className="mt-2 text-[14px] text-muted">
            Spec-by-spec pages with a written verdict — for when the guide has narrowed it to two.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {comparisons.map(({ slug, a, b }, i) => (
            <div
              key={slug}
              data-reveal
              style={{ "--reveal-delay": `${(i % 3) * 70}ms` } as React.CSSProperties}
            >
              <Tilt className="h-full">
                <Link
                  href={`/compare/${slug}`}
                  className="group flex h-full cursor-pointer flex-col justify-between gap-5 bg-surface p-6 transition-colors hover:bg-surface-2"
                >
                  <div>
                    <h3 className="text-[14px] leading-snug font-semibold transition-colors group-hover:text-accent">
                      {a!.name} <span className="font-mono text-[11px] text-muted-2">vs.</span> {b!.name}
                    </h3>
                    <p className="mt-2 font-mono text-[12px] text-muted tabular-nums">
                      {a!.price !== null ? formatPrice(a!.price) : "Call"} ·{" "}
                      {b!.price !== null ? formatPrice(b!.price) : "Call"}
                    </p>
                  </div>
                  <span className="flex items-center gap-1.5 font-mono text-[11px] text-muted-2 uppercase">
                    Read the verdict
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true" className="text-accent transition-transform group-hover:translate-x-1">
                      <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </Link>
              </Tilt>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
