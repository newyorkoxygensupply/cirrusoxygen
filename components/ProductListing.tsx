import Link from "next/link";
import { formatPrice, productAltText, productHref, productsByBase } from "@/lib/products";
import { ProductThumb } from "@/components/ProductThumb";
import { SpecComparisonTable } from "@/components/SpecComparisonTable";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Tilt } from "@/components/Tilt";
import { listingCrumbs } from "@/lib/breadcrumbs";
import { itemListJsonLd, breadcrumbJsonLd } from "@/lib/schema";

export function ProductListing({
  eyebrow,
  title,
  intro,
  base,
  pillar,
  science,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  base: string;
  /** Optional link to the section's pillar guide, shown under the intro. */
  pillar?: { label: string; href: string };
  /** Optional hero-adjacent "how it works" sections — real mechanism, not marketing. */
  science?: {
    eyebrow: string;
    heading: string;
    body: React.ReactNode;
    visual: React.ReactNode;
    imageSide?: "left" | "right";
  }[];
}) {
  const products = productsByBase(base);
  const listLd = itemListJsonLd(products.map((p) => ({ name: p.name, url: productHref(p) })));
  const crumbs = listingCrumbs(base, title);
  const crumbsLd = breadcrumbJsonLd(crumbs);

  return (
    <div>
      {products.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listLd) }} />
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbsLd) }} />
      <Breadcrumbs crumbs={crumbs} />
      <section className="border-b border-border px-8 py-20">
        <div className="mx-auto max-w-[720px] text-center">
          <p className="font-mono text-[11px] tracking-[0.14em] text-accent uppercase">{eyebrow}</p>
          <h1 className="font-display mt-4 text-[clamp(28px,4vw,42px)] font-semibold text-balance">
            {title}
          </h1>
          <p className="mx-auto mt-5 max-w-[54ch] text-[15px] leading-relaxed text-muted">{intro}</p>
          {pillar && (
            <Link
              href={pillar.href}
              className="mt-7 inline-flex cursor-pointer items-center gap-2 rounded-full border border-border-strong px-5 py-2 text-[13px] font-semibold transition-colors hover:border-accent hover:text-accent"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true" className="text-accent">
                <path d="M4 19V6a2 2 0 0 1 2-2h13v13H6a2 2 0 0 0-2 2Zm0 0a2 2 0 0 0 2 2h13" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {pillar.label}
            </Link>
          )}
        </div>
      </section>

      {science?.map((s, i) => (
        <section key={s.heading} className="border-b border-border px-8 py-24">
          <div className="mx-auto grid max-w-[1160px] grid-cols-1 items-center gap-14 sm:grid-cols-2 sm:gap-20">
            <div data-reveal className={s.imageSide === "left" ? "order-2 sm:order-2" : "order-2 sm:order-1"}>
              <p className="font-mono text-[11px] tracking-[0.1em] text-accent uppercase">{s.eyebrow}</p>
              <h2 className="font-display mt-2 text-[clamp(24px,3vw,36px)] font-semibold text-balance">
                {s.heading}
              </h2>
              <div className="mt-4 max-w-[46ch] text-[15px] text-muted">{s.body}</div>
            </div>
            <div
              data-reveal
              className={`flex justify-center ${s.imageSide === "left" ? "order-1 sm:order-1" : "order-1 sm:order-2"}`}
              style={{ "--reveal-delay": `${i * 60}ms` } as React.CSSProperties}
            >
              {s.visual}
            </div>
          </div>
        </section>
      ))}

      <section className="px-8 py-16">
        <div className="mx-auto max-w-[1240px]">
          {products.length > 0 ? (
            <div className="grid grid-cols-1 gap-px border border-border bg-border sm:grid-cols-3">
              {products.map((p) => (
                <Tilt key={p.slug}>
                  <Link
                    href={productHref(p)}
                    className="group relative flex h-full cursor-pointer flex-col bg-surface p-7 transition-colors hover:bg-surface-2"
                  >
                    {p.badge && (
                      <span
                        className={`absolute top-4 right-4 rounded-full border px-2.5 py-0.5 font-mono text-[10px] tracking-[0.06em] uppercase ${
                          p.badge === "Discontinued"
                            ? "border-border-strong bg-surface text-muted"
                            : "border-accent-warm/40 bg-accent-warm/10 text-accent-warm"
                        }`}
                      >
                        {p.badge}
                      </span>
                    )}
                    <ProductThumb image={p.image} name={p.name} alt={productAltText(p)} className="mb-5 h-40 w-full" />
                    <p className="font-mono text-[10px] tracking-[0.06em] text-muted-2 uppercase">{p.brand}</p>
                    <h2 className="mt-1 text-[15px] font-semibold">{p.name}</h2>
                    {p.spec && <p className="mt-1.5 font-mono text-[12px] text-muted">{p.spec}</p>}
                    <p className="mt-4 font-mono text-[16px] tabular-nums">
                      {p.price === null ? "Call for Pricing" : formatPrice(p.price)}
                    </p>
                  </Link>
                </Tilt>
              ))}
            </div>
          ) : (
            <div className="mx-auto max-w-[480px] rounded-[3px] border border-dashed border-border-strong px-8 py-16 text-center">
              <p className="text-[14px] text-muted">
                This line is being fitted for the catalog now. In the meantime, our concierge team
                can source a matching prescription order directly.
              </p>
              <Link
                href="/concierge"
                className="mt-5 inline-block cursor-pointer text-[13px] font-semibold text-accent underline underline-offset-2 hover:no-underline"
              >
                Talk to Concierge →
              </Link>
            </div>
          )}
        </div>
      </section>

      <SpecComparisonTable products={products} />
    </div>
  );
}
