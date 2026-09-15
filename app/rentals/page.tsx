import type { Metadata } from "next";
import Link from "next/link";
import { formatPrice, productAltText, productHref, productsByCategory, rentVsBuyRows } from "@/lib/products";
import { RENTAL_DEVICES } from "@/lib/rentals";
import { RentalBooking } from "@/components/RentalBooking";
import { ProductThumb } from "@/components/ProductThumb";
import { SpecComparisonTable } from "@/components/SpecComparisonTable";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Tilt } from "@/components/Tilt";
import { listingCrumbs } from "@/lib/breadcrumbs";
import { itemListJsonLd, breadcrumbJsonLd } from "@/lib/schema";

export const metadata: Metadata = {
  alternates: { canonical: "/rentals" },
  title: "Oxygen & CPAP Rentals",
  description: "Rent portable and home oxygen concentrators, CPAP, and BiPAP machines by the week or month — for travel, recovery, or a trial before you buy.",
};

function ProductGrid({ products }: { products: ReturnType<typeof productsByCategory> }) {
  return (
    <div className="grid grid-cols-1 gap-px border border-border bg-border sm:grid-cols-3">
      {products.map((p) => (
        <Tilt key={p.slug}>
          <Link
            href={productHref(p)}
            className="group relative flex h-full cursor-pointer flex-col bg-surface p-7 transition-colors hover:bg-surface-2"
          >
            {p.badge && (
              <span className="absolute top-4 right-4 rounded-full border border-accent-warm/40 bg-accent-warm/10 px-2.5 py-0.5 font-mono text-[10px] tracking-[0.06em] text-accent-warm uppercase">
                {p.badge}
              </span>
            )}
            <ProductThumb image={p.image} name={p.name} alt={productAltText(p)} className="mb-5 h-40 w-full" />
            <p className="font-mono text-[10px] tracking-[0.06em] text-muted-2 uppercase">{p.brand}</p>
            <h3 className="mt-1 text-[15px] font-semibold">{p.name}</h3>
            {p.spec && <p className="mt-1.5 font-mono text-[12px] text-muted">{p.spec}</p>}
            <p className="mt-4 font-mono text-[16px] tabular-nums">
              {p.price === null ? "Call for Pricing" : formatPrice(p.price)}
            </p>
          </Link>
        </Tilt>
      ))}
    </div>
  );
}

export default function Page() {
  const oxygenRentals = productsByCategory("oxygen-rental");
  const cpapRentals = productsByCategory("cpap-rental");
  const all = [...oxygenRentals, ...cpapRentals];
  const listLd = itemListJsonLd(all.map((p) => ({ name: p.name, url: productHref(p) })));
  const crumbs = listingCrumbs("/rentals", "Rentals");
  const crumbsLd = breadcrumbJsonLd(crumbs);

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbsLd) }} />
      <Breadcrumbs crumbs={crumbs} />

      <section className="border-b border-border px-8 py-20">
        <div className="mx-auto max-w-[720px] text-center">
          <p className="font-mono text-[11px] tracking-[0.14em] text-accent uppercase">Rentals</p>
          <h1 className="font-display mt-4 text-[clamp(28px,4vw,42px)] font-semibold text-balance">
            Oxygen & CPAP Rentals
          </h1>
          <p className="mx-auto mt-5 max-w-[54ch] text-[15px] leading-relaxed text-muted">
            Weekly and monthly rentals of the same instruments we sell — for travel, post-surgery
            recovery, or trying a machine before you commit to buying one.
          </p>
          <a
            href="#book"
            className="mt-6 inline-flex cursor-pointer items-center gap-2 text-[13px] font-semibold text-accent underline underline-offset-4 hover:no-underline"
          >
            Get an instant quote &amp; request a booking
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path d="M12 5v14m7-7-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </section>

      <section className="border-b border-border px-8 py-16">
        <div className="mx-auto grid max-w-[1160px] grid-cols-1 gap-10 sm:grid-cols-3">
          <div>
            <h2 className="text-[14px] font-semibold">When renting makes sense</h2>
            <p className="mt-2 text-[13px] leading-relaxed text-muted">
              Travel, cruises, post-surgical recovery, or a trial run before buying. Past
              4&ndash;6 months of continuous use, purchasing is usually the better value.
            </p>
          </div>
          <div>
            <h2 className="text-[14px] font-semibold">What's included</h2>
            <p className="mt-2 text-[13px] leading-relaxed text-muted">
              Oxygen rentals ship with the concentrator, battery, AC/DC chargers, carrying case,
              and cannula. CPAP and BiPAP rentals ship with the machine, tubing, and power supply
              &mdash; masks are sold separately for hygiene and fit.
            </p>
          </div>
          <div>
            <h2 className="text-[14px] font-semibold">Terms</h2>
            <p className="mt-2 text-[13px] leading-relaxed text-muted">
              7-day minimum on shipped rentals. A valid prescription is required for every unit
              here, the same as a purchase &mdash; your concierge specialist verifies it before
              anything ships.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-border px-8 py-16">
        <div className="mx-auto max-w-[900px]">
          <h2 className="font-display text-[clamp(20px,2.4vw,28px)] font-semibold text-balance">
            Rent or buy? The crossover math.
          </h2>
          <p className="mt-3 max-w-[64ch] text-[14px] leading-relaxed text-muted">
            Computed from our own live purchase and rental prices — the month count where renting
            starts costing more than owning. Rent shorter than the breakeven; buy longer.
          </p>
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-[13px]">
              <thead>
                <tr className="border-b border-border-strong font-mono text-[11px] tracking-[0.06em] text-muted-2 uppercase">
                  <th className="py-3 pr-4 text-left font-medium">Device</th>
                  <th className="py-3 pr-4 text-right font-medium">Purchase</th>
                  <th className="py-3 pr-4 text-right font-medium">Monthly rental</th>
                  <th className="py-3 text-right font-medium">Breakeven</th>
                </tr>
              </thead>
              <tbody>
                {rentVsBuyRows().map((r) => (
                  <tr key={r.rentalSlug} className="border-b border-border">
                    <td className="py-3 pr-4">
                      <Link href={`/rentals/${r.rentalSlug}`} className="cursor-pointer font-semibold hover:text-accent">
                        {r.deviceName}
                      </Link>
                    </td>
                    <td className="py-3 pr-4 text-right font-mono tabular-nums">{formatPrice(r.purchasePrice)}</td>
                    <td className="py-3 pr-4 text-right font-mono tabular-nums">{formatPrice(r.monthlyRental)}</td>
                    <td className="py-3 text-right font-mono font-semibold text-accent tabular-nums">
                      ~{r.breakevenMonths} mo
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-[12px] text-muted-2">
            Breakeven = purchase price &divide; monthly rental rate, rounded to one decimal.
            Excludes shipping and consumables. Models priced by phone on either side aren&rsquo;t
            shown &mdash; ask your concierge specialist to run the same math for those.
          </p>
        </div>
      </section>

      <section id="book" className="scroll-mt-24 border-b border-border px-8 py-16">
        <div className="mx-auto max-w-[1160px]">
          <div className="mb-10 max-w-[56ch]">
            <h2 className="font-display text-[clamp(20px,2.4vw,28px)] font-semibold text-balance">
              Instant quote &amp; booking request
            </h2>
            <p className="mt-3 text-[14px] leading-relaxed text-muted">
              Pick a device and your dates to see weekly and monthly totals from our live rates,
              then send the request &mdash; a specialist confirms availability, verifies your
              prescription, and finalizes everything by phone or email.
            </p>
          </div>
          <RentalBooking devices={RENTAL_DEVICES} />
        </div>
      </section>

      <section className="px-8 py-16">
        <div className="mx-auto max-w-[1240px]">
          <h2 className="font-display mb-8 text-[13px] font-semibold tracking-[0.08em] text-muted uppercase">
            Oxygen Concentrator Rentals
          </h2>
          <ProductGrid products={oxygenRentals} />
        </div>
      </section>

      <SpecComparisonTable products={oxygenRentals} />

      <section className="border-t border-border px-8 py-16">
        <div className="mx-auto max-w-[1240px]">
          <h2 className="font-display mb-8 text-[13px] font-semibold tracking-[0.08em] text-muted uppercase">
            CPAP & BiPAP Rentals
          </h2>
          <ProductGrid products={cpapRentals} />
        </div>
      </section>

      <SpecComparisonTable products={cpapRentals} />
    </div>
  );
}
