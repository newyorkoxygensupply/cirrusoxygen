"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PRODUCTS, compatibleAccessories, formatPrice, productAltText, productHref, productSection, type Product } from "@/lib/products";
import { productGraphJsonLd } from "@/lib/schema";
import { useCart } from "@/lib/cart-context";
import { ProductThumb } from "@/components/ProductThumb";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Tilt } from "@/components/Tilt";

function faqForProduct(p: Product): [string, string][] {
  const faqs: [string, string][] = [];

  faqs.push(
    p.rxRequired
      ? [
          `Is a prescription required for the ${p.name}?`,
          `Yes. This device class requires a valid prescription by law. Your concierge specialist verifies it once before your order ships.`,
        ]
      : [
          `Is a prescription required for the ${p.name}?`,
          `No — this item doesn't require a prescription to order.`,
        ]
  );

  if (p.category.startsWith("oxygen")) {
    faqs.push(
      p.faaApproved
        ? [
            `Is the ${p.name} approved for air travel?`,
            `Yes, the ${p.name} is FAA-approved for in-flight use — bring your approval documentation from your concierge specialist when you fly.`,
          ]
        : [
            `Can I bring the ${p.name} on a flight?`,
            `No — this is a stationary, continuous-flow unit built for home use, not FAA-approved for air travel. See our portable lineup for travel-approved options.`,
          ]
    );
  }

  if (p.badge === "Refurbished") {
    faqs.push([
      `What condition is the ${p.name} in?`,
      `This unit is ${p.badge.toLowerCase()} — inspected and functionally verified before resale, sold at a discount to new. Ask your concierge specialist for the exact warranty terms on this unit before ordering.`,
    ]);
  } else if (p.badge === "Discontinued") {
    faqs.push([
      `Is the ${p.name} still in production?`,
      `No — this model is manufacturer-discontinued. What's listed is final inventory, not authorized-new stock, and manufacturer warranty support may be shorter or unavailable. Ask your concierge specialist for this unit's exact terms.`,
    ]);
  }

  faqs.push([
    `Is the ${p.name} covered by insurance?`,
    `CIRRUS is a self-pay retailer — we don't bill insurance, Medicaid, or Medicare. Pricing reflects that directly.`,
  ]);

  faqs.push([
    `Can I pay for the ${p.name} with HSA or FSA funds?`,
    `Yes — this is an HSA/FSA-eligible medical expense. Pay with your HSA/FSA card directly, or ask your concierge specialist for an itemized receipt to submit for reimbursement.`,
  ]);

  faqs.push([
    `How fast will the ${p.name} ship?`,
    `Standard continental delivery is 48 hours from the time prescription verification clears.`,
  ]);

  return faqs;
}

export function ProductDetail({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const related = PRODUCTS.filter((p) => p.category === product.category && p.slug !== product.slug).slice(0, 3);
  const callForPricing = product.price === null;

  const section = productSection(product);
  const crumbs = [
    { name: "Home", url: "/" },
    { name: section.name, url: section.url },
    { name: product.name, url: productHref(product) },
  ];
  const faqs = faqForProduct(product);
  const graphLd = productGraphJsonLd(product, faqs, crumbs);
  const accessories = compatibleAccessories(product);

  function handleAdd() {
    if (callForPricing || product.price === null) return;
    addItem({ slug: product.slug, name: product.name, price: product.price }, 1);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2200);
  }

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graphLd) }} />

      <Breadcrumbs crumbs={crumbs} />

      <section className="grid grid-cols-1 border-b border-border md:grid-cols-2">
        <div className="relative flex min-h-[420px] items-center justify-center border-b border-border bg-surface md:border-r md:border-b-0">
          {product.slug === "inogen-rove-6" ? (
            <video
              src="/videos/inogen-rove-6.mp4"
              poster={product.image ?? undefined}
              autoPlay
              muted
              loop
              playsInline
              className="h-full w-full object-cover"
            />
          ) : product.image ? (
            <Image
              src={product.image}
              alt={productAltText(product)}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-contain p-10"
              priority
            />
          ) : (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                background:
                  "radial-gradient(circle at 35% 30%, color-mix(in srgb, var(--accent) 22%, var(--surface-2)) 0%, var(--surface-2) 60%)",
              }}
            >
              <div className="absolute h-[220px] w-[220px] rounded-full border border-accent/50" />
              <div className="absolute h-[150px] w-[150px] rounded-full border border-accent/50" />
              <div className="absolute h-[90px] w-[90px] rounded-full bg-accent/30" />
              <p className="absolute bottom-5 left-5 font-mono text-[10px] tracking-[0.06em] text-muted">
                PRODUCT PHOTOGRAPHY PENDING &mdash; {product.brand}
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col justify-center p-10 md:p-14">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-mono text-[11px] tracking-[0.1em] text-accent uppercase">{product.brand}</p>
            {product.badge && (
              <span
                className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] tracking-[0.06em] uppercase ${
                  product.badge === "Discontinued"
                    ? "border-border-strong text-muted"
                    : "border-accent-warm/40 bg-accent-warm/10 text-accent-warm"
                }`}
              >
                {product.badge}
              </span>
            )}
          </div>
          <h1 className="font-display mt-3 text-[clamp(26px,3.4vw,40px)] font-semibold text-balance">
            {product.name}
          </h1>
          {product.spec && <p className="mt-3 max-w-[42ch] text-[15px] leading-relaxed text-muted">{product.spec}</p>}

          <div className="mt-6 flex items-baseline gap-3 font-mono text-[26px] tabular-nums">
            <span className={product.compareAt ? "text-accent-warm" : ""}>
              {callForPricing ? "Call for Pricing" : formatPrice(product.price!)}
            </span>
            {product.compareAt && (
              <span className="text-[15px] text-muted-2 line-through">{formatPrice(product.compareAt)}</span>
            )}
          </div>

          {!callForPricing && (
            <p className="mt-2 text-[12px] text-muted-2">
              Monthly payment options available through{' '}
              <a
                href="https://www.affirm.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-accent underline underline-offset-2"
              >
                Affirm
              </a>{' '}
              — select Affirm at checkout.
            </p>
          )}

          {callForPricing ? (
            <Link
              href="/concierge"
              className="mt-7 inline-flex w-fit cursor-pointer items-center gap-2 rounded-[3px] bg-accent px-7 py-3.5 text-[13px] font-semibold text-accent-ink transition-transform hover:-translate-y-px"
            >
              Talk to Concierge
            </Link>
          ) : (
            <button
              type="button"
              onClick={handleAdd}
              className="mt-7 inline-flex w-fit cursor-pointer items-center gap-2 rounded-[3px] bg-accent px-7 py-3.5 text-[13px] font-semibold text-accent-ink transition-transform hover:-translate-y-px"
            >
              {added ? "Added to cart" : "Add to Cart"}
              {added && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          )}

          {(product.category === "oxygen-rental" || product.category === "cpap-rental") && (
            <Link
              href={`/rentals?device=${product.slug.replace(/-(weekly|monthly)-rental$/, "")}#book`}
              className="mt-4 inline-flex w-fit cursor-pointer items-center gap-1.5 text-[12px] font-semibold text-accent underline underline-offset-2 hover:no-underline"
            >
              Get an instant quote for your dates
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          )}

          {product.rxRequired ? (
            <div className="mt-5 flex items-start gap-2 text-[12px] text-muted">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="mt-0.5 shrink-0 text-accent">
                <path d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>
                Prescription required by law for this device class. Verify at checkout &mdash;{" "}
                <Link href="/prescription" className="cursor-pointer text-accent underline underline-offset-2 hover:no-underline">
                  see how it works
                </Link>
                .
              </span>
            </div>
          ) : (
            <p className="mt-5 text-[12px] text-muted">No prescription required for this item.</p>
          )}
          {product.faaApproved && (
            <p className="mt-2 text-[12px] text-muted">FAA travel-approved.</p>
          )}

          {product.badge === "Discontinued" && (
            <div className="mt-5 flex items-start gap-2 rounded-[3px] border border-border-strong p-3.5 text-[12px] text-muted">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="mt-0.5 shrink-0 text-muted-2">
                <path d="M12 9v4m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>
                <strong className="text-text">Manufacturer-discontinued.</strong> This model is no
                longer produced — what you see is final inventory, not authorized-new stock.
                Manufacturer warranty support may be shorter or unavailable; ask your concierge
                specialist for this unit&rsquo;s exact warranty terms before ordering.
              </span>
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 border-t border-border pt-6 font-mono text-[11px] text-muted-2 uppercase">
            <span>48-hr shipping</span>
            <span>3-yr concierge line</span>
            <span>Unmarked packaging</span>
            <span>HSA/FSA eligible</span>
          </div>
          <p className="mt-3 text-[12px] text-muted-2">
            Financing may be available — ask your concierge specialist.
          </p>
        </div>
      </section>

      {product.specs && product.specs.length > 0 ? (
        <section className="border-b border-border px-8 py-16">
          <div className="mx-auto max-w-[640px]">
            <h2 className="font-display mb-6 text-[13px] font-semibold tracking-[0.08em] text-muted uppercase">
              Specifications
            </h2>
            <dl className="border-t border-border">
              {product.specs.map(([label, value]) => (
                <div key={label} className="flex justify-between gap-6 border-b border-border py-3 text-[13px]">
                  <dt className="text-muted">{label}</dt>
                  <dd className="text-right font-mono font-medium tabular-nums">{value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 text-[12px] text-muted-2">
              Confirm exact configuration with your concierge specialist during prescription
              verification —{" "}
              <Link href="/concierge" className="cursor-pointer text-accent underline underline-offset-2 hover:no-underline">
                ask a question about this device
              </Link>
              .
            </p>
          </div>
        </section>
      ) : (
        <section className="border-b border-border px-8 py-16 text-center">
          <p className="mx-auto max-w-[60ch] text-[14px] leading-relaxed text-muted">
            Full manufacturer specifications for the {product.name} are confirmed by your concierge
            specialist during prescription verification, so what you see reflects your exact unit
            configuration &mdash; not a generic sheet.
          </p>
          <Link href="/concierge" className="mt-4 inline-block cursor-pointer text-[13px] font-semibold text-accent underline underline-offset-2 hover:no-underline">
            Ask Concierge a question about this device →
          </Link>
        </section>
      )}

      <section className="border-b border-border bg-surface-2 px-8 py-16">
        <div className="mx-auto max-w-[720px]">
          <h2 className="font-display mb-8 text-center text-[13px] font-semibold tracking-[0.08em] text-muted uppercase">
            Common Questions
          </h2>
          <div className="divide-y divide-border border-t border-b border-border">
            {faqs.map(([q, a]) => (
              <div key={q} className="py-5">
                <h3 className="text-[14px] font-semibold">{q}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-muted">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {accessories.length > 0 && (
        <section className="border-b border-border px-8 py-16">
          <div className="mx-auto max-w-[1240px]">
            <h2 className="font-display mb-8 text-[13px] font-semibold tracking-[0.08em] text-muted uppercase">
              Frequently Bought With
            </h2>
            <div className="grid grid-cols-1 gap-px border border-border bg-border sm:grid-cols-3">
              {accessories.map((p) => (
                <Tilt key={p.slug}>
                  <Link
                    href={productHref(p)}
                    className="group flex h-full cursor-pointer flex-col bg-surface p-7 transition-colors hover:bg-surface-2"
                  >
                    <ProductThumb image={p.image} name={p.name} alt={productAltText(p)} className="mb-5 h-40 w-full" />
                    <h3 className="text-[15px] font-semibold">{p.name}</h3>
                    {p.spec && <p className="mt-1.5 font-mono text-[12px] text-muted">{p.spec}</p>}
                    <p className="mt-4 font-mono text-[16px] tabular-nums">
                      {p.price === null ? "Call for Pricing" : formatPrice(p.price)}
                    </p>
                  </Link>
                </Tilt>
              ))}
            </div>
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="px-8 py-16">
          <div className="mx-auto max-w-[1240px]">
            <h2 className="font-display mb-8 text-[13px] font-semibold tracking-[0.08em] text-muted uppercase">
              Also in this line
            </h2>
            <div className="grid grid-cols-1 gap-px border border-border bg-border sm:grid-cols-3">
              {related.map((p) => (
                <Tilt key={p.slug}>
                  <Link
                    href={productHref(p)}
                    className="group flex h-full cursor-pointer flex-col bg-surface p-7 transition-colors hover:bg-surface-2"
                  >
                    <ProductThumb image={p.image} name={p.name} alt={productAltText(p)} className="mb-5 h-40 w-full" />
                    <h3 className="text-[15px] font-semibold">{p.name}</h3>
                    {p.spec && <p className="mt-1.5 font-mono text-[12px] text-muted">{p.spec}</p>}
                    <p className="mt-4 font-mono text-[16px] tabular-nums">
                      {p.price === null ? "Call for Pricing" : formatPrice(p.price)}
                    </p>
                  </Link>
                </Tilt>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
