import type { Metadata } from "next";
import Link from "next/link";
import { PRODUCTS, CATEGORY_META, formatPrice, productAltText, productHref } from "@/lib/products";
import { ProductThumb } from "@/components/ProductThumb";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { faqJsonLd, itemListJsonLd } from "@/lib/schema";

const BRAND = "Inogen";

export const metadata: Metadata = {
  alternates: { canonical: "/brands/inogen" },
  title: "Inogen Oxygen Concentrators — Portable & Stationary",
  description:
    "Every current Inogen model, cash-pay: Rove 6, Rove 4, One G5, At Home GS-100, Voxi 5, refurbished units, batteries, and rentals. Ships nationwide in 48 hours.",
};

const CROWDS = [{ name: "Home", url: "/" }, { name: "Inogen", url: "/brands/inogen" }];

function groupByCategory() {
  const brandProducts = PRODUCTS.filter((p) => p.brand === BRAND);
  const order = [
    "oxygen-portable",
    "oxygen-stationary",
    "oxygen-accessory",
    "oxygen-rental",
  ] as const;
  return order
    .map((cat) => ({
      category: cat,
      label: CATEGORY_META[cat].label,
      base: CATEGORY_META[cat].base,
      products: brandProducts.filter((p) => p.category === cat),
    }))
    .filter((g) => g.products.length > 0);
}

const FAQS: [string, string][] = [
  [
    "Are Inogen concentrators FAA-approved for air travel?",
    "Every current Inogen portable model — the Rove 6, Rove 4, and One G5 — is on the FAA's approved portable oxygen concentrator list for in-flight use. Airlines still require advance notice and a physician's letter; check your carrier's specific policy before flying.",
  ],
  [
    "What's the difference between the Inogen Rove 6 and Rove 4?",
    "The Rove 6 is the larger, higher-output unit (up to 6 pulse-dose settings, 6-13 hour battery life) built for users who need more oxygen per breath. The Rove 4 is lighter and more compact (as low as 2.9 lbs) with up to 4 pulse-dose settings — it trades some output for size and weight.",
  ],
  [
    "Does CIRRUS sell refurbished Inogen units?",
    "Yes — refurbished Inogen One G5 and Rove 4 units are available at a discount off the new price, tested to the same functional standard before shipping. Each listing discloses that it's refurbished.",
  ],
  [
    "Is a prescription required for an Inogen concentrator?",
    "Yes. Oxygen concentrators are prescription medical devices regardless of brand. CIRRUS verifies a valid prescription before any oxygen concentrator order ships — see the prescription verification page for the exact process.",
  ],
  [
    "Does CIRRUS ship Inogen concentrators nationwide?",
    "Yes — orders ship across the continental United States, typically within 48 hours of prescription verification. CIRRUS is a cash-pay retailer only: no insurance, Medicaid, or Medicare billing.",
  ],
];

export default function Page() {
  const groups = groupByCategory();
  const allInogen = groups.flatMap((g) => g.products);
  const itemListLd = itemListJsonLd(
    allInogen.map((p) => ({ name: p.name, url: productHref(p), image: p.image }))
  );
  const faqLd = faqJsonLd(FAQS);

  return (
    <div>
      <Breadcrumbs crumbs={CROWDS} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <section className="border-b border-border px-8 py-20">
        <div className="mx-auto max-w-[760px] text-center">
          <p className="font-mono text-[11px] tracking-[0.14em] text-accent uppercase">Brand</p>
          <h1 className="font-display mt-4 text-[clamp(30px,4.5vw,48px)] font-semibold text-balance">
            Inogen Oxygen Concentrators
          </h1>
          <p className="mx-auto mt-5 max-w-[60ch] text-[15px] leading-relaxed text-muted">
            Inogen builds some of the lightest FAA-approved portable concentrators on the market,
            alongside the At Home GS-100 and Voxi 5 stationary units. CIRRUS carries the full
            current lineup — new and refurbished — cash-pay, shipped nationwide in 48 hours.
          </p>
        </div>
      </section>

      {groups.map((group) => (
        <section key={group.category} className="border-b border-border px-8 py-14">
          <div className="mx-auto max-w-[1240px]">
            <div className="flex items-baseline justify-between">
              <h2 className="font-display text-[22px] font-semibold">
                Inogen {group.label}
              </h2>
              <Link href={group.base} className="font-mono text-[11px] tracking-[0.06em] text-accent uppercase hover:underline">
                See all {group.label.toLowerCase()} →
              </Link>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {group.products.map((p) => (
                <Link
                  key={p.slug}
                  href={productHref(p)}
                  className="group block rounded-[2px] border border-border p-4 transition-colors hover:border-accent"
                >
                  <ProductThumb image={p.image} name={p.name} alt={productAltText(p)} className="h-36 w-full" />
                  <p className="font-mono mt-4 text-[10px] tracking-[0.06em] text-muted-2 uppercase">
                    {p.badge ?? "Inogen"}
                  </p>
                  <h3 className="mt-1 text-[14px] font-semibold">{p.name}</h3>
                  {p.spec && <p className="mt-1 text-[12px] text-muted">{p.spec}</p>}
                  <p className="mt-2 text-[13px] font-medium tabular-nums">
                    {p.price !== null ? formatPrice(p.price) : "Call for pricing"}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ))}

      <section className="border-b border-border px-8 py-16">
        <div className="mx-auto max-w-[720px]">
          <h2 className="font-display text-[22px] font-semibold">Inogen FAQs</h2>
          <dl className="mt-8 space-y-6">
            {FAQS.map(([q, a]) => (
              <div key={q}>
                <dt className="text-[14px] font-semibold">{q}</dt>
                <dd className="mt-2 text-[13px] leading-relaxed text-muted">{a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="px-8 py-16">
        <div className="mx-auto max-w-[720px] text-center">
          <p className="text-[14px] text-muted">
            Shipping to your area? See{" "}
            <Link href="/areas-served" className="text-accent underline underline-offset-2 hover:no-underline">
              nationwide shipping coverage
            </Link>{" "}
            or start with{" "}
            <Link href="/prescription" className="text-accent underline underline-offset-2 hover:no-underline">
              prescription verification
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
