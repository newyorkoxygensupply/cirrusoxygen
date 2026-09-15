import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GLOSSARY, getGlossaryTerm } from "@/lib/glossary";
import { breadcrumbJsonLd, SITE_URL } from "@/lib/schema";

export function generateStaticParams() {
  return GLOSSARY.map((g) => ({ slug: g.slug }));
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
  const g = getGlossaryTerm(slug);
  if (!g) return {};
  return {
    title: `${g.term} — Definition`,
    description: g.definition[0],
    alternates: { canonical: `/glossary/${g.slug}` },
  };
}

// Real medical conditions among the glossary terms — everything else here is
// a measurement, device, or process, not a diagnosable condition itself.
const CONDITION_SLUGS = new Set([
  "central-sleep-apnea",
  "obstructive-sleep-apnea",
  "hypoxemia",
]);

// Entity linking: glossary terms that map to a real, unambiguous Wikipedia
// article. Emitting `sameAs` on a DefinedTerm connects our definition to the
// canonical entity in Google's Knowledge Graph — the single most effective
// disambiguation signal for a jargon term. Every URL here was verified live;
// terms without a clean 1:1 entity (e.g. brand-specific or measurement slang)
// are deliberately omitted rather than pointed at an approximate match.
const TERM_SAME_AS: Record<string, string> = {
  "cpap-continuous-positive-airway-pressure": "https://en.wikipedia.org/wiki/Continuous_positive_airway_pressure",
  "bipap-vpap-bilevel": "https://en.wikipedia.org/wiki/Positive_airway_pressure",
  "central-sleep-apnea": "https://en.wikipedia.org/wiki/Central_sleep_apnea",
  "obstructive-sleep-apnea": "https://en.wikipedia.org/wiki/Obstructive_sleep_apnea",
  hypoxemia: "https://en.wikipedia.org/wiki/Hypoxemia",
  "oxygen-concentrator": "https://en.wikipedia.org/wiki/Oxygen_concentrator",
  "pulse-oximeter": "https://en.wikipedia.org/wiki/Pulse_oximetry",
  "nasal-cannula": "https://en.wikipedia.org/wiki/Nasal_cannula",
  "ventilator-mechanical": "https://en.wikipedia.org/wiki/Medical_ventilator",
  "non-invasive-ventilation": "https://en.wikipedia.org/wiki/Non-invasive_ventilation",
  fev1: "https://en.wikipedia.org/wiki/Spirometry",
  "spo2-oxygen-saturation": "https://en.wikipedia.org/wiki/Oxygen_saturation_(medicine)",
  "tidal-volume": "https://en.wikipedia.org/wiki/Tidal_volume",
  "gold-stage-copd": "https://en.wikipedia.org/wiki/Chronic_obstructive_pulmonary_disease",
  "titration-study": "https://en.wikipedia.org/wiki/Polysomnography",
};

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const g = getGlossaryTerm(slug);
  if (!g) return notFound();

  const sameAs = TERM_SAME_AS[g.slug];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": CONDITION_SLUGS.has(g.slug) ? ["DefinedTerm", "MedicalCondition"] : "DefinedTerm",
    name: g.term,
    description: g.definition.join(" "),
    inDefinedTermSet: `${SITE_URL}/glossary`,
    ...(sameAs ? { sameAs } : {}),
  };
  const crumbsLd = breadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Glossary", url: "/glossary" },
    { name: g.term, url: `/glossary/${g.slug}` },
  ]);

  return (
    <div className="px-8 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbsLd) }} />
      <div className="mx-auto max-w-[680px]">
        <Link href="/glossary" className="cursor-pointer text-[12px] font-semibold text-accent underline underline-offset-2 hover:no-underline">
          ← Glossary
        </Link>
        <p className="mt-6 font-mono text-[11px] tracking-[0.1em] text-accent uppercase">Definition</p>
        <h1 className="font-display mt-3 text-[clamp(24px,3.4vw,34px)] font-semibold text-balance">
          {g.term}
        </h1>
        <div className="mt-6 flex flex-col gap-4 border-t border-border pt-6 text-[15px] leading-[1.75] text-muted">
          {g.definition.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        {g.relatedHref && (
          <Link
            href={g.relatedHref}
            className="mt-8 inline-block cursor-pointer text-[13px] font-semibold text-accent underline underline-offset-2 hover:no-underline"
          >
            {g.relatedLabel} →
          </Link>
        )}
      </div>
    </div>
  );
}
