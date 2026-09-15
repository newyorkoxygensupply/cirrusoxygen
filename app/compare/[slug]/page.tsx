import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { COMPARISONS, getComparison, guideForComparison, resolveComparison } from "@/lib/comparisons";
import { formatPrice, productHref, weightPerBatteryHour } from "@/lib/products";
import { breadcrumbJsonLd } from "@/lib/schema";
import { AutoLinkedBody } from "@/components/AutoLinkedBody";

export function generateStaticParams() {
  return COMPARISONS.map((c) => ({ slug: c.slug }));
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
  const c = getComparison(slug);
  if (!c) return {};
  const { a, b } = resolveComparison(c);
  if (!a || !b) return {};
  return {
    title: `${a.name} vs. ${b.name}`,
    description: `A real, honest comparison of the ${a.name} and ${b.name} — price, specs, and which one fits which prescription.`,
    alternates: { canonical: `/compare/${c.slug}` },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = getComparison(slug);
  if (!c) return notFound();
  const { a, b } = resolveComparison(c);
  if (!a || !b) return notFound();

  const crumbsLd = breadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Compare", url: "/compare" },
    { name: `${a.name} vs. ${b.name}`, url: `/compare/${c.slug}` },
  ]);
  const guide = guideForComparison(c);

  // Computed only from each unit's own disclosed Weight + Battery Life specs —
  // omitted entirely if either side doesn't parse cleanly, never estimated.
  const ratioA = weightPerBatteryHour(a);
  const ratioB = weightPerBatteryHour(b);

  const rows: [string, string, string][] = [
    ["Brand", a.brand, b.brand],
    ["Price", a.price !== null ? formatPrice(a.price) : "Call for Pricing", b.price !== null ? formatPrice(b.price) : "Call for Pricing"],
    ["Spec", a.spec ?? "—", b.spec ?? "—"],
    ["FAA Approved", a.faaApproved ? "Yes" : "—", b.faaApproved ? "Yes" : "—"],
    ["Condition", a.badge ?? "New", b.badge ?? "New"],
    ...(ratioA && ratioB
      ? ([["Weight per Hour of Runtime", `${ratioA.lbsPerHour} lbs/hr`, `${ratioB.lbsPerHour} lbs/hr`]] as [string, string, string][])
      : []),
  ];

  return (
    <div className="px-8 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbsLd) }} />
      <div className="mx-auto max-w-[780px]">
        <Link href="/compare" className="cursor-pointer text-[12px] font-semibold text-accent underline underline-offset-2 hover:no-underline">
          ← Compare
        </Link>
        <h1 className="font-display mt-5 text-[clamp(24px,3.4vw,34px)] font-semibold text-balance">
          {a.name} vs. {b.name}
        </h1>
        {guide && (
          <Link
            href={guide.href}
            className="mt-5 flex cursor-pointer items-center justify-between gap-3 rounded-[3px] border border-border-strong bg-surface-2 px-4 py-3 transition-colors hover:border-accent"
          >
            <span className="text-[12px] text-muted">
              Part of the series: <span className="font-semibold text-text">{guide.title}</span>
            </span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true" className="shrink-0 text-accent">
              <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        )}

        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-[13px]">
            <thead>
              <tr>
                <th scope="col" className="border-b border-border p-3 text-left text-muted-2"></th>
                <th scope="col" className="border-b border-border p-3 text-left font-semibold">
                  <Link href={productHref(a)} className="cursor-pointer hover:text-accent">{a.name}</Link>
                </th>
                <th scope="col" className="border-b border-border p-3 text-left font-semibold">
                  <Link href={productHref(b)} className="cursor-pointer hover:text-accent">{b.name}</Link>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map(([label, va, vb]) => (
                <tr key={label}>
                  <th scope="row" className="border-b border-border p-3 text-left font-mono text-[11px] font-normal text-muted-2 uppercase">{label}</th>
                  <td className="border-b border-border p-3 tabular-nums">{va}</td>
                  <td className="border-b border-border p-3 tabular-nums">{vb}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-10 border-t border-border pt-8">
          <h2 className="font-display mb-4 text-[13px] font-semibold tracking-[0.08em] text-muted uppercase">
            The verdict
          </h2>
          <div className="flex flex-col gap-4 text-[15px] leading-[1.75] text-muted">
            <AutoLinkedBody paragraphs={c.verdict} />
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-4 border-t border-border pt-8">
          <Link
            href={productHref(a)}
            className="cursor-pointer rounded-[3px] bg-accent px-6 py-3 text-[13px] font-semibold text-accent-ink"
          >
            View {a.name}
          </Link>
          <Link
            href={productHref(b)}
            className="cursor-pointer rounded-[3px] border border-border-strong px-6 py-3 text-[13px] font-semibold"
          >
            View {b.name}
          </Link>
        </div>
      </div>
    </div>
  );
}
