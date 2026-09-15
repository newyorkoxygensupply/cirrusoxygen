import type { Metadata } from "next";
import Link from "next/link";
import { GLOSSARY } from "@/lib/glossary";
import { Tilt } from "@/components/Tilt";

export const metadata: Metadata = {
  alternates: { canonical: "/glossary" },
  title: "Glossary",
  description: "Plain-language definitions for the oxygen therapy and CPAP/BiPAP terms used across CIRRUS — AHI, pulse dose, cmH2O, FEV1, and more.",
};

export default function Page() {
  const sorted = [...GLOSSARY].sort((a, b) => a.term.localeCompare(b.term));

  return (
    <div>
      <section className="border-b border-border px-8 py-20">
        <div className="mx-auto max-w-[720px] text-center">
          <p className="font-mono text-[11px] tracking-[0.14em] text-accent uppercase">Reference</p>
          <h1 className="font-display mt-4 text-[clamp(28px,4vw,42px)] font-semibold text-balance">
            Glossary
          </h1>
          <p className="mx-auto mt-5 max-w-[54ch] text-[15px] leading-relaxed text-muted">
            Plain-language definitions for the oxygen therapy and sleep apnea terms used across
            this site — the same terms that show up on a prescription, a spec sheet, or a sleep
            study report.
          </p>
        </div>
      </section>

      <section className="px-8 py-16">
        <div className="mx-auto max-w-[800px]">
          <div className="grid grid-cols-1 gap-px border border-border bg-border sm:grid-cols-2">
            {sorted.map((g) => (
              <Tilt key={g.slug} max={6}>
                <Link
                  href={`/glossary/${g.slug}`}
                  className="block h-full cursor-pointer bg-surface p-5 transition-colors hover:bg-surface-2"
                >
                  <h2 className="text-[14px] font-semibold">{g.term}</h2>
                  <p className="mt-1.5 line-clamp-2 text-[12px] text-muted">{g.definition[0]}</p>
                </Link>
              </Tilt>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
