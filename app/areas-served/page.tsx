import type { Metadata } from "next";
import Link from "next/link";
import { CITIES } from "@/lib/cities";

export const metadata: Metadata = {
  alternates: { canonical: "/areas-served" },
  title: "Areas Served",
  description: "CIRRUS ships oxygen concentrators, CPAP, and BiPAP systems nationwide — 48-hour delivery to all 50 states, no local office required.",
};

export default function Page() {
  const byState = new Map<string, typeof CITIES>();
  for (const c of CITIES) {
    const list = byState.get(c.state) ?? [];
    list.push(c);
    byState.set(c.state, list);
  }
  const states = [...byState.keys()].sort();

  return (
    <div>
      <section className="border-b border-border px-8 py-20">
        <div className="mx-auto max-w-[720px] text-center">
          <p className="font-mono text-[11px] tracking-[0.14em] text-accent uppercase">Coverage</p>
          <h1 className="font-display mt-4 text-[clamp(28px,4vw,42px)] font-semibold text-balance">
            Areas Served
          </h1>
          <p className="mx-auto mt-5 max-w-[58ch] text-[15px] leading-relaxed text-muted">
            CIRRUS is a direct-ship retailer, not a chain of local offices — we don&rsquo;t have a
            branch in any of the cities listed below. What we do have is 48-hour continental
            shipping to every one of them, the same prescription verification process, and the
            same concierge line, regardless of where your order ships.
          </p>
        </div>
      </section>

      <section className="px-8 py-16">
        <div className="mx-auto max-w-[1000px]">
          {states.map((state) => (
            <div key={state} className="border-b border-border py-6">
              <h2 className="font-mono text-[11px] tracking-[0.08em] text-muted uppercase">{state}</h2>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
                {byState.get(state)!.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/areas-served/${c.slug}`}
                    className="cursor-pointer text-[13px] text-muted transition-colors hover:text-accent"
                  >
                    {c.city}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
