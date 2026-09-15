import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CITIES, getCity, type City } from "@/lib/cities";
import { PRODUCTS, formatPrice, productAltText, productHref } from "@/lib/products";
import { ProductThumb } from "@/components/ProductThumb";
import { breadcrumbJsonLd, faqJsonLd, howToJsonLd } from "@/lib/schema";

export function generateStaticParams() {
  return CITIES.map((c) => ({ slug: c.slug }));
}

// Without this, a slug outside generateStaticParams renders on-demand and a
// notFound() call there can get served as a cached 200 shell instead of a
// real 404 — this forces an immediate, uncached 404 for any unknown slug.
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const city = getCity(slug);
  if (!city) return {};
  return {
    title: `Oxygen & CPAP Shipping to ${city.city}, ${city.state}`,
    description: `CIRRUS ships portable oxygen concentrators and CPAP/BiPAP systems to ${city.city}, ${city.state} in 48 hours — cash-pay, no insurance, no local office required.`,
    alternates: { canonical: `/areas-served/${city.slug}` },
  };
}

// Deterministic per-city product picks so the "featured" set is stable across builds
// without needing per-city curation data we don't have.
function featuredFor(city: City) {
  const seed = city.slug.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const categories = ["oxygen-portable", "oxygen-stationary", "cpap", "bipap-apap"] as const;
  return categories
    .map((cat) => {
      const pool = PRODUCTS.filter((p) => p.category === cat && p.price !== null);
      return pool[seed % pool.length] ?? pool[0];
    })
    .filter(Boolean);
}

const CATEGORY_BLOCKS = [
  {
    key: "oxygen",
    title: "Portable & Stationary Oxygen",
    href: "/oxygen",
    copy: (c: City) =>
      `FAA-approved portable concentrators and high-flow stationary units, verified for prescription and shipped directly to ${c.city} addresses.`,
  },
  {
    key: "sleep",
    title: "CPAP & BiPAP Therapy",
    href: "/sleep",
    copy: (c: City) =>
      `Auto-adjusting CPAP, BiPAP/APAP, and full mask fittings — the same authorized-channel units, shipped to ${c.city} with concierge setup support.`,
  },
  {
    key: "ventilators",
    title: "Home & Institutional Ventilators",
    href: "/ventilators",
    copy: () =>
      `Invasive and non-invasive ventilators from the leading manufacturers, for clinicians and home-care patients who need equipment outside a hospital network.`,
  },
  {
    key: "respiratory-accessories",
    title: "Respiratory Accessories",
    href: "/respiratory-accessories",
    copy: (c: City) =>
      `Nebulizers, pulse oximeters, batteries, and mask parts — the small items that keep a ${c.city} order running between deliveries.`,
  },
];

// Fuller modular sections — one per core category — matching the depth of a typical
// competitor location page, but built entirely from real CIRRUS categories/policies.
const CATEGORY_MODULES = [
  {
    key: "oxygen",
    eyebrow: "Supplemental Oxygen",
    title: (c: City) => `Oxygen Concentrators for ${c.city} Patients`,
    href: "/oxygen",
    linkLabel: "Shop Oxygen Concentrators",
    body: (c: City) =>
      `Patients in ${c.city} order oxygen from CIRRUS for the same reason patients everywhere do: authorized-channel inventory, real prescription verification, and a concierge line that doesn't disappear after checkout. Portable units ship for travel and daily mobility; stationary units ship for overnight and high-flow needs.`,
    points: [
      "FAA-approved portable concentrators, cleared for air travel",
      "High-flow stationary units for continuous overnight use",
      "Battery, cannula, and filter accessories shipped alongside the unit",
      "Prescription verified once — reorders don't repeat the process",
    ],
  },
  {
    key: "sleep",
    eyebrow: "Sleep Apnea Therapy",
    title: (c: City) => `CPAP & BiPAP Systems Shipped to ${c.city}`,
    href: "/sleep",
    linkLabel: "Shop CPAP & BiPAP",
    body: (c: City) =>
      `${c.city} orders for CPAP and BiPAP/APAP systems go through the same setup path as any other: mask fitting guidance from your concierge specialist, a verified prescription, and a device shipped ready to run — not a floor model.`,
    points: [
      "Auto-adjusting CPAP and BiPAP/APAP therapy devices",
      "Full mask fitting guidance — nasal, full-face, and pillow styles",
      "Filters, tubing, and cleaning accessories available on reorder",
      "Manufacturer warranty honored regardless of where you're shipping",
    ],
  },
  {
    key: "ventilators",
    eyebrow: "Ventilation",
    title: () => "Home & Institutional Ventilators",
    href: "/ventilators",
    linkLabel: "Shop Ventilators",
    body: () =>
      "For clinicians and home-care patients who need equipment outside a hospital procurement network, CIRRUS carries invasive and non-invasive ventilators from the industry's leading manufacturers — the same units used in ICUs and long-term care, available direct.",
    points: [
      "Invasive and non-invasive ventilator models",
      "Manufacturer-authorized inventory, not gray-market imports",
      "Clinical specification sheets available before you order",
      "Concierge support for institutional and home-care setup questions",
    ],
  },
  {
    key: "respiratory-accessories",
    eyebrow: "Accessories",
    title: (c: City) => `Respiratory Accessories, Restocked to ${c.city}`,
    href: "/respiratory-accessories",
    linkLabel: "Shop Accessories",
    body: (c: City) =>
      `The parts that run out between deliveries — nebulizer sets, pulse oximeters, batteries, mask cushions — ship to ${c.city} on the same 48-hour timeline as a full device order, so a worn part doesn't become a delay in therapy.`,
    points: [
      "Nebulizers and pulse oximeters",
      "Replacement batteries and carrying cases",
      "Mask cushions, filters, and tubing",
      "No minimum order for accessory-only reorders",
    ],
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Order online or by phone",
    body: "Choose your device and place the order — no local branch visit required, wherever you're shipping.",
  },
  {
    step: "02",
    title: "Prescription verified",
    body: "Your concierge specialist confirms the prescription required by law for your device class before it ships.",
  },
  {
    step: "03",
    title: "Shipped in 48 hours",
    body: "Once verification clears, your order ships by carrier in unmarked packaging — no local warehouse needed.",
  },
  {
    step: "04",
    title: "Concierge line stays open",
    body: "The same specialist who verified your order is who you call for setup questions, reorders, or service.",
  },
];

function faqFor(city: City): [string, string][] {
  return [
    [
      `Does CIRRUS have a physical location in ${city.city}?`,
      `No. CIRRUS ships nationwide from authorized-channel inventory rather than operating local branches. What reaches ${city.city} is the same equipment, prescription verification, and concierge support every order gets — delivered by carrier instead of a storefront.`,
    ],
    [
      `How fast does an order ship to ${city.city}?`,
      `Standard continental delivery is 48 hours from the time prescription verification clears, using the same carrier network that serves the rest of ${city.state}.`,
    ],
    [
      `Do I need a prescription to order oxygen or CPAP equipment?`,
      `Prescription-required device classes need a valid prescription by law, regardless of where you live. Your concierge specialist verifies it once per device before shipping.`,
    ],
    [
      `Is CIRRUS equipment covered by insurance for ${city.city} residents?`,
      `CIRRUS is a self-pay retailer — we don't bill insurance, Medicaid, or Medicare in any state. Pricing reflects that directly rather than routing through a claims process.`,
    ],
    [
      `Can I get an FAA-approved oxygen concentrator for travel from ${city.city}?`,
      `Yes — our portable concentrator lineup includes FAA-approved models cleared for air travel, in addition to home and daily-mobility use.`,
    ],
  ];
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const city = getCity(slug);
  if (!city) return notFound();

  const sameState = CITIES.filter((c) => c.state === city.state && c.slug !== city.slug)
    .sort((a, b) => b.population - a.population)
    .slice(0, 8);

  const featured = featuredFor(city);
  const faqs = faqFor(city);

  const crumbsLd = breadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Areas Served", url: "/areas-served" },
    { name: city.state, url: "/areas-served" },
    { name: city.city, url: `/areas-served/${city.slug}` },
  ]);
  const faqLd = faqJsonLd(faqs);
  const howToLd = howToJsonLd(
    `How Shipping to ${city.city} Works`,
    HOW_IT_WORKS.map((s) => ({ title: s.title, body: s.body }))
  );

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbsLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToLd) }} />

      <div className="border-b border-border px-8 py-4">
        <p className="mx-auto max-w-[1240px] font-mono text-[11px] text-muted-2">
          <Link href="/" className="cursor-pointer hover:text-text">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/areas-served" className="cursor-pointer hover:text-text">Areas Served</Link>
          <span className="mx-2">/</span>
          <span className="text-text">{city.city}, {city.state}</span>
        </p>
      </div>

      <section className="border-b border-border px-8 py-20">
        <div className="mx-auto max-w-[720px] text-center">
          <p className="font-mono text-[11px] tracking-[0.14em] text-accent uppercase">
            {city.state} &middot; Pop. {city.population.toLocaleString()}
          </p>
          <h1 className="font-display mt-4 text-[clamp(26px,4vw,40px)] font-semibold text-balance">
            Oxygen & Sleep Systems, Shipped to {city.city}
          </h1>
          <p className="mx-auto mt-5 max-w-[58ch] text-[15px] leading-relaxed text-muted">
            CIRRUS doesn&rsquo;t have a local office in {city.city} — nobody does this well by
            having a storefront on every block. What reaches {city.city} in 48 hours is the same
            authorized-channel inventory, the same prescription verification, and the same
            concierge line every other order gets, shipped by carrier rather than a local branch.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/oxygen"
              className="cursor-pointer rounded-[3px] bg-accent px-6 py-3 text-[13px] font-semibold text-accent-ink transition-transform hover:-translate-y-px"
            >
              Shop Oxygen
            </Link>
            <Link
              href="/concierge"
              className="cursor-pointer rounded-[3px] border border-border-strong px-6 py-3 text-[13px] font-semibold transition-colors hover:bg-surface-2"
            >
              Talk to Concierge
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 border-b border-border sm:grid-cols-2 lg:grid-cols-4">
        {CATEGORY_BLOCKS.map((block, i) => (
          <Link
            key={block.key}
            href={block.href}
            className={`group cursor-pointer border-b border-border p-8 transition-colors hover:bg-surface-2 lg:border-b-0 ${
              i % 2 === 0 ? "sm:border-r" : ""
            } ${i < CATEGORY_BLOCKS.length - 1 ? "lg:border-r" : ""}`}
          >
            <h2 className="text-[14px] font-semibold">{block.title}</h2>
            <p className="mt-2 text-[12.5px] leading-relaxed text-muted">{block.copy(city)}</p>
            <span className="mt-4 flex items-center gap-1.5 text-[11px] font-semibold text-accent">Browse →</span>
          </Link>
        ))}
      </section>

      {CATEGORY_MODULES.map((mod, i) => (
        <section
          key={mod.key}
          className={`border-b border-border px-8 py-16 ${i % 2 === 1 ? "bg-surface-2" : ""}`}
        >
          <div className="mx-auto grid max-w-[1100px] grid-cols-1 items-start gap-10 md:grid-cols-[1.1fr_1fr]">
            <div>
              <p className="font-mono text-[11px] tracking-[0.1em] text-accent uppercase">{mod.eyebrow}</p>
              <h2 className="font-display mt-2 text-[22px] font-semibold text-balance">{mod.title(city)}</h2>
              <p className="mt-4 max-w-[52ch] text-[14px] leading-relaxed text-muted">{mod.body(city)}</p>
              <Link
                href={mod.href}
                className="mt-5 inline-flex cursor-pointer items-center gap-1.5 text-[13px] font-semibold text-accent underline underline-offset-2 hover:no-underline"
              >
                {mod.linkLabel} →
              </Link>
            </div>
            <ul className="grid grid-cols-1 gap-3 border-t border-border pt-6 md:border-t-0 md:border-l md:border-border md:pt-0 md:pl-8">
              {mod.points.map((point) => (
                <li key={point} className="flex items-start gap-2.5 text-[13px] text-muted">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="mt-0.5 shrink-0 text-accent">
                    <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ))}

      {featured.length > 0 && (
        <section className="border-b border-border px-8 py-16">
          <div className="mx-auto max-w-[1240px]">
            <h2 className="font-display mb-8 text-[13px] font-semibold tracking-[0.08em] text-muted uppercase">
              Frequently shipped to {city.city}
            </h2>
            <div className="grid grid-cols-1 gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((p) => (
                <Link
                  key={p.slug}
                  href={productHref(p)}
                  className="group flex cursor-pointer flex-col bg-surface p-6 transition-colors hover:bg-surface-2"
                >
                  <ProductThumb
                    image={p.image}
                    name={p.name}
                    alt={productAltText(p)}
                    className="mb-4 h-32 w-full"
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  />
                  <p className="font-mono text-[10px] tracking-[0.06em] text-muted-2 uppercase">{p.brand}</p>
                  <h3 className="mt-1 text-[13.5px] font-semibold">{p.name}</h3>
                  <p className="mt-3 font-mono text-[14px] tabular-nums">
                    {p.price === null ? "Call for Pricing" : formatPrice(p.price)}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="grid grid-cols-1 border-b border-border sm:grid-cols-3">
        {[
          ["48-Hour Shipping", `Standard continental delivery to ${city.state}, once prescription verification clears.`],
          ["No Local Office Needed", `We ship directly to ${city.city} addresses — no branch visit, no waiting room.`],
          ["Same Concierge Line", "One specialist handles your order end to end, wherever it ships."],
        ].map(([k, v]) => (
          <div key={k} className="border-b border-border p-8 last:border-b-0 sm:border-r sm:border-b-0 last:sm:border-r-0">
            <p className="font-mono text-[11px] tracking-[0.08em] text-accent uppercase">{k}</p>
            <p className="mt-2 text-[13px] text-muted">{v}</p>
          </div>
        ))}
      </section>

      <section className="border-b border-border bg-surface-2 px-8 py-14 text-center">
        <p className="mx-auto max-w-[56ch] text-[14px] leading-relaxed text-muted">
          <strong className="text-text">A note on how this works:</strong> we don&rsquo;t bill
          insurance, Medicaid, or Medicare — every {city.city} order is self-pay, with the same
          prescription verification required by law regardless of payment method. See{" "}
          <Link href="/prescription" className="cursor-pointer text-accent underline underline-offset-2 hover:no-underline">
            how verification works
          </Link>{" "}
          or{" "}
          <Link href="/concierge" className="cursor-pointer text-accent underline underline-offset-2 hover:no-underline">
            talk to concierge
          </Link>{" "}
          before you order.
        </p>
      </section>

      <section className="border-b border-border px-8 py-16">
        <div className="mx-auto max-w-[1100px]">
          <h2 className="font-display mb-10 text-center text-[13px] font-semibold tracking-[0.08em] text-muted uppercase">
            How Shipping to {city.city} Works
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {HOW_IT_WORKS.map((s) => (
              <div key={s.step}>
                <p className="font-mono text-[24px] font-semibold text-accent tabular-nums">{s.step}</p>
                <h3 className="mt-2 text-[14px] font-semibold">{s.title}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-surface-2 px-8 py-16">
        <div className="mx-auto max-w-[760px]">
          <h2 className="font-display mb-8 text-center text-[13px] font-semibold tracking-[0.08em] text-muted uppercase">
            {city.city} Questions, Answered
          </h2>
          <div className="divide-y divide-border border-t border-b border-border">
            {faqs.map(([q, a]) => (
              <div key={q} className="py-6">
                <h3 className="text-[14.5px] font-semibold">{q}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-muted">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {sameState.length > 0 && (
        <section className="px-8 py-14">
          <div className="mx-auto max-w-[1000px] text-center">
            <h2 className="font-display mb-6 text-[12px] font-semibold tracking-[0.08em] text-muted uppercase">
              Other {city.state} cities we ship to
            </h2>
            <div className="flex flex-wrap justify-center gap-x-5 gap-y-2.5">
              {sameState.map((c) => (
                <Link
                  key={c.slug}
                  href={`/areas-served/${c.slug}`}
                  className="cursor-pointer text-[13px] text-muted hover:text-accent underline underline-offset-2 hover:no-underline"
                >
                  {c.city}
                </Link>
              ))}
            </div>
            <p className="mt-8 text-[12px] text-muted-2">
              <Link href="/areas-served" className="cursor-pointer hover:text-text">
                ← See all areas served
              </Link>
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
