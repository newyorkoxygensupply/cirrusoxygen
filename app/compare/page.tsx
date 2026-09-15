import type { Metadata } from "next";
import Link from "next/link";
import { COMPARISONS, resolveComparison } from "@/lib/comparisons";
import { Tilt } from "@/components/Tilt";

export const metadata: Metadata = {
  alternates: { canonical: "/compare" },
  title: "Compare",
  description: "Side-by-side comparisons of real CIRRUS catalog products, with a written verdict for each pair — not an auto-generated spec dump.",
};

export default function Page() {
  return (
    <div>
      <section className="border-b border-border px-8 py-20">
        <div className="mx-auto max-w-[720px] text-center">
          <p className="font-mono text-[11px] tracking-[0.14em] text-accent uppercase">Compare</p>
          <h1 className="font-display mt-4 text-[clamp(28px,4vw,42px)] font-semibold text-balance">
            Compare
          </h1>
          <p className="mx-auto mt-5 max-w-[54ch] text-[15px] leading-relaxed text-muted">
            Every comparison here covers two products with a genuine, meaningful difference —
            price, weight class, or clinical use case — with a written verdict, not just two spec
            tables side by side.
          </p>
        </div>
      </section>

      <section className="px-8 py-16">
        <div className="mx-auto grid max-w-[900px] grid-cols-1 gap-px border border-border bg-border sm:grid-cols-2">
          {COMPARISONS.map((c) => {
            const { a, b } = resolveComparison(c);
            if (!a || !b) return null;
            return (
              <Tilt key={c.slug}>
                <Link
                  href={`/compare/${c.slug}`}
                  className="block h-full cursor-pointer bg-surface p-6 transition-colors hover:bg-surface-2"
                >
                  <h2 className="text-[14px] font-semibold">
                    {a.name} <span className="text-muted-2">vs.</span> {b.name}
                  </h2>
                  <p className="mt-1.5 text-[12px] text-muted">{a.brand} · {b.brand}</p>
                </Link>
              </Tilt>
            );
          })}
        </div>
      </section>
    </div>
  );
}
