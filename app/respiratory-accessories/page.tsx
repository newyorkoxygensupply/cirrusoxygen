import type { Metadata } from "next";
import Link from "next/link";
import { formatPrice, productAltText, productHref, productsByBase } from "@/lib/products";
import { ProductThumb } from "@/components/ProductThumb";
import { SpecComparisonTable } from "@/components/SpecComparisonTable";
import { NebulizerShowcase } from "@/components/NebulizerShowcase";
import { SuctionUnitShowcase } from "@/components/SuctionUnitShowcase";
import { PulseOxLightShowcase } from "@/components/PulseOxLightShowcase";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { listingCrumbs } from "@/lib/breadcrumbs";
import { itemListJsonLd, breadcrumbJsonLd } from "@/lib/schema";

export const metadata: Metadata = {
  alternates: { canonical: "/respiratory-accessories" },
  title: "Respiratory Accessories",
  description: "Nebulizers, pulse oximeters, and suction units — the cross-cutting hub for respiratory equipment outside oxygen and sleep.",
};

export default function Page() {
  const accessories = productsByBase("/respiratory-accessories");
  const listLd = itemListJsonLd(accessories.map((p) => ({ name: p.name, url: productHref(p) })));
  const crumbs = listingCrumbs("/respiratory-accessories", "Respiratory Accessories");
  const crumbsLd = breadcrumbJsonLd(crumbs);

  return (
    <div>
      {accessories.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listLd) }} />
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbsLd) }} />
      <Breadcrumbs crumbs={crumbs} />
      <section className="border-b border-border px-8 py-20">
        <div className="mx-auto max-w-[720px] text-center">
          <p className="font-mono text-[11px] tracking-[0.14em] text-accent uppercase">Shop</p>
          <h1 className="font-display mt-4 text-[clamp(28px,4vw,42px)] font-semibold text-balance">
            Respiratory Accessories
          </h1>
          <p className="mx-auto mt-5 max-w-[54ch] text-[15px] leading-relaxed text-muted">
            Nebulizers, pulse oximeters, and suction units — plus quick links to oxygen- and
            sleep-specific parts.
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 border-b border-border sm:grid-cols-3">
        <Link
          href="/oxygen/accessories"
          className="group cursor-pointer border-r border-b border-border p-11 transition-colors hover:bg-surface-2 sm:border-b-0"
        >
          <h2 className="text-[15px] font-semibold">Oxygen Accessories</h2>
          <p className="mt-2 max-w-[34ch] text-[13px] text-muted">Batteries and carrying cases.</p>
          <span className="mt-4 flex items-center gap-1.5 text-[12px] font-semibold text-accent">Browse</span>
        </Link>
        <Link
          href="/oxygen/tanks"
          className="group cursor-pointer border-r border-b border-border p-11 transition-colors hover:bg-surface-2 sm:border-b-0"
        >
          <h2 className="text-[15px] font-semibold">Tanks & Cylinders</h2>
          <p className="mt-2 max-w-[34ch] text-[13px] text-muted">Backup and supplemental oxygen supply.</p>
          <span className="mt-4 flex items-center gap-1.5 text-[12px] font-semibold text-accent">Browse</span>
        </Link>
        <Link
          href="/sleep/accessories"
          className="group cursor-pointer p-11 transition-colors hover:bg-surface-2"
        >
          <h2 className="text-[15px] font-semibold">Masks & Cleaners</h2>
          <p className="mt-2 max-w-[34ch] text-[13px] text-muted">CPAP masks and sanitizers.</p>
          <span className="mt-4 flex items-center gap-1.5 text-[12px] font-semibold text-accent">Browse</span>
        </Link>
      </section>

      <section className="border-b border-border px-8 py-24">
        <div className="mx-auto grid max-w-[1160px] grid-cols-1 items-center gap-14 sm:grid-cols-2 sm:gap-20">
          <div data-reveal className="order-2 sm:order-1">
            <p className="font-mono text-[11px] tracking-[0.1em] text-accent uppercase">Aerosol, not inhaler</p>
            <h2 className="font-display mt-2 text-[clamp(24px,3vw,36px)] font-semibold text-balance">
              Compressed air, sheared into a mist.
            </h2>
            <div className="mt-4 max-w-[46ch] text-[15px] text-muted">
              <p>
                A jet nebulizer forces compressed air through a narrow opening in the medication
                cup, shattering the liquid into a fine aerosol. Droplets too large to inhale
                usefully strike an internal baffle and fall back into the reservoir to be
                re-atomized — only the fine mist escapes toward the mouthpiece.
              </p>
            </div>
          </div>
          <div data-reveal className="order-1 flex justify-center sm:order-2">
            <NebulizerShowcase />
          </div>
        </div>
      </section>

      <section className="border-b border-border px-8 py-24">
        <div className="mx-auto grid max-w-[1160px] grid-cols-1 items-center gap-14 sm:grid-cols-2 sm:gap-20">
          <div data-reveal className="order-2 sm:order-2">
            <p className="font-mono text-[11px] tracking-[0.1em] text-accent uppercase">Intake, not delivery</p>
            <h2 className="font-display mt-2 text-[clamp(24px,3vw,36px)] font-semibold text-balance">
              A float valve that shuts itself off.
            </h2>
            <div className="mt-4 max-w-[46ch] text-[15px] text-muted">
              <p>
                A suction unit&rsquo;s vacuum pump draws fluid through a catheter tip into a
                collection canister. The safety detail is the float valve: a ball that rises with
                the fluid level and seals the line before it reaches — and could damage — the
                pump motor.
              </p>
            </div>
          </div>
          <div data-reveal className="order-1 flex justify-center sm:order-1" style={{ "--reveal-delay": "60ms" } as React.CSSProperties}>
            <SuctionUnitShowcase />
          </div>
        </div>
      </section>

      <section className="border-b border-border px-8 py-24">
        <div className="mx-auto grid max-w-[1160px] grid-cols-1 items-center gap-14 sm:grid-cols-2 sm:gap-20">
          <div data-reveal className="order-2 sm:order-1">
            <p className="font-mono text-[11px] tracking-[0.1em] text-accent uppercase">One reading, two wavelengths</p>
            <h2 className="font-display mt-2 text-[clamp(24px,3vw,36px)] font-semibold text-balance">
              A fingertip clip and a wearable ring, reading the same way.
            </h2>
            <div className="mt-4 max-w-[46ch] text-[15px] text-muted">
              <p>
                Whether it clips on a fingertip for a spot check or sits on a finger all night as a
                ring, every pulse oximeter here works the same way: red and infrared light shine
                through tissue, and the ratio of what&rsquo;s absorbed — which shifts with every
                heartbeat as arterial blood pulses through — is the entire measurement. The
                form factor changes; the physics underneath doesn&rsquo;t.
              </p>
              <p className="mt-3 text-[13px] text-muted-2">
                Where accuracy holds up and where it doesn&rsquo;t, in{" "}
                <Link href="/journal/pulse-oximeters-how-they-work-accuracy-limits" className="text-accent underline underline-offset-2 hover:no-underline">
                  how pulse oximeters actually work
                </Link>
                .
              </p>
            </div>
          </div>
          <div data-reveal className="order-1 flex justify-center sm:order-2">
            <PulseOxLightShowcase />
          </div>
        </div>
      </section>

      <section className="px-8 py-16">
        <div className="mx-auto max-w-[1240px]">
          <h2 className="font-display mb-8 text-[13px] font-semibold tracking-[0.08em] text-muted uppercase">
            Available now
          </h2>
          <div className="grid grid-cols-1 gap-px border border-border bg-border sm:grid-cols-3">
            {accessories.map((p) => (
              <Link
                key={p.slug}
                href={productHref(p)}
                className="group flex cursor-pointer flex-col bg-surface p-7 transition-colors hover:bg-surface-2"
              >
                <ProductThumb image={p.image} name={p.name} alt={productAltText(p)} className="mb-5 h-40 w-full" />
                <p className="font-mono text-[10px] tracking-[0.06em] text-muted-2 uppercase">{p.brand}</p>
                <h3 className="mt-1 text-[15px] font-semibold">{p.name}</h3>
                {p.spec && <p className="mt-1.5 font-mono text-[12px] text-muted">{p.spec}</p>}
                <p className="mt-4 font-mono text-[16px] tabular-nums">
                  {p.price === null ? "Call for Pricing" : formatPrice(p.price)}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <SpecComparisonTable products={accessories} />
    </div>
  );
}
