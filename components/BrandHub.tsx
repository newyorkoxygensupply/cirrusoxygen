import Link from "next/link";
import { PRODUCTS, CATEGORY_META, formatPrice, productAltText, productHref, type Category } from "@/lib/products";
import { ProductThumb } from "@/components/ProductThumb";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { faqJsonLd, itemListJsonLd } from "@/lib/schema";

export type BrandFaq = [string, string];

const ALL_BRANDS: { slug: string; name: string }[] = [
  { slug: "inogen", name: "Inogen" },
  { slug: "resmed", name: "ResMed" },
  { slug: "philips-respironics", name: "Philips Respironics" },
  { slug: "caire", name: "Caire" },
  { slug: "oxygo", name: "OxyGo" },
  { slug: "drive-devilbiss", name: "Drive DeVilbiss" },
  { slug: "fisher-paykel", name: "Fisher & Paykel" },
  { slug: "invacare", name: "Invacare" },
  { slug: "hamilton-medical", name: "Hamilton Medical" },
  { slug: "drager", name: "Dräger" },
];

function groupByCategory(brand: string, order: Category[]) {
  const brandProducts = PRODUCTS.filter((p) => p.brand === brand);
  return order
    .map((cat) => ({
      category: cat,
      label: CATEGORY_META[cat].label,
      base: CATEGORY_META[cat].base,
      products: brandProducts.filter((p) => p.category === cat),
    }))
    .filter((g) => g.products.length > 0);
}

/** Shared renderer for every /brands/[slug] page: real on-brand product
 * grid grouped by category, ItemList + FAQPage structured data, and a
 * brand-specific FAQ block. Each brand page supplies its own intro copy and
 * genuinely brand-specific FAQs — never templated filler text. */
export function BrandHub({
  brand,
  slug,
  heading,
  intro,
  categoryOrder,
  faqs,
}: {
  brand: string;
  slug: string;
  heading: string;
  intro: string;
  categoryOrder: Category[];
  faqs: BrandFaq[];
}) {
  const groups = groupByCategory(brand, categoryOrder);
  const allProducts = groups.flatMap((g) => g.products);
  const itemListLd = itemListJsonLd(
    allProducts.map((p) => ({ name: p.name, url: productHref(p), image: p.image }))
  );
  const faqLd = faqJsonLd(faqs);
  const crumbs = [{ name: "Home", url: "/" }, { name: brand, url: `/brands/${slug}` }];

  return (
    <div>
      <Breadcrumbs crumbs={crumbs} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <section className="border-b border-border px-8 py-20">
        <div className="mx-auto max-w-[760px] text-center">
          <p className="font-mono text-[11px] tracking-[0.14em] text-accent uppercase">Brand</p>
          <h1 className="font-display mt-4 text-[clamp(30px,4.5vw,48px)] font-semibold text-balance">
            {heading}
          </h1>
          <p className="mx-auto mt-5 max-w-[60ch] text-[15px] leading-relaxed text-muted">{intro}</p>
        </div>
      </section>

      {groups.map((group) => (
        <section key={group.category} className="border-b border-border px-8 py-14">
          <div className="mx-auto max-w-[1240px]">
            <div className="flex items-baseline justify-between">
              <h2 className="font-display text-[22px] font-semibold">
                {brand} {group.label}
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
                  className="group relative block rounded-[2px] border border-border p-4 transition-colors hover:border-accent"
                >
                  {p.badge && (
                    <span
                      className={`absolute top-3 right-3 z-10 rounded-full border px-2.5 py-0.5 font-mono text-[10px] tracking-[0.06em] uppercase ${
                        p.badge === "Discontinued"
                          ? "border-border-strong bg-surface text-muted"
                          : "border-accent-warm/40 bg-accent-warm/10 text-accent-warm"
                      }`}
                    >
                      {p.badge}
                    </span>
                  )}
                  <ProductThumb image={p.image} name={p.name} alt={productAltText(p)} className="h-36 w-full" />
                  <p className="font-mono mt-4 text-[10px] tracking-[0.06em] text-muted-2 uppercase">{brand}</p>
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
          <h2 className="font-display text-[22px] font-semibold">{brand} FAQs</h2>
          <dl className="mt-8 space-y-6">
            {faqs.map(([q, a]) => (
              <div key={q}>
                <dt className="text-[14px] font-semibold">{q}</dt>
                <dd className="mt-2 text-[13px] leading-relaxed text-muted">{a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="border-b border-border px-8 py-10">
        <div className="mx-auto max-w-[1240px]">
          <p className="font-mono text-[11px] tracking-[0.06em] text-muted-2 uppercase">Other brands</p>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
            {ALL_BRANDS.filter((b) => b.slug !== slug).map((b) => (
              <Link
                key={b.slug}
                href={`/brands/${b.slug}`}
                className="text-[13px] text-accent underline underline-offset-2 hover:no-underline"
              >
                {b.name}
              </Link>
            ))}
          </div>
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
