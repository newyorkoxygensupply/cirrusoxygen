import type { Metadata } from "next";
import Link from "next/link";
import { getArticle, getArticlesByCategory } from "@/lib/journal";
import { ClusterIndex } from "@/components/ClusterIndex";
import { breadcrumbJsonLd, itemListJsonLd } from "@/lib/schema";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PillarComparisons } from "@/components/PillarComparisons";
import { Tilt } from "@/components/Tilt";
import { SegmentAxisShowcase } from "@/components/SegmentAxisShowcase";
import { VitalsWaveform } from "@/components/VitalsWaveform";

export const metadata: Metadata = {
  alternates: { canonical: "/ventilators/guide" },
  title: "The Ventilator Procurement Guide — ICU, Transport & MRI",
  description:
    "How institutional buyers evaluate mechanical ventilators: market segmentation, MRI-conditional labeling, transport specs, authorized channels, fleet standardization, service contracts, and consumables budgeting — in eight chapters.",
};

// The cluster, in reading order. Each slug must exist in lib/journal.ts —
// getArticle() below throws the page into a build error if one goes missing.
const CHAPTERS: { group: string; groupDesc: string; slugs: string[] }[] = [
  {
    group: "Understand the segments",
    groupDesc: "ICU, transport, MRI-conditional, and home care — different tools, not tiers.",
    slugs: [
      "ventilator-classes-icu-transport-mri-explained",
      "transport-ventilator-specs-that-matter",
      "mri-conditional-ventilator-what-it-means",
      "hospital-vs-home-ventilation-line",
    ],
  },
  {
    group: "Buy it right",
    groupDesc: "Provenance and fleet logic — the two decisions that outlive any spec sheet.",
    slugs: [
      "buying-ventilators-authorized-channels",
      "ventilator-fleet-standardization",
    ],
  },
  {
    group: "Own it",
    groupDesc: "The costs that recur: service arrangements and the consumables stream.",
    slugs: [
      "ventilator-service-contracts-biomed",
      "ventilator-consumables-circuits-budgeting",
    ],
  },
];

export default function Page() {
  const chapters = CHAPTERS.map((g) => ({
    ...g,
    articles: g.slugs.map((slug) => {
      const a = getArticle(slug);
      if (!a) throw new Error(`Pillar chapter missing from journal: ${slug}`);
      return a;
    }),
  }));
  const allArticles = chapters.flatMap((g) => g.articles);
  const chapterSlugs = new Set(allArticles.map((a) => a.slug));
  const libraryArticles = getArticlesByCategory("Clinical & Institutional").filter(
    (a) => !chapterSlugs.has(a.slug)
  );

  const crumbs = [
    { name: "Home", url: "/" },
    { name: "Ventilators", url: "/ventilators" },
    { name: "Procurement Guide", url: "/ventilators/guide" },
  ];
  const listLd = itemListJsonLd(
    allArticles.map((a) => ({ name: a.title, url: `/journal/${a.slug}` }))
  );

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listLd) }} />
      <Breadcrumbs crumbs={crumbs} />

      {/* ── Pillar hero ─────────────────────────────────────────────── */}
      <section className="border-b border-border px-8 py-20">
        <div className="mx-auto grid max-w-[1160px] grid-cols-1 items-center gap-14 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="text-center lg:text-left">
            <p className="font-mono text-[11px] tracking-[0.14em] text-accent uppercase">
              For Clinical &amp; Institutional Buyers
            </p>
            <VitalsWaveform className="mx-auto mt-3 max-w-[220px] text-accent opacity-70 lg:mx-0" height={28} />
            <h1 className="font-display mt-4 text-[clamp(30px,4.6vw,52px)] leading-[1.06] font-semibold text-balance">
              The ventilator procurement guide — segments, provenance, and total cost.
            </h1>
            <p className="mx-auto mt-6 max-w-[62ch] text-[16px] leading-[1.75] text-muted lg:mx-0">
              Eight chapters for biomed and procurement teams: how the market actually segments, what
              MRI-conditional and transport specs certify, why authorized channels matter most where
              the stakes are highest, and the fleet, service, and consumables math that decides the
              real cost of ownership. Written for buyers, not patients.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3.5 lg:justify-start">
              <Link
                href="#chapters"
                className="inline-flex cursor-pointer items-center gap-2 rounded-[3px] bg-accent px-7 py-3.5 text-[13px] font-semibold text-accent-ink transition-transform hover:-translate-y-px"
              >
                Start reading
              </Link>
              <Link
                href="/ventilators"
                className="inline-flex cursor-pointer items-center rounded-[3px] border border-border-strong px-7 py-3.5 text-[13px] font-semibold transition-colors hover:border-text"
              >
                View Ventilators
              </Link>
            </div>
          </div>
          <div data-reveal>
            <SegmentAxisShowcase />
          </div>
        </div>
      </section>

      {/* ── Chapters ────────────────────────────────────────────────── */}
      <section id="chapters" className="px-8 py-16">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-14">
          {chapters.map((g, gi) => (
            <div key={g.group}>
              <div data-reveal className="mb-6 flex items-baseline gap-4">
                <span className="font-mono text-[12px] text-muted-2 tabular-nums">
                  0{gi + 1}
                </span>
                <div>
                  <h2 className="font-display text-[clamp(18px,2.4vw,24px)] font-semibold">{g.group}</h2>
                  <p className="mt-1 text-[14px] text-muted">{g.groupDesc}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
                {g.articles.map((a, i) => (
                  <div
                    key={a.slug}
                    data-reveal
                    style={{ "--reveal-delay": `${i * 70}ms` } as React.CSSProperties}
                  >
                    <Tilt className="h-full">
                      <Link
                        href={`/journal/${a.slug}`}
                        className="group flex h-full cursor-pointer flex-col justify-between gap-6 bg-surface p-6 transition-colors hover:bg-surface-2"
                      >
                        <div>
                          <h3 className="text-[15px] leading-snug font-semibold transition-colors group-hover:text-accent">
                            {a.title}
                          </h3>
                          <p className="mt-2 text-[13px] leading-relaxed text-muted">{a.dek}</p>
                        </div>
                        <span className="flex items-center gap-1.5 font-mono text-[11px] text-muted-2 uppercase">
                          {a.readTime} read
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true" className="text-accent transition-transform group-hover:translate-x-1">
                            <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                      </Link>
                    </Tilt>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <PillarComparisons guideKey="ventilator-guide" />

      <ClusterIndex
        title="Every ventilator &amp; clinical article we've published"
        subtitle="Beyond the core chapters — the complete clinical library, one click deep."
        articles={libraryArticles}
      />

      {/* ── From reading to procurement ─────────────────────────────── */}
      <section className="border-t border-border bg-surface-2 px-8 py-16">
        <div className="mx-auto max-w-[1240px]">
          <div data-reveal className="mb-8 max-w-[52ch]">
            <p className="font-mono text-[11px] tracking-[0.1em] text-accent uppercase">
              When you&rsquo;re ready
            </p>
            <h2 className="font-display mt-2 text-[clamp(20px,2.6vw,28px)] font-semibold">
              Quotes, service terms, and consumables — one conversation
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-px border border-border bg-border sm:grid-cols-3">
            {[
              { label: "All Ventilators", href: "/ventilators", desc: "21 units across ICU, transport, MRI, and neonatal — Hamilton, Dräger, Getinge, Mindray, Zoll." },
              { label: "The Standard", href: "/the-standard", desc: "Our sourcing policy: authorized channels only, at every price point." },
              { label: "Institutional Concierge", href: "/concierge", desc: "Fleet quotes, service arrangements, and consumables planning, brand by brand." },
            ].map((s) => (
              <Tilt key={s.href}>
                <Link
                  href={s.href}
                  className="group flex h-full cursor-pointer flex-col bg-surface p-7 transition-colors hover:bg-surface-2"
                >
                  <h3 className="text-[15px] font-semibold transition-colors group-hover:text-accent">{s.label}</h3>
                  <p className="mt-2 text-[13px] text-muted">{s.desc}</p>
                </Link>
              </Tilt>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
