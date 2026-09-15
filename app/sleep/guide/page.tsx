import type { Metadata } from "next";
import Link from "next/link";
import { getArticle, getArticlesByCategory } from "@/lib/journal";
import { ClusterIndex } from "@/components/ClusterIndex";
import { breadcrumbJsonLd, itemListJsonLd } from "@/lib/schema";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PillarComparisons } from "@/components/PillarComparisons";
import { Tilt } from "@/components/Tilt";
import { AirwayPressureShowcase } from "@/components/AirwayPressureShowcase";
import { VitalsWaveform } from "@/components/VitalsWaveform";

export const metadata: Metadata = {
  alternates: { canonical: "/sleep/guide" },
  title: "CPAP Machines, Explained — The Complete Guide",
  description:
    "How to choose, buy, and live with a CPAP machine: how pressure therapy works, CPAP vs. APAP vs. BiPAP, real costs, mask fit, cleaning, travel, prescriptions, and insurance vs. self-pay — in twelve plain-language chapters.",
};

// The cluster, in reading order. Each slug must exist in lib/journal.ts —
// getArticle() below throws the page into a build error if one goes missing,
// which is exactly the guarantee a pillar page wants.
const CHAPTERS: { group: string; groupDesc: string; slugs: string[] }[] = [
  {
    group: "Understand the therapy",
    groupDesc: "What pressure therapy actually is, and which machine class does what.",
    slugs: [
      "how-cpap-machines-work-pressure-not-oxygen",
      "cpap-vs-bipap-vs-apap-which-machine",
      "cpap-pressure-what-auto-titrating-actually-adjusts",
      "central-vs-obstructive-sleep-apnea",
    ],
  },
  {
    group: "Price it honestly",
    groupDesc: "Real machine and mask prices, and the insurance-vs-self-pay decision.",
    slugs: [
      "cpap-machine-cost-price-ranges",
      "cpap-without-insurance-self-pay",
    ],
  },
  {
    group: "Live with it",
    groupDesc: "The first month, the mask, the cleaning schedule, and the road.",
    slugs: [
      "cpap-first-30-days-adjustment",
      "why-your-mask-doesnt-fit-yet",
      "how-to-clean-cpap-equipment-schedule",
      "travel-cpap-tsa-airlines-second-machine",
    ],
  },
  {
    group: "Order it",
    groupDesc: "The paperwork, and what your machine reports once you own it.",
    slugs: [
      "cpap-prescription-requirements",
      "cpap-compliance-data-what-your-machine-tracks",
    ],
  },
];

const SHOP_LINKS = [
  { label: "CPAP Machines", href: "/sleep/cpap", desc: "Auto and fixed-pressure, $599–$949, including travel units." },
  { label: "BiPAP & VPAP", href: "/sleep/bipap-apap", desc: "Bi-level and adaptive servo-ventilation machines." },
  { label: "Masks & Accessories", href: "/sleep/accessories", desc: "Full-face, nasal, and pillow styles, no prescription needed." },
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
  const libraryArticles = getArticlesByCategory("Sleep Health").filter(
    (a) => !chapterSlugs.has(a.slug)
  );

  const crumbs = [
    { name: "Home", url: "/" },
    { name: "Sleep", url: "/sleep" },
    { name: "The Complete Guide", url: "/sleep/guide" },
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
              The Complete Guide
            </p>
            <VitalsWaveform className="mx-auto mt-3 max-w-[220px] text-accent opacity-70 lg:mx-0" height={28} />
            <h1 className="font-display mt-4 text-[clamp(30px,4.6vw,52px)] leading-[1.06] font-semibold text-balance">
              CPAP machines, explained — choosing, buying, and sleeping with one.
            </h1>
            <p className="mx-auto mt-6 max-w-[62ch] text-[16px] leading-[1.75] text-muted lg:mx-0">
              Twelve plain-language chapters covering the full arc: what pressure therapy actually
              does, which machine class your prescription points to, what it genuinely costs, and
              how the first month goes when it goes well. Written by the team that verifies
              prescriptions and ships these machines daily — general information, not medical advice.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3.5 lg:justify-start">
              <Link
                href="#chapters"
                className="inline-flex cursor-pointer items-center gap-2 rounded-[3px] bg-accent px-7 py-3.5 text-[13px] font-semibold text-accent-ink transition-transform hover:-translate-y-px"
              >
                Start reading
              </Link>
              <Link
                href="/sleep"
                className="inline-flex cursor-pointer items-center rounded-[3px] border border-border-strong px-7 py-3.5 text-[13px] font-semibold transition-colors hover:border-text"
              >
                Shop Sleep
              </Link>
            </div>
          </div>
          <div data-reveal>
            <AirwayPressureShowcase />
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

      <PillarComparisons guideKey="cpap-guide" />

      <ClusterIndex
        title="Every sleep &amp; CPAP article we've published"
        subtitle="Beyond the core chapters — the complete sleep library, one click deep."
        articles={libraryArticles}
      />

      {/* ── From reading to owning ──────────────────────────────────── */}
      <section className="border-t border-border bg-surface-2 px-8 py-16">
        <div className="mx-auto max-w-[1240px]">
          <div data-reveal className="mb-8 max-w-[52ch]">
            <p className="font-mono text-[11px] tracking-[0.1em] text-accent uppercase">
              When you&rsquo;re ready
            </p>
            <h2 className="font-display mt-2 text-[clamp(20px,2.6vw,28px)] font-semibold">
              The catalog this guide keeps pointing at
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-px border border-border bg-border sm:grid-cols-3">
            {SHOP_LINKS.map((s) => (
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
          <p className="mt-8 text-[13px] text-muted">
            Or skip the reading entirely —{" "}
            <Link href="/concierge" className="cursor-pointer font-semibold text-accent underline underline-offset-2 hover:no-underline">
              talk to a concierge specialist
            </Link>{" "}
            and they&rsquo;ll walk your prescription to the right machine directly.
          </p>
        </div>
      </section>
    </div>
  );
}
